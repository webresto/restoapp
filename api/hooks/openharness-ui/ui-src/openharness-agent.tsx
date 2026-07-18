// OpenHarness agent admin page: assistant-ui LocalRuntime wired to the
// Restoapp SSE backend (api/bootstrap/openharness-sse.js).
//
// Until the backend has an LLM key (the LiteLLM frontend broker issues at most
// one key per hour) the page shows a registration loader driven by
// /api/openharness/status. Once connected, model + context and budget limits
// live in two collapsible panels right under the composer.
import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';
import {
  AssistantRuntimeProvider,
  useAuiEvent,
  useLocalRuntime,
} from '@assistant-ui/react';
import {
  BotIcon,
  ChevronRightIcon,
  Loader2Icon,
  RefreshCwIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Thread } from './thread';
import {
  basePath,
  createOpenHarnessAdapter,
  OpenHarnessAttachmentAdapter,
  compactSession,
  fetchHistory,
  fetchLimits,
  fetchMeta,
  fetchStatus,
  historyToThreadMessages,
  resetSession,
  setModel,
  type ConnectionStatus,
  type LlmLimits,
  type SessionMeta,
  type TokenUsage,
} from './runtime';
import { setLocale, t } from './i18n';
import { cn } from './utils';
import cssText from './globals.css?inline';

const STYLE_ID = 'openharness-agent-styles';
const MODEL_REFRESH_INTERVAL_MS = 3 * 60 * 1000;
const STATUS_POLL_MS = 15_000;

function useInjectedStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = cssText;
    document.head.appendChild(style);
  }, []);
}

const formatTokens = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '0';
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  return String(Math.round(value));
};

const describeContextWindow = (value: number | null): string => {
  if (!Number.isFinite(value) || !value || value <= 0) return 'ctx unknown';
  return `${formatTokens(value)} ctx`;
};

const modelShortName = (model: string): string => {
  const tail = model.split('/').pop() ?? model;
  return tail.split(':')[0];
};

// Relative spend multiplier shown in the model picker instead of the raw
// context window (e.g. "×2", "×0.3"). null when the gateway exposes no price.
const describeCostCoefficient = (value: number | null): string | null => {
  if (value === null || !Number.isFinite(value) || value <= 0) return null;
  return `×${value}`;
};

// Budget is rendered in relative units (share of the daily allowance), not in
// raw USD — the absolute numbers are tiny gateway-internal amounts.
const formatPercent = (ratio: number): string => {
  if (!Number.isFinite(ratio)) return '—';
  const clamped = Math.min(Math.max(ratio, 0), 1) * 100;
  if (clamped > 0 && clamped < 1) return '<1%';
  if (clamped > 99 && clamped < 100) return '>99%';
  return `${Math.round(clamped)}%`;
};

const formatLocalTime = (iso: string | null): string | null => {
  if (!iso) return null;
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp).toLocaleTimeString();
};

// Countdown to a reset instant: hours while ≥ 1h away, minutes below that.
// Returns a localized "Resets in 2h" / "Resets in 45m" phrase, or null when
// the reset time is unknown.
const formatResetCountdown = (iso: string | null, now: number): string | null => {
  if (!iso) return null;
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) return null;
  const ms = timestamp - now;
  if (ms <= 0) return t('Resetting…');
  const minutes = Math.ceil(ms / 60_000);
  const duration = minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${Math.max(1, minutes)}m`;
  return t('Resets in {duration}', { duration });
};

const ContextMeter: FC<{ used: number; window: number }> = ({ used, window: contextWindow }) => {
  const ratio = contextWindow > 0 ? Math.min(used / contextWindow, 1) : 0;
  const tone = ratio > 0.85 ? 'bg-destructive' : ratio > 0.6 ? 'bg-amber-500' : 'bg-primary';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex min-w-36 items-center gap-2" aria-label={t('Context usage')}>
            <div className="bg-muted h-1.5 w-24 overflow-hidden rounded-full">
              <div
                className={cn('h-full rounded-full transition-[width] duration-500', tone)}
                style={{ width: `${Math.max(ratio * 100, used > 0 ? 2 : 0)}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
              {formatTokens(used)} / {formatTokens(contextWindow)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t('Context: {used} of {total} tokens ({pct}%)', {
            used: used.toLocaleString(),
            total: contextWindow.toLocaleString(),
            pct: Math.round(ratio * 100),
          })}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AttachmentErrorToasts: FC = () => {
  useAuiEvent('composer.attachmentAddError', ({ reason, message }) => {
    const toast = (window as any).sonner?.toast;
    const text =
      reason === 'not-accepted'
        ? t('This file type is not supported.')
        : message || t('Attachment failed.');
    if (toast?.error) toast.error(text);
    else console.warn('[openharness-ui]', text);
  });
  return null;
};

