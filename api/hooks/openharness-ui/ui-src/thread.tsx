// Vendored from assistant-ui (packages/ui .../thread.tsx), trimmed for the
// OpenHarness backend: history lives in a server-side session, so branch
// picking, message editing and reload are removed (they would desync the
// server history). Dictation and follow-up suggestions are dropped too.
import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from './attachment';
import { MarkdownText } from './markdown-text';
import {
  Reasoning,
  ReasoningContent,
  ReasoningRoot,
  ReasoningText,
  ReasoningTrigger,
} from './reasoning';
import { ToolFallback } from './tool-fallback';
import {
  ThoughtGroupContent,
  ThoughtGroupRoot,
  ThoughtGroupTrigger,
} from './thought-group';
import { TooltipIconButton } from './tooltip-icon-button';
import { Button } from '@/components/ui/button';
import { cn } from './utils';
import {
  ActionBarPrimitive,
  AuiIf,
  type AssistantState,
  ComposerPrimitive,
  ErrorPrimitive,
  groupPartByType,
  MessagePrimitive,
  ThreadPrimitive,
  unstable_useSlashCommandAdapter,
  useAuiState,
  useComposerRuntime,
} from '@assistant-ui/react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BotIcon,
  CheckIcon,
  CopyIcon,
  SquareIcon,
} from 'lucide-react';
import type { FC, ReactNode } from 'react';
import { t } from './i18n';

const SUGGESTIONS = [
  'What MCP tools are available?',
  'Show the 5 most recent orders',
  'Summarize today’s orders',
];

const isNewChatView = (s: AssistantState) =>
  s.thread.messages.length === 0 && (!s.thread.isLoading || s.threads.isLoading);

export type ThreadProps = {
  /** Wired to the header "New chat" reset; used by the /new slash command. */
  onNewChat?: () => void;
  /** Compacts the server session context; used by the /compact slash command. */
  onCompact?: () => void;
  /** Rendered directly under the composer (model / context / limits panels). */
  belowComposer?: ReactNode;
};

export const Thread: FC<ThreadProps> = ({ onNewChat, onCompact, belowComposer }) => {
  const isEmpty = useAuiState(isNewChatView);

  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root bg-background flex h-full flex-col"
      style={{
        ['--thread-max-width' as string]: '44rem',
        ['--composer-bg' as string]:
          'color-mix(in oklab, var(--color-muted) 30%, var(--color-background))',
        ['--composer-radius' as string]: '1.5rem',
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        data-slot="aui_thread-viewport"
        className="relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth"
      >
        <div
          className={cn(
            'mx-auto flex w-full max-w-(--thread-max-width) flex-1 flex-col px-4 pt-4',
            isEmpty && 'justify-center',
          )}
        >
          <AuiIf condition={isNewChatView}>
            <ThreadWelcome />
          </AuiIf>

          <div
            data-slot="aui_message-group"
            className="mb-14 flex flex-col gap-y-6 empty:hidden"
          >
            <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} />
          </div>

          <ThreadPrimitive.ViewportFooter
            className={cn(
              'aui-thread-viewport-footer bg-background flex flex-col gap-4 overflow-visible pb-4 md:pb-6',
              !isEmpty && 'sticky bottom-0 mt-auto rounded-t-(--composer-radius)',
            )}
          >
            <ThreadScrollToBottom />
            <Composer onNewChat={onNewChat} onCompact={onCompact} />
            {belowComposer}
            <AuiIf condition={(s) => isNewChatView(s) && s.composer.isEmpty}>
              <ThreadSuggestions />
            </AuiIf>
          </ThreadPrimitive.ViewportFooter>
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip={t('Scroll to bottom')}
        variant="outline"
        className="aui-thread-scroll-to-bottom dark:border-border dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root mb-6 flex flex-col items-center px-4 text-center">
      <BotIcon className="text-muted-foreground mb-3 size-10" />
      <h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-2xl font-semibold duration-200">
        {t('How can I help you today?')}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {t('Ask about Restoapp data available to your account.')}
      </p>
    </div>
  );
};

const ThreadSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestions flex w-full flex-wrap items-center justify-center gap-2 px-4">
      {SUGGESTIONS.map((key) => t(key)).map((prompt) => (
        <ThreadPrimitive.Suggestion key={prompt} prompt={prompt} send asChild>
          <Button
            variant="ghost"
            className="aui-thread-welcome-suggestion text-foreground hover:bg-muted border-border/60 h-auto gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-normal whitespace-nowrap transition-colors"
          >
            {prompt}
          </Button>
        </ThreadPrimitive.Suggestion>
      ))}
    </div>
  );
};

const HELP_PROMPT =
  'What can you do? List the data models, admin pages and tools available to me.';

const Composer: FC<{ onNewChat?: () => void; onCompact?: () => void }> = ({
  onNewChat,
  onCompact,
}) => {
  const composerRuntime = useComposerRuntime();
  const slash = unstable_useSlashCommandAdapter({
    commands: [
      {
        id: 'new',
        label: '/new',
        description: t('Start a new chat (clears the conversation)'),
        execute: () => onNewChat?.(),
      },
      {
        id: 'compact',
        label: '/compact',
        description: t('Free up context: prune or summarize older messages'),
        execute: () => onCompact?.(),
      },
      {
        id: 'model',
        label: '/model',
        description: t('Open the model selector'),
        execute: () => {
          document
            .querySelector<HTMLSelectElement>('select[aria-label="Select model"]')
            ?.focus();
        },
      },
      {
        id: 'help',
        label: '/help',
        description: t('Ask the assistant what it can do'),
        // Deferred so the popover's own composer cleanup runs first and does
        // not clobber the injected prompt.
        execute: () => {
          setTimeout(() => {
            composerRuntime.setText(t(HELP_PROMPT));
            composerRuntime.send();
          }, 0);
        },
      },
    ],
    removeOnExecute: true,
  });

  return (
    <ComposerPrimitive.Unstable_TriggerPopoverRoot>
      <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
        <ComposerPrimitive.Unstable_TriggerPopover
          char="/"
          adapter={slash.adapter}
          className="aui-composer-slash-popover border-border/60 bg-popover text-popover-foreground absolute inset-x-2 bottom-full z-20 mb-2 flex flex-col gap-0.5 overflow-hidden rounded-xl border p-1 shadow-lg"
        >
          <ComposerPrimitive.Unstable_TriggerPopover.Action {...slash.action} />
          <ComposerPrimitive.Unstable_TriggerPopoverItems>
            {(items) =>
              items.length === 0 ? (
                <div className="text-muted-foreground px-2.5 py-1.5 text-xs">
                  No matching commands
                </div>
              ) : (
                items.map((item, index) => (
                  <ComposerPrimitive.Unstable_TriggerPopoverItem
                    key={item.id}
                    item={item}
                    index={index}
                    className="data-[highlighted]:bg-accent hover:bg-accent flex w-full cursor-pointer items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-start text-sm"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.description && (
                      <span className="text-muted-foreground text-xs">{item.description}</span>
                    )}
                  </ComposerPrimitive.Unstable_TriggerPopoverItem>
                ))
              )
            }
          </ComposerPrimitive.Unstable_TriggerPopoverItems>
        </ComposerPrimitive.Unstable_TriggerPopover>
        <ComposerPrimitive.AttachmentDropzone asChild>
          <div
            data-slot="aui_composer-shell"
            className="border-border/60 data-[dragging=true]:border-ring focus-within:border-border dark:border-muted-foreground/15 dark:focus-within:border-muted-foreground/30 flex w-full flex-col gap-2 rounded-(--composer-radius) border bg-(--composer-bg) p-2 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-within:shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.05)] data-[dragging=true]:border-dashed dark:shadow-none"
          >
            <ComposerAttachments />
            <ComposerPrimitive.Input
              placeholder={t('Ask about Restoapp data… type / for commands')}
              className="aui-composer-input caret-primary placeholder:text-muted-foreground/80 max-h-32 min-h-10 w-full resize-none bg-transparent px-2.5 py-1 text-base outline-none"
              rows={1}
              autoFocus
              addAttachmentOnPaste
              enterKeyHint="send"
              aria-label={t('Message input')}
            />
            <ComposerAction />
          </div>
        </ComposerPrimitive.AttachmentDropzone>
      </ComposerPrimitive.Root>
    </ComposerPrimitive.Unstable_TriggerPopoverRoot>
  );
};

