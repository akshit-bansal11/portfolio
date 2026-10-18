/*
 * coding-stats.ts
 * Type definitions for GitHub contribution data.
 */

// A single day's contribution count from GitHub's contribution calendar.
export interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

// A single week of contribution days from GitHub's calendar.
export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

// The full GitHub contribution calendar for a given year.
export interface GitHubContributions {
  totalContributions: number;
  weeks: ContributionWeek[];
}
