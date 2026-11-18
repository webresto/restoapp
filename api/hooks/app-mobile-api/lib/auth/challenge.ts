import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import type { AttemptStore, PowUseStore, PuzzlePort } from "../types";

/**
 * Proof-of-work CAPTCHA without process memory, for a pm2 cluster.
 *
 * adminizer's `POWCaptcha` keeps its tasks in a static map, and in a cluster the task and the answer
 * land in different workers. Here the task proves itself: the message hidden in the puzzle is
 * `<id>:<label>:<exp>:<sig>` with `sig = HMAC-SHA256(secret, "<id>:<label>:<exp>")`, so any worker
 * can check it; replays are stopped by inserting `id` into a table with a primary key.
 *
 * The same shape is proposed for adminizer upstream (`PowChallengeStore`, plan section 2). Until that
 * build is out the hook keeps this copy; afterwards it imports adminizer's class and this file goes.
 */

export const CHALLENGE_TTL_MS = 30 * 60 * 1000;
/** Failures with a label within this window raise the difficulty — the coefficient of adminizer. */
export const FAILURE_WINDOW_MS = 30 * 60 * 1000;

export interface ChallengeOptions {
  secret(): string | undefined;
  puzzle: PuzzlePort;
  used: PowUseStore;
  attempts: AttemptStore;
  baseDifficultyMs(): number;
  now(): number;
  ttlMs?: number;
}

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export class PowChallenge {
  constructor(private readonly options: ChallengeOptions) {}

  private requireSecret(): string {
    const secret = this.options.secret();
    if (!secret) throw new Error("mobile API: no MOBILE_API_SECRET or JWT_SECRET, the CAPTCHA cannot be signed");
    return secret;
  }

  /** Difficulty grows by one base step for every 7 failures with this label in 30 minutes. */
  async difficultyMs(label: string): Promise<number> {
    const failures = await this.options.attempts.count(label, this.options.now() - FAILURE_WINDOW_MS, true);
    return this.options.baseDifficultyMs() * (1 + Math.floor(failures / 7));
  }

  async message(label: string): Promise<string> {
    if (!label) throw new Error("Label not provided");
    const id = randomUUID();
    const exp = Math.floor((this.options.now() + (this.options.ttlMs ?? CHALLENGE_TTL_MS)) / 1000);
    return `${id}:${label}:${exp}:${sign(this.requireSecret(), `${id}:${label}:${exp}`)}`;
  }

  /** The task as adminizer sends it to the browser: the puzzle as an array of bytes. */
  async getJob(label: string): Promise<number[]> {
    const message = await this.message(label);
    const puzzle = await this.options.puzzle.generate(message, await this.difficultyMs(label));
    return Array.from(puzzle);
  }

  /**
   * The solution is the message itself. The label may contain colons (`login:::1`), so the message is
   * read from both ends: the id first, the signature and the expiry last.
   */
  async check(solution: unknown, label: string): Promise<boolean> {
    if (typeof solution !== "string" || solution.length > 1000) return false;
    const parts = solution.split(":");
    if (parts.length < 4) return false;
    const id = parts[0];
    const sig = parts[parts.length - 1];
    const expRaw = parts[parts.length - 2];
    const solvedLabel = parts.slice(1, -2).join(":");
    if (!id || solvedLabel !== label || !/^\d+$/.test(expRaw)) return false;

    const exp = Number(expRaw);
    if (exp * 1000 <= this.options.now()) return false;

    const expected = Buffer.from(sign(this.requireSecret(), `${id}:${label}:${expRaw}`));
    const given = Buffer.from(sig);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;

    return this.options.used.markUsed(id, label, exp * 1000);
  }
}
