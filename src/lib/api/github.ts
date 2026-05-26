/*
 * github.ts
 * Client-side API helper for fetching GitHub stats from
 * the internal /api/github-stats route. All component fetch
 * calls go through this function instead of raw fetch().
 */

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
