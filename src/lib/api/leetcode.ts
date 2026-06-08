/*
 * leetcode.ts
 * Client-side API helpers for fetching LeetCode stats from
 * the internal /api/leetcode-stats route. All component fetch
 * calls go through these functions instead of raw fetch().
 */

import type { LeetCodeCalendar, LeetCodeSolved } from "@/types/coding-stats";

// Fetch solved-problem counts broken down by difficulty.
// Returns zeros on failure so the UI degrades gracefully.
export async function fetchLeetCodeSolved(): Promise<LeetCodeSolved> {
	const res = await fetch("/api/leetcode-stats?type=solved");
	if (!res.ok) return getEmptySolved();
	return res.json() as Promise<LeetCodeSolved>;
}

// Fetch the submission calendar heatmap data.
// Returns empty data on failure so the UI degrades gracefully.
export async function fetchLeetCodeCalendar(): Promise<LeetCodeCalendar> {
	const res = await fetch("/api/leetcode-stats?type=calendar");
	if (!res.ok) return { submissionCalendar: "{}", totalActiveDays: 0, streak: 0 };
	return res.json() as Promise<LeetCodeCalendar>;
}

function getEmptySolved(): LeetCodeSolved {
	return {
		solvedProblem: 0,
		easySolved: 0,
		mediumSolved: 0,
		hardSolved: 0,
		totalSubmissionNum: [],
		acSubmissionNum: [],
	};
}
