/*
 * GET /api/blog/[slug]/engagement
 * Like count, whether this visitor liked, and the visible comments.
 * Reads fail soft: a D1 outage returns an empty, unliked state.
 */

import { type SlugContext, guard, jsonResponse, visitorId } from "@/lib/engagement/request";
import { countLikes, hasLiked, listComments } from "@/lib/engagement/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: SlugContext) {
  const { slug } = await params;
  const blocked = guard(slug);
  if (blocked) return blocked;

  try {
    const visitor = visitorId(request);
    const [likes, liked, comments] = await Promise.all([
      countLikes(slug),
      hasLiked(slug, visitor),
      listComments(slug),
    ]);
    return jsonResponse({ likes, liked, comments });
  } catch (error) {
    console.error("engagement read failed", error);
    return jsonResponse({ likes: 0, liked: false, comments: [] });
  }
}
