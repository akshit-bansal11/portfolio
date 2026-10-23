/*
 * github.ts
 * Client-side API helpers for fetching GitHub stats from
 * the internal /api/github-stats route. All component fetch
 * calls go through these functions instead of raw fetch().
 * Responses are narrowed with type guards; a failed request or an unexpected shape
 * yields empty values so the UI shows an empty state instead of crashing.
 */

import type { ContributionWeek, GitHubContributions } from "@/types/coding-stats";

export interface GitHubStats {
  publicRepos: number;
  totalCommits: number;
}

const EMPTY_STATS: GitHubStats = { publicRepos: 0, totalCommits: 0 };
const EMPTY_CONTRIBUTIONS: GitHubContributions = { totalContributions: 0, weeks: [] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGitHubStats(value: unknown): value is GitHubStats {
  return (
    isRecord(value) &&
    typeof value.publicRepos === "number" &&
    typeof value.totalCommits === "number"
  );
}

function isContributionWeek(value: unknown): value is ContributionWeek {
  return (
    isRecord(value) &&
    Array.isArray(value.contributionDays) &&
    value.contributionDays.every(
      (day: unknown) =>
        isRecord(day) && typeof day.date === "string" && typeof day.contributionCount === "number",
    )
  );
}

function isGitHubContributions(value: unknown): value is GitHubContributions {
  return (
    isRecord(value) &&
    typeof value.totalContributions === "number" &&
    Array.isArray(value.weeks) &&
    value.weeks.every(isContributionWeek)
  );
}

// GET a JSON body and narrow it with the guard; fall back on any failure.
async function fetchGuarded<T>(
  url: string,
  guard: (value: unknown) => value is T,
  fallback: T,
): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const body: unknown = await res.json();
    return guard(body) ? body : fallback;
  } catch {
    return fallback;
  }
}

// Fetch GitHub stats from the internal API route.
export function fetchGitHubStats(): Promise<GitHubStats> {
  return fetchGuarded("/api/github-stats", isGitHubStats, EMPTY_STATS);
}

// Fetch the GitHub contribution calendar for a given year.
export function fetchGitHubContributions(year: number): Promise<GitHubContributions> {
  return fetchGuarded(
    `/api/github-stats?contributions=true&year=${year}`,
    isGitHubContributions,
    EMPTY_CONTRIBUTIONS,
  );
}
