/**
 * Connection manager for the OpenHarness agent.
 *
 * Resolves which LLM endpoint + API key the agent should use, in priority order:
 *   1. Manually configured key in the OPENHARNESS_CONNECTION setting (LiteLLM or
 *      any OpenAI-compatible endpoint — provider is detected or set explicitly).
 *   2. Legacy OPENHARNESS_API_KEY env var (backward compatible).
 *   3. A key auto-issued by the LiteLLM frontend broker (POST /frontend/register),
 *      persisted in the OPENHARNESS_BROKER_STATE setting so restarts do not burn
 *      the broker's global one-key-per-hour issue slot.
 *
 * When no key is available the manager keeps retrying registration in the
 * background, honouring the broker's retry_after_at on 429 responses. The admin
 * UI polls getStatus() to render the "registration in progress" loader.
 */

const CONNECTION_SETTING = 'OPENHARNESS_CONNECTION';
const BROKER_STATE_SETTING = 'OPENHARNESS_BROKER_STATE';
const DEFAULT_BASE_URL = 'https://lllm.m42.cx/v1';
// Re-check config/expiry even when idle, so admin edits of the setting are
// picked up without a restart.
const IDLE_RECHECK_MS = 60_000;
const NETWORK_RETRY_MS = 60_000;
// 400/401 from the broker: an integration/config problem. Retried often enough
// that fixing the broker side gets picked up without a restart.
const HARD_ERROR_RETRY_MS = 5 * 60_000;
// Consider a broker key expired slightly early so a session never starts on
// a key that dies mid-run.
const EXPIRY_SLACK_MS = 60_000;

// LiteLLM answers a deleted/unknown key with 401 and this wording. The proxy
// does NOT say "401" or "unauthorized" in the message, and the ai-sdk hides the
// status code once it wraps the call in a RetryError, so both are matched.
const REVOKED_KEY_PATTERN = /invalid proxy server token|unable to find token|authentication error/i;

/**
 * True when the provider rejected the key itself — it was deleted, blocked or
 * expired upstream — and re-registering is the only way forward.
 *
 * Deliberately narrow: the broker issues at most one key per hour for every
 * install, so a false positive here throws away a working key and burns that
 * shared slot. Rate limits (429) and budget errors mean the key is alive and
 * must never land in this branch; 403 is excluded too, because LiteLLM uses it
 * for "key may not access this model", which re-registration would not fix.
 */
export function isRevokedKeyError(error: unknown): boolean {
    for (const current of flattenErrorChain(error)) {
        const status = current.statusCode ?? current.status;
        if (status === 401) return true;
        // The wording is only trusted when no status survived the wrapping. Any
        // other status means the key itself is alive: 429 throttles it, and 403
        // ("Authentication Error: key not allowed to access model") also carries
        // auth-sounding wording that re-registration would not fix.
        if (status == null && REVOKED_KEY_PATTERN.test(String(current.message ?? ''))) return true;
    }
    return false;
}

/**
 * One log line for an LLM failure.
 *
 * Both the ai-sdk and LiteLLM attach the entire request to their errors —
 * message list, tool schemas, every response header — so logging the object
 * itself buries the console in hundreds of lines per failed run. Only the facts
 * that identify the failure are kept: status, what the provider said, and how
 * many attempts were burned getting there.
 */
export function summarizeLlmError(error: unknown): string {
    const chain = flattenErrorChain(error);
    const withStatus = chain.find((entry) => (entry.statusCode ?? entry.status) != null);
    const source = withStatus ?? chain[0];
    if (!source) return String(error ?? 'unknown error');

    const status = withStatus ? (withStatus.statusCode ?? withStatus.status) : null;
    // RetryError collects one entry per attempt, and its own message already
    // repeats the last one — read the count, not the text.
    const attempts = chain.find((entry) => Array.isArray(entry.errors))?.errors?.length;
    const message = String(source.message ?? '').replace(/\s+/g, ' ').trim();

    const parts: string[] = [];
    if (status != null) parts.push(`HTTP ${status}`);
    parts.push(message.length > 300 ? `${message.slice(0, 300)}…` : message || 'no message');
    if (attempts && attempts > 1) parts.push(`${attempts} attempts burned`);
    return parts.join(' — ');
}

