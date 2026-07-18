import { z } from 'zod';
import { AbstractAiModelService, Adminizer, DataAccessor, ModelConfig, UserAP } from 'adminizer';
import { AdminLinkProvider } from '../../api/hooks/openharness-ui/AdminLinkProvider';
import { loadSystemPrompt, normalizePromptKey, promptExists } from './loadSystemPrompt';
import { isRevokedKeyError, summarizeLlmError } from './OpenHarnessConnectionManager';
import type { OpenHarnessConnectionManager, OpenHarnessCredentials } from './OpenHarnessConnectionManager';

// RestoApp's standard LiteLLM gateway; the actual endpoint + key come from the
// OpenHarnessConnectionManager (setting / env / broker-issued).
const DEFAULT_BASE_URL = 'https://lllm.m42.cx/v1';

type StreamEvent = Record<string, unknown>;
type ModelOption = {
    id: string;
    model: string;
    baseURL: string;
    vision: boolean;
    contextWindow: number | null;
    maxOutputTokens: number | null;
    // Relative spend multiplier for the model, derived from the LiteLLM
    // per-token price (see attachCostCoefficients). null when the gateway does
    // not expose a price for this model.
    costCoefficient: number | null;
};
/**
 * OpenHarness-backed data agent.  The OpenHarness packages are ESM-only, so
 * they are loaded lazily and only when this optional agent is used.
 */
export class OpenHarnessDataAgentService extends AbstractAiModelService {
    private readonly connection: OpenHarnessConnectionManager;
    private readonly defaultModel: string;
    private readonly contextWindow: number;
    private readonly defaultVision: boolean;
    private readonly fileStore: string;
    private readonly sessions = new Map<number, any>();
    private readonly selectedModels = new Map<number, string>();
    private modelCatalogCache: { fetchedAt: number; models: ModelOption[] } | null = null;

    constructor(adminizer: Adminizer, connection: OpenHarnessConnectionManager) {
        super(adminizer, {
            id: 'openharness',
            name: 'RestoApp Assistant',
            description: 'Streams answers and uses only Restoapp tools permitted for the current user.',
        });
        this.connection = connection;
        this.defaultModel = process.env.OPENHARNESS_MODEL ?? '';
        this.contextWindow = Number(process.env.OPENHARNESS_CONTEXT_WINDOW) || 128_000;
        // Image attachments are forwarded to the model only when the selected
        // OpenAI-compatible provider is known to support vision inputs.
        this.defaultVision = process.env.OPENHARNESS_VISION === 'true';
        this.fileStore = process.env.OPENHARNESS_FILE_STORE || `${process.cwd()}/.tmp/openharness-agent/files`;
        // A new key (broker re-registration, admin edited the setting) must not
        // be mixed into sessions built for the old endpoint.
        this.connection.onChange(() => this.handleConnectionChange());
    }

    public isEnabled(): boolean {
        return Boolean(this.getCredentials());
    }

    /** Drop per-user sessions and the model catalogue after a credential change. */
    public handleConnectionChange(): void {
        this.sessions.clear();
        this.modelCatalogCache = null;
    }

    private getCredentials(): OpenHarnessCredentials | null {
        return this.connection.getCredentialsSync();
    }

    public async generateReply(prompt: string, _history: any[], user: UserAP): Promise<string> {
        let output = '';
        await this.streamReply(prompt, user, (event) => {
            if (event.type === 'text.delta' && typeof event.text === 'string') output += event.text;
        });
        return output || 'RestoApp Assistant finished without returning a message.';
    }

    /** `input` is either a plain prompt or ai-sdk `ModelMessage[]` (multimodal parts). */
    public async streamReply(input: string | any[], user: UserAP, onEvent: (event: StreamEvent) => void, signal?: AbortSignal): Promise<void> {
        if (!this.isEnabled()) {
            throw new Error('RestoApp Assistant is not connected to an LLM endpoint yet.');
        }
        const session = await this.getSession(user);
        try {
            for await (const event of session.send(input, { signal })) {
                // The agent reports a failed run as an "error" event and only
                // throws when the session layer gives up, so both paths have to
                // notice a dead key.
                if (event?.type === 'error') this.reportRunFailure((event as any).error, 'agent run failed');
                onEvent(event as StreamEvent);
            }
        } catch (error: any) {
            this.reportRunFailure(error, 'agent run threw');
            throw error;
        }
    }

