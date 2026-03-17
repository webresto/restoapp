import {z} from 'zod';
import {
    Agent,
    AgentInputItem,
    run,
    tool,
    setDefaultOpenAIKey,
    RunContext,
} from '@openai/agents';
import {AbstractAiModelService, AiAssistantMessage, Entity, ModelConfig, Adminizer, DataAccessor, UserAP} from 'adminizer';

interface AgentContext {
    user: UserAP;
}

export class OpenAiDataAgentService extends AbstractAiModelService {
    private readonly apiKey?: string;
    private readonly model: string;

    constructor(adminizer: Adminizer) {
        super(adminizer, {
            id: 'openai-data',
            name: 'OpenAI data explorer',
            description: 'Answers questions with live data retrieved via Restoapp models.',
        });

        this.apiKey = process.env.OPENAI_API_KEY ?? process.env.ADMINIZER_OPENAI_KEY;
        this.model = process.env.OPENAI_AGENT_MODEL ?? 'gpt-4.1-mini';

        if (this.apiKey) {
            setDefaultOpenAIKey(this.apiKey);
        } else {
            Adminizer.log.warn('[OpenAiDataAgentService] OPENAI_API_KEY is not configured; the agent will remain inactive.');
        }
    }

    public isEnabled(): boolean {
        return Boolean(this.apiKey);
    }

    public async generateReply(
        prompt: string,
        history: AiAssistantMessage[],
        user: UserAP,
    ): Promise<string> {
        if (!this.isEnabled()) {
            return 'The OpenAI data agent is not configured. Please set the OPENAI_API_KEY environment variable.';
        }

        try {
            const agent = this.createAgent(user);
            const conversation = this.toAgentInput(history);
            const result = await run(agent, conversation.length > 0 ? conversation : prompt, {
                context: {user},
                maxTurns: 6,
            });

            return typeof result.finalOutput === 'string'
                ? result.finalOutput
                : 'The agent finished without returning a message.';
        } catch (error) {
            Adminizer.log.error('[OpenAiDataAgentService] Failed to generate reply', error);
            return 'I encountered an error while generating a response. Please try again later.';
        }
    }

