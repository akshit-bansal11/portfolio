/*
 * store.ts
 * Server-only queries for likes and comments. Every statement is parameterised;
 * email and visitor are written but never selected back out.
 */

import { d1Query } from "./d1";
import { isRecord } from "./validate";

export const RATE_LIMIT_MAX = 3;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_COMMENTS = 200;

export interface PublicComment {
  id: number;
  name: string | null;
  body: string;
  createdAt: number;
}

function numberField(rows: unknown[], key: string): number {
  const row = rows[0];
  const value = isRecord(row) ? row[key] : undefined;
  return typeof value === "number" ? value : 0;
}

export async function countLikes(slug: string): Promise<number> {
  return numberField(
    await d1Query("SELECT COUNT(*) AS n FROM post_likes WHERE slug = ?", [slug]),
    "n",
  );
}

export async function hasLiked(slug: string, visitor: string): Promise<boolean> {
  const rows = await d1Query("SELECT 1 AS n FROM post_likes WHERE slug = ? AND visitor = ?", [
    slug,
    visitor,
  ]);
  return rows.length > 0;
}

// Flips this visitor's like and returns the new state.
export async function toggleLike(slug: string, visitor: string) {
  const liked = !(await hasLiked(slug, visitor));
  if (liked) {
    await d1Query(
      "INSERT INTO post_likes (slug, visitor, created_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
      [slug, visitor, Date.now()],
    );
  } else {
    await d1Query("DELETE FROM post_likes WHERE slug = ? AND visitor = ?", [slug, visitor]);
  }
  return { likes: await countLikes(slug), liked };
}

function toComment(row: unknown): PublicComment | null {
  if (!isRecord(row)) return null;
  const { id, name, body, created_at: createdAt } = row;
  if (typeof id !== "number" || typeof body !== "string" || typeof createdAt !== "number") {
    return null;
  }
  return { id, name: typeof name === "string" ? name : null, body, createdAt };
}

export async function listComments(slug: string): Promise<PublicComment[]> {
  const rows = await d1Query(
    "SELECT id, name, body, created_at FROM comments WHERE slug = ? AND hidden = 0 ORDER BY created_at ASC, id ASC LIMIT ?",
    [slug, MAX_COMMENTS],
  );
  return rows.flatMap((row) => toComment(row) ?? []);
}

// Seconds until this visitor may comment again, or 0 when under the limit.
export async function retryAfterSeconds(visitor: string): Promise<number> {
  const now = Date.now();
  const rows = await d1Query(
    "SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM comments WHERE visitor = ? AND created_at > ?",
    [visitor, now - RATE_LIMIT_WINDOW_MS],
  );
  if (numberField(rows, "n") < RATE_LIMIT_MAX) return 0;
  const oldest = numberField(rows, "oldest");
  return Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
}

export async function addComment(
  slug: string,
  visitor: string,
  input: { name: string | null; email: string | null; body: string },
): Promise<PublicComment> {
  const createdAt = Date.now();
  const rows = await d1Query(
    "INSERT INTO comments (slug, name, email, body, visitor, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
    [slug, input.name, input.email, input.body, visitor, createdAt],
  );
  return { id: numberField(rows, "id"), name: input.name, body: input.body, createdAt };
}
