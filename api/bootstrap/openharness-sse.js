'use strict';

const runs = new Map();
const MAX_RUN_AGE_MS = 10 * 60 * 1000;

const MAX_FILES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
// Inline cap per text attachment: roughly 64k tokens, half of the default
// 128k context window, so a single file cannot immediately trigger compaction.
const MAX_INLINE_TEXT_CHARS = 256 * 1024;

const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'yaml', 'yml', 'xml', 'html', 'css',
  'js', 'ts', 'jsx', 'tsx', 'sql', 'log', 'ini', 'conf', 'env', 'sh', 'graphql',
]);
const TEXT_MIME_TYPES = new Set([
  'application/json', 'application/xml', 'application/x-yaml', 'application/sql', 'image/svg+xml',
]);

function canUse(req, res) {
  const adminizer = req.adminizer;
  if (!req.user) { res.sendStatus(401); return false; }
  if (!adminizer?.accessRightsHelper?.hasPermission('ai-assistant-openharness', req.user)) {
    res.sendStatus(403); return false;
  }
  if (!adminizer.openHarnessAgentService) {
    res.status(503).json({ error: 'RestoApp Assistant is not configured.' });
    return false;
  }
  return true;
}

function write(res, event, data, id) {
  if (id !== undefined) res.write(`id: ${id}\n`);
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function cleanup() {
  const cutoff = Date.now() - MAX_RUN_AGE_MS;
  for (const [id, run] of runs) if (run.createdAt < cutoff) runs.delete(id);
}

function isTextFile(file) {
  const mime = file.mimetype || '';
  if (mime.startsWith('text/')) return true;
  if (TEXT_MIME_TYPES.has(mime)) return true;
  const ext = (file.originalname || '').split('.').pop()?.toLowerCase() || '';
  return TEXT_EXTENSIONS.has(ext);
}

/** Turns prompt + uploaded files into a ModelMessage[] for session.send(). */
function buildInput(prompt, files, vision, savedFiles = []) {
  if (!files?.length) return prompt;
  const parts = [];
  if (prompt) parts.push({ type: 'text', text: prompt });
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const saved = savedFiles[index];
    const name = file.originalname || 'file';
    const savedNote = saved?.id
      ? ` saved_file_id=${JSON.stringify(saved.id)} saved_file_name=${JSON.stringify(saved.name || name)}`
      : '';
    if (isTextFile(file)) {
      let text = file.buffer.toString('utf8');
      let note = '';
      if (text.length > MAX_INLINE_TEXT_CHARS) {
        text = text.slice(0, MAX_INLINE_TEXT_CHARS);
        note = `\n[attachment truncated at ${MAX_INLINE_TEXT_CHARS} characters]`;
      }
      parts.push({ type: 'text', text: `<attachment name=${JSON.stringify(name)}${savedNote}>\n${text}${note}\n</attachment>` });
    } else if ((file.mimetype || '').startsWith('image/')) {
      if (vision) {
        parts.push({ type: 'image', image: `data:${file.mimetype};base64,${file.buffer.toString('base64')}` });
      } else {
        parts.push({ type: 'text', text: `[Image attached: ${name}${saved?.id ? `, saved_file_id=${saved.id}` : ''} — the current model cannot see images]` });
      }
    } else {
      parts.push({ type: 'text', text: `[Unsupported attachment saved but not inlined: ${name}${saved?.id ? `, saved_file_id=${saved.id}` : ''} (${file.mimetype || 'unknown type'})]` });
    }
  }
  return [{ role: 'user', content: parts }];
}

/** SSE payloads must be JSON-safe and lean; agent "done" carries the whole history. */
function sanitizeEvent(event) {
  if (!event || typeof event !== 'object') return event;
  if (event.type === 'done' && event.messages) {
    const { messages, ...rest } = event;
    return rest;
  }
  if (event.error instanceof Error) return { ...event, error: event.error.message };
  return event;
}

