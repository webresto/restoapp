import type { MethodContext, MobileApiRegistry } from "../lib/registry";
import type { PanelUser } from "../lib/types";

/**
 * «Ассистент» — the assistant of this server's admin panel (adminizer's AI panel, the `openharness` model of
 * `api/bootstrap/ai-agent.js`) in the RestoApp touch app, the same way Resto Cloud gives it to a cloud account
 * (cloud-panel, layers/app-mobile-api/lib/assistant.ts): one mechanism, the assistant is the context's.
 *
 * The client draws the chat itself (`client: {native: "assistant"}`) and talks to the panel's own agent routes —
 * `<routePrefix>/api/ai-assistant/agent/<model>/{status,meta,history,conversations,runs}` and the run's SSE stream —
 * so the model, its tools, the rights and the conversations are the panel's, shared with the web. adminizer knows
 * the user only by its `adminizer_jwt` cookie, so the one method of the app, `assistant.session`, turns the device
 * into a short web session of the same account: the JWT of the login form for an hour, asked again by the app when
 * it runs out. Behind the panel's own right `ai-assistant-<model>`.
 */

export const ASSISTANT_SESSION_TTL_SECONDS = 60 * 60;

/** Material Symbols "smart_toy", 24×24 — the icon of «Ассистент» in the cloud too. */
const ICON =
  "M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12" +
  "c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5z" +
  "M16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z";

export interface AssistantPort {
  /** The model of the AI panel, while the panel has it: off, not registered yet — null. */
  model(): { id: string; title: string } | null;
  /** adminizer's routePrefix — `/admin` on RestoApp. */
  routePrefix(): string;
  /** A JWT for the `adminizer_jwt` cookie of this user: the payload and secret of the login form. */
  sign(user: PanelUser, ttlSeconds: number): string;
}

export function registerAssistant(registry: MobileApiRegistry, port: AssistantPort, modelId: string): void {
  registry.registerApp({
    id: "assistant",
    version: "1.0.0",
    title: "mobile.app.assistant.title",
    icon: { path: ICON },
    category: "mobile.category.help",
    home: "assistant.session",
    scope: "server",
    client: { native: "assistant", min: 1 },
  });

  registry.registerMethod({
    name: "assistant.session",
    app: "assistant",
    kind: "query",
    title: "mobile.assistant.session.title",
    // The panel's own right: whoever may open its assistant in the browser may open it on the phone.
    access: { token: `ai-assistant-${modelId}` },
    input: { type: "object", properties: {} },
    handler: async (_params: Record<string, never>, ctx: MethodContext) => {
      const model = port.model();
      if (!model || !ctx.user) return ctx.fail("unavailable", "The assistant of the panel is off");
      const prefix = port.routePrefix().replace(/\/+$/, "");
      return {
        transport: "adminizer-agent",
        model: model.id,
        title: model.title,
        base: `${prefix}/api/ai-assistant/agent/${encodeURIComponent(model.id)}`,
        cookie: { name: "adminizer_jwt", value: port.sign(ctx.user, ASSISTANT_SESSION_TTL_SECONDS) },
        // adminizer checks a double-submit CSRF token on every POST: a cookie and a header with the same value.
        csrf: { cookie: "XSRF-TOKEN", header: "X-XSRF-TOKEN" },
        expiresAt: new Date(Date.now() + ASSISTANT_SESSION_TTL_SECONDS * 1000).toISOString(),
      };
    },
    // Nothing to write down: a session is not a change.
    audit: () => ({ record: null, params: {} }),
  });
}
