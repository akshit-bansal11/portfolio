/*
 * blogEngagement.ts
 * Typed client for the blog likes and comments API. Components call these
 * instead of fetch(); every response is narrowed before it is trusted.
 */

export interface EngagementComment {
  id: number;
  name: string | null;
  body: string;
  createdAt: number;
}

export interface Engagement {
  likes: number;
  liked: boolean;
  comments: EngagementComment[];
}

export interface CommentInput {
  anonymous: boolean;
  name: string;
  email: string;
  body: string;
  /** Honeypot: real visitors leave it empty. */
  website: string;
}

export type EngagementResult =
  | { status: "ok"; data: Engagement }
  | { status: "unavailable" }
  | { status: "error" };

export type LikeResult =
  | { status: "ok"; likes: number; liked: boolean }
  | { status: "unavailable" }
  | { status: "error" };

export type CommentResult =
  | { status: "ok"; comment: EngagementComment }
  | { status: "invalid"; error: string; fields: Record<string, string> }
  | { status: "rate-limited"; error: string }
  | { status: "unavailable"; error: string }
  | { status: "error"; error: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isComment(value: unknown): value is EngagementComment {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    (value.name === null || typeof value.name === "string") &&
    typeof value.body === "string" &&
    typeof value.createdAt === "number"
  );
}

function isEngagement(value: unknown): value is Engagement {
  return (
    isRecord(value) &&
    typeof value.likes === "number" &&
    typeof value.liked === "boolean" &&
    Array.isArray(value.comments) &&
    value.comments.every(isComment)
  );
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

export async function getEngagement(slug: string): Promise<EngagementResult> {
  try {
    const res = await fetch(`/api/blog/${slug}/engagement`, { cache: "no-store" });
    if (res.status === 503) return { status: "unavailable" };
    const body = await readBody(res);
    return res.ok && isEngagement(body) ? { status: "ok", data: body } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}

export async function toggleLike(slug: string): Promise<LikeResult> {
  try {
    const res = await fetch(`/api/blog/${slug}/like`, { method: "POST" });
    if (res.status === 503) return { status: "unavailable" };
    const body = await readBody(res);
    if (
      res.ok &&
      isRecord(body) &&
      typeof body.likes === "number" &&
      typeof body.liked === "boolean"
    ) {
      return { status: "ok", likes: body.likes, liked: body.liked };
    }
    return { status: "error" };
  } catch {
    return { status: "error" };
  }
}

export async function postComment(slug: string, input: CommentInput): Promise<CommentResult> {
  try {
    const res = await fetch(`/api/blog/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = await readBody(res);
    if (res.status === 201 && isRecord(body) && isComment(body.comment)) {
      return { status: "ok", comment: body.comment };
    }
    const error = errorText(body);
    if (res.status === 429) return { status: "rate-limited", error };
    if (res.status === 503) return { status: "unavailable", error };
    if (res.status === 400) return { status: "invalid", error, fields: fieldErrors(body) };
    return { status: "error", error };
  } catch {
    return { status: "error", error: GENERIC_ERROR };
  }
}
