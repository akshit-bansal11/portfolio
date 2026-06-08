/*
 * LeetCodeSubmissionCalendar.tsx
 * Renders the LeetCode submission calendar heatmap,
 * wrapping the shared ActivityHeatmap with an amber/orange color scale.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import ActivityHeatmap from "@/components/cards/ActivityHeatmap";
import { fetchLeetCodeCalendar } from "@/lib/api/leetcode";
import { cn } from "@/lib/utils";
import type { LeetCodeCalendar } from "@/types/coding-stats";

// LeetCode's amber/orange contribution color scale.
const LEETCODE_COLOR_SCALE: [string, string, string, string, string] = [
	"#161b22", // 0 submissions
	"#5a3e00", // low
	"#8a6100", // medium-low
	"#c48b00", // medium-high
	"#fbbf24", // high
];

interface LeetCodeSubmissionCalendarProps {
	className?: string;
}

export default function LeetCodeSubmissionCalendar({ className }: LeetCodeSubmissionCalendarProps) {
	const currentYear = new Date().getFullYear();
	const [calendar, setCalendar] = useState<LeetCodeCalendar | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		fetchLeetCodeCalendar()
			.then((data) => {
				if (!cancelled) {
					setCalendar(data);
					setLoading(false);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setCalendar(null);
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	// Parse the submissionCalendar JSON string (timestamp→count)
	// into a date-string → count map for the current year.
	const heatmapData = useMemo(() => {
		if (!calendar?.submissionCalendar) return {};

		let parsed: Record<string, number>;
		try {
			parsed = JSON.parse(calendar.submissionCalendar) as Record<string, number>;
		} catch {
			return {};
		}

		const map: Record<string, number> = {};
		for (const [timestamp, count] of Object.entries(parsed)) {
			const date = new Date(Number(timestamp) * 1000);
			if (date.getFullYear() === currentYear) {
				const dateStr = date.toISOString().split("T")[0];
				map[dateStr] = (map[dateStr] ?? 0) + count;
			}
		}
		return map;
	}, [calendar, currentYear]);

	// Count total submissions for the current year.
	const totalSubmissions = useMemo(() => {
		return Object.values(heatmapData).reduce((sum, count) => sum + count, 0);
	}, [heatmapData]);

	return (
		<div
			className={cn(
				"flex flex-col rounded-2xl bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 p-4 md:p-5",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-1.5 md:gap-2">
					<svg
						className="w-3 h-3 md:w-4 md:h-4 text-amber-400"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.602.498a1.38 1.38 0 0 0 1.955-.06c.53-.544.511-1.416-.042-1.942l-.601-.498a5.25 5.25 0 0 0-2.79-1.169 5.11 5.11 0 0 0-.317-.033L16.436 0h-2.953Z" />
					</svg>
					<h3 className="text-xs md:text-sm font-semibold text-white">LeetCode Submissions</h3>
				</div>
				<div className="flex items-center gap-2 md:gap-3">
					{calendar && (
						<>
							<span className="text-[10px] md:text-xs text-neutral-500">🔥 {calendar.streak}d</span>
							<span className="hidden sm:inline text-[10px] md:text-xs text-neutral-500">
								{totalSubmissions.toLocaleString()} in {currentYear}
							</span>
						</>
					)}
				</div>
			</div>

			{/* Heatmap body — zoomed down on mobile to fit viewport, natural size on md+. */}
			{loading ? (
				<div className="rounded-lg bg-neutral-900/40 animate-pulse min-h-[120px] md:flex-1" />
			) : (
				<div className="flex justify-center md:block md:flex-1 md:flex md:items-center md:justify-center">
					<div className="[zoom:0.55] xs:[zoom:0.65] sm:[zoom:0.75] md:[zoom:1]">
						<ActivityHeatmap
							data={heatmapData}
							colorScale={LEETCODE_COLOR_SCALE}
							year={currentYear}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
