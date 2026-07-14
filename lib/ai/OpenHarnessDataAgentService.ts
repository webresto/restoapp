import { z } from 'zod';
import { AbstractAiModelService, Adminizer, DataAccessor, ModelConfig, UserAP } from 'adminizer';

type StreamEvent = Record<string, unknown>;

/**
 * OpenHarness-backed data agent.  The OpenHarness packages are ESM-only, so
 * they are loaded lazily and only when this optional agent is used.
 */
export class OpenHarnessDataAgentService extends AbstractAiModelService {
    private readonly apiKey?: string;
    private readonly model: string;
    private readonly contextWindow: number;
    private readonly vision: boolean;
    private readonly sessions = new Map<number, any>();

    constructor(adminizer: Adminizer) {
        super(adminizer, {
            id: 'openharness',
            name: 'OpenHarness data agent',
            description: 'Streams answers and uses only Restoapp tools permitted for the current user.',
        });
        this.apiKey = process.env.OPENHARNESS_API_KEY ?? process.env.OPENAI_API_KEY ?? process.env.ADMINIZER_OPENAI_KEY;
        this.model = process.env.OPENHARNESS_MODEL ?? process.env.OPENAI_AGENT_MODEL ?? '';
        this.contextWindow = Number(process.env.OPENHARNESS_CONTEXT_WINDOW) || 128_000;
        // Image attachments are forwarded to the model only when the selected
        // OpenAI-compatible provider is known to support vision inputs.
        this.vision = process.env.OPENHARNESS_VISION === 'true';
    }

    public isEnabled(): boolean {
        return Boolean(this.apiKey && this.model && this.getBaseUrl());
    }

    public async generateReply(prompt: string, _history: any[], user: UserAP): Promise<string> {
        let output = '';
        await this.streamReply(prompt, user, (event) => {
            if (event.type === 'text.delta' && typeof event.text === 'string') output += event.text;
        });
        return output || 'The OpenHarness agent finished without returning a message.';
    }

    /** `input` is either a plain prompt or ai-sdk `ModelMessage[]` (multimodal parts). */
    public async streamReply(input: string | any[], user: UserAP, onEvent: (event: StreamEvent) => void, signal?: AbortSignal): Promise<void> {
        if (!this.isEnabled()) {
            throw new Error('OpenHarness is not configured. Set OPENHARNESS_API_KEY, OPENHARNESS_MODEL, and OPENHARNESS_BASE_URL.');
        }
        const session = await this.getSession(user);
        for await (const event of session.send(input, { signal })) onEvent(event as StreamEvent);
    }