const ComposerAction: FC = () => {
  return (
    <div className="aui-composer-action-wrapper relative flex items-center justify-between">
      <ComposerAddAttachment />
      <div className="flex items-center gap-1.5">
        <AuiIf condition={(s) => !s.thread.isRunning}>
          <ComposerPrimitive.Send asChild>
            <TooltipIconButton
              tooltip={t('Send message')}
              side="bottom"
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-send size-7 rounded-full"
              aria-label={t('Send message')}
            >
              <ArrowUpIcon className="aui-composer-send-icon size-4.5" />
            </TooltipIconButton>
          </ComposerPrimitive.Send>
        </AuiIf>
        <AuiIf condition={(s) => s.thread.isRunning}>
          <ComposerPrimitive.Cancel asChild>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="aui-composer-cancel size-7 rounded-full"
              aria-label={t('Stop generating')}
            >
              <SquareIcon className="aui-composer-cancel-icon size-3.5 fill-current" />
            </Button>
          </ComposerPrimitive.Cancel>
        </AuiIf>
      </div>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root border-destructive bg-destructive/10 text-destructive dark:bg-destructive/5 mt-2 rounded-md border p-3 text-sm dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_assistant-message-root"
      data-role="assistant"
      className="fade-in slide-in-from-bottom-1 animate-in relative -mb-7.5 pb-7.5 duration-150"
    >
      <div
        data-slot="aui_assistant-message-content"
        className="text-foreground px-2 leading-relaxed wrap-break-word"
      >
        <MessagePrimitive.GroupedParts
          groupBy={groupPartByType({
            reasoning: ['group-thought', 'group-reasoning'],
            'tool-call': ['group-thought'],
            'standalone-tool-call': [],
          })}
        >
          {({ part, children }) => {
            switch (part.type) {
              case 'group-thought':
                return (
                  <ThoughtGroupRoot
                    requiresAction={part.status.type === 'requires-action'}
                  >
                    <ThoughtGroupTrigger active={part.status.type === 'running'} />
                    <ThoughtGroupContent>{children}</ThoughtGroupContent>
                  </ThoughtGroupRoot>
                );
              case 'group-reasoning': {
                const running = part.status.type === 'running';
                return (
                  <ReasoningRoot variant="ghost" streaming={running}>
                    <ReasoningTrigger active={running} />
                    <ReasoningContent aria-busy={running}>
                      <ReasoningText>{children}</ReasoningText>
                    </ReasoningContent>
                  </ReasoningRoot>
                );
              }
              case 'text':
                return <MarkdownText />;
              case 'reasoning':
                return <Reasoning {...(part as any)} />;
              case 'tool-call':
                return (part as any).toolUI ?? <ToolFallback {...(part as any)} />;
              case 'indicator':
                return (
                  <span
                    data-slot="aui_assistant-message-indicator"
                    className="animate-pulse font-sans"
                    aria-label={t('Assistant is working')}
                  >
                    {'●'}
                  </span>
                );
              default:
                return null;
            }
          }}
        </MessagePrimitive.GroupedParts>
        <MessageError />
      </div>

      <div
        data-slot="aui_assistant-message-footer"
        className="ms-2 flex min-h-7.5 items-center pt-1.5"
      >
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-assistant-action-bar-root text-muted-foreground animate-in fade-in -ms-1 flex gap-1 duration-200"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip={t('Copy')}>
          <AuiIf condition={(s) => s.message.isCopied}>
            <CheckIcon className="animate-in zoom-in-50 fade-in duration-200 ease-out" />
          </AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}>
            <CopyIcon className="animate-in zoom-in-75 fade-in duration-150" />
          </AuiIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      data-slot="aui_user-message-root"
      className="fade-in slide-in-from-bottom-1 animate-in grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&>*]:col-start-2"
      data-role="user"
    >
      <UserMessageAttachments />

      <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
        <div className="aui-user-message-content bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word whitespace-pre-wrap empty:hidden">
          <MessagePrimitive.Parts />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};
