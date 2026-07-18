/**
 * Normalized limit/budget readout for the OpenHarness agent UI.
 *
 * LiteLLM adapter: reads `/key/info` with the agent's own key (works without a
 * master key). Broker-issued keys carry TWO budget windows — a short "burst"
 * window (4h) and a daily window (24h) — set via `budget_limits` at key
 * generation. LiteLLM enforces both and computes a `reset_at` per window, but
 * only exposes ONE spend counter (the running total, which resets on the key's
 * primary `budget_duration` = 24h). The per-window spend of the 4h burst window
 * is not reachable directly with the frontend key (the /spend/* and /user/info
 * admin endpoints require the master key), so it is *derived* from the daily
 * running total via a per-window baseline snapshot (see `deriveBurstSpend`):
 * every request counts toward both windows 1:1, so the burst spend is the
 * growth of the daily total since the window opened.
 *
 * OpenAI adapter: the OpenAI platform exposes no per-key budget API, so the
 * response just states that limits are managed on the provider's side.
 */

import type { OpenHarnessCredentials } from './OpenHarnessConnectionManager';

/**
 * One budget window. The daily window's `spentUsd`/`remainingBudgetUsd` come
 * straight from the key's running spend total; burst windows get a spend value
 * derived from that total via a per-window baseline (see `deriveBurstSpend`).
 */
export type LlmBudgetWindow = {
    /** Semantic role: 'daily' has real spend, 'burst' is the tighter short cap. */
    kind: 'daily' | 'burst';
    /** Human label of the window duration, e.g. '4h' or '24h'. */
    durationLabel: string;
    /** Window length in seconds, for sorting/ratios; null when unparseable. */
    durationSeconds: number | null;
    maxBudgetUsd: number;
    spentUsd: number | null;
    remainingBudgetUsd: number | null;
    resetAt: string | null;
};

export type LlmLimits = {
    provider: string;
    supported: boolean;
    /** True when the key is currently blocked by a budget window (429). */
    overBudget?: boolean;
    message?: string;
    userId?: string | null;
    keyAlias?: string | null;
    // Daily window, kept flat for backward compatibility (the accurate meter).
    maxBudgetUsd: number | null;
    spentUsd: number | null;
    remainingBudgetUsd: number | null;
    budgetResetAt: string | null;
    // Tighter short window (4h burst): cap + reset. LiteLLM does not expose the
    // window's own spend to the frontend key, so `burstSpentUsd` is *derived*
    // from the daily running total via a per-window baseline snapshot (see
    // `deriveBurstSpend`); it is accurate within a window and re-baselines on
    // each reset.
    burstMaxBudgetUsd: number | null;
    burstSpentUsd: number | null;
    burstRemainingBudgetUsd: number | null;
    burstResetAt: string | null;
    burstDurationLabel: string | null;
    /** All windows, shortest-first, for a full readout. */
    windows: LlmBudgetWindow[];
    rpmLimit: number | null;
    tpmLimit: number | null;
    fetchedAt: string;
};

const CACHE_TTL_MS = 20_000;

const DAY_SECONDS = 24 * 60 * 60;

/** Parse a LiteLLM duration label ('4h', '30m', '24h', '1d') to seconds. */
function durationToSeconds(label: unknown): number | null {
    if (typeof label !== 'string') return null;
    const match = label.trim().match(/^(\d+(?:\.\d+)?)\s*(s|m|h|d|w)$/i);
    if (!match) return null;
    const value = Number(match[1]);
    if (!Number.isFinite(value)) return null;
    const unit = match[2].toLowerCase();
    const scale = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : unit === 'd' ? DAY_SECONDS : 7 * DAY_SECONDS;
    return value * scale;
}

export class LlmLimitsService {
    private cache: { key: string; fetchedAt: number; limits: LlmLimits } | null = null;

    /**
     * Per-window baseline of the daily running-spend total, captured at the
     * start of each burst window. LiteLLM only reports ONE spend counter (the
     * daily total), but every dollar counts toward the burst window 1:1 while
     * that window is open, so `burst spent = dailyTotal − baselineAtWindowStart`.
     * Keyed by the window's duration label (e.g. '4h').
     */
    private burstBaselines = new Map<string, { resetAt: string | null; baseline: number }>();

