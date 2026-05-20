/*
 * route.ts
 * GET /api/github-stats — returns the user's public repo
 * count and total commit contributions across all years.
 * Uses GraphQL when a token is available; otherwise falls
 * back to the public search API. Cached for 1 hour.
 */

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

// Route handler: aggregate public repos + total commits and return JSON.
export async function GET() {
	try {
		// Optional GitHub token unlocks the GraphQL contributions API.
		const token = process.env.GITHUB_TOKEN;

		// Headers used for plain REST calls (with optional auth).
		const restHeaders: HeadersInit = {
			"User-Agent": "portfolio-app",
			Accept: "application/vnd.github.v3+json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		};

		// ── Public repos count ──────────────────────────────────────────────
		// Hit the user endpoint to read public_repos and account creation date.
		const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
			headers: restHeaders,
			next: { revalidate: 3600 },
		});

		if (!userRes.ok) throw new Error(`GitHub user fetch failed: ${userRes.status}`);

		const user = await userRes.json();
		const publicRepos: number = user.public_repos ?? 0;

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