    /**
     * Logs one line about a failed run and re-registers the key when the provider
     * says it no longer exists. The stack goes to the debug log as text — logging
     * the error object itself is what produced the console dumps, since the ai-sdk
     * hangs the entire request and every retry off it.
     */
    private reportRunFailure(error: unknown, context: string): void {
        sails.log.error(`OpenHarness > ${context}: ${summarizeLlmError(error)}`);
        sails.log.debug(`OpenHarness > ${context}, stack: ${(error as any)?.stack ?? String(error)}`);
        // A rejected broker key means it expired or was revoked server-side:
        // drop it and let the manager re-register in the background.
        if (isRevokedKeyError(error)) void this.connection.reportAuthFailure();
    }

    /** Session facts for the UI header: model, context window and usage so far. */
    public getSessionMeta(user: UserAP): Record<string, unknown> {
        const session = this.sessions.get(user.id);
        const active = this.getCurrentSelection(user);
        // Same rough estimator the session's compaction uses by default.
        const contextTokens = session ? Math.round(JSON.stringify(session.messages ?? []).length / 4) : 0;
        return {
            model: active.id,
            contextWindow: active.contextWindow ?? this.contextWindow,
            vision: active.vision,
            turns: session?.turns ?? 0,
            totalUsage: session?.totalUsage ?? { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
            contextTokens,
        };
    }

    public resetSession(user: UserAP): boolean {
        return this.sessions.delete(user.id);
    }

    /** Raw ai-sdk conversation history from the in-memory session (empty when none). */
    public getSessionHistory(user: UserAP): any[] {
        return this.sessions.get(user.id)?.messages ?? [];
    }

    /** Manually compact the session context (prune tool results / summarize). */
    public async compactSession(user: UserAP): Promise<Record<string, unknown>> {
        const session = this.sessions.get(user.id);
        if (!session || !session.messages?.length) return { compacted: false };
        let tokensBefore = 0;
        let tokensAfter = 0;
        let messagesRemoved = 0;
        let done = false;
        for await (const event of session.compact()) {
            if (event.type === 'compaction.start') tokensBefore = event.tokensBefore ?? 0;
            if (event.type === 'compaction.pruned') messagesRemoved += event.messagesRemoved ?? 0;
            if (event.type === 'compaction.done') {
                tokensBefore = event.tokensBefore ?? tokensBefore;
                tokensAfter = event.tokensAfter ?? 0;
                done = true;
            }
        }
        return { compacted: done, tokensBefore, tokensAfter, messagesRemoved };
    }

    public async listAvailableModels(): Promise<string[]> {
        const options = await this.getAvailableModelOptions();
        return options.map((entry) => entry.id);
    }

    public async getModelChoices(): Promise<Array<Record<string, unknown>>> {
        const options = await this.getAvailableModelOptions();
        return options.map((entry) => ({
            id: entry.id,
            contextWindow: entry.contextWindow,
            maxOutputTokens: entry.maxOutputTokens,
            vision: entry.vision,
            costCoefficient: entry.costCoefficient,
        }));
    }

    public getCurrentModel(user: UserAP): string {
        return this.selectedModels.get(user.id) || this.getDefaultModelId();
    }

    /**
     * The model used when a user has not picked one: the explicit
     * OPENHARNESS_MODEL when configured, otherwise the first model the provider
     * lists at the ×1 cost coefficient (the baseline-priced model), falling back
     * to whatever it listed first.
     */
    private getDefaultModelId(): string {
        if (this.defaultModel) return this.defaultModel;
        const cached = this.modelCatalogCache?.models ?? [];
        const baseline = cached.find((entry) => entry.costCoefficient === 1);
        return (baseline ?? cached[0])?.id ?? '';
    }

    public async setCurrentModel(user: UserAP, model: string): Promise<boolean> {
        const normalized = model.trim();
        if (!normalized) throw new Error('Model name is required.');
        const available = await this.getAvailableModelOptions();
        if (!available.some((entry) => entry.id === normalized)) {
            throw new Error(`Model "${normalized}" is not available from the provider.`);
        }
        if (this.getCurrentModel(user) === normalized) return false;
        this.selectedModels.set(user.id, normalized);
        this.resetSession(user);
        return true;
    }

    public async saveUploadedFiles(user: UserAP, files: any[] = []): Promise<Array<Record<string, unknown>>> {
        if (!files.length) return [];
        const fs = require('fs');
        const path = require('path');
        const crypto = require('crypto');
        const dir = this.userFileDir(user);
        fs.mkdirSync(dir, { recursive: true });

        const existing = this.readFileIndex(user);
        const saved: Array<Record<string, unknown>> = [];
        for (const file of files) {
            const originalName = file.originalname || 'attachment';
            const ext = path.extname(originalName);
            const id = `file-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
            const storedName = `${id}${ext}`;
            const diskPath = path.join(dir, storedName);
            fs.writeFileSync(diskPath, file.buffer);
            const meta = {
                id,
                name: originalName,
                storedName,
                mimeType: file.mimetype || 'application/octet-stream',
                size: file.size ?? file.buffer?.length ?? 0,
                savedAt: new Date().toISOString(),
                readableAsText: this.isStoredTextFile(originalName, file.mimetype),
            };
            existing.push(meta);
            saved.push(meta);
        }
        this.writeFileIndex(user, existing);
        return saved;
    }

    private async getSession(user: UserAP): Promise<any> {
        const credentials = this.getCredentials();
        if (!credentials) throw new Error('RestoApp Assistant is not connected to an LLM endpoint yet.');
        const fingerprint = `${credentials.baseUrl}:${credentials.apiKey}`;
        const existing = this.sessions.get(user.id);
        if (existing && existing.__ohFingerprint === fingerprint) return existing;

        // Avoid TypeScript transforming import() into require(), which cannot load ESM packages.
        const load = (name: string): Promise<any> => Function('name', 'return import(name)')(name);
        const [{ Agent, Session }, { createOpenAI }, { tool }] = await Promise.all([
            load('@openharness/core'), load('@ai-sdk/openai'), load('ai'),
        ]);
        // Ensures a model is resolvable even when OPENHARNESS_MODEL is unset:
        // getCurrentSelection falls back to the first model the provider reports.
        await this.getAvailableModelOptions();
        const activeSelection = this.getCurrentSelection(user);
        const provider = createOpenAI({
            apiKey: credentials.apiKey,
            baseURL: activeSelection.baseURL,
        });
        const activeModel = activeSelection.model;
        const activeContextWindow = activeSelection.contextWindow ?? this.contextWindow;

        // Admin pages are collected live from modules over the emitter, gated by
        // the same rule the navbar uses (no token = public).
        const canAccess = (token: string) => Boolean(this.adminizer.accessRightsHelper?.hasPermission(token, user));
        const listApps = () => AdminLinkProvider.list('app', canAccess);
        const appList = (await listApps()).map((app) => `${app.name} (${app.title})`).join(', ') || 'none';

        const generateAdminLink = tool({
            description: [
                'Generate a link into the Restoapp admin panel.',
                'type "model": model is a model name from the readable models list; with id the link opens the record edit page, without id the model list page.',
                'type "app": model is an admin page id; these pages are single views, so id is ignored.',
                `Admin pages available to this user: ${appList}.`,
            ].join(' '),
            inputSchema: z.object({
                model: z.string().min(1),
                id: z.union([z.string(), z.number()]).optional(),
                type: z.enum(['model', 'app']),
            }),
            execute: async (input: { model: string; id?: string | number; type: 'model' | 'app' }) => {
                if (input.type === 'app') {
                    const app = await AdminLinkProvider.resolve('app', input.model, canAccess);
                    if (!app) {
                        // Pages are permission-filtered, so a miss is a wrong id or no access.
                        const apps = (await listApps()).map((entry) => entry.name).join(', ') || 'none';
                        return { error: `No admin page "${input.model}" available to this user. Available pages: ${apps}.` };
                    }
                    return { link: app.link, type: 'app', target: app.name };
                }
                // Normalize model names the same way query_model_records does.
                const entity = this.resolveEntity(input.model);
                const id = input.id === undefined || input.id === null ? '' : String(input.id).trim();
                const link = id ? `${entity.uri}/edit/${encodeURIComponent(id)}` : entity.uri;
                return { link, type: 'model', target: entity.name };
            },
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
                    if (tools.length === 0) {
                        const groups = typeof mcp.listGroups === 'function' ? mcp.listGroups() : [];
                        return {
                            group: input.group,
                            count: 0,
                            tools: [],
                            error: `No tools found in group "${input.group}". This group name may not exist — check availableGroups below and retry with the matching one.`,
                            availableGroups: groups,
                        };
                    }
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

        const listSavedFiles = tool({
            description: 'List files uploaded by this user in the OpenHarness chat. Use this before read_saved_file.',
            inputSchema: z.object({}),
            execute: async () => {
                const files = this.readFileIndex(user).map((file: any) => ({
                    id: file.id,
                    name: file.name,
                    mimeType: file.mimeType,
                    size: file.size,
                    savedAt: file.savedAt,
                    readableAsText: file.readableAsText || this.isStoredTextFile(file.name, file.mimeType),
                }));
                return { count: files.length, files };
            },
        });

        const readSavedFile = tool({
            description: 'Read a text-like file previously uploaded in this OpenHarness chat by file id.',
            inputSchema: z.object({
                id: z.string().min(1),
                maxChars: z.number().int().min(1).max(256_000).optional(),
            }),
            execute: async (input: { id: string; maxChars?: number }) => {
                const fs = require('fs');
                const path = require('path');
                const file = this.readFileIndex(user).find((entry: any) => entry.id === input.id);
                if (!file) return { error: `Saved file "${input.id}" was not found.` };
                if (!file.readableAsText && !this.isStoredTextFile(file.name, file.mimeType)) {
                    return {
                        id: file.id,
                        name: file.name,
                        mimeType: file.mimeType,
                        size: file.size,
                        error: 'This saved file is binary and cannot be read as text.',
                    };
                }
                const diskPath = path.join(this.userFileDir(user), file.storedName);
                const maxChars = input.maxChars ?? 64_000;
                let text = fs.readFileSync(diskPath, 'utf8');
                const truncated = text.length > maxChars;
                if (truncated) text = text.slice(0, maxChars);
                return {
                    id: file.id,
                    name: file.name,
                    mimeType: file.mimeType,
                    size: file.size,
                    truncated,
                    text,
                };
            },
        });

        const readable = this.listReadableModels(user).map(({ name, config }) => `${name} (${config.model})`).join(', ') || 'none';
        const mcpToolsEnabled = process.env.OPENHARNESS_MCP_TOOLS !== 'false';
        const mcpAvailable = mcpToolsEnabled && user.isAdministrator;
        const tools: Record<string, any> = {
            query_model_records: queryModelRecords,
            list_saved_files: listSavedFiles,
            read_saved_file: readSavedFile,
            generate_admin_link: generateAdminLink,
        };
        const mcpPrompt = mcpAvailable
            ? [
                'You can also use registered MCP tools.',
                'If the user asks whether MCP tools are available, answer yes.',
                'Do not say you lack context about MCP when list_mcp_tools is available in this chat.',
                'Use list_mcp_tools first: without group for a compact catalogue, with group for exact schemas.',
                'If list_mcp_tools with a group returns count:0, do not conclude the capability is missing — the group name was likely a guess; re-check availableGroups in the response (or call list_mcp_tools without group) and retry with the matching group.',
                'Then use call_mcp_tool with the exact tool_name and params object.',
                'Prefer read-only MCP tools for diagnostics. Do not call mutating MCP tools unless the user explicitly requested that operation.',
            ].join('\n')
            : mcpToolsEnabled
                ? 'MCP tools are only available to administrator users in this chat.'
                : 'MCP tools are disabled by configuration for this chat.';

        if (mcpAvailable) {
            tools.list_mcp_tools = listMcpTools;
            tools.call_mcp_tool = callMcpTool;
        }
        const availableTools = Object.keys(tools).sort().join(', ') || 'none';
        const modelPromptName = this.getModelPromptName(activeSelection.id, activeModel);

        const path = require('path');
        const agent = new Agent({
            name: 'RestoApp Assistant',
            model: provider.chat(activeModel),
            instructions: false,
            maxSteps: 6,
            // Patched into @openharness/core (.ci/patchset): without it the ai-sdk
            // default handler console.errors the raw error object on every stream
            // failure, including each retry inside a run.
            onError: ({ error }: { error: unknown }) => {
                sails.log.debug(`OpenHarness > stream error: ${summarizeLlmError(error)}`);
            },
            skills: { paths: [path.join(__dirname, 'skills')] },
            systemPrompt: loadSystemPrompt(['openharness', modelPromptName], {
                active_provider_model: `${activeSelection.id} -> ${activeModel}`,
                available_tools: availableTools,
                readable_models: readable,
                mcp_prompt: mcpPrompt,
            }),
            tools,
        });
        const session = new Session({ agent, contextWindow: activeContextWindow });
        session.__ohFingerprint = fingerprint;
        this.sessions.set(user.id, session);
        return session;
    }

    private getBaseUrl(): string {
        return this.getCredentials()?.baseUrl || process.env.OPENHARNESS_BASE_URL || DEFAULT_BASE_URL;
    }

    /** Real model ids users have already picked this session — always valid targets. */
    private getSelectedModelOptions(): ModelOption[] {
        return Array.from(this.selectedModels.values())
            .filter((id) => id && id !== this.defaultModel)
            .map((id) => ({
                id,
                model: id,
                baseURL: this.getBaseUrl(),
                vision: this.defaultVision,
                contextWindow: this.contextWindow,
                maxOutputTokens: null,
                costCoefficient: null,
            }));
    }

    private getFallbackModelOptions(): ModelOption[] {
        return this.mergeModelOptions([
            {
                // Placeholder for when discovery found nothing (provider unreachable
                // or the key is scoped to an empty /v1/models): keeps the catalogue
                // non-empty so a chat can still start. It must never be merged next
                // to real models — it is not a selectable model, just a stand-in.
                id: this.defaultModel || 'default',
                model: this.defaultModel || 'default',
                baseURL: this.getBaseUrl(),
                vision: this.defaultVision,
                contextWindow: this.contextWindow,
                maxOutputTokens: null,
                costCoefficient: null,
            },
            ...this.getSelectedModelOptions(),
        ]);
    }

    private getCurrentSelection(user: UserAP): ModelOption {
        const selectedId = this.selectedModels.get(user.id);
        const cached = this.modelCatalogCache?.models ?? [];
        if (selectedId) {
            const match = cached.find((entry) => entry.id === selectedId);
            if (match) return match;
        }
        const defaultId = this.getDefaultModelId();
        if (defaultId) {
            const match = cached.find((entry) => entry.id === defaultId);
            if (match) return match;
        }
        return cached[0] ?? this.getFallbackModelOptions()[0];
    }

    private async getAvailableModelOptions(): Promise<ModelOption[]> {
        const fallback = this.getFallbackModelOptions();
        const cached = this.modelCatalogCache;
        if (cached && (Date.now() - cached.fetchedAt) < 180_000) {
            return cached.models;
        }

        try {
            const discovered = await this.discoverModelOptions();
            // Once the provider lists real models, the "default" placeholder must
            // not appear alongside them — it is not a model the proxy accepts, so
            // picking it would send model:"default" and fail. Only user-selected
            // ids are kept next to what discovery returned.
            const merged = this.mergeModelOptions([...discovered, ...this.getSelectedModelOptions()]);
            if (!merged.length) throw new Error('Provider returned no models');
            this.modelCatalogCache = { fetchedAt: Date.now(), models: merged };
            return merged;
        } catch {
            return fallback;
        }
    }

    private async discoverModelOptions(): Promise<ModelOption[]> {
        const credentials = this.getCredentials();
        if (!credentials) return [];
        const options: ModelOption[] = [];
        const proxyBaseUrl = credentials.baseUrl.replace(/\/+$/, '');
        const headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${credentials.apiKey}`,
        };

        // Only the OpenAI-compatible /v1/models list is used: LiteLLM scopes
        // it to the calling key's Team model list. /model/info and the
        // upstream Ollama endpoints are NOT key-scoped and would leak every
        // model configured on the proxy (including ones this key has no
        // access to), so they are deliberately not queried here.
        const proxyModels = await this.fetchJson<{
            data?: Array<{
                id?: string;
                max_input_tokens?: number | null;
                max_output_tokens?: number | null;
            }>
        }>(`${proxyBaseUrl}/models`, { headers });
        for (const entry of proxyModels?.data ?? []) {
            const id = entry?.id?.trim();
            if (!id) continue;
            options.push({
                id,
                model: id,
                baseURL: proxyBaseUrl,
                vision: this.defaultVision,
                contextWindow: Number.isFinite(entry.max_input_tokens) ? entry.max_input_tokens ?? null : null,
                maxOutputTokens: Number.isFinite(entry.max_output_tokens) ? entry.max_output_tokens ?? null : null,
                costCoefficient: null,
            });
        }

        await this.attachCostCoefficients(options, proxyBaseUrl, headers);
        return options;
    }

    /**
     * Enriches the (already key-scoped) model list with a relative spend
     * multiplier read from LiteLLM's /model/info per-token prices.
     *
     * /model/info is NOT key-scoped and lists every model on the proxy, so it is
     * only used to look up prices for ids that discovery already returned — no
     * extra model is ever surfaced from it. The coefficient is normalized so the
     * median-priced visible model is ×1 (or, when OPENHARNESS_COST_BASE_MODEL is
     * set and priced, that model is the ×1 reference); absolute USD amounts stay
     * out of the UI. Best-effort: on any failure the coefficients stay null.
     */
    private async attachCostCoefficients(options: ModelOption[], proxyBaseUrl: string, headers: Record<string, string>): Promise<void> {
        if (!options.length) return;
        const info = await this.fetchJson<{
            data?: Array<{
                model_name?: string;
                model_info?: { input_cost_per_token?: number | null; output_cost_per_token?: number | null };
            }>;
        }>(`${proxyBaseUrl}/model/info`, { headers });
        if (!info?.data?.length) return;

        // Total per-token price (input + output) keyed by model name; only the
        // ids discovery already exposes are considered.
        const priceById = new Map<string, number>();
        for (const entry of info.data) {
            const id = entry?.model_name?.trim();
            if (!id) continue;
            const input = Number(entry.model_info?.input_cost_per_token) || 0;
            const output = Number(entry.model_info?.output_cost_per_token) || 0;
            const total = input + output;
            if (total > 0) priceById.set(id, total);
        }

        const prices = options.map((option) => priceById.get(option.id)).filter((price): price is number => typeof price === 'number' && price > 0);
        if (!prices.length) return;

        const baseModel = process.env.OPENHARNESS_COST_BASE_MODEL?.trim();
        const base = (baseModel && priceById.get(baseModel)) || this.median(prices);
        if (!base || base <= 0) return;

        for (const option of options) {
            const price = priceById.get(option.id);
            if (typeof price !== 'number' || price <= 0) continue;
            option.costCoefficient = this.roundCoefficient(price / base);
        }
    }

    private median(values: number[]): number {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    /** Friendly multiplier: one decimal at/above ×1, two below, never rounded to 0. */
    private roundCoefficient(raw: number): number {
        const rounded = raw >= 1 ? Number(raw.toFixed(1)) : Number(raw.toFixed(2));
        return rounded === 0 ? 0.01 : rounded;
    }

    private async fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
        try {
            const response = await fetch(url, init);
            if (!response.ok) {
                // The model list is the cheapest call the key makes, so it is
                // usually the first to notice the key died upstream. Reporting it
                // here re-registers before the user sends a doomed message.
                if (response.status === 401) void this.connection.reportAuthFailure();
                return null;
            }
            return await response.json() as T;
        } catch {
            return null;
        }
    }

    private mergeModelOptions(options: ModelOption[]): ModelOption[] {
        const result = new Map<string, ModelOption>();
        for (const option of options) {
            if (!option?.id || !option?.model || !option?.baseURL) continue;
            if (!result.has(option.id)) result.set(option.id, option);
        }
        return Array.from(result.values());
    }

    private getModelPromptName(modelId: string, modelName: string): string {
        const candidates = [
            `openharness-model-${normalizePromptKey(modelId)}`,
            `openharness-model-${normalizePromptKey(modelName)}`,
        ];
        return candidates.find((name) => promptExists(name)) ?? 'openharness-model-default';
    }

    private userFileDir(user: UserAP): string {
        const path = require('path');
        const safeUserId = String(user.id).replace(/[^a-zA-Z0-9_-]/g, '_');
        return path.join(this.fileStore, safeUserId);
    }

    private fileIndexPath(user: UserAP): string {
        const path = require('path');
        return path.join(this.userFileDir(user), 'index.json');
    }

    private readFileIndex(user: UserAP): any[] {
        const fs = require('fs');
        const indexPath = this.fileIndexPath(user);
        if (!fs.existsSync(indexPath)) return [];
        try {
            const parsed = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    private writeFileIndex(user: UserAP, files: any[]): void {
        const fs = require('fs');
        const dir = this.userFileDir(user);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(this.fileIndexPath(user), JSON.stringify(files, null, 2));
    }

    private isStoredTextFile(name: string, mimeType?: string): boolean {
        const lowerName = name.toLowerCase();
        if (lowerName === '.env' || lowerName.startsWith('.env.')) return true;
        const mime = mimeType || '';
        if (mime.startsWith('text/')) return true;
        if (['application/json', 'application/xml', 'application/x-yaml', 'application/sql', 'image/svg+xml'].includes(mime)) return true;
        const ext = name.split('.').pop()?.toLowerCase() || '';
        return [
            'txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'yaml', 'yml', 'xml', 'html', 'css',
            'js', 'ts', 'jsx', 'tsx', 'sql', 'log', 'ini', 'conf', 'env', 'sh', 'graphql',
        ].includes(ext);
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