    private createAgent(user: UserAP): Agent<AgentContext> {
        const accessibleModels = this.listReadableModels(user);
        const modelSummary = accessibleModels.length > 0
            ? accessibleModels.map(({name, config}) => `• ${name} (model key: ${config.model})`).join('\n')
            : 'No models are currently accessible.';

        const writableModels = this.listWritableModels(user);
        const writableSummary = writableModels.length > 0
            ? writableModels.map(({name, config, operations}) => `• ${name} (model key: ${config.model}, operations: ${operations.join(', ')})`).join('\n')
            : 'No models are writable.';

        const dataQueryTool = tool({
            name: 'query_model_records',
            description: 'Query Restoapp models using DataAccessor. Provide the model name from the admin panel configuration.',
            parameters: {
                type: 'object',
                properties: {
                    model: {
                        type: 'string',
                        description: 'Model name as defined in the Restoapp configuration',
                        minLength: 1
                    },
                    filter: {
                        type: 'string',
                        description: 'Optional filter as a JSON string matching the model criteria'
                    },
                    fields: {
                        type: 'array',
                        items: { type: 'string', minLength: 1 },
                        description: 'Optional list of fields to include in the response'
                    },
                    limit: {
                        type: 'number',
                        minimum: 1,
                        maximum: 50,
                        description: 'Maximum number of records to return (default 10).'
                    }
                },
                required: ['model', 'filter', 'fields', 'limit'],
                additionalProperties: false
            },
            execute: async (input: any, runContext?: RunContext<AgentContext>) => {
                const activeUser = runContext?.context?.user ?? user;

                if (!input.model) {
                    throw new Error('Model name is required');
                }

                const entity = this.resolveEntity(input.model);
                if (!entity.model) {
                    throw new Error(`Model "${input.model}" is not registered in Restoapp.`);
                }

                const accessor = new DataAccessor(this.adminizer, activeUser, entity, 'list');
                let criteria = {};
                if (input.filter && input.filter.trim()) {
                    try {
                        criteria = JSON.parse(input.filter);
                    } catch (e) {
                        throw new Error('Invalid filter JSON');
                    }
                }
                const records = await entity.model.find(criteria, accessor);
                const limited = records.slice(0, input.limit ?? 10);
                const projected = input.fields && input.fields.length > 0
                    ? limited.map((record) => this.pickFields(record, input.fields ?? []))
                    : limited;

                return JSON.stringify({
                    model: entity.name,
                    count: projected.length,
                    records: projected,
                }, null, 2);
            },
        });

        // MCP tools — allow admin users to call MCP server tools directly (in-process)
        const mcpTool = tool({
            name: 'call_mcp_tool',
            description: 'Call an MCP server tool directly. Only available for administrator users. ' +
                'Use list_mcp_tools first to see available tools and their schemas.',
            parameters: {
                type: 'object',
                properties: {
                    tool_name: {
                        type: 'string',
                        description: 'Name of the MCP tool to call',
                        minLength: 1,
                    },
                    params: {
                        type: 'string',
                        description: 'JSON string with parameters for the tool (see tool schema). Use "{}" if no params needed.',
                        default: '{}',
                    },
                },
                required: ['tool_name'],
                additionalProperties: false,
            },
            execute: async (input: any, runContext?: RunContext<AgentContext>) => {
                const activeUser = runContext?.context?.user ?? user;
                if (!activeUser.isAdministrator) {
                    return JSON.stringify({error: 'MCP tools are only available for administrators.'});
                }

                const mcp = (globalThis as any).mcp;
                if (!mcp || typeof mcp.callTool !== 'function') {
                    return JSON.stringify({error: 'MCP server is not available.'});
                }

                let params = {};
                if (input.params && input.params.trim()) {
                    try {
                        params = JSON.parse(input.params);
                    } catch {
                        return JSON.stringify({error: 'Invalid params JSON.'});
                    }
                }

                try {
                    const result = await mcp.callTool(input.tool_name, params);
                    return JSON.stringify({tool: input.tool_name, result}, null, 2);
                } catch (err: any) {
                    return JSON.stringify({error: err.message || 'MCP tool call failed.'});
                }
            },
        });

        const listMcpToolsTool = tool({
            name: 'list_mcp_tools',
            description: 'List all available MCP server tools with their descriptions and schemas. Only available for administrators.',
            parameters: {
                type: 'object',
                properties: {},
                additionalProperties: false,
            },
            execute: async (_input: any, runContext?: RunContext<AgentContext>) => {
                const activeUser = runContext?.context?.user ?? user;
                if (!activeUser.isAdministrator) {
                    return JSON.stringify({error: 'MCP tools are only available for administrators.'});
                }

                const mcp = (globalThis as any).mcp;
                if (!mcp || typeof mcp.listTools !== 'function') {
                    return JSON.stringify({error: 'MCP server is not available.'});
                }

                const mcpTools = mcp.listTools('all');
                return JSON.stringify({count: mcpTools.length, tools: mcpTools}, null, 2);
            },
        });

        const agentTools: any[] = [dataQueryTool];
        // Add MCP tools only if the user is an administrator
        if (user.isAdministrator) {
            agentTools.push(listMcpToolsTool, mcpTool);
        }

        const mcpNote = user.isAdministrator
            ? [
                '',
                'You also have access to MCP server tools via list_mcp_tools and call_mcp_tool.',
                'Use list_mcp_tools to discover available tools, then call_mcp_tool to invoke them.',
                'MCP tools provide access to system-level operations like health checks, module info, menu data, and image uploads.',
            ].join('\n')
            : '';

        return new Agent<AgentContext>({
            name: 'Restoapp data agent',
            instructions: [
                'You are an assistant that answers questions using Restoapp data.',
                'Always rely on the provided tools to inspect or modify database records.',
                'Prefer concise JSON outputs for tool calls and provide human-readable summaries afterwards.',
                'Only include fields that are relevant to the request and double-check required values before creating records.',
                'Summaries should explain how the answer was derived from the data or confirm the performed mutation.',
                '',
                'Accessible models (read):',
                modelSummary,
                '',
                'Writable models:',
                writableSummary,
                mcpNote,
            ].join('\n'),
            handoffDescription: 'Retrieves Restoapp records using DataAccessor with full permission checks.',
            tools: agentTools,
            model: this.model,
        });
    }

