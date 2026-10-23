/*
 * request.ts
 * Server-only helpers shared by the engagement route handlers: slug check,
 * visitor hashing, guarded JSON body parsing and error responses.
 */

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { blogPosts } from "@/data/blogPosts";
import { isEngagementConfigured } from "./d1";

const MAX_BODY_BYTES = 8 * 1024;

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

// SHA-256 hex of salt + client IP. The raw IP is never stored.
export function hashVisitor(salt: string, ip: string): string {
  return createHash("sha256")
    .update(salt + ip)
    .digest("hex");
}

export function visitorId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
  return hashVisitor(process.env.ENGAGEMENT_IP_SALT ?? "", ip);
}

export type JsonBody = { ok: true; data: unknown } | { ok: false; response: Response };

// Reads a JSON body capped at 8 KB; rejects non-JSON content types.
export async function readJson(request: Request): Promise<JsonBody> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, response: errorResponse(400, "Expected JSON.") };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return { ok: false, response: errorResponse(413, "That is too large.") };
  }
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, response: errorResponse(400, "Invalid JSON.") };
  }
}

export function serverError(error: unknown) {
  console.error("engagement route failed", error);
  return errorResponse(500, "Something went wrong. Please try again.");
}
