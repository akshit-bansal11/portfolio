/*
 * ActivityHeatmap.tsx
 * Shared contribution-calendar heatmap component used by
 * both the GitHub and LeetCode calendar embeds.
 * Renders a pure CSS Grid of 53 columns × 7 rows with
 * month labels and day-of-week labels.
 */

"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// Month abbreviations for the top labels.
const MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

// Day-of-week abbreviations shown on the left axis.
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

interface ActivityHeatmapProps {
	/** Map of ISO date string (YYYY-MM-DD) → contribution count. */
	data: Record<string, number>;
	/** Five-color gradient scale from 0 contributions to max. */
	colorScale: [string, string, string, string, string];
	/** The year being displayed. */
	year: number;
	/** Optional extra class name. */
	className?: string;
}

// Build the full grid of days for a given year, starting from Jan 1.
function buildYearGrid(year: number): { date: string; dayOfWeek: number }[][] {
	const weeks: { date: string; dayOfWeek: number }[][] = [];
	const start = new Date(year, 0, 1);
	const end = new Date(year, 11, 31);
	const today = new Date();

	// Pad the first week so it starts on Sunday (dayOfWeek=0).
	let currentWeek: { date: string; dayOfWeek: number }[] = [];
	const startDay = start.getDay();
	for (let i = 0; i < startDay; i++) {
		currentWeek.push({ date: "", dayOfWeek: i });
	}

	const cursor = new Date(start);
	while (cursor <= end && cursor <= today) {
		const dateStr = cursor.toISOString().split("T")[0];
		const dayOfWeek = cursor.getDay();

		currentWeek.push({ date: dateStr, dayOfWeek });

		if (dayOfWeek === 6) {
			weeks.push(currentWeek);
			currentWeek = [];
		}

		cursor.setDate(cursor.getDate() + 1);
	}

	// Push the last partial week if it has days.
	if (currentWeek.length > 0) {
		weeks.push(currentWeek);
	}

	return weeks;
}

// Compute which columns each month label should appear above.
function computeMonthPositions(
	weeks: { date: string; dayOfWeek: number }[][],
): { label: string; col: number }[] {
	const positions: { label: string; col: number }[] = [];
	let lastMonth = -1;

	for (let w = 0; w < weeks.length; w++) {
		for (const day of weeks[w]) {
			if (!day.date) continue;
			const month = new Date(day.date).getMonth();
			if (month !== lastMonth) {
				positions.push({ label: MONTH_LABELS[month], col: w });
				lastMonth = month;
			}
		}
	}

	return positions;
}

export default function ActivityHeatmap({
	data,
	colorScale,
	year,
	className,
}: ActivityHeatmapProps) {
	const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

	const weeks = useMemo(() => buildYearGrid(year), [year]);
	const monthPositions = useMemo(() => computeMonthPositions(weeks), [weeks]);

	// Find the max contribution count for color scaling.
	const maxCount = useMemo(() => {
		const values = Object.values(data);
		if (values.length === 0) return 1;
		return Math.max(...values, 1);
	}, [data]);

	// Map a count to one of the 5 color levels.
	function getColor(count: number): string {
		if (count === 0) return colorScale[0];
		const ratio = count / maxCount;
		if (ratio <= 0.25) return colorScale[1];
		if (ratio <= 0.5) return colorScale[2];
		if (ratio <= 0.75) return colorScale[3];
		return colorScale[4];
	}

	function handleMouseEnter(e: React.MouseEvent, date: string, count: number) {
		const rect = e.currentTarget.getBoundingClientRect();
		const parentRect = e.currentTarget.closest("[data-heatmap-container]")?.getBoundingClientRect();
		if (!parentRect) return;
		setTooltip({
			text: `${count} contribution${count !== 1 ? "s" : ""} on ${date}`,
			x: rect.left - parentRect.left + rect.width / 2,
			y: rect.top - parentRect.top - 8,
		});
	}

	return (
		<div className={cn("relative", className)} data-heatmap-container>
			{/* Month labels */}
			<div
				className="grid gap-[3px] mb-1 ml-8"
				style={{
					gridTemplateColumns: `repeat(${weeks.length}, 11px)`,
				}}
			>
				{Array.from({ length: weeks.length }).map((_, i) => {
					const monthEntry = monthPositions.find((m) => m.col === i);
					return (
						<span key={i} className="text-[10px] text-neutral-500 leading-none whitespace-nowrap">
							{monthEntry?.label ?? ""}
						</span>
					);
				})}
			</div>

			{/* Grid body: day labels + cells */}
			<div className="flex gap-[3px]">
				{/* Day-of-week labels */}
				<div className="flex flex-col gap-[3px] shrink-0">
					{DAY_LABELS.map((label, i) => (
						<span key={i} className="text-[10px] text-neutral-500 h-[11px] w-5 leading-[11px]">
							{label}
						</span>
					))}
				</div>

				{/* Heatmap cells */}
				<div
					className="grid gap-[3px]"
					style={{
						gridTemplateColumns: `repeat(${weeks.length}, 11px)`,
						gridTemplateRows: "repeat(7, 11px)",
						gridAutoFlow: "column",
					}}
				>
					{weeks.map((week, wi) =>
						week.map((day) => {
							if (!day.date) {
								return <div key={`${wi}-empty-${day.dayOfWeek}`} className="w-[11px] h-[11px]" />;
							}
							const count = data[day.date] ?? 0;
							return (
								<div
									key={day.date}
									aria-hidden="true"
									className="w-[11px] h-[11px] rounded-sm cursor-pointer transition-transform hover:scale-125"
									style={{ backgroundColor: getColor(count) }}
									onMouseEnter={(e) => handleMouseEnter(e, day.date, count)}
									onMouseLeave={() => setTooltip(null)}
								/>
							);
						}),
					)}
				</div>
			</div>

			{/* Tooltip */}
			{tooltip && (
				<div
					className="absolute z-50 pointer-events-none px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-xs text-white whitespace-nowrap shadow-lg"
					style={{
						left: tooltip.x,
						top: tooltip.y,
						transform: "translate(-50%, -100%)",
					}}
				>
					{tooltip.text}
				</div>
			)}

			{/* Legend */}
			<div className="flex items-center gap-1.5 mt-2 ml-8">
				<span className="text-[10px] text-neutral-500">Less</span>
				{colorScale.map((color, i) => (
					<div
						key={i}
						className="w-[11px] h-[11px] rounded-sm"
						style={{ backgroundColor: color }}
					/>
				))}
				<span className="text-[10px] text-neutral-500">More</span>
			</div>
		</div>
	);
}
