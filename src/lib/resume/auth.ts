/*
 * auth.ts
 * Server-only admin session for the resume editor. Never import this from
 * client code. One admin, one secret: RESUME_ADMIN_KEY. The session cookie and
 * the CSRF token are both HMACs of that key, so rotating it ends every session.
 *
 * The key is a generated random string (>= 32 chars), not a human password, so
 * a fast HMAC compare is the right check; Argon2id (SEC-05) exists to slow down
 * guessing of low-entropy passwords, which a 2^190 key space already prevents.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { isResumeStoreConfigured } from "./store";

export const SESSION_COOKIE = "__Host-resume_admin";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: "lax", path: "/" } as const;
const KEY_MIN = 32;
const KEY_INPUT_MAX = 512;

function adminKey(): string | null {
  const key = process.env.RESUME_ADMIN_KEY ?? "";
  return key.length >= KEY_MIN ? key : null;
}

function sign(key: string, message: string): string {
  return createHmac("sha256", key).update(message).digest("hex");
}

function sameHex(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

// Feature is off unless D1 is set up and the key is long enough.
export function isResumeEditable(): boolean {
  return isResumeStoreConfigured() && adminKey() !== null;
}

// Compares digests, not the raw strings, so the compare is constant-length.
export function checkAdminKey(input: string): boolean {
  const key = adminKey();
  if (!key || input.length > KEY_INPUT_MAX) return false;
  return sameHex(sign(key, `login:${input}`), sign(key, `login:${key}`));
}

// "<expiresAtMs>.<hmac>" with an absolute expiry; no rolling refresh.
export function createSession(now = Date.now()): { value: string; expires: Date } {
  const key = adminKey();
  if (!key) throw new Error("resume admin key is not set");
  const expiresAt = now + SESSION_TTL_MS;
  return {
    value: `${expiresAt}.${sign(key, `session:${expiresAt}`)}`,
    expires: new Date(expiresAt),
  };
}

// Fails closed: no key, a malformed value, a bad signature or a past expiry all mean "no session".
export function isValidSession(value: string | undefined, now = Date.now()): boolean {
  const key = adminKey();
  if (!key || !value) return false;
  const [stamp, mac, ...rest] = value.split(".");
  const expiresAt = Number(stamp);
  if (rest.length > 0 || !mac || !/^\d+$/.test(stamp) || expiresAt <= now) return false;
  if (expiresAt > now + SESSION_TTL_MS) return false;
  return sameHex(mac, sign(key, `session:${expiresAt}`));
}

export function csrfToken(session: string): string {
  const key = adminKey();
  if (!key) throw new Error("resume admin key is not set");
  return sign(key, `csrf:${session}`);
}

export function isValidCsrf(session: string, token: string | null): boolean {
  return Boolean(token) && sameHex(token ?? "", csrfToken(session));
}