    /**
     * `brokerLimits` is the policy the frontend broker reported when it issued
     * the key ({ daily_budget_usd, four_hour_budget_usd, key_budget_windows,
     * rpm_limit, tpm_limit }); it fills the gaps when LiteLLM does not expose the
     * limits to the key itself.
     *
     * `forceRefresh` bypasses the short cache so an explicit UI refresh always
     * hits the LiteLLM server for the live spend and window reset times.
     */
    public async getLimits(
        credentials: OpenHarnessCredentials,
        brokerLimits?: Record<string, unknown> | null,
        forceRefresh = false,
    ): Promise<LlmLimits> {
        const cacheKey = `${credentials.provider}:${credentials.baseUrl}:${credentials.apiKey}`;
        if (!forceRefresh && this.cache && this.cache.key === cacheKey && Date.now() - this.cache.fetchedAt < CACHE_TTL_MS) {
            return this.cache.limits;
        }
        const limits = credentials.provider === 'litellm'
            ? await this.getLiteLlmLimits(credentials, brokerLimits)
            : this.getOpenAiLimits();
        this.cache = { key: cacheKey, fetchedAt: Date.now(), limits };
        return limits;
    }

    public invalidate(): void {
        this.cache = null;
    }

    private getOpenAiLimits(): LlmLimits {
        return {
            provider: 'openai',
            supported: false,
            message: 'Budget and rate limits are managed in the OpenAI dashboard for this provider.',
            maxBudgetUsd: null,
            spentUsd: null,
            remainingBudgetUsd: null,
            budgetResetAt: null,
            burstMaxBudgetUsd: null,
            burstSpentUsd: null,
            burstRemainingBudgetUsd: null,
            burstResetAt: null,
            burstDurationLabel: null,
            windows: [],
            rpmLimit: null,
            tpmLimit: null,
            fetchedAt: new Date().toISOString(),
        };
    }

    private async getLiteLlmLimits(credentials: OpenHarnessCredentials, brokerLimits?: Record<string, unknown> | null): Promise<LlmLimits> {
        // /key/info and /user/info live on the proxy root, not under /v1.
        const root = credentials.baseUrl.replace(/\/+$/, '').replace(/\/v1$/, '');
        const headers = { Accept: 'application/json', Authorization: `Bearer ${credentials.apiKey}` };

        // When the key is over any budget window LiteLLM returns 429 on *every*
        // endpoint — including this read — so capture the raw response to tell a
        // budget block apart from a genuinely unreadable key.
        const keyResult = await this.fetchWithMeta(`${root}/key/info`, { headers });
        const key = keyResult.body?.info ?? null;
        const budgetError = this.detectBudgetError(keyResult.body);
        const userId = credentials.userId || key?.user_id || null;

        // User-level limits win when reachable: the broker mirrors the daily
        // budget and rpm/tpm onto the LiteLLM user. In practice the frontend key
        // cannot read /user/info (needs the master key), so this stays null and
        // the key-level values are used.
        let user: any = null;
        if (userId) {
            const userInfo = await this.fetchJson<any>(`${root}/user/info?user_id=${encodeURIComponent(userId)}`, { headers });
            user = userInfo?.user_info ?? null;
        }

        if (!key && !user) {
            // Over-budget key: report it honestly (caps from the broker policy,
            // meters shown as full) instead of "limits unavailable".
            if (budgetError) {
                return this.buildOverBudgetLimits(brokerLimits, userId, budgetError);
            }
            return {
                provider: 'litellm',
                supported: false,
                message: 'The provider did not return key or user info for this API key.',
                userId,
                maxBudgetUsd: null,
                spentUsd: null,
                remainingBudgetUsd: null,
                budgetResetAt: null,
                burstMaxBudgetUsd: null,
                burstSpentUsd: null,
                burstRemainingBudgetUsd: null,
                burstResetAt: null,
                burstDurationLabel: null,
                windows: [],
                rpmLimit: null,
                tpmLimit: null,
                fetchedAt: new Date().toISOString(),
            };
        }

        const pickNumber = (...values: unknown[]): number | null => {
            for (const value of values) {
                if (typeof value === 'number' && Number.isFinite(value)) return value;
            }
            return null;
        };

        // Running spend total. LiteLLM resets it on the key's primary
        // budget_duration (24h), so it belongs to the daily window.
        const totalSpend = pickNumber(user?.spend, key?.spend);
        const dailyMaxBudget = pickNumber(user?.max_budget, key?.max_budget, brokerLimits?.daily_budget_usd);
        const dailyResetAt = user?.budget_reset_at ?? key?.budget_reset_at ?? null;
        const dailyDurationSeconds = durationToSeconds(user?.budget_duration ?? key?.budget_duration) ?? DAY_SECONDS;

        const windows = this.buildWindows(key, brokerLimits, {
            dailyMaxBudget,
            dailyResetAt,
            dailyDurationSeconds,
            totalSpend,
        });

        const dailyWindow = windows.find((window) => window.kind === 'daily') ?? null;
        const burstWindow = windows.find((window) => window.kind === 'burst') ?? null;

        return {
            provider: 'litellm',
            supported: true,
            userId,
            keyAlias: key?.key_alias ?? null,
            maxBudgetUsd: dailyWindow?.maxBudgetUsd ?? dailyMaxBudget,
            spentUsd: dailyWindow?.spentUsd ?? totalSpend,
            remainingBudgetUsd: dailyWindow?.remainingBudgetUsd
                ?? (dailyMaxBudget !== null && totalSpend !== null ? Math.max(0, dailyMaxBudget - totalSpend) : null),
            budgetResetAt: dailyWindow?.resetAt ?? dailyResetAt,
            burstMaxBudgetUsd: burstWindow?.maxBudgetUsd ?? null,
            burstSpentUsd: burstWindow?.spentUsd ?? null,
            burstRemainingBudgetUsd: burstWindow?.remainingBudgetUsd ?? null,
            burstResetAt: burstWindow?.resetAt ?? null,
            burstDurationLabel: burstWindow?.durationLabel ?? null,
            windows,
            rpmLimit: pickNumber(user?.rpm_limit, key?.rpm_limit, brokerLimits?.rpm_limit),
            tpmLimit: pickNumber(user?.tpm_limit, key?.tpm_limit, brokerLimits?.tpm_limit),
            fetchedAt: new Date().toISOString(),
        };
    }

