// OpenHarness agent admin page: assistant-ui LocalRuntime wired to the
// Restoapp SSE backend (api/bootstrap/openharness-sse.js), with a header
// showing the active model and context-window usage.
import {
  type ChangeEvent,
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
import { BotIcon, RotateCcwIcon } from 'lucide-react';
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
  createOpenHarnessAdapter,
  OpenHarnessAttachmentAdapter,
  compactSession,
  fetchHistory,
  fetchMeta,
  historyToThreadMessages,
  resetSession,
  setModel,
  type SessionMeta,
  type TokenUsage,
} from './runtime';
import { cn } from './utils';
import cssText from './globals.css?inline';

const STYLE_ID = 'openharness-agent-styles';
const MODEL_REFRESH_INTERVAL_MS = 3 * 60 * 1000;

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

const ContextMeter: FC<{ used: number; window: number }> = ({ used, window: contextWindow }) => {
  const ratio = contextWindow > 0 ? Math.min(used / contextWindow, 1) : 0;
  const tone = ratio > 0.85 ? 'bg-destructive' : ratio > 0.6 ? 'bg-amber-500' : 'bg-primary';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex min-w-36 items-center gap-2" aria-label="Context usage">
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
          Context: {used.toLocaleString()} of {contextWindow.toLocaleString()} tokens (
          {Math.round(ratio * 100)}%)
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
        ? 'This file type is not supported.'
        : message || 'Attachment failed.';
    if (toast?.error) toast.error(text);
    else console.warn('[openharness-ui]', text);
  });
  return null;
};

const ChatSession: FC<{
  getMeta: () => SessionMeta | null;
  onUsage: (usage: TokenUsage) => void;
  onRunEnd: () => void;
  onNewChat: () => void;
  onCompact: () => void;
}> = ({ getMeta, onUsage, onRunEnd, onNewChat, onCompact }) => {
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
      <Thread onNewChat={onNewChat} onCompact={onCompact} />
    </AssistantRuntimeProvider>
  );
};

export default function OpenHarnessAgent() {
  useInjectedStyles();

  const [meta, setMeta] = useState<SessionMeta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [liveUsage, setLiveUsage] = useState<TokenUsage | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [switchingModel, setSwitchingModel] = useState(false);
  const lastModelRefreshAtRef = useRef(0);

  const metaRef = useRef<SessionMeta | null>(null);
  metaRef.current = meta;
  const getMeta = useCallback(() => metaRef.current, []);

  const refreshMeta = useCallback(() => {
    lastModelRefreshAtRef.current = Date.now();
    fetchMeta()
      .then((value) => { setMeta(value); setMetaError(null); })
      .catch((error: any) => setMetaError(error?.message || 'Failed to load agent info'));
  }, []);

  useEffect(() => { refreshMeta(); }, [refreshMeta]);

  const refreshModelsIfDue = useCallback(() => {
    if ((Date.now() - lastModelRefreshAtRef.current) < MODEL_REFRESH_INTERVAL_MS) return;
    refreshMeta();
  }, [refreshMeta]);

  const onUsage = useCallback((usage: TokenUsage) => setLiveUsage(usage), []);
  const onRunEnd = useCallback(() => refreshMeta(), [refreshMeta]);

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
      if (toast?.error) toast.error(error?.message || 'Failed to reset the session');
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
        ? `Context compacted: ${formatTokens(result.tokensBefore ?? 0)} → ${formatTokens(result.tokensAfter ?? 0)} tokens`
        : 'Nothing to compact yet.';
      if (toast?.success) toast.success(message);
      else console.info('[openharness-ui]', message);
    } catch (error: any) {
      const message = error?.message || 'Compaction failed';
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
      const message = error?.message || 'Failed to switch the model';
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

  return (
    <div className="aui-root ohx-root bg-background text-foreground">
      <header className="border-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <BotIcon className="text-muted-foreground size-5" />
          <span className="text-sm font-semibold">RestoApp Assistant</span>
        </div>

        {meta && (
          <Badge variant="outline" className="max-w-64 font-mono text-xs" title={meta.model}>
            <span className="truncate">{modelShortName(meta.model)}</span>
          </Badge>
        )}

        {selectedModel && (
          <Badge variant="secondary" className="text-xs">
            {describeContextWindow(selectedModel.contextWindow)}
            {selectedModel.vision ? ' · vision' : ''}
          </Badge>
        )}

        {meta && (
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Model</span>
            <select
              value={meta.model}
              onChange={handleModelChange}
              onMouseDown={refreshModelsIfDue}
              onFocus={refreshModelsIfDue}
              disabled={switchingModel || resetting}
              className="border-input bg-background text-foreground h-8 min-w-48 rounded-md border px-2 text-xs"
              aria-label="Select model"
            >
              {meta.availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id} · {describeContextWindow(model.contextWindow)}{model.vision ? ' · vision' : ''}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="ms-auto flex items-center gap-4">
          {meta && <ContextMeter used={usedTokens} window={meta.contextWindow} />}
          {meta && meta.turns > 0 && (
            <span className="text-muted-foreground hidden text-xs sm:inline">
              {meta.turns} {meta.turns === 1 ? 'turn' : 'turns'}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            disabled={resetting || switchingModel}
            className="gap-1.5"
          >
            <RotateCcwIcon className={cn('size-3.5', resetting && 'animate-spin')} />
            New chat
          </Button>
        </div>

        {metaError && <span className="text-destructive w-full text-xs">{metaError}</span>}
      </header>

      <ChatSession
        key={sessionKey}
        getMeta={getMeta}
        onUsage={onUsage}
        onRunEnd={onRunEnd}
        onNewChat={handleNewChat}
        onCompact={handleCompact}
      />
    </div>
  );
}
