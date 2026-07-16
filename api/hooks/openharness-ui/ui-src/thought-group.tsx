// Collapsed-by-default "Thought process" wrapper that hides the whole agent
// work stream (tool calls + reasoning) behind one muted trigger. Modeled on
// tool-group.tsx / reasoning.tsx (radix Collapsible, ghost look).
import { useState } from 'react';
import { BrainIcon, ChevronDownIcon, LoaderIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from './utils';

const ANIMATION_DURATION = 200;

export type ThoughtGroupRootProps = Omit<
  React.ComponentProps<typeof Collapsible>,
  'open' | 'onOpenChange'
> & {
  defaultOpen?: boolean;
  /** Force-open once when a tool call needs user action (approval UI). */
  requiresAction?: boolean;
};

function ThoughtGroupRoot({
  className,
  defaultOpen = false,
  requiresAction = false,
  children,
  ...props
}: ThoughtGroupRootProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [prevRequiresAction, setPrevRequiresAction] = useState(requiresAction);
  if (requiresAction !== prevRequiresAction) {
    setPrevRequiresAction(requiresAction);
    if (requiresAction) setOpen(true);
  }

  return (
    <Collapsible
      data-slot="thought-group-root"
      open={open}
      onOpenChange={setOpen}
      className={cn('aui-thought-group-root group/thought-group-root w-full', className)}
      style={{ '--animation-duration': `${ANIMATION_DURATION}ms` } as React.CSSProperties}
      {...props}
    >
      {children}
    </Collapsible>
  );
}

function ThoughtGroupTrigger({
  active = false,
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger> & {
  active?: boolean;
}) {
  const label = active ? 'Thinking…' : 'Thought process';

  return (
    <CollapsibleTrigger
      data-slot="thought-group-trigger"
      className={cn(
        'aui-thought-group-trigger group/trigger text-muted-foreground hover:text-foreground flex w-fit origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]',
        className,
      )}
      {...props}
    >
      {active ? (
        <LoaderIcon
          data-slot="thought-group-trigger-loader"
          className="aui-thought-group-trigger-loader size-4 shrink-0 animate-spin [animation-duration:0.6s]"
        />
      ) : (
        <BrainIcon
          data-slot="thought-group-trigger-icon"
          className="aui-thought-group-trigger-icon size-4 shrink-0"
        />
      )}
      <span
        data-slot="thought-group-trigger-label"
        className="aui-thought-group-trigger-label-wrapper relative inline-block text-start text-xs leading-none"
      >
        <span>{label}</span>
        {active && (
          <span
            aria-hidden
            data-slot="thought-group-trigger-shimmer"
            className="aui-thought-group-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none"
          >
            {label}
          </span>
        )}
      </span>
      <ChevronDownIcon
        data-slot="thought-group-trigger-chevron"
        className={cn(
          'aui-thought-group-trigger-chevron size-3 shrink-0',
          'transition-transform duration-(--animation-duration) ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
          '-rotate-90',
          'group-data-[state=open]/trigger:rotate-0',
        )}
      />
    </CollapsibleTrigger>
  );
}

function ThoughtGroupContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="thought-group-content"
      className={cn(
        'aui-thought-group-content relative overflow-hidden text-sm outline-none',
        'group/collapsible-content ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none',
        'data-[state=closed]:animate-collapsible-up',
        'data-[state=open]:animate-collapsible-down',
        'data-[state=closed]:fill-mode-forwards',
        'data-[state=closed]:pointer-events-none',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'border-border/60 mt-1 mb-2 flex flex-col gap-1 border-s ps-3',
          '[&>*]:animate-in [&>*]:fade-in-0 [&>*]:slide-in-from-top-1 [&>*]:duration-(--animation-duration) [&>*]:ease-[cubic-bezier(0.32,0.72,0,1)]',
          '[&>*]:motion-reduce:animate-none',
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}

export { ThoughtGroupRoot, ThoughtGroupTrigger, ThoughtGroupContent };