    /**
     * Build the budget windows from the key's `budget_limits` (preferred: it
     * carries live per-window reset_at) and fall back to the broker's declared
     * `key_budget_windows` (cap only, no reset), then to the single daily
     * window. The running spend total is attributed to the longest window (the
     * daily one); shorter (burst) windows get a spend value derived from that
     * total via `deriveBurstSpend`, since LiteLLM does not report their
     * independent spend to the frontend key.
     */
    private buildWindows(
        key: any,
        brokerLimits: Record<string, unknown> | null | undefined,
        daily: { dailyMaxBudget: number | null; dailyResetAt: string | null; dailyDurationSeconds: number; totalSpend: number | null },
    ): LlmBudgetWindow[] {
        type RawWindow = { durationLabel: string; durationSeconds: number | null; maxBudgetUsd: number; resetAt: string | null };
        const raw: RawWindow[] = [];

        const keyLimits = Array.isArray(key?.budget_limits) ? key.budget_limits : null;
        const brokerWindows = Array.isArray(brokerLimits?.key_budget_windows) ? brokerLimits!.key_budget_windows as any[] : null;
        const source = keyLimits ?? brokerWindows;

        if (source) {
            for (const entry of source) {
                const maxBudgetUsd = typeof entry?.max_budget === 'number' ? entry.max_budget : null;
                if (maxBudgetUsd === null || !Number.isFinite(maxBudgetUsd)) continue;
                const durationLabel = typeof entry?.budget_duration === 'string' ? entry.budget_duration : '';
                raw.push({
                    durationLabel,
                    durationSeconds: durationToSeconds(durationLabel),
                    maxBudgetUsd,
                    resetAt: typeof entry?.reset_at === 'string' ? entry.reset_at : null,
                });
            }
        }

        // No structured windows anywhere: fall back to a single daily window.
        if (raw.length === 0) {
            if (daily.dailyMaxBudget === null) return [];
            raw.push({
                durationLabel: '24h',
                durationSeconds: daily.dailyDurationSeconds,
                maxBudgetUsd: daily.dailyMaxBudget,
                resetAt: daily.dailyResetAt,
            });
        }

        // Shortest-first, treating unknown durations as longest.
        raw.sort((a, b) => (a.durationSeconds ?? Infinity) - (b.durationSeconds ?? Infinity));

        // The longest window carries the running spend total (LiteLLM resets it
        // on the key's 24h budget_duration).
        const dailyIndex = raw.reduce((best, window, index) =>
            (window.durationSeconds ?? Infinity) >= (raw[best].durationSeconds ?? Infinity) ? index : best, 0);

        return raw.map((window, index) => {
            const isDaily = index === dailyIndex;
            const spentUsd = isDaily
                ? daily.totalSpend
                : this.deriveBurstSpend(window.durationLabel, window.resetAt, window.maxBudgetUsd, daily.totalSpend);
            return {
                kind: isDaily ? 'daily' : 'burst',
                durationLabel: window.durationLabel || (isDaily ? '24h' : ''),
                durationSeconds: window.durationSeconds,
                maxBudgetUsd: window.maxBudgetUsd,
                spentUsd,
                // Never show a negative remaining: LiteLLM may overspend slightly
                // on the last request before it blocks.
                remainingBudgetUsd: spentUsd !== null ? Math.max(0, window.maxBudgetUsd - spentUsd) : null,
                resetAt: window.resetAt ?? (isDaily ? daily.dailyResetAt : null),
            };
        });
    }

