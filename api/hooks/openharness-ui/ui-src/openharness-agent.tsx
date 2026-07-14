// OpenHarness agent admin page: assistant-ui LocalRuntime wired to the
// Restoapp SSE backend (api/bootstrap/openharness-sse.js), with a header
// showing the active model and context-window usage.
import {
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
  fetchMeta,
  resetSession,
  type SessionMeta,
  type TokenUsage,
} from './runtime';
import { cn } from './utils';
import cssText from './globals.css?inline';

const STYLE_ID = 'openharness-agent-styles';

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
}> = ({ getMeta, onUsage, onRunEnd }) => {
  const adapter = useMemo(
    () => createOpenHarnessAdapter({ onUsage, onRunEnd }),
    [onUsage, onRunEnd],
  );
  const attachments = useMemo(() => new OpenHarnessAttachmentAdapter(getMeta), [getMeta]);
  const runtime = useLocalRuntime(adapter, { adapters: { attachments } });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AttachmentErrorToasts />
      <Thread />
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

  const metaRef = useRef<SessionMeta | null>(null);
  metaRef.current = meta;
  const getMeta = useCallback(() => metaRef.current, []);

  const refreshMeta = useCallback(() => {
    fetchMeta()
      .then((value) => { setMeta(value); setMetaError(null); })
      .catch((error: any) => setMetaError(error?.message || 'Failed to load agent info'));
  }, []);

  useEffect(() => { refreshMeta(); }, [refreshMeta]);

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

  const usedTokens = liveUsage
    ? (liveUsage.inputTokens ?? 0) + (liveUsage.outputTokens ?? 0)
    : (meta?.contextTokens ?? 0);

  return (
    <div className="aui-root ohx-root bg-background text-foreground">
      <header className="border-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <BotIcon className="text-muted-foreground size-5" />
          <span className="text-sm font-semibold">OpenHarness Agent</span>
        </div>

        {meta && (
          <Badge variant="outline" className="max-w-64 font-mono text-xs" title={meta.model}>
            <span className="truncate">{modelShortName(meta.model)}</span>
          </Badge>
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
            disabled={resetting}
            className="gap-1.5"
          >
            <RotateCcwIcon className={cn('size-3.5', resetting && 'animate-spin')} />
            New chat
          </Button>
        </div>

        {metaError && <span className="text-destructive w-full text-xs">{metaError}</span>}
      </header>

      <ChatSession key={sessionKey} getMeta={getMeta} onUsage={onUsage} onRunEnd={onRunEnd} />
    </div>
  );
}