// ── Collapsible panels under the composer ─────────────────────────────

const CollapsiblePanel: FC<{
  title: string;
  hint?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}> = ({ title, hint, onOpenChange, children }) => (
  <details
    className="group border-border/60 bg-muted/20 w-full rounded-lg border"
    onToggle={(event) => onOpenChange?.((event.target as HTMLDetailsElement).open)}
  >
    <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs select-none [&::-webkit-details-marker]:hidden">
      <ChevronRightIcon className="size-3.5 shrink-0 transition-transform group-open:rotate-90" />
      <span className="font-medium">{title}</span>
      {hint !== undefined && (
        <span className="ms-auto flex min-w-0 items-center gap-2 truncate text-end">{hint}</span>
      )}
    </summary>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 pt-1 pb-2.5">{children}</div>
  </details>
);

// A single labelled usage row: title + used-% on top, a full-width progress
// bar, and a "Resets in …" countdown below — the two-line layout from the
// reference usage panel. `ratio` is the used share (0..1), null when unknown.
const UsageMeter: FC<{
  label: string;
  ratio: number | null;
  resetAt: string | null;
  now: number;
}> = ({ label, ratio, resetAt, now }) => {
  const filled = ratio === null ? 0 : Math.min(Math.max(ratio, 0), 1);
  const tone = filled > 0.85 ? 'bg-destructive' : filled > 0.6 ? 'bg-amber-500' : 'bg-primary';
  const countdown = formatResetCountdown(resetAt, now);
  return (
    <div className="w-full" aria-label={label}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-foreground text-xs font-medium">{label}</span>
        {ratio !== null && (
          <span className="text-muted-foreground text-xs tabular-nums">{formatPercent(ratio)}</span>
        )}
      </div>
      <div className="bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
        <div className={cn('h-full rounded-full transition-[width]', tone)} style={{ width: `${filled * 100}%` }} />
      </div>
      {countdown && (
        <span className="text-muted-foreground mt-1 block text-xs">{countdown}</span>
      )}
    </div>
  );
};

/**
 * Budget / rate limits panel. Data comes from the backend limits adapter
 * (LiteLLM: /key/info + /user/info with the agent's own key). `refreshToken`
 * bumps after every finished run so the numbers track real spend.
 */