    private pickFields<T extends Record<string, unknown>>(record: T, fields: string[]): Partial<T> {
        return fields.reduce<Partial<T>>((acc, field) => {
            if (field in record) {
                acc[field as keyof T] = record[field] as T[keyof T];
            }
            return acc;
        }, {});
    }

    private toAgentInput(history: AiAssistantMessage[]): AgentInputItem[] {
        return history.map<AgentInputItem>((message) => {
            if (message.role === 'user') {
                return {
                    type: 'message',
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: message.content,
                        },
                    ],
                };
            }

            return {
                type: 'message',
                role: 'assistant',
                status: 'completed',
                content: [
                    {
                        type: 'output_text',
                        text: message.content,
                    },
                ],
            };
        });
    }

    private listReadableModels(user: UserAP): Array<{name: string; config: ModelConfig}> {
        const readable: Array<{name: string; config: ModelConfig}> = [];

        for (const [entityName, rawConfig] of Object.entries(this.adminizer.config.models ?? {})) {
            const config = this.ensureModelConfig(entityName, rawConfig);
            const modelInstance = config.model
                ? this.adminizer.modelHandler.model.get(config.model.toLowerCase())
                : undefined;

            if (!modelInstance) {
                continue;
            }

            const token = `read-${modelInstance.modelname}-model`;
            if (this.adminizer.accessRightsHelper.hasPermission(token, user)) {
                readable.push({name: entityName, config});
            }
        }

        return readable;
    }

    private listWritableModels(user: UserAP): Array<{name: string; config: ModelConfig; operations: string[]}> {
        const writable: Array<{name: string; config: ModelConfig; operations: string[]}> = [];

        for (const [entityName, rawConfig] of Object.entries(this.adminizer.config.models ?? {})) {
            const config = this.ensureModelConfig(entityName, rawConfig);
            const modelInstance = config.model
                ? this.adminizer.modelHandler.model.get(config.model.toLowerCase())
                : undefined;

            if (!modelInstance) {
                continue;
            }

            const operations: string[] = [];

            if (this.adminizer.accessRightsHelper.hasPermission(`create-${modelInstance.modelname}-model`, user)) {
                operations.push('create');
            }
            if (this.adminizer.accessRightsHelper.hasPermission(`update-${modelInstance.modelname}-model`, user)) {
                operations.push('update');
            }
            if (this.adminizer.accessRightsHelper.hasPermission(`delete-${modelInstance.modelname}-model`, user)) {
                operations.push('delete');
            }

            if (operations.length > 0) {
                writable.push({name: entityName, config, operations});
            }
        }

        return writable;
    }

    private resolveEntity(modelName: string): Entity {
        const normalized = modelName.trim().toLowerCase();
        const models = this.adminizer.config.models ?? {};

        for (const [entityName, rawConfig] of Object.entries(models)) {
            const config = this.ensureModelConfig(entityName, rawConfig);
            const candidateNames = new Set([
                entityName.toLowerCase(),
                config.model?.toLowerCase(),
            ]);

            if (!candidateNames.has(normalized)) {
                continue;
            }

            const modelInstance = this.adminizer.modelHandler.model.get(config.model?.toLowerCase());
            if (!modelInstance) {
                throw new Error(`Model adapter is not initialized for "${config.model}".`);
            }

            return {
                name: entityName,
                config,
                model: modelInstance,
                type: 'model',
                uri: `${this.adminizer.config.routePrefix}/model/${entityName}`,
            };
        }

        throw new Error(`Unknown model "${modelName}".`);
    }

    private ensureModelConfig(entityName: string, config: ModelConfig | boolean): ModelConfig {
        if (typeof config === 'boolean') {
            const modelId = entityName.toLowerCase();
            return {
                model: modelId,
                title: entityName,
                icon: 'description',
                list: true,
                add: true,
                edit: true,
                remove: true,
                view: true,
            } as ModelConfig;
        }

        return config;
    }
}
