/**
 * Error codes of the protocol. One table: HTTP status and whether a retry can help. The client
 * branches on `code`, never on the message.
 */
export const ERRORS = {
  unauthorized: { status: 401, retryable: false, message: "Sign in again" },
  invalid_credentials: { status: 401, retryable: false, message: "Wrong login or password" },
  forbidden: { status: 403, retryable: false, message: "Not allowed" },
  place_forbidden: { status: 403, retryable: false, message: "Access to this point is not granted" },
  https_required: { status: 403, retryable: false, message: "HTTPS is required" },
  invalid: { status: 400, retryable: false, message: "Invalid request" },
  captcha_invalid: { status: 400, retryable: false, message: "Invalid CAPTCHA solution, ask for a new task" },
  not_found: { status: 404, retryable: false, message: "Not found" },
  conflict: { status: 409, retryable: false, message: "Conflict" },
  too_large: { status: 413, retryable: false, message: "Request body is too large" },
  rate_limited: { status: 429, retryable: true, message: "Too many attempts" },
  internal: { status: 500, retryable: false, message: "Internal error" },
  unavailable: { status: 503, retryable: true, message: "Mobile API is unavailable" },
} as const;

export type ErrorCode = keyof typeof ERRORS;

export class MobileError extends Error {
  readonly code: ErrorCode;
  readonly details?: unknown;
  /** Seconds, for `rate_limited`: goes to `Retry-After`. */
  readonly retryAfter?: number;

  constructor(code: ErrorCode, message?: string, extra: { details?: unknown; retryAfter?: number } = {}) {
    super(message ?? ERRORS[code].message);
    this.name = "MobileError";
    this.code = code;
    this.details = extra.details;
    this.retryAfter = extra.retryAfter;
  }

  get status(): number {
    return ERRORS[this.code].status;
  }

  toBody(): { error: { code: ErrorCode; message: string; retryable: boolean; details?: unknown } } {
    return {
      error: {
        code: this.code,
        message: this.message,
        retryable: ERRORS[this.code].retryable,
        ...(this.details !== undefined ? { details: this.details } : {}),
      },
    };
  }
}

export function fail(code: ErrorCode, message?: string, extra?: { details?: unknown; retryAfter?: number }): never {
  throw new MobileError(code, message, extra);
}