/** Breadth-first walk over `cause`/`lastError`/`errors[]`, cycle-safe. */
function flattenErrorChain(error: unknown): any[] {
    const seen = new Set<unknown>();
    const found: any[] = [];
    const queue: any[] = [error];
    while (queue.length) {
        const current = queue.shift();
        if (!current || typeof current !== 'object' || seen.has(current)) continue;
        seen.add(current);
        found.push(current);
        // RetryError keeps the real causes in `errors`; ai-sdk errors chain via `cause`.
        queue.push(current.cause, current.lastError, ...(Array.isArray(current.errors) ? current.errors : []));
    }
    return found;
}

export type OpenHarnessProvider = 'litellm' | 'openai';
export type ConnectionSource = 'setting' | 'env' | 'broker';
// setup_required: PROJECT_NAME is not set yet — broker registration needs it,
// so the admin must finish the server setup first.
export type ConnectionState = 'ready' | 'registering' | 'waiting_retry' | 'setup_required' | 'error';

export type OpenHarnessCredentials = {
    apiKey: string;
    baseUrl: string;
    provider: OpenHarnessProvider;
    source: ConnectionSource;
    /** LiteLLM user id (frontend:<frontend_id>) when the key came from the broker. */
    userId: string | null;
};

export type ConnectionStatus = {
    state: ConnectionState;
    provider: OpenHarnessProvider;
    baseUrl: string;
    source: ConnectionSource | null;
    /** ISO time of the next scheduled registration attempt (waiting_retry/error). */
    nextAttemptAt: string | null;
    lastError: string | null;
    /** Broker-issued key expiry, when known. */
    expiresAt: string | null;
};

type ConnectionConfig = {
    provider: 'auto' | OpenHarnessProvider;
    baseUrl: string;
    apiKey: string;
    brokerToken: string;
    frontendId: string;
    projectName: string;
    registerModels: string[];
};

type BrokerState = {
    apiKey?: string;
    userId?: string;
    baseUrl?: string;
    expiresAt?: string;
    issuedAt?: string;
    limits?: Record<string, unknown>;
};

const CONNECTION_JSON_SCHEMA = {
    type: 'object',
    properties: {
        provider: {
            type: 'string',
            enum: ['auto', 'litellm', 'openai'],
            description: 'Force the adapter type. "auto" detects OpenAI endpoints by URL.',
        },
        baseUrl: { type: 'string', description: 'OpenAI-compatible endpoint, e.g. https://lllm.m42.cx/v1 or https://api.openai.com/v1' },
        apiKey: { type: 'string', description: 'Manual API key. Leave empty to auto-register through the LiteLLM frontend broker.' },
        brokerToken: { type: 'string', description: 'Optional broker shared token, sent only when set (fallback: OPENHARNESS_BROKER_TOKEN env).' },
        frontendId: { type: 'string', description: 'Stable frontend id for broker registration. Default: restoapp:<PROJECT_NAME>.' },
        projectName: { type: 'string', description: 'Project name sent to the broker. Default: the PROJECT_NAME core setting.' },
        registerModels: { type: 'array', items: { type: 'string' }, description: 'Models requested from the broker on registration.' },
    },
} as const;

const BROKER_STATE_JSON_SCHEMA = {
    type: 'object',
    properties: {
        apiKey: { type: 'string' },
        userId: { type: 'string' },
        baseUrl: { type: 'string' },
        expiresAt: { type: 'string' },
        issuedAt: { type: 'string' },
        limits: { type: 'object' },
    },
} as const;

export class OpenHarnessConnectionManager {
    private credentials: OpenHarnessCredentials | null = null;
    private brokerLimits: Record<string, unknown> | null = null;
    private state: ConnectionState = 'registering';
    private lastError: string | null = null;
    private nextAttemptAt: number | null = null;
    private expiresAt: string | null = null;
    private timer: NodeJS.Timeout | null = null;
    private resolving: Promise<void> | null = null;
    private readonly changeListeners: Array<() => void> = [];

    public onChange(listener: () => void): void {
        this.changeListeners.push(listener);
    }

