/*
 * POST /api/blog/[slug]/like
 * Toggles this visitor's like and returns the new count and state.
 */

import {
  guard,
  jsonResponse,
  type SlugContext,
  serverError,
  visitorId,
} from "@/lib/engagement/request";
import { toggleLike } from "@/lib/engagement/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: SlugContext) {
  const { slug } = await params;
  const blocked = guard(slug);
  if (blocked) return blocked;

  try {
    return jsonResponse(await toggleLike(slug, visitorId(request)));
  } catch (error) {
    return serverError(error);
  }
}