    /** Session facts for the UI header: model, context window and usage so far. */
    public getSessionMeta(user: UserAP): Record<string, unknown> {
        const session = this.sessions.get(user.id);
        // Same rough estimator the session's compaction uses by default.
        const contextTokens = session ? Math.round(JSON.stringify(session.messages ?? []).length / 4) : 0;
        return {
            model: this.model,
            contextWindow: this.contextWindow,
            vision: this.vision,
            turns: session?.turns ?? 0,
            totalUsage: session?.totalUsage ?? { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
            contextTokens,
        };
    }

    public resetSession(user: UserAP): boolean {
        return this.sessions.delete(user.id);
    }

    private async getSession(user: UserAP): Promise<any> {
        const existing = this.sessions.get(user.id);
        if (existing) return existing;

        // Avoid TypeScript transforming import() into require(), which cannot load ESM packages.
        const load = (name: string): Promise<any> => Function('name', 'return import(name)')(name);
        const [{ Agent, Session }, { createOpenAI }, { tool }] = await Promise.all([
            load('@openharness/core'), load('@ai-sdk/openai'), load('ai'),
        ]);
        const provider = createOpenAI({
            apiKey: this.apiKey,
            baseURL: this.getBaseUrl(),
        });

        const queryModelRecords = tool({
            description: 'Read records from a Restoapp model. Use only models listed in the system instructions.',
            inputSchema: z.object({
                model: z.string().min(1),
                filter: z.string().optional(),
                fields: z.array(z.string().min(1)).optional(),
                limit: z.number().int().min(1).max(50).optional(),
            }),
            execute: async (input: { model: string; filter?: string; fields?: string[]; limit?: number }) => {
                const entity = this.resolveEntity(input.model);
                const accessor = new DataAccessor(this.adminizer, user, entity, 'list');
                let criteria: Record<string, unknown> = {};
                if (input.filter?.trim()) {
                    try { criteria = JSON.parse(input.filter); } catch { throw new Error('filter must be valid JSON'); }
                }
                const records = await entity.model.find(criteria, accessor);
                const limited = records.slice(0, input.limit ?? 10);
                const projected = input.fields?.length
                    ? limited.map((record: Record<string, unknown>) => this.pickFields(record, input.fields!))
                    : limited;
                return { model: entity.name, count: projected.length, records: projected };
            },
        });

        const listMcpTools = tool({
            description: [
                'List MCP tools available to administrator users.',
                'Call without a group to get the compact group catalogue.',
                'Call with a group name to get full tool descriptions and input schemas for that group.',
            ].join(' '),
            inputSchema: z.object({
                group: z.string().min(1).optional(),
            }),
            execute: async (input: { group?: string }) => {
                if (!user.isAdministrator) {
                    return { error: 'MCP tools are only available for administrators.' };
                }

                const mcp = (globalThis as any).mcp;
                if (!mcp || typeof mcp.listTools !== 'function') {
                    return { error: 'MCP server is not available.' };
                }

                if (input.group) {
                    const tools = mcp.listTools('all', input.group);
                    return { group: input.group, count: tools.length, tools };
                }

                const groups = typeof mcp.listGroups === 'function' ? mcp.listGroups() : [];
                const tools = mcp.listTools('all').map((entry: any) => ({
                    name: entry.name,
                    group: entry.group,
                    mode: entry.mode,
                    description: entry.shortDescription || entry.description,
                }));
                return { groupCount: groups.length, groups, toolCount: tools.length, tools };
            },
        });

        const callMcpTool = tool({
            description: [
                'Call a registered MCP tool by name.',
                'Only use tool names and params that came from list_mcp_tools.',
                'For tools that create, update, delete, deploy, restore, restart, or otherwise mutate state, only call them after the user explicitly asks for that action.',
            ].join(' '),
            inputSchema: z.object({
                tool_name: z.string().min(1),
                params: z.record(z.any()).optional(),
            }),
            execute: async (input: { tool_name: string; params?: Record<string, unknown> }) => {
                if (!user.isAdministrator) {
                    return { error: 'MCP tools are only available for administrators.' };
                }

                const mcp = (globalThis as any).mcp;
                if (!mcp || typeof mcp.callTool !== 'function') {
                    return { error: 'MCP server is not available.' };
                }

                try {
                    const result = await mcp.callTool(input.tool_name, input.params ?? {}, { user });
                    return { tool: input.tool_name, result };
                } catch (error: any) {
                    return { error: error?.message || 'MCP tool call failed.' };
                }
            },
        });

        const readable = this.listReadableModels(user).map(({ name, config }) => `${name} (${config.model})`).join(', ') || 'none';
        const tools: Record<string, any> = { query_model_records: queryModelRecords };
        const mcpPrompt = user.isAdministrator
            ? [
                'You can also use registered MCP tools.',
                'Use list_mcp_tools first: without group for a compact catalogue, with group for exact schemas.',
                'Then use call_mcp_tool with the exact tool_name and params object.',
                'Prefer read-only MCP tools for diagnostics. Do not call mutating MCP tools unless the user explicitly requested that operation.',
            ].join('\n')
            : 'MCP tools are not available to this user.';

        if (user.isAdministrator) {
            tools.list_mcp_tools = listMcpTools;
            tools.call_mcp_tool = callMcpTool;
        }

        const agent = new Agent({
            name: 'Restoapp OpenHarness agent',
            model: provider.chat(this.model),
            instructions: false,
            maxSteps: 6,
            systemPrompt: [
                'You answer questions about Restoapp using only the supplied tools.',
                'Never claim to have direct shell or filesystem access.',
                'Explain results concisely after inspecting data.',
                `Readable models for this user: ${readable}.`,
                mcpPrompt,
            ].join('\n'),
            tools,
        });
        const session = new Session({ agent, contextWindow: this.contextWindow });
        this.sessions.set(user.id, session);
        return session;
    }

    private getBaseUrl(): string {
        return process.env.OPENHARNESS_BASE_URL ?? process.env.OPENAI_URL ?? process.env.OPENAI_BASE_URL ?? '';
    }

    private listReadableModels(user: UserAP): Array<{ name: string; config: ModelConfig }> {
        const result: Array<{ name: string; config: ModelConfig }> = [];
        for (const [name, raw] of Object.entries(this.adminizer.config.models ?? {})) {
            const config = this.ensureModelConfig(name, raw as ModelConfig | boolean);
            const model = config.model ? this.adminizer.modelHandler.model.get(config.model.toLowerCase()) : undefined;
            if (model && this.adminizer.accessRightsHelper.hasPermission(`read-${model.modelname}-model`, user)) result.push({ name, config });
        }
        return result;
    }

    private resolveEntity(modelName: string): any {
        const normalized = modelName.trim().toLowerCase();
        for (const [name, raw] of Object.entries(this.adminizer.config.models ?? {})) {
            const config = this.ensureModelConfig(name, raw as ModelConfig | boolean);
            if (name.toLowerCase() !== normalized && config.model?.toLowerCase() !== normalized) continue;
            const model = this.adminizer.modelHandler.model.get(config.model?.toLowerCase());
            if (!model) throw new Error(`Model adapter is not initialized for "${config.model}".`);
            return { name, config, model, type: 'model', uri: `${this.adminizer.config.routePrefix}/model/${name}` };
        }
        throw new Error(`Unknown model "${modelName}".`);
    }

    private ensureModelConfig(name: string, config: ModelConfig | boolean): ModelConfig {
        return typeof config === 'boolean'
            ? { model: name.toLowerCase(), title: name, icon: 'description', list: true, add: true, edit: true, remove: true, view: true } as ModelConfig
            : config;
    }

    private pickFields(record: Record<string, unknown>, fields: string[]): Record<string, unknown> {
        return fields.reduce<Record<string, unknown>>((result, field) => {
            if (field in record) result[field] = record[field];
            return result;
        }, {});
    }
}
