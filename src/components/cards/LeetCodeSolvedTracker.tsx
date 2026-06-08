/*
 * LeetCodeSolvedTracker.tsx
 * Displays LeetCode solved-problems stats with progress bars
 * broken down by difficulty: Easy (green), Medium (amber), Hard (red).
 */

"use client";

import { useEffect, useState } from "react";
import { fetchLeetCodeSolved } from "@/lib/api/leetcode";
import { cn } from "@/lib/utils";
import type { LeetCodeSolved } from "@/types/coding-stats";

// Difficulty config for colors and labels.
const DIFFICULTIES = [
	{
		key: "easy" as const,
		label: "Easy",
		barColor: "bg-emerald-500",
		textColor: "text-emerald-400",
	},
	{
		key: "medium" as const,
		label: "Medium",
		barColor: "bg-amber-500",
		textColor: "text-amber-400",
	},
	{ key: "hard" as const, label: "Hard", barColor: "bg-red-500", textColor: "text-red-400" },
] as const;

// Total questions per difficulty (approximate — LeetCode updates these frequently).
const TOTAL_QUESTIONS: Record<string, number> = {
	easy: 850,
	medium: 1800,
	hard: 800,
};

interface LeetCodeSolvedTrackerProps {
	className?: string;
}

export default function LeetCodeSolvedTracker({ className }: LeetCodeSolvedTrackerProps) {
	const [data, setData] = useState<LeetCodeSolved | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		fetchLeetCodeSolved()
			.then((solved) => {
				if (!cancelled) {
					setData(solved);
					setLoading(false);
				}
			})
			.catch(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	// Extract the total question count from API data if available.
	function getTotalForDifficulty(difficulty: "easy" | "medium" | "hard"): number {
		if (!data?.acSubmissionNum) return TOTAL_QUESTIONS[difficulty];
		// The API returns total available in totalSubmissionNum, but
		// the fallback constant is used if the API doesn't provide totals.
		return TOTAL_QUESTIONS[difficulty];
	}

	function getSolvedForDifficulty(difficulty: "easy" | "medium" | "hard"): number {
		if (!data) return 0;
		if (difficulty === "easy") return data.easySolved;
		if (difficulty === "medium") return data.mediumSolved;
		return data.hardSolved;
	}

	return (
		<div
			className={cn(
				"rounded-2xl bg-neutral-900/60 backdrop-blur-sm border border-neutral-800 p-4 md:p-5",
				"md:flex md:flex-col",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
				<svg
					className="w-3 h-3 md:w-4 md:h-4 text-amber-400"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.602.498a1.38 1.38 0 0 0 1.955-.06c.53-.544.511-1.416-.042-1.942l-.601-.498a5.25 5.25 0 0 0-2.79-1.169 5.11 5.11 0 0 0-.317-.033L16.436 0h-2.953Z" />
				</svg>
				<h3 className="text-xs md:text-sm font-semibold text-white">LeetCode Problems</h3>
			</div>

			{loading ? (
				<div className="space-y-2 md:space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-6 md:h-8 rounded-lg bg-neutral-900/40 animate-pulse" />
					))}
				</div>
			) : (
				<>
					{/* Total solved count */}
					<div className="text-center mb-3 md:mb-4">
						<span className="font-clash text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
							{data?.solvedProblem ?? 0}
						</span>
						<p className="text-[10px] md:text-xs text-neutral-500 mt-0.5">problems solved</p>
					</div>

					{/* Per-difficulty progress bars */}
					<div className="space-y-2 md:space-y-3">
						{DIFFICULTIES.map(({ key, label, barColor, textColor }) => {
							const solved = getSolvedForDifficulty(key);
							const total = getTotalForDifficulty(key);
							const pct = total > 0 ? (solved / total) * 100 : 0;

							return (
								<div key={key}>
									<div className="flex items-center justify-between mb-0.5 md:mb-1">
										<span className={cn("text-[10px] md:text-xs font-medium", textColor)}>
											{label}
										</span>
										<span className="text-[10px] md:text-xs text-neutral-500">
											{solved}/{total}
										</span>
									</div>
									<div className="h-1 md:h-1.5 rounded-full bg-neutral-800 overflow-hidden">
										<div
											className={cn("h-full rounded-full transition-all duration-700", barColor)}
											style={{ width: `${pct}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}