    /**
     * Declare settings, seed the connection setting, and start resolution.
     *
     * Never throws: a failure here (unavailable Settings model, unreachable
     * datastore) used to leave the manager stuck in `registering` forever, with
     * the agent answering "not connected" and nothing retrying. It is recorded
     * as an error state with a retry instead, so the panel can show the reason.
     */
    public async init(): Promise<void> {
        try {
            const SettingsModel = (globalThis as any).Settings;
            SettingsModel.setDeclaredSetting(CONNECTION_SETTING);
            SettingsModel.setDeclaredSetting(BROKER_STATE_SETTING);
            if (await SettingsModel.get(CONNECTION_SETTING) === undefined) {
                await SettingsModel.set(CONNECTION_SETTING, {
                    value: { provider: 'auto', baseUrl: '', apiKey: '' },
                    type: 'json',
                    jsonSchema: CONNECTION_JSON_SCHEMA,
                    name: 'OpenHarness LLM connection',
                    description: 'Endpoint + API key for the RestoApp Assistant. Empty apiKey = auto-register through the LiteLLM frontend broker.',
                });
            }
        } catch (error: any) {
            this.failWithRetry(error, 'settings are unavailable');
            return;
        }
        await this.refresh();
    }

    /** Last resolved credentials (sync access for hot paths). */
    public getCredentialsSync(): OpenHarnessCredentials | null {
        return this.credentials;
    }

    /**
     * Limits the broker reported when it issued the current key (daily budget,
     * rpm/tpm). Used as a fallback readout when LiteLLM does not let the key
     * inspect its own user record.
     */
    public getBrokerLimits(): Record<string, unknown> | null {
        return this.credentials?.source === 'broker' ? this.brokerLimits : null;
    }

    public isReady(): boolean {
        return this.state === 'ready' && this.credentials !== null;
    }

    public getStatus(): ConnectionStatus {
        return {
            state: this.state,
            provider: this.credentials?.provider
                ?? this.detectProvider(this.credentials?.baseUrl || DEFAULT_BASE_URL, 'auto'),
            baseUrl: this.credentials?.baseUrl || DEFAULT_BASE_URL,
            source: this.credentials?.source ?? null,
            nextAttemptAt: this.nextAttemptAt ? new Date(this.nextAttemptAt).toISOString() : null,
            lastError: this.lastError,
            expiresAt: this.expiresAt,
        };
    }

    /**
     * Re-read config, resolve credentials, and (re)start registration if needed.
     *
     * Resolution failures are reported as an error state with a scheduled retry
     * rather than thrown: this is called from the panel's status polling, which
     * must keep describing the problem instead of turning into a 500.
     */
    public async refresh(): Promise<ConnectionStatus> {
        if (!this.resolving) {
            this.resolving = this.resolve()
                .catch((error: any) => this.failWithRetry(error, 'credential resolution failed'))
                .finally(() => { this.resolving = null; });
        }
        await this.resolving;
        return this.getStatus();
    }

    /**
     * Called when the provider rejected the key (401). Broker keys get revoked
     * or expire server-side; drop the stored key and re-register immediately.
     */
    public async reportAuthFailure(): Promise<void> {
        // Only broker keys are ours to discard: a key from the setting or env was
        // put there by an admin, and silently dropping it would hide their typo.
        if (this.credentials?.source !== 'broker') return;
        sails.log.warn('OpenHarness > broker key was rejected by the provider, re-registering');
        await this.saveBrokerState({});
        this.credentials = null;
        this.state = 'registering';
        this.scheduleNextAttempt(0);
    }

    // ── internals ─────────────────────────────────────────────────────

