import { expect } from "chai";
import { isRevokedKeyError, summarizeLlmError } from "../lib/ai/OpenHarnessConnectionManager";

// Error shapes copied from live LiteLLM/ai-sdk failures.
function apiCallError(status: number, message: string) {
  return Object.assign(new Error(message), { statusCode: status, isRetryable: status === 429 });
}

function retryError(message: string, errors: Error[]) {
  return Object.assign(new Error(`Failed after 3 attempts. Last error: ${message}`), {
    reason: "maxRetriesExceeded",
    errors,
    lastError: errors[errors.length - 1],
  });
}

const REVOKED =
  "Authentication Error, Invalid proxy server token passed. Received API Key = sk-...PC5Q, " +
  "Key Hash (Token) =c5f97984. Unable to find token in cache or `LiteLLM_VerificationTokenTable`";
const RATE_LIMITED =
  "Rate limit exceeded for user: frontend:restoapp:localhost. Limit type: tokens. " +
  "Current limit: 20000, Remaining: 8163. Limit resets at: 2026-07-17 10:29:13 UTC";

describe("isRevokedKeyError", () => {
  describe("keys that are gone upstream", () => {
    it("detects the 401 LiteLLM returns for a deleted key", () => {
      expect(isRevokedKeyError(apiCallError(401, REVOKED))).to.equal(true);
    });

    it("detects it through the RetryError the ai-sdk wraps calls in", () => {
      expect(isRevokedKeyError(retryError(REVOKED, [apiCallError(401, REVOKED)]))).to.equal(true);
    });

    it("falls back to the message when a wrapper stripped the status code", () => {
      expect(isRevokedKeyError(new Error(REVOKED))).to.equal(true);
    });

    it("follows the cause chain", () => {
      expect(isRevokedKeyError(Object.assign(new Error("stream failed"), {
        cause: apiCallError(401, REVOKED),
      }))).to.equal(true);
    });
  });

  // A false positive here discards a working key and burns the broker's global
  // one-key-per-hour slot for every install, so these matter more than the above.
  describe("keys that are still alive", () => {
    it("ignores a token rate limit", () => {
      expect(isRevokedKeyError(apiCallError(429, RATE_LIMITED))).to.equal(false);
    });

    it("ignores a rate limit wrapped in a RetryError", () => {
      expect(isRevokedKeyError(retryError(RATE_LIMITED, [
        apiCallError(429, RATE_LIMITED),
        apiCallError(429, RATE_LIMITED),
      ]))).to.equal(false);
    });

    it("ignores 403, whose wording is auth-like but means the model is denied", () => {
      expect(isRevokedKeyError(
        apiCallError(403, "Authentication Error: key not allowed to access model"),
      )).to.equal(false);
    });

    it("ignores an exceeded budget", () => {
      expect(isRevokedKeyError(
        apiCallError(400, "ExceededBudget: Crossed spend within budget"),
      )).to.equal(false);
    });

    it("ignores network failures", () => {
      expect(isRevokedKeyError(new Error("fetch failed"))).to.equal(false);
    });
  });

  describe("malformed input", () => {
    it("handles null and undefined", () => {
      expect(isRevokedKeyError(null)).to.equal(false);
      expect(isRevokedKeyError(undefined)).to.equal(false);
    });

    it("terminates on a self-referencing cause", () => {
      const cyclic: any = new Error("outer");
      cyclic.cause = cyclic;
      expect(isRevokedKeyError(cyclic)).to.equal(false);
    });
  });
});

describe("summarizeLlmError", () => {
  it("keeps the status and the provider's wording", () => {
    const summary = summarizeLlmError(apiCallError(401, REVOKED));
    expect(summary).to.contain("HTTP 401");
    expect(summary).to.contain("Invalid proxy server token");
  });

  it("reports how many attempts a RetryError burned", () => {
    const summary = summarizeLlmError(retryError(RATE_LIMITED, [
      apiCallError(429, RATE_LIMITED),
      apiCallError(429, RATE_LIMITED),
      apiCallError(429, RATE_LIMITED),
    ]));
    expect(summary).to.contain("HTTP 429");
    expect(summary).to.contain("3 attempts burned");
  });

  // The whole point: an APICallError carries the request body, the tool schemas
  // and every response header, and logging the object dumps all of it.
  it("stays a single short line even when the error carries the whole request", () => {
    const bulky = Object.assign(apiCallError(429, RATE_LIMITED), {
      url: "https://lllm.m42.cx/v1/chat/completions",
      requestBodyValues: { messages: new Array(21).fill({ role: "user", content: "x".repeat(500) }), tools: new Array(7).fill({ schema: "…" }) },
      responseHeaders: { "retry-after": "60", "x-litellm-key-spend": "0.0051667" },
      data: { error: { message: RATE_LIMITED, type: "throttling_error" } },
    });
    const summary = summarizeLlmError(bulky);
    expect(summary).to.not.contain("\n");
    expect(summary.length).to.be.lessThan(400);
  });

  it("truncates a runaway provider message", () => {
    const summary = summarizeLlmError(apiCallError(500, "boom ".repeat(200)));
    expect(summary.length).to.be.lessThan(400);
    expect(summary).to.contain("…");
  });

  it("survives errors with no message or status", () => {
    expect(summarizeLlmError(new Error(""))).to.contain("no message");
    expect(summarizeLlmError(null)).to.equal("unknown error");
  });
});
