/*
 * request.ts
 * Server-only helpers shared by the engagement route handlers: slug check,
 * visitor hashing, origin check, guarded JSON body parsing and error responses.
 */

import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { blogPosts } from "@/data/blogPosts";
import { isEngagementConfigured } from "./d1";

const MAX_BODY_BYTES = 8 * 1024;

export const NO_VISITOR_MESSAGE = "Couldn't identify your connection.";

export interface SlugContext {
  params: Promise<{ slug: string }>;
}

export function errorResponse(status: number, error: string, fields?: Record<string, string>) {
  return NextResponse.json(fields ? { error, fields } : { error }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// Returns an error response for an unknown slug or missing config, else null.
export function guard(slug: string): Response | null {
  if (!blogPosts.some((post) => post.slug === slug)) return errorResponse(404, "Not found.");
  if (!isEngagementConfigured()) return errorResponse(503, "Comments are not set up yet.");
  return null;
}

// Expands an IPv6 address and keeps its /64 prefix, so one subscriber's rotating
// addresses share a visitor. IPv4 (and IPv4-mapped) addresses pass through.
function normaliseIp(raw: string): string {
  const ip = raw.split("%")[0].toLowerCase();
  if (!ip.includes(":")) return ip;
  const tail = ip.slice(ip.lastIndexOf(":") + 1);
  if (tail.includes(".")) return tail;
  const [left, right = ""] = ip.split("::");
  const head = left.split(":").filter(Boolean);
  const end = right.split(":").filter(Boolean);
  const zeros = Array.from({ length: Math.max(0, 8 - head.length - end.length) }, () => "0");
  const prefix = [...head, ...zeros, ...end]
    .slice(0, 4)
    .map((group) => Number.parseInt(group, 16).toString(16));
  return `${prefix.join(":")}::/64`;
}

// Prefers the headers Vercel sets itself, then the first X-Forwarded-For entry.
function clientIp(request: Request): string | null {
  const raw =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for")?.split(",")[0];
  const ip = raw?.trim();
  return ip ? normaliseIp(ip) : null;
}

// HMAC-SHA256 hex of the client IP keyed by the salt, or null when there is no IP.
// The raw IP is never stored.
export function visitorId(request: Request): string | null {
  const ip = clientIp(request);
  if (!ip) return null;
  return createHmac("sha256", process.env.ENGAGEMENT_IP_SALT ?? "")
    .update(ip)
    .digest("hex");
}

// Same-origin POSTs only: a missing or foreign Origin is rejected.
export function checkOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  try {
    if (origin && host && new URL(origin).host === host) return null;
  } catch {
    // an unparseable Origin falls through to the rejection
  }
  return errorResponse(403, "Forbidden.");
}

export type JsonBody = { ok: true; data: unknown } | { ok: false; response: Response };

// Reads a JSON body capped at maxBytes (8 KB by default; checked up front and again while
// streaming).
export async function readJson(request: Request, maxBytes = MAX_BODY_BYTES): Promise<JsonBody> {
  const tooLarge = { ok: false, response: errorResponse(413, "That is too large.") } as const;
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, response: errorResponse(400, "Expected JSON.") };
  }
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) return tooLarge;
  if (!request.body) return { ok: false, response: errorResponse(400, "Invalid JSON.") };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return tooLarge;
    }
    chunks.push(value);
  }
  try {
    return { ok: true, data: JSON.parse(Buffer.concat(chunks).toString("utf8")) };
  } catch {
    return { ok: false, response: errorResponse(400, "Invalid JSON.") };
  }
}

export function serverError(error: unknown) {
  console.error("engagement route failed", error);
  return errorResponse(500, "Something went wrong. Please try again.");
}
