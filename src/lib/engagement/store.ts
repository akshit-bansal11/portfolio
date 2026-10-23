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

export interface EngagementSnapshot {
  likes: number;
  liked: boolean;
  comments: PublicComment[];
}

function numberField(rows: unknown[], key: string): number {
  const row = rows[0];
  const value = isRecord(row) ? row[key] : undefined;
  return typeof value === "number" ? value : 0;
}

async function countLikes(slug: string): Promise<number> {
  return numberField(
    await d1Query("SELECT COUNT(*) AS n FROM post_likes WHERE slug = ?", [slug]),
    "n",
  );
}

// Flips this visitor's like and returns the new state. Delete-first keeps it atomic:
// whichever statement changes a row decides the outcome.
export async function toggleLike(slug: string, visitor: string) {
  const removed = await d1Query(
    "DELETE FROM post_likes WHERE slug = ? AND visitor = ? RETURNING slug",
    [slug, visitor],
  );
  const liked = removed.length === 0;
  if (liked) {
    await d1Query(
      "INSERT INTO post_likes (slug, visitor, created_at) VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
      [slug, visitor, Date.now()],
    );
  }
  return { likes: await countLikes(slug), liked };
}

// Rows that fail narrowing are dropped, never given a fallback id.
function toComment(row: unknown): PublicComment | null {
  if (!isRecord(row)) return null;
  const { id, name, body, createdAt } = row;
  if (typeof id !== "number" || typeof body !== "string" || typeof createdAt !== "number") {
    return null;
  }
  return { id, name: typeof name === "string" ? name : null, body, createdAt };
}

// One round trip: like count, this visitor's flag and the visible comments as a JSON array.
export async function getEngagement(
  slug: string,
  visitor: string | null,
): Promise<EngagementSnapshot> {
  const rows = await d1Query(
    `SELECT
       (SELECT COUNT(*) FROM post_likes WHERE slug = ?) AS likes,
       EXISTS (SELECT 1 FROM post_likes WHERE slug = ? AND visitor = ?) AS liked,
       (SELECT json_group_array(json_object('id', id, 'name', name, 'body', body, 'createdAt', created_at))
          FROM (SELECT id, name, body, created_at FROM comments
                WHERE slug = ? AND hidden = 0
                ORDER BY created_at ASC, id ASC LIMIT ?)) AS comments`,
    [slug, slug, visitor ?? "", slug, MAX_COMMENTS],
  );
  const row = rows[0];
  const raw = isRecord(row) ? row.comments : undefined;
  const parsed: unknown = typeof raw === "string" ? JSON.parse(raw) : [];
  const comments = Array.isArray(parsed) ? parsed.flatMap((item) => toComment(item) ?? []) : [];
  return { likes: numberField(rows, "likes"), liked: numberField(rows, "liked") === 1, comments };
}

// Seconds until the visitor's oldest comment in the window ages out.
export async function retryAfterSeconds(visitor: string): Promise<number> {
  const now = Date.now();
  const rows = await d1Query(
    "SELECT MIN(created_at) AS oldest FROM comments WHERE visitor = ? AND created_at > ?",
    [visitor, now - RATE_LIMIT_WINDOW_MS],
  );
  const oldest = numberField(rows, "oldest");
  return Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
}

// Rate limit and insert in one statement, so a parallel burst cannot slip past the
// count. Returns null when the visitor is over the limit.
export async function addComment(
  slug: string,
  visitor: string,
  input: { name: string | null; email: string | null; body: string },
): Promise<PublicComment | null> {
  const now = Date.now();
  const rows = await d1Query(
    `INSERT INTO comments (slug, name, email, body, visitor, hidden, created_at)
     SELECT ?, ?, ?, ?, ?, 0, ?
     WHERE (SELECT COUNT(*) FROM comments WHERE visitor = ? AND created_at > ?) < ?
     RETURNING id, created_at AS createdAt`,
    [
      slug,
      input.name,
      input.email,
      input.body,
      visitor,
      now,
      visitor,
      now - RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_MAX,
    ],
  );
  const row = rows[0];
  if (!isRecord(row) || typeof row.id !== "number" || typeof row.createdAt !== "number") {
    return null;
  }
  return { id: row.id, name: input.name, body: input.body, createdAt: row.createdAt };
}