    private async resolve(): Promise<void> {
        const previousKey = this.credentials?.apiKey ?? null;
        const config = await this.readConfig();

        // 1. Manual key from the setting.
        if (config.apiKey) {
            this.setReady({
                apiKey: config.apiKey,
                baseUrl: config.baseUrl || DEFAULT_BASE_URL,
                provider: this.detectProvider(config.baseUrl || DEFAULT_BASE_URL, config.provider),
                source: 'setting',
                userId: null,
            }, previousKey);
            return;
        }

        // 2. Legacy env key.
        if (process.env.OPENHARNESS_API_KEY) {
            const baseUrl = process.env.OPENHARNESS_BASE_URL || config.baseUrl || DEFAULT_BASE_URL;
            this.setReady({
                apiKey: process.env.OPENHARNESS_API_KEY,
                baseUrl,
                provider: this.detectProvider(baseUrl, config.provider),
                source: 'env',
                userId: null,
            }, previousKey);
            return;
        }

        // 3. Previously issued broker key.
        const brokerState = await this.readBrokerState();
        if (brokerState.apiKey && !this.isExpired(brokerState.expiresAt)) {
            this.expiresAt = brokerState.expiresAt ?? null;
            this.brokerLimits = brokerState.limits ?? null;
            this.setReady({
                apiKey: brokerState.apiKey,
                baseUrl: brokerState.baseUrl || config.baseUrl || DEFAULT_BASE_URL,
                provider: 'litellm',
                source: 'broker',
                userId: brokerState.userId ?? null,
            }, previousKey);
            // Re-register shortly before the key expires.
            if (brokerState.expiresAt) {
                const untilRenewal = Date.parse(brokerState.expiresAt) - EXPIRY_SLACK_MS - Date.now();
                this.scheduleNextAttempt(Math.max(untilRenewal, IDLE_RECHECK_MS), { silent: true });
            }
            return;
        }

        // 4. No key anywhere: register through the broker. Registration is
        // keyed by the project name, so an unfinished server setup blocks it.
        this.credentials = null;
        this.expiresAt = null;
        if (!config.projectName) {
            this.state = 'setup_required';
            this.lastError = 'PROJECT_NAME is not set. Finish the server setup to register the assistant.';
            this.scheduleNextAttempt(IDLE_RECHECK_MS, { silent: true });
            return;
        }
        await this.register(config, previousKey);
    }