    /**
     * Derive the spend inside the current burst window from the daily running
     * total. The frontend key cannot read the burst window's own spend, but
     * every request counts toward both windows equally, so within one burst
     * window `spent = dailyTotal − baseline`, where `baseline` is the daily
     * total captured when the window opened. A new window is detected by its
     * `resetAt` advancing; a daily-counter reset (total drops below the
     * baseline) also re-baselines. Returns 0 for a freshly opened/first-seen
     * window (any spend already made before the first read is not recoverable).
     */
    private deriveBurstSpend(
        durationLabel: string,
        resetAt: string | null,
        maxBudgetUsd: number,
        totalSpend: number | null,
    ): number | null {
        if (totalSpend === null) return null;
        const key = durationLabel || 'burst';
        const prev = this.burstBaselines.get(key);
        if (!prev || prev.resetAt !== resetAt || totalSpend < prev.baseline) {
            this.burstBaselines.set(key, { resetAt, baseline: totalSpend });
            return 0;
        }
        return Math.max(0, Math.min(totalSpend - prev.baseline, maxBudgetUsd));
    }

    private async fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
        try {
            const response = await fetch(url, init);
            if (!response.ok) return null;
            return await response.json() as T;
        } catch {
            return null;
        }
    }

    /** Like `fetchJson`, but keeps the status and the parsed body even on !ok. */
    private async fetchWithMeta(url: string, init?: RequestInit): Promise<{ ok: boolean; status: number; body: any }> {
        try {
            const response = await fetch(url, init);
            const body = await response.json().catch(() => null);
            return { ok: response.ok, status: response.status, body };
        } catch {
            return { ok: false, status: 0, body: null };
        }
    }

    /** Return the budget-exceeded message if the body is a LiteLLM budget 429. */
    private detectBudgetError(body: any): string | null {
        const error = body?.error ?? body;
        const type = typeof error?.type === 'string' ? error.type : '';
        const message = typeof error?.message === 'string' ? error.message : '';
        if (type === 'budget_exceeded' || /ExceededBudget|over .*budget/i.test(message)) {
            return message || 'Key is over its budget.';
        }
        return null;
    }

    /**
     * Degraded readout for a key blocked by a budget window: LiteLLM 429s every
     * endpoint, so live spend/reset are unreadable. Show the caps from the
     * broker policy with both meters full (spent = cap) so the UI can explain
     * *why* the assistant stopped, instead of falling back to "unavailable".
     */
    private buildOverBudgetLimits(
        brokerLimits: Record<string, unknown> | null | undefined,
        userId: string | null,
        message: string,
    ): LlmLimits {
        const num = (value: unknown): number | null =>
            typeof value === 'number' && Number.isFinite(value) ? value : null;
        const dailyMax = num(brokerLimits?.daily_budget_usd);
        const burstMax = num(brokerLimits?.four_hour_budget_usd);
        const windows: LlmBudgetWindow[] = [];
        if (burstMax !== null) {
            windows.push({ kind: 'burst', durationLabel: '4h', durationSeconds: 4 * 3600, maxBudgetUsd: burstMax, spentUsd: burstMax, remainingBudgetUsd: 0, resetAt: null });
        }
        if (dailyMax !== null) {
            windows.push({ kind: 'daily', durationLabel: '24h', durationSeconds: DAY_SECONDS, maxBudgetUsd: dailyMax, spentUsd: dailyMax, remainingBudgetUsd: 0, resetAt: null });
        }
        return {
            provider: 'litellm',
            supported: true,
            overBudget: true,
            message,
            userId,
            maxBudgetUsd: dailyMax,
            spentUsd: dailyMax,
            remainingBudgetUsd: dailyMax !== null ? 0 : null,
            budgetResetAt: null,
            burstMaxBudgetUsd: burstMax,
            burstSpentUsd: burstMax,
            burstRemainingBudgetUsd: burstMax !== null ? 0 : null,
            burstResetAt: null,
            burstDurationLabel: burstMax !== null ? '4h' : null,
            windows,
            rpmLimit: num(brokerLimits?.rpm_limit),
            tpmLimit: num(brokerLimits?.tpm_limit),
            fetchedAt: new Date().toISOString(),
        };
    }
}
