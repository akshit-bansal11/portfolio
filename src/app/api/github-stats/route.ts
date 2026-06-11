/*
 * route.ts
 * GET /api/github-stats — returns the user's public repo
 * count and total commit contributions across all years.
 * Uses GraphQL when a token is available; otherwise falls
 * back to the public search API. Cached for 1 hour.
 *
 * Modes:
 *   Default         → { publicRepos, totalCommits }
 *   ?contributions=true&year=2026 → contribution calendar data
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GitHub login whose stats power the "By The Numbers" section.
const GITHUB_USERNAME = "akshit-bansal11";

// ISR revalidation window for this route (in seconds).
export const revalidate = 3600;

// GraphQL query: total commits across a year-bounded contribution window.
const GQL_CONTRIBUTIONS = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
      }
    }
  }
`;

// GraphQL query: full contribution calendar with daily counts.
const GQL_CONTRIBUTION_CALENDAR = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

// Route handler: aggregate public repos + total commits and return JSON.
export async function GET(request: NextRequest) {
	try {
		// Optional GitHub token unlocks the GraphQL contributions API.
		const token = process.env.GITHUB_TOKEN;

		// Check if this is a contribution calendar request.
		const wantsContributions = request.nextUrl.searchParams.get("contributions") === "true";

		if (wantsContributions && token) {
			return handleContributionCalendar(request, token);
		}

		// Headers used for plain REST calls (with optional auth).
		const restHeaders: HeadersInit = {
			"User-Agent": "portfolio-app",
			Accept: "application/vnd.github.v3+json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		};

		// ── Account info (used for creation date) ───────────────────────────
		// Hit the user endpoint to read the account creation date.
		const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
			headers: restHeaders,
			next: { revalidate: 3600 },
		});

		if (!userRes.ok) throw new Error(`GitHub user fetch failed: ${userRes.status}`);

		const user = await userRes.json();

		// ── Public repos count ──────────────────────────────────────────────
		// user.public_repos also counts forks, so it over-reports (e.g. 29 vs 11).
		// Instead, page through the repos list and count only owned source repos
		// (excluding forks). Archived repos are still counted as "shipped".
		const publicRepos = await countPublicSourceRepos(restHeaders);

		// ── Total commits across all years via GraphQL ──────────────────────
		// GraphQL requires a token; fall back to search API if none is set.
		let totalCommits = 0;

		if (token) {
			// Walk every year from account creation to today, summing contributions.
			const accountCreatedYear = new Date(user.created_at as string).getFullYear();
			const currentYear = new Date().getFullYear();

			for (let year = accountCreatedYear; year <= currentYear; year++) {
				const from = `${year}-01-01T00:00:00Z`;
				const to = year === currentYear ? new Date().toISOString() : `${year}-12-31T23:59:59Z`;

				// Per-year GraphQL request asking for totalCommitContributions.
				const gqlRes = await fetch("https://api.github.com/graphql", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
						"User-Agent": "portfolio-app",
					},
					body: JSON.stringify({
						query: GQL_CONTRIBUTIONS,
						variables: { login: GITHUB_USERNAME, from, to },
					}),
					next: { revalidate: 3600 },
				});

				if (gqlRes.ok) {
					const gqlData = await gqlRes.json();
					totalCommits +=
						(gqlData.data?.user?.contributionsCollection?.totalCommitContributions as number) ?? 0;
				}
			}
		} else {
			// No token — fall back to search API (recent commits only)
			const commitRes = await fetch(
				`https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}&per_page=1`,
				{
					headers: {
						...restHeaders,
						Accept: "application/vnd.github.cloak-preview+json",
					},
					next: { revalidate: 3600 },
				},
			);
			if (commitRes.ok) {
				const data = await commitRes.json();
				totalCommits = (data.total_count as number) ?? 0;
			}
		}

		return NextResponse.json({ publicRepos, totalCommits });
	} catch (err) {
		// Any failure returns zeros so the UI degrades gracefully.
		console.error("[github-stats]", err);
		return NextResponse.json({ publicRepos: 0, totalCommits: 0 });
	}
}

// Count public, non-fork repos owned by the user by paging the list endpoint.
// GitHub's user.public_repos field includes forks, which over-reports the
// number of repos the user actually authored. We exclude forks here.
async function countPublicSourceRepos(headers: HeadersInit): Promise<number> {
	let count = 0;

	// Page through up to a reasonable cap (100 per page × 10 pages = 1000 repos).
	for (let page = 1; page <= 10; page++) {
		const res = await fetch(
			`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&type=owner`,
			{ headers, next: { revalidate: 3600 } },
		);

		if (!res.ok) break;

		const repos = (await res.json()) as Array<{ fork: boolean }>;
		if (repos.length === 0) break;

		count += repos.filter((repo) => !repo.fork).length;

		// Last page reached when fewer than the page size is returned.
		if (repos.length < 100) break;
	}

	return count;
}

// Handle contribution calendar requests — returns weekly/daily counts for heatmap.
async function handleContributionCalendar(request: NextRequest, token: string) {
	const yearParam = request.nextUrl.searchParams.get("year");
	const year = yearParam ? Number.parseInt(yearParam, 10) : new Date().getFullYear();

	const from = `${year}-01-01T00:00:00Z`;
	const to =
		year === new Date().getFullYear() ? new Date().toISOString() : `${year}-12-31T23:59:59Z`;

	const gqlRes = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"User-Agent": "portfolio-app",
		},
		body: JSON.stringify({
			query: GQL_CONTRIBUTION_CALENDAR,
			variables: { login: GITHUB_USERNAME, from, to },
		}),
		next: { revalidate: 3600 },
	});

	if (!gqlRes.ok) {
		console.error(`[github-stats] Contribution calendar GQL failed: ${gqlRes.status}`);
		return NextResponse.json({ totalContributions: 0, weeks: [] });
	}

	const gqlData = await gqlRes.json();
	const calendar = gqlData.data?.user?.contributionsCollection?.contributionCalendar;

	if (!calendar) {
		return NextResponse.json({ totalContributions: 0, weeks: [] });
	}

	return NextResponse.json(calendar);
}