    private async register(config: ConnectionConfig, previousKey: string | null): Promise<void> {
        // Do not spam the broker: if a retry is already scheduled for later, keep waiting.
        if (this.nextAttemptAt && this.nextAttemptAt - Date.now() > 1_000) {
            this.state = 'waiting_retry';
            return;
        }

        this.state = 'registering';
        const baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
        try {
            // Registration is always attempted: the default broker is expected to
            // hand out rate-limited frontend keys. A shared token, when configured,
            // is sent along — otherwise the request goes out unauthenticated and a
            // 401 simply becomes a retried error state.
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            if (config.brokerToken) headers.Authorization = `Bearer ${config.brokerToken}`;
            const response = await fetch(`${baseUrl}/frontend/register`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    frontend_id: config.frontendId,
                    project_name: config.projectName,
                    models: config.registerModels,
                }),
            });
            const body: any = await response.json().catch(() => ({}));

            if (response.ok && body?.api_key) {
                await this.saveBrokerState({
                    apiKey: body.api_key,
                    userId: body.user_id,
                    baseUrl: body.base_url || baseUrl,
                    expiresAt: body.expires_at,
                    issuedAt: new Date().toISOString(),
                    limits: body.limits,
                });
                this.expiresAt = body.expires_at ?? null;
                this.brokerLimits = body.limits ?? null;
                this.setReady({
                    apiKey: body.api_key,
                    baseUrl: body.base_url || baseUrl,
                    provider: 'litellm',
                    source: 'broker',
                    userId: body.user_id ?? null,
                }, previousKey);
                sails.log.info(`OpenHarness > broker issued a key for ${body.user_id ?? config.frontendId}`);
                return;
            }

            if (response.status === 429) {
                // Broker issues at most one key per interval globally; wait until our slot.
                const details = body?.details ?? {};
                const retryAt = Date.parse(details.retry_after_at ?? '');
                const retrySeconds = Number(details.retry_after_seconds);
                const delay = Number.isFinite(retryAt)
                    ? Math.max(retryAt - Date.now(), 5_000)
                    : Number.isFinite(retrySeconds) ? Math.max(retrySeconds * 1000, 5_000) : NETWORK_RETRY_MS;
                this.state = 'waiting_retry';
                this.lastError = body?.message || 'Broker key issue rate limited';
                this.scheduleNextAttempt(delay);
                sails.log.info(`OpenHarness > broker rate limited, next registration attempt in ${Math.round(delay / 1000)}s`);
                return;
            }

            // 400/401/…: an integration problem — retry slowly so logs stay readable.
            this.state = 'error';
            this.lastError = body?.message || body?.error || `Broker registration failed with HTTP ${response.status}`;
            this.scheduleNextAttempt(HARD_ERROR_RETRY_MS);
            sails.log.error(`OpenHarness > broker registration failed: ${this.lastError}`);
        } catch (error: any) {
            this.state = 'error';
            this.lastError = error?.message || 'Broker is unreachable';
            this.scheduleNextAttempt(NETWORK_RETRY_MS);
            sails.log.warn(`OpenHarness > broker registration attempt failed: ${this.lastError}`);
        }
    }

    /** Record an unexpected failure so the UI can show it, and try again later. */
    private failWithRetry(error: unknown, context: string): void {
        this.state = 'error';
        this.lastError = `${context}: ${(error as any)?.message ?? String(error)}`;
        sails.log.error(`OpenHarness > ${this.lastError}`);
        this.scheduleNextAttempt(NETWORK_RETRY_MS);
    }

    private setReady(credentials: OpenHarnessCredentials, previousKey: string | null): void {
        this.credentials = credentials;
        this.state = 'ready';
        this.lastError = null;
        this.nextAttemptAt = null;
        if (credentials.source !== 'broker') this.expiresAt = null;
        if (previousKey !== credentials.apiKey) {
            for (const listener of this.changeListeners) {
                try { listener(); } catch (error) { sails.log.error('OpenHarness > onChange listener failed', error); }
            }
        }
    }

    /** silent = keep current state (idle re-check), otherwise it is a retry countdown. */
    private scheduleNextAttempt(delayMs: number, options: { silent?: boolean } = {}): void {
        if (this.timer) clearTimeout(this.timer);
        this.nextAttemptAt = options.silent ? this.nextAttemptAt : Date.now() + delayMs;
        this.timer = setTimeout(() => {
            this.nextAttemptAt = null;
            void this.refresh();
        }, Math.max(delayMs, 1_000));
        this.timer.unref?.();
    }

    private async readConfig(): Promise<ConnectionConfig> {
        const SettingsModel = (globalThis as any).Settings;
        const raw = (await SettingsModel.get(CONNECTION_SETTING)) as Partial<ConnectionConfig> | undefined ?? {};
        // The broker identifies an install by its project name; the core
        // PROJECT_NAME setting is the canonical source (required by setup).
        const coreProjectName = ((await SettingsModel.get('PROJECT_NAME')) as string | undefined || '').trim();
        const projectName = (raw.projectName || '').trim() || coreProjectName;
        const frontendId = (raw.frontendId || '').trim() || (projectName ? `restoapp:${projectName}` : '');
        return {
            provider: raw.provider === 'litellm' || raw.provider === 'openai' ? raw.provider : 'auto',
            baseUrl: (raw.baseUrl || '').trim(),
            apiKey: (raw.apiKey || '').trim(),
            brokerToken: (raw.brokerToken || '').trim() || (process.env.OPENHARNESS_BROKER_TOKEN || '').trim(),
            frontendId,
            projectName,
            registerModels: Array.isArray(raw.registerModels) && raw.registerModels.length
                ? raw.registerModels
                : ['grs-base-regular'],
        };
    }

    private async readBrokerState(): Promise<BrokerState> {
        const SettingsModel = (globalThis as any).Settings;
        const raw = await SettingsModel.get(BROKER_STATE_SETTING);
        return (raw && typeof raw === 'object') ? raw as BrokerState : {};
    }

    private async saveBrokerState(state: BrokerState): Promise<void> {
        const SettingsModel = (globalThis as any).Settings;
        await SettingsModel.set(BROKER_STATE_SETTING, {
            value: state as any,
            type: 'json',
            jsonSchema: BROKER_STATE_JSON_SCHEMA,
            name: 'OpenHarness broker state',
            description: 'Runtime state: key issued by the LiteLLM frontend broker. Managed automatically.',
            readOnly: true,
            // Holds the issued API key — DB-only, never rendered in the UI or exported.
            secret: true,
        });
    }

    private isExpired(expiresAt?: string): boolean {
        if (!expiresAt) return false;
        const timestamp = Date.parse(expiresAt);
        return Number.isFinite(timestamp) && timestamp - EXPIRY_SLACK_MS <= Date.now();
    }

    private detectProvider(baseUrl: string, configured: 'auto' | OpenHarnessProvider): OpenHarnessProvider {
        if (configured !== 'auto') return configured;
        return /(^|\.)openai\.com/i.test(baseUrl) ? 'openai' : 'litellm';
    }
}
