/*
 * POST /api/blog/[slug]/comments
 * Validates and stores a comment. A filled honeypot is answered as a
 * success but stores nothing. Limited to 3 comments per visitor per 10 minutes.
 */

import {
  type SlugContext,
  errorResponse,
  guard,
  jsonResponse,
  readJson,
  serverError,
  visitorId,
} from "@/lib/engagement/request";
import { addComment, retryAfterSeconds } from "@/lib/engagement/store";
import { validateComment } from "@/lib/engagement/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: SlugContext) {
  const { slug } = await params;
  const blocked = guard(slug);
  if (blocked) return blocked;

  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const result = validateComment(parsed.data);
  if (!result.ok) return errorResponse(400, "Please fix the highlighted fields.", result.fields);
  if (result.honeypot) {
    return jsonResponse(
      { comment: { id: 0, name: null, body: "", createdAt: Date.now() } },
      201,
    );
  }

  try {
    const visitor = visitorId(request);
    const retryAfter = await retryAfterSeconds(visitor);
    if (retryAfter > 0) {
      const response = errorResponse(
        429,
        "You are commenting a little fast. Please try again in a few minutes.",
      );
      response.headers.set("Retry-After", String(retryAfter));
      return response;
    }
    const { name, email, body } = result.value;
    return jsonResponse({ comment: await addComment(slug, visitor, { name, email, body }) }, 201);
  } catch (error) {
    return serverError(error);
  }
}
