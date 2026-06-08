/*
 * GitHubContributionCalendar.tsx
 * Renders the GitHub contribution heatmap for the current year,
 * wrapping the shared ActivityHeatmap with GitHub's green color scale.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import ActivityHeatmap from "@/components/cards/ActivityHeatmap";
import { fetchGitHubContributions } from "@/lib/api/github";
import { cn } from "@/lib/utils";
import type { GitHubContributions } from "@/types/coding-stats";

// GitHub's classic green contribution color scale.
const GITHUB_COLOR_SCALE: [string, string, string, string, string] = [
	"#161b22", // 0 contributions
	"#0e4429", // low
	"#006d32", // medium-low
	"#26a641", // medium-high
	"#39d353", // high
];

interface GitHubContributionCalendarProps {
	className?: string;
}

export default function GitHubContributionCalendar({ className }: GitHubContributionCalendarProps) {
	const currentYear = new Date().getFullYear();
	const [year] = useState(currentYear);
	const [contributions, setContributions] = useState<GitHubContributions | null>(null);
	const [loading, setLoading] = useState(true);

	// Adjust state when year changes to trigger loading UI
	const [prevYear, setPrevYear] = useState(year);
	if (year !== prevYear) {
		setPrevYear(year);
		setLoading(true);
		setContributions(null);
	}

	useEffect(() => {
		let cancelled = false;

		fetchGitHubContributions(year)
			.then((data) => {
				if (!cancelled) {
					setContributions(data);
					setLoading(false);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setContributions(null);
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [year]);

	// Transform the API's weeks/days structure into a flat date→count map.
	const heatmapData = useMemo(() => {
		if (!contributions?.weeks) return {};
		const map: Record<string, number> = {};
		for (const week of contributions.weeks) {
			for (const day of week.contributionDays) {
				map[day.date] = day.contributionCount;
			}
		}
		return map;
	}, [contributions]);

	return (
		<div
			className={cn(
				"rounded-2xl bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 p-4 md:p-5",
				"md:flex md:flex-col",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-1.5 md:gap-2">
					<svg
						className="w-3 h-3 md:w-4 md:h-4 text-neutral-400"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943" />
					</svg>
					<h3 className="text-xs md:text-sm font-semibold text-white">GitHub Contributions</h3>
				</div>
				{contributions && (
					<span className="text-[10px] md:text-xs text-neutral-500">
						{contributions.totalContributions.toLocaleString()} in {year}
					</span>
				)}
			</div>

			{/* Heatmap body — zoomed down on mobile to fit viewport, natural size on md+. */}
			{loading ? (
				<div className="rounded-lg bg-neutral-900/40 animate-pulse min-h-[120px] md:flex-1" />
			) : (
				<div className="flex justify-center md:block md:flex-1 md:flex md:items-center md:justify-center">
					<div className="[zoom:0.55] xs:[zoom:0.65] sm:[zoom:0.75] md:[zoom:1]">
						<ActivityHeatmap data={heatmapData} colorScale={GITHUB_COLOR_SCALE} year={year} />
					</div>
				</div>
			)}
		</div>
	);
}
