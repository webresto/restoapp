import type {
  AttachmentAdapter,
  ChatModelAdapter,
  CompleteAttachment,
  PendingAttachment,
} from '@assistant-ui/react';

export type TokenUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export type SessionMeta = {
  model: string;
  contextWindow: number;
  vision: boolean;
  turns: number;
  totalUsage: TokenUsage;
  contextTokens: number;
  maxFiles: number;
  maxFileSize: number;
};

export function basePath(): string {
  return (window.location.pathname || '').replace(/\/openharness-agent$/, '');
}

function getCsrfToken(): string | null {
  for (const entry of document.cookie.split(';')) {
    const [rawName, ...rawValue] = entry.trim().split('=');
    if (rawName === 'XSRF-TOKEN') return decodeURIComponent(rawValue.join('=') || '');
  }
  return null;
}

function csrfHeaders(): HeadersInit {
  const token = getCsrfToken();
  return token ? { 'X-XSRF-TOKEN': token } : {};
}

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data.error || data.message || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

export async function fetchMeta(): Promise<SessionMeta> {
  const response = await fetch(`${basePath()}/api/openharness/meta`, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
}

export async function resetSession(): Promise<void> {
  const response = await fetch(`${basePath()}/api/openharness/session`, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: { Accept: 'application/json', ...csrfHeaders() },
  });
  if (!response.ok) throw new Error(await readError(response));
}

type OpenHarnessEvent = Record<string, any> & { type: string };

/**
 * Consumes the buffered SSE run stream as an async iterator. EventSource
 * reconnects transparently; the server resumes from Last-Event-ID, so no
 * event is delivered twice.
 */
async function* sseEvents(url: string, signal?: AbortSignal): AsyncGenerator<OpenHarnessEvent> {
  const source = new EventSource(url, { withCredentials: true });
  const queue: OpenHarnessEvent[] = [];
  let notify: (() => void) | null = null;
  let finished = false;
  const wake = () => { notify?.(); notify = null; };

  source.addEventListener('openharness', (event: MessageEvent) => {
    try { queue.push(JSON.parse(event.data)); } catch { /* ignore malformed */ }
    wake();
  });
  source.onerror = () => {
    // CLOSED means the browser gave up (no auto-reconnect); CONNECTING is a
    // transparent retry and the server will resume via Last-Event-ID.
    if (source.readyState === EventSource.CLOSED) { finished = true; wake(); }
  };
  const onAbort = () => { finished = true; wake(); };
  signal?.addEventListener('abort', onAbort);

  try {
    while (true) {
      while (queue.length) {
        const event = queue.shift()!;
        yield event;
        if (event.type === 'done' || event.type === 'error') return;
      }
      if (finished || signal?.aborted) return;
      await new Promise<void>((resolve) => { notify = resolve; });
    }
  } finally {
    signal?.removeEventListener('abort', onAbort);
    source.close();
  }
}

type AdapterCallbacks = {
  onUsage?: (usage: TokenUsage) => void;
  onRunEnd?: () => void;
};

/**
 * ChatModelAdapter for the OpenHarness backend. Conversation history lives in
 * the server-side Session, so only the newest user message (plus attachment
 * files) is submitted; the SSE events are folded into an ordered list of
 * text / reasoning / tool-call parts.
 */
