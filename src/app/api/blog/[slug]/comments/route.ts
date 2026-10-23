/*
 * POST /api/blog/[slug]/comments
 * Validates and stores a comment. A filled honeypot is answered as a
 * success but stores nothing. Limited to 3 comments per visitor per 10 minutes,
 * enforced inside the insert statement itself.
 */

import {
  NO_VISITOR_MESSAGE,
  type SlugContext,
  checkOrigin,
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
  const forbidden = checkOrigin(request);
  if (forbidden) return forbidden;
  const { slug } = await params;
  const blocked = guard(slug);
  if (blocked) return blocked;
  const visitor = visitorId(request);
  if (!visitor) return errorResponse(400, NO_VISITOR_MESSAGE);

  const parsed = await readJson(request);
  if (!parsed.ok) return parsed.response;

  const result = validateComment(parsed.data);
  if (!result.ok) return errorResponse(400, "Please fix the highlighted fields.", result.fields);
  if (result.honeypot) return jsonResponse({ accepted: true }, 201);

  try {
    const { name, email, body } = result.value;
    const comment = await addComment(slug, visitor, { name, email, body });
    if (!comment) {
      const response = errorResponse(
        429,
        "You are commenting a little fast. Please try again in a few minutes.",
      );
      response.headers.set("Retry-After", String(await retryAfterSeconds(visitor)));
      return response;
    }
    return jsonResponse({ comment }, 201);
  } catch (error) {
    return serverError(error);
  }
}
