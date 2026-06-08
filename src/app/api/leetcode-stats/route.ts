/*
 * route.ts
 * GET /api/leetcode-stats — proxies the alfa-leetcode-api
 * to fetch LeetCode user stats server-side, avoiding
 * CORS issues and providing caching.
 *
 * Query params:
 *   ?type=solved   → solved-problem counts by difficulty
 *   ?type=calendar → submission calendar heatmap data
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// LeetCode username to fetch stats for.
const LEETCODE_USERNAME = "akshit-bansal11";

// Community REST API base URL.
const API_BASE = "https://alfa-leetcode-api.onrender.com";

// ISR revalidation window (1 hour).
export const revalidate = 3600;

export async function GET(request: NextRequest) {
	try {
		const type = request.nextUrl.searchParams.get("type") ?? "solved";

		const endpoint =
			type === "calendar"
				? `${API_BASE}/${LEETCODE_USERNAME}/calendar`
				: `${API_BASE}/${LEETCODE_USERNAME}/solved`;

		const res = await fetch(endpoint, {
			headers: {
				"User-Agent": "portfolio-app",
				Accept: "application/json",
			},
			next: { revalidate: 3600 },
		});

		if (!res.ok) {
			console.error(`[leetcode-stats] Upstream error: ${res.status}`);
			return NextResponse.json(getEmptyResponse(type), { status: 200 });
		}

		const data: unknown = await res.json();
		return NextResponse.json(data);
	} catch (err) {
		console.error("[leetcode-stats]", err);
		const type = request.nextUrl.searchParams.get("type") ?? "solved";
		return NextResponse.json(getEmptyResponse(type));
	}
}

// Graceful fallback shape when the upstream API fails.
function getEmptyResponse(type: string): Record<string, unknown> {
	if (type === "calendar") {
		return { submissionCalendar: "{}", totalActiveDays: 0, streak: 0 };
	}
	return {
		solvedProblem: 0,
		easySolved: 0,
		mediumSolved: 0,
		hardSolved: 0,
		totalSubmissionNum: [],
		acSubmissionNum: [],
	};
}