const LimitsPanel: FC<{ open: boolean; refreshToken: number }> = ({ open, refreshToken }) => {
  const [limits, setLimits] = useState<LlmLimits | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // force=true on an explicit refresh: the backend then re-reads LiteLLM live
  // for the current spend and the 4h/24h window reset times.
  const refresh = useCallback((force = false) => {
    setLoading(true);
    fetchLimits(force)
      .then((value) => { setLimits(value); setError(null); })
      .catch((err: any) => setError(err?.message || t('Failed to load limits')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (open) refresh();
  }, [open, refreshToken, refresh]);

  // Tick once a minute so the "Resets in …" countdowns stay current without a
  // network round-trip (the reset instants themselves are absolute).
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [open]);

  if (!open && !limits) return null;
  if (error) {
    return (
      <span className="text-destructive text-xs">
        {error}
        <Button variant="ghost" size="sm" className="ms-2 h-6 px-2 text-xs" onClick={() => refresh(true)}>{t('Retry')}</Button>
      </span>
    );
  }
  if (!limits) return <span className="text-muted-foreground text-xs">{t('Loading…')}</span>;

  if (!limits.supported) {
    return (
      <span className="text-muted-foreground text-xs">
        {t('Limits are not available for this provider.')}
      </span>
    );
  }

  // Session (burst) window: the tighter, binding cap (e.g. 4h). Its spend is
  // derived by the backend from the daily running total, so a real used-% is
  // available here.
  const hasBurst = typeof limits.burstMaxBudgetUsd === 'number' && (limits.burstMaxBudgetUsd as number) > 0;
  const sessionRatio = hasBurst && limits.burstSpentUsd !== null
    ? (limits.burstSpentUsd as number) / (limits.burstMaxBudgetUsd as number)
    : null;

  // Daily window: the accurate spend meter straight from the key.
  const hasDaily = typeof limits.maxBudgetUsd === 'number' && (limits.maxBudgetUsd as number) > 0;
  const dailyRatio = hasDaily
    ? (limits.spentUsd ?? 0) / (limits.maxBudgetUsd as number)
    : null;

  return (
    <div className="w-full space-y-3">
      {limits.overBudget && (
        <p className="text-destructive text-xs">
          {t('The assistant is over its budget. It will work again after the window resets.')}
        </p>
      )}
      {hasBurst && (
        <UsageMeter
          label={t('Session ({duration})', { duration: limits.burstDurationLabel ?? '4h' })}
          ratio={sessionRatio}
          resetAt={limits.burstResetAt}
          now={now}
        />
      )}
      {hasDaily ? (
        <UsageMeter
          label={t('Daily ({duration})', { duration: t('1 day') })}
          ratio={dailyRatio}
          resetAt={limits.budgetResetAt}
          now={now}
        />
      ) : (
        <span className="text-muted-foreground block text-xs">{t('No daily budget cap')}</span>
      )}

      <div className="text-muted-foreground flex items-center gap-3 text-xs">
        {limits.rpmLimit !== null && <span className="tabular-nums">{limits.rpmLimit} rpm</span>}
        {limits.tpmLimit !== null && <span className="tabular-nums">{formatTokens(limits.tpmLimit)} tpm</span>}
        <Button
          variant="ghost"
          size="sm"
          className="ms-auto h-6 px-2 text-xs"
          onClick={() => refresh(true)}
          disabled={loading}
          aria-label={t('Refresh limits')}
        >
          <RefreshCwIcon className={cn('size-3', loading && 'animate-spin')} />
        </Button>
      </div>
    </div>
  );
};

// ── Registration loader ───────────────────────────────────────────────

const statusHeadline = (status: ConnectionStatus | null): string => {
  switch (status?.state) {
    case 'waiting_retry': return t('Waiting for the next registration slot');
    case 'error': return t('Registration attempt failed');
    case 'setup_required': return t('Server setup required');
    default: return t('Connecting the assistant…');
  }
};

const ConnectionLoader: FC<{ status: ConnectionStatus | null; error: string | null }> = ({ status, error }) => {
  const nextAttempt = formatLocalTime(status?.nextAttemptAt ?? null);
  const setupRequired = status?.state === 'setup_required';
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {setupRequired
        ? <BotIcon className="text-muted-foreground size-8" />
        : <Loader2Icon className="text-muted-foreground size-8 animate-spin" />}
      <p className="text-sm font-medium">{statusHeadline(status)}</p>
      <p className="text-muted-foreground max-w-md text-xs text-balance">
        {setupRequired
          ? t('Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.')
          : t('The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.')}
      </p>
      {setupRequired && (
        <Button asChild variant="outline" size="sm">
          <a href={`${basePath()}/settings-manager#PROJECT_NAME`}>PROJECT_NAME</a>
        </Button>
      )}
      {nextAttempt && !setupRequired && (
        <p className="text-muted-foreground text-xs">
          {t('Next attempt at')}{' '}
          <span className="text-foreground font-medium tabular-nums">{nextAttempt}</span>
        </p>
      )}
      {status?.state === 'error' && status.lastError && (
        <p className="text-destructive max-w-md text-xs">{status.lastError}</p>
      )}
      {error && <p className="text-destructive max-w-md text-xs">{error}</p>}
    </div>
  );
};

const ChatSession: FC<{
  getMeta: () => SessionMeta | null;
  onUsage: (usage: TokenUsage) => void;
  onRunEnd: () => void;
  onNewChat: () => void;
  onCompact: () => void;
  belowComposer?: ReactNode;
}> = ({ getMeta, onUsage, onRunEnd, onNewChat, onCompact, belowComposer }) => {
  const adapter = useMemo(
    () => createOpenHarnessAdapter({ onUsage, onRunEnd }),
    [onUsage, onRunEnd],
  );
  const attachments = useMemo(() => new OpenHarnessAttachmentAdapter(getMeta), [getMeta]);
  const runtime = useLocalRuntime(adapter, { adapters: { attachments } });

  // Rebuild the dialog from the server session once per mount, so a page
  // reload shows exactly what the agent still remembers ("New chat" and model
  // switches remount this component after resetting the server session).
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    fetchHistory()
      .then((messages) => {
        const restored = historyToThreadMessages(messages);
        if (restored.length) runtime.thread.reset(restored as any);
      })
      .catch(() => { /* no history — start empty */ });
  }, [runtime]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AttachmentErrorToasts />
      <Thread onNewChat={onNewChat} onCompact={onCompact} belowComposer={belowComposer} />
    </AssistantRuntimeProvider>
  );
};

