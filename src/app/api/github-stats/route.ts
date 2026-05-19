import { NextResponse } from "next/server";

const GITHUB_USERNAME = "akshit-bansal11";

export const revalidate = 3600;

const GQL_CONTRIBUTIONS = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
      }
    }
  }
`;

export async function GET() {
	try {
		const token = process.env.GITHUB_TOKEN;

		const restHeaders: HeadersInit = {
			"User-Agent": "portfolio-app",
			Accept: "application/vnd.github.v3+json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		};

		// ── Public repos count ──────────────────────────────────────────────
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
			const accountCreatedYear = new Date(user.created_at as string).getFullYear();
			const currentYear = new Date().getFullYear();

			for (let year = accountCreatedYear; year <= currentYear; year++) {
				const from = `${year}-01-01T00:00:00Z`;
				const to = year === currentYear ? new Date().toISOString() : `${year}-12-31T23:59:59Z`;

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
		console.error("[github-stats]", err);
		return NextResponse.json({ publicRepos: 0, totalCommits: 0 });
	}
}