export function createOpenHarnessAdapter({ onUsage, onRunEnd }: AdapterCallbacks): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const last = messages[messages.length - 1];
      if (!last || last.role !== 'user') throw new Error('Nothing to send.');

      const text = last.content
        .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
        .map((part) => part.text)
        .join('\n\n');

      const form = new FormData();
      form.append('message', text);
      for (const attachment of last.attachments ?? []) {
        const file = (attachment as { file?: File }).file;
        if (file) form.append('files', file, attachment.name);
      }

      const started = await fetch(`${basePath()}/api/openharness/runs`, {
        method: 'POST',
        body: form,
        credentials: 'same-origin',
        headers: { Accept: 'application/json', ...csrfHeaders() },
        signal: abortSignal,
      });
      if (!started.ok) throw new Error(await readError(started));
      const { stream } = await started.json();

      type Part = Record<string, any> & { type: string };
      const parts: Part[] = [];
      const toolParts = new Map<string, Part>();
      let textPart: Part | null = null;
      let reasoningPart: Part | null = null;
      const snapshot = () => ({ content: parts.map((part) => ({ ...part })) as any });

      try {
        for await (const event of sseEvents(stream, abortSignal)) {
          switch (event.type) {
            case 'text.delta': {
              if (!textPart) { textPart = { type: 'text', text: '' }; parts.push(textPart); reasoningPart = null; }
              textPart.text += event.text ?? '';
              yield snapshot();
              break;
            }
            case 'text.done': textPart = null; break;
            case 'reasoning.delta': {
              if (!reasoningPart) { reasoningPart = { type: 'reasoning', text: '' }; parts.push(reasoningPart); textPart = null; }
              reasoningPart.text += event.text ?? '';
              yield snapshot();
              break;
            }
            case 'reasoning.done': reasoningPart = null; break;
            case 'tool.start': {
              const part: Part = {
                type: 'tool-call',
                toolCallId: event.toolCallId,
                toolName: event.toolName,
                args: event.input ?? {},
                argsText: JSON.stringify(event.input ?? {}, null, 2),
              };
              toolParts.set(event.toolCallId, part);
              parts.push(part);
              textPart = null; reasoningPart = null;
              yield snapshot();
              break;
            }
            case 'tool.done': {
              const part = toolParts.get(event.toolCallId);
              if (part) { part.result = event.output; yield snapshot(); }
              break;
            }
            case 'tool.error': {
              const part = toolParts.get(event.toolCallId);
              if (part) { part.result = event.error ?? 'Tool call failed'; part.isError = true; yield snapshot(); }
              break;
            }
            case 'step.done':
            case 'turn.done': {
              if (event.usage) onUsage?.(event.usage);
              break;
            }
            case 'error':
              throw new Error(typeof event.error === 'string' ? event.error : 'Agent run failed');
            case 'done':
              return;
            default:
              break;
          }
        }
      } finally {
        onRunEnd?.();
      }
    },
  };
}

const TEXT_ACCEPT = [
  'text/*', 'application/json',
  '.txt', '.md', '.markdown', '.csv', '.tsv', '.json', '.yaml', '.yml', '.xml', '.html', '.css',
  '.js', '.ts', '.jsx', '.tsx', '.sql', '.log', '.ini', '.conf', '.sh', '.graphql',
].join(',');

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Keeps the original File on the attachment (the chat adapter uploads it as
 * multipart form data); images additionally get a data-URL content part so
 * the chat UI can render thumbnails and previews.
 */
export class OpenHarnessAttachmentAdapter implements AttachmentAdapter {
  constructor(private readonly getMeta: () => SessionMeta | null) {}

  get accept(): string {
    return this.getMeta()?.vision ? `${TEXT_ACCEPT},image/*` : TEXT_ACCEPT;
  }

  async add({ file }: { file: File }): Promise<PendingAttachment> {
    const maxFileSize = this.getMeta()?.maxFileSize ?? 8 * 1024 * 1024;
    if (file.size > maxFileSize) {
      throw new Error(`File is too large (max ${Math.round(maxFileSize / 1024 / 1024)}MB)`);
    }
    return {
      id: crypto.randomUUID(),
      type: file.type.startsWith('image/') ? 'image' : 'document',
      name: file.name,
      contentType: file.type || 'application/octet-stream',
      file,
      status: { type: 'requires-action', reason: 'composer-send' },
    };
  }

  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    const content =
      attachment.type === 'image'
        ? [{ type: 'image' as const, image: await fileToDataURL(attachment.file) }]
        : [];
    return { ...attachment, status: { type: 'complete' }, content };
  }

  async remove(): Promise<void> {}
}