export default function OpenHarnessAgent() {
  useInjectedStyles();

  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [meta, setMeta] = useState<SessionMeta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [liveUsage, setLiveUsage] = useState<TokenUsage | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [switchingModel, setSwitchingModel] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [limitsToken, setLimitsToken] = useState(0);
  const lastModelRefreshAtRef = useRef(0);

  const ready = status?.state === 'ready';

  const metaRef = useRef<SessionMeta | null>(null);
  metaRef.current = meta;
  const getMeta = useCallback(() => metaRef.current, []);

  // Poll the connection status until the backend has an LLM key. The backend
  // itself schedules broker registration retries; this only reflects progress
  // ("next attempt at …") and flips the page into chat mode once ready.
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const value = await fetchStatus();
        if (cancelled) return;
        // Locale arrives with the status; set it before the first real render
        // so both the loader and the chat UI come up translated.
        setLocale(value.locale);
        setStatus(value);
        setStatusError(null);
        if (value.state === 'ready') return;
        const untilNext = value.nextAttemptAt ? Date.parse(value.nextAttemptAt) - Date.now() + 2_000 : NaN;
        const delay = Number.isFinite(untilNext)
          ? Math.min(Math.max(untilNext, 5_000), 30_000)
          : STATUS_POLL_MS;
        timer = window.setTimeout(poll, delay);
      } catch (error: any) {
        if (cancelled) return;
        setStatusError(error?.message || t('Failed to check the assistant status'));
        timer = window.setTimeout(poll, STATUS_POLL_MS);
      }
    };
    void poll();
    return () => { cancelled = true; if (timer) window.clearTimeout(timer); };
  }, []);

  const refreshMeta = useCallback(() => {
    lastModelRefreshAtRef.current = Date.now();
    fetchMeta()
      .then((value) => { setMeta(value); setMetaError(null); })
      .catch((error: any) => setMetaError(error?.message || t('Failed to load agent info')));
  }, []);

  useEffect(() => { if (ready) refreshMeta(); }, [ready, refreshMeta]);

  const refreshModelsIfDue = useCallback(() => {
    if ((Date.now() - lastModelRefreshAtRef.current) < MODEL_REFRESH_INTERVAL_MS) return;
    refreshMeta();
  }, [refreshMeta]);

  const onUsage = useCallback((usage: TokenUsage) => setLiveUsage(usage), []);
  const onRunEnd = useCallback(() => {
    refreshMeta();
    // Spend counters on the gateway update with a short delay; bumping the
    // token here refreshes the limits panel right after each run.
    setLimitsToken((token) => token + 1);
  }, [refreshMeta]);

  const handleNewChat = useCallback(async () => {
    if (resetting) return;
    setResetting(true);
    try {
      await resetSession();
      setLiveUsage(null);
      setSessionKey((key) => key + 1);
      refreshMeta();
    } catch (error: any) {
      const toast = (window as any).sonner?.toast;
      if (toast?.error) toast.error(error?.message || t('Failed to reset the session'));
    } finally {
      setResetting(false);
    }
  }, [resetting, refreshMeta]);

  const compactingRef = useRef(false);
  const handleCompact = useCallback(async () => {
    if (compactingRef.current) return;
    compactingRef.current = true;
    const toast = (window as any).sonner?.toast;
    try {
      const result = await compactSession();
      setLiveUsage(null);
      refreshMeta();
      const message = result.compacted
        ? t('Context compacted: {before} → {after} tokens', {
            before: formatTokens(result.tokensBefore ?? 0),
            after: formatTokens(result.tokensAfter ?? 0),
          })
        : t('Nothing to compact yet.');
      if (toast?.success) toast.success(message);
      else console.info('[openharness-ui]', message);
    } catch (error: any) {
      const message = error?.message || t('Compaction failed');
      if (toast?.error) toast.error(message);
      else console.warn('[openharness-ui]', message);
    } finally {
      compactingRef.current = false;
    }
  }, [refreshMeta]);

  const handleModelChange = useCallback(async (event: ChangeEvent<HTMLSelectElement>) => {
    const nextModel = event.target.value;
    if (!nextModel || switchingModel || nextModel === metaRef.current?.model) return;
    setSwitchingModel(true);
    try {
      const nextMeta = await setModel(nextModel);
      setMeta(nextMeta);
      setMetaError(null);
      setLiveUsage(null);
      setSessionKey((key) => key + 1);
    } catch (error: any) {
      const toast = (window as any).sonner?.toast;
      const message = error?.message || t('Failed to switch the model');
      if (toast?.error) toast.error(message);
      else setMetaError(message);
    } finally {
      setSwitchingModel(false);
    }
  }, []);

  const usedTokens = liveUsage
    ? (liveUsage.inputTokens ?? 0) + (liveUsage.outputTokens ?? 0)
    : (meta?.contextTokens ?? 0);
  const selectedModel = meta?.availableModels.find((entry) => entry.id === meta.model) ?? null;

  // Model + context and limits live under the composer, per the admin UX:
  // the header stays minimal, details unfold on demand.
  const belowComposer = meta ? (
    <div className="mx-auto flex w-full flex-col gap-1.5">
      <CollapsiblePanel
        title={t('Model & context')}
        hint={
          <>
            <span className="max-w-40 truncate font-mono" title={meta.model}>{modelShortName(meta.model)}</span>
            <span className="tabular-nums">{formatTokens(usedTokens)} / {formatTokens(meta.contextWindow)}</span>
          </>
        }
      >
        <label className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground whitespace-nowrap">{t('Model')}</span>
          <select
            value={meta.model}
            onChange={handleModelChange}
            onMouseDown={refreshModelsIfDue}
            onFocus={refreshModelsIfDue}
            disabled={switchingModel || resetting}
            className="border-input bg-background text-foreground h-8 min-w-48 rounded-md border px-2 text-xs"
            aria-label="Select model"
            title={t('Select model')}
          >
            {meta.availableModels.map((model) => {
              const coefficient = describeCostCoefficient(model.costCoefficient);
              return (
                <option key={model.id} value={model.id}>
                  {model.id}{coefficient ? ` · ${coefficient}` : ''}{model.vision ? ' · vision' : ''}
                </option>
              );
            })}
          </select>
        </label>
        {selectedModel && (
          <Badge variant="secondary" className="text-xs">
            {describeContextWindow(selectedModel.contextWindow)}
            {selectedModel.vision ? ' · vision' : ''}
          </Badge>
        )}
        <ContextMeter used={usedTokens} window={meta.contextWindow} />
        {meta.turns > 0 && (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
            {meta.turns} {meta.turns === 1 ? t('turn') : t('turns')}
          </span>
        )}
      </CollapsiblePanel>

      <CollapsiblePanel title={t('Limits')} onOpenChange={setLimitsOpen}>
        <LimitsPanel open={limitsOpen} refreshToken={limitsToken} />
      </CollapsiblePanel>
    </div>
  ) : null;

  return (
    <div className="aui-root ohx-root bg-background text-foreground">
      <header className="border-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <BotIcon className="text-muted-foreground size-5" />
          <span className="text-sm font-semibold">RestoApp Assistant</span>
        </div>

        {ready && meta && (
          <Badge variant="outline" className="max-w-64 font-mono text-xs" title={meta.model}>
            <span className="truncate">{modelShortName(meta.model)}</span>
          </Badge>
        )}

        {ready && (
          <div className="ms-auto flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              disabled={resetting || switchingModel}
              className="gap-1.5"
            >
              <RotateCcwIcon className={cn('size-3.5', resetting && 'animate-spin')} />
              {t('New chat')}
            </Button>
          </div>
        )}

        {metaError && <span className="text-destructive w-full text-xs">{metaError}</span>}
      </header>

      {ready ? (
        <ChatSession
          key={sessionKey}
          getMeta={getMeta}
          onUsage={onUsage}
          onRunEnd={onRunEnd}
          onNewChat={handleNewChat}
          onCompact={handleCompact}
          belowComposer={belowComposer}
        />
      ) : (
        <ConnectionLoader status={status} error={statusError} />
      )}
    </div>
  );
}
