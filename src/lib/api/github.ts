/*
 * github.ts
 * Client-side API helpers for fetching GitHub stats from
 * the internal /api/github-stats route. All component fetch
 * calls go through these functions instead of raw fetch().
 */

import type { GitHubContributions } from "@/types/coding-stats";

export interface GitHubStats {
	publicRepos: number;
	totalCommits: number;
}

// Fetch GitHub stats from the internal API route.
// Returns zeros on failure so the UI degrades gracefully.
export async function fetchGitHubStats(): Promise<GitHubStats> {
	const res = await fetch("/api/github-stats");
	if (!res.ok) return { publicRepos: 0, totalCommits: 0 };
	return res.json() as Promise<GitHubStats>;
}

// Fetch the GitHub contribution calendar for a given year.
// Returns empty data on failure so the UI degrades gracefully.
export async function fetchGitHubContributions(year: number): Promise<GitHubContributions> {
	const res = await fetch(`/api/github-stats?contributions=true&year=${year}`);
	if (!res.ok) return { totalContributions: 0, weeks: [] };
	return res.json() as Promise<GitHubContributions>;
}
