/*
 * coding-stats.ts
 * Type definitions for GitHub contribution data and
 * LeetCode solved / submission calendar stats.
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

// LeetCode solved-problems breakdown returned by alfa-leetcode-api /:username/solved.
export interface LeetCodeSolved {
	solvedProblem: number;
	easySolved: number;
	mediumSolved: number;
	hardSolved: number;
	totalSubmissionNum: LeetCodeSubmissionCount[];
	acSubmissionNum: LeetCodeSubmissionCount[];
}

// Individual difficulty-level submission count.
export interface LeetCodeSubmissionCount {
	difficulty: string;
	count: number;
	submissions: number;
}

// LeetCode submission calendar returned by alfa-leetcode-api /:username/calendar.
export interface LeetCodeCalendar {
	submissionCalendar: string;
	totalActiveDays: number;
	streak: number;
}
