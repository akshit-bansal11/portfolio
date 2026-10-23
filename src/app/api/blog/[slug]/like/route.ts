/*
 * POST /api/blog/[slug]/like
 * Toggles this visitor's like and returns the new count and state.
 */

import {
  checkOrigin,
  errorResponse,
  guard,
  jsonResponse,
  NO_VISITOR_MESSAGE,
  type SlugContext,
  serverError,
  visitorId,
} from "@/lib/engagement/request";
import { toggleLike } from "@/lib/engagement/store";

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

  try {
    return jsonResponse(await toggleLike(slug, visitor));
  } catch (error) {
    return serverError(error);
  }
}