module.exports.default = async function (sails) {
  sails.on('Adminpanel:loaded', () => {
    const adminizer = sails.hooks.adminpanel?.adminizer;
    if (!adminizer) return;
    const prefix = adminizer.config.routePrefix;

    // multer is an adminizer dependency (hoisted). It only engages on
    // multipart/form-data requests; plain JSON bodies pass through untouched.
    const multer = require('multer');
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES, fieldSize: 1024 * 1024 },
    }).array('files', MAX_FILES);

    adminizer.app.get(`${prefix}/api/openharness/meta`, async (req, res) => {
      if (!canUse(req, res)) return;
      const meta = adminizer.openHarnessAgentService.getSessionMeta(req.user);
      const availableModels = await adminizer.openHarnessAgentService.getModelChoices();
      res.json({ ...meta, availableModels, maxFiles: MAX_FILES, maxFileSize: MAX_FILE_SIZE });
    });

    adminizer.app.post(`${prefix}/api/openharness/model`, async (req, res) => {
      if (!canUse(req, res)) return;
      const model = typeof req.body?.model === 'string' ? req.body.model.trim() : '';
      if (!model) return res.status(400).json({ error: 'Model is required.' });
      await adminizer.openHarnessAgentService.setCurrentModel(req.user, model);
      const meta = adminizer.openHarnessAgentService.getSessionMeta(req.user);
      const availableModels = await adminizer.openHarnessAgentService.getModelChoices();
      res.json({ ...meta, availableModels, maxFiles: MAX_FILES, maxFileSize: MAX_FILE_SIZE });
    });

    adminizer.app.delete(`${prefix}/api/openharness/session`, (req, res) => {
      if (!canUse(req, res)) return;
      const reset = adminizer.openHarnessAgentService.resetSession(req.user);
      res.json({ reset });
    });

    // The server session is the source of truth for the dialog; the UI pulls
    // it on page load so a reload restores exactly what the agent remembers.
    adminizer.app.get(`${prefix}/api/openharness/history`, (req, res) => {
      if (!canUse(req, res)) return;
      const messages = adminizer.openHarnessAgentService.getSessionHistory(req.user);
      res.json({ messages });
    });

    adminizer.app.post(`${prefix}/api/openharness/compact`, async (req, res) => {
      if (!canUse(req, res)) return;
      try {
        const result = await adminizer.openHarnessAgentService.compactSession(req.user);
        const meta = adminizer.openHarnessAgentService.getSessionMeta(req.user);
        res.json({ ...result, meta });
      } catch (error) {
        res.status(500).json({ error: error?.message || 'Compaction failed' });
      }
    });

    adminizer.app.post(`${prefix}/api/openharness/runs`, (req, res) => {
      if (!canUse(req, res)) return;
      upload(req, res, async (uploadError) => {
        if (uploadError) {
          const message = uploadError.code === 'LIMIT_FILE_SIZE'
            ? `File is too large (max ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`
            : uploadError.message || 'Upload failed';
          return res.status(413).json({ error: message });
        }
        const prompt = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
        const files = req.files || [];
        if (!prompt && !files.length) return res.status(400).json({ error: 'Message is required' });
        cleanup();

        const savedFiles = await adminizer.openHarnessAgentService.saveUploadedFiles(req.user, files);
        const { vision } = adminizer.openHarnessAgentService.getSessionMeta(req.user);
        const input = buildInput(prompt || 'See the attached files.', files, vision, savedFiles);

        const id = `oh-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const run = { id, userId: req.user.id, createdAt: Date.now(), events: [], clients: new Set(), done: false };
        runs.set(id, run);
        const publish = (event) => {
          const safe = sanitizeEvent(event);
          const index = run.events.push(safe) - 1;
          for (const client of run.clients) write(client, 'openharness', safe, index);
        };
        // Do not await the run in this request handler: the browser must first
        // receive the 202 response so it can open the SSE connection.
        res.status(202).json({ runId: id, stream: `${prefix}/api/openharness/runs/${id}/stream` });
        setImmediate(() => {
          void (async () => {
            try {
              await adminizer.openHarnessAgentService.streamReply(input, req.user, publish);
              run.done = true; publish({ type: 'done' });
            } catch (error) {
              run.done = true; publish({ type: 'error', error: error?.message || 'Agent run failed' });
            }
          })();
        });
      });
    });

    adminizer.app.get(`${prefix}/api/openharness/runs/:runId/stream`, (req, res) => {
      if (!canUse(req, res)) return;
      const run = runs.get(req.params.runId);
      if (!run || run.userId !== req.user.id) return res.sendStatus(404);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders?.();
      res.write('retry: 3000\n\n');
      write(res, 'connected', { runId: run.id });
      // Event ids let EventSource resume after a reconnect without replaying
      // what the client already processed (Last-Event-ID header).
      const lastEventId = Number(req.headers['last-event-id']);
      const start = Number.isFinite(lastEventId) ? lastEventId + 1 : 0;
      for (let i = start; i < run.events.length; i++) write(res, 'openharness', run.events[i], i);
      if (run.done) { res.end(); return; }
      run.clients.add(res);
      req.on('close', () => run.clients.delete(res));
    });
  });
};
