import type { AccessPort, AttemptStore, DeviceStore, PanelUser, UsersPort } from "../types";
import { fail } from "../errors";
import { PowChallenge } from "./challenge";
import { accountProblem, issueDevice } from "./device";

/** Attempts per minute, per IP and per login. In the database: the workers of a cluster count together. */
export const LOGIN_LIMIT = 10;
export const LOGIN_WINDOW_MS = 60 * 1000;

/** The CAPTCHA label of the web login, so web and app failures raise one difficulty. */
export const ipLabel = (ip: string) => `login:${ip}`;
export const loginLabel = (login: string) => `user:${login.trim().toLowerCase()}`;

export interface LoginDeps {
  users: UsersPort;
  access: AccessPort;
  devices: DeviceStore;
  attempts: AttemptStore;
  challenge: PowChallenge;
  captchaEnabled(): boolean;
  now(): number;
}

export interface LoginRequest {
  login: string;
  password: string;
  captchaSolution?: string;
  device: { name: string; platform: string };
}

async function enforceLimit(deps: LoginDeps, label: string): Promise<void> {
  const count = await deps.attempts.count(label, deps.now() - LOGIN_WINDOW_MS);
  if (count >= LOGIN_LIMIT) fail("rate_limited", "Too many attempts, wait a minute", { retryAfter: LOGIN_WINDOW_MS / 1000 });
}

/**
 * The checks of adminizer's `controllers/login.js`, in its order, without its process memory:
 * CAPTCHA, user, confirmation, password (`login + password + AP_PASSWORD_SALT`), expiry, the panel
 * token. On top of the web: one error for a wrong login and a wrong password, and rate limits.
 */
export async function login(deps: LoginDeps, request: LoginRequest, ip: string): Promise<{ token: string; user: PanelUser }> {
  const byIp = ipLabel(ip);
  const byLogin = loginLabel(request.login);
  await enforceLimit(deps, byIp);
  await enforceLimit(deps, byLogin);

  const failed = async (code: "invalid_credentials" | "captcha_invalid" | "forbidden", message?: string): Promise<never> => {
    const at = deps.now();
    await deps.attempts.record(byIp, false, at);
    await deps.attempts.record(byLogin, false, at);
    return fail(code, message);
  };

  if (deps.captchaEnabled() && !(await deps.challenge.check(request.captchaSolution, byIp))) {
    return failed("captcha_invalid");
  }

  const user = await deps.users.findByLogin(request.login);
  if (!user || !user.passwordHashed || !deps.users.verifyPassword(user, request.login, request.password)) {
    return failed("invalid_credentials");
  }
  // Only after the password: telling "disabled" from "wrong password" before it would reveal accounts.
  const problem = await accountProblem(deps, user);
  if (problem) return failed("forbidden", problem);

  const at = deps.now();
  await deps.attempts.record(byIp, true, at);
  await deps.attempts.record(byLogin, true, at);

  const { token } = await issueDevice(deps, user, request.device);
  return { token, user };
}
