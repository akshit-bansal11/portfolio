/*
 * resume.ts
 * Typed client for the resume admin API (session + save). The editor calls
 * these instead of fetch(); every response is narrowed before it is trusted.
 */

import type { ResumeContent } from "@/data/resume";

export type SessionResult =
  | { status: "ok"; admin: false }
  | { status: "ok"; admin: true; csrf: string }
  | { status: "error" };

export type SignInResult =
  | { status: "ok"; csrf: string }
  | { status: "rejected"; error: string }
  | { status: "unavailable"; error: string }
  | { status: "error"; error: string };

export type SignOutResult = { status: "ok" } | { status: "error"; error: string };

export type SaveResult =
  | { status: "ok"; savedAt: number }
  | { status: "invalid"; error: string; fields: Record<string, string> }
  | { status: "signed-out"; error: string }
  | { status: "unavailable"; error: string }
  | { status: "error"; error: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readBody(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function errorText(body: unknown): string {
  return isRecord(body) && typeof body.error === "string" ? body.error : GENERIC_ERROR;
}

function fieldErrors(body: unknown): Record<string, string> {
  if (!isRecord(body) || !isRecord(body.fields)) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.fields)) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

export async function getSession(): Promise<SessionResult> {
  try {
    const res = await fetch("/api/resume/session", { cache: "no-store" });
    const body = await readBody(res);
    if (!res.ok || !isRecord(body)) return { status: "error" };
    if (body.admin === true && typeof body.csrf === "string") {
      return { status: "ok", admin: true, csrf: body.csrf };
    }
    return body.admin === false ? { status: "ok", admin: false } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}

export async function signIn(key: string): Promise<SignInResult> {
  try {
    const res = await fetch("/api/resume/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    const body = await readBody(res);
    if (res.ok && isRecord(body) && body.admin === true && typeof body.csrf === "string") {
      return { status: "ok", csrf: body.csrf };
    }
    const error = errorText(body);
    if (res.status === 401) return { status: "rejected", error };
    if (res.status === 503) return { status: "unavailable", error };
    return { status: "error", error };
  } catch {
    return { status: "error", error: GENERIC_ERROR };
  }
}

export async function signOut(csrf: string): Promise<SignOutResult> {
  try {
    const res = await fetch("/api/resume/session", {
      method: "DELETE",
      headers: { "X-CSRF-Token": csrf },
    });
    return res.ok ? { status: "ok" } : { status: "error", error: errorText(await readBody(res)) };
  } catch {
    return { status: "error", error: GENERIC_ERROR };
  }
}

export async function saveResume(csrf: string, content: ResumeContent): Promise<SaveResult> {
  try {
    const res = await fetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
      body: JSON.stringify(content),
    });
    const body = await readBody(res);
    if (res.ok && isRecord(body) && typeof body.savedAt === "number") {
      return { status: "ok", savedAt: body.savedAt };
    }
    const error = errorText(body);
    if (res.status === 401 || res.status === 403) return { status: "signed-out", error };
    if (res.status === 503) return { status: "unavailable", error };
    if (res.status === 422 || res.status === 413) {
      return { status: "invalid", error, fields: fieldErrors(body) };
    }
    return { status: "error", error };
  } catch {
    return { status: "error", error: GENERIC_ERROR };
  }
}
