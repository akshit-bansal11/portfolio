/*
 * GET /api/blog/[slug]/engagement
 * Like count, whether this visitor liked, and the visible comments, in one D1 call.
 * Reads fail soft: a D1 outage returns an empty, unliked state.
 */

import { type SlugContext, guard, jsonResponse, visitorId } from "@/lib/engagement/request";
import { getEngagement } from "@/lib/engagement/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: SlugContext) {
  const { slug } = await params;
  const blocked = guard(slug);
  if (blocked) return blocked;

  try {
    return jsonResponse(await getEngagement(slug, visitorId(request)));
  } catch (error) {
    console.error("engagement read failed", error);
    return jsonResponse({ likes: 0, liked: false, comments: [] });
  }
}
