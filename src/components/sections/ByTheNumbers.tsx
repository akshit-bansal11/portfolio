/*
 * ByTheNumbers.tsx
 * "By The Numbers" stats section.
 * Fetches live GitHub stats via the api lib, combines them
 * with hardcoded years values, and animates each card's
 * value with a number counter on scroll-in.
 *
 * Includes GitHub contribution calendar and LeetCode embeds
 * (solved tracker + submission calendar) below the stat cards.
 */

"use client";

import { animate, createScope } from "animejs";
import { useEffect, useRef, useState } from "react";
import GitHubContributionCalendar from "@/components/cards/GitHubContributionCalendar";
import LeetCodeSolvedTracker from "@/components/cards/LeetCodeSolvedTracker";
import LeetCodeSubmissionCalendar from "@/components/cards/LeetCodeSubmissionCalendar";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import { fetchGitHubStats } from "@/lib/api/github";
import { cn } from "@/lib/utils";

// Shape of a single stat card displayed in the section.
interface StatCardData {
	id: string;
	value: number;
	suffix: string;
	label: string;
	sublabel: string;
	accentClass: string;
	glowClass: string;
}

// Animated number counter using anime.js, scoped to a single span.
function CounterValue({
	target,
	suffix,
	triggered,
	accentClass,
}: {
	target: number;
	suffix: string;
	triggered: boolean;
	accentClass: string;
}) {
	// Ref to the inner span the counter writes into.
	const spanRef = useRef<HTMLSpanElement>(null);
	const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

	useEffect(() => {
		// Wait for the trigger flag before kicking off the count-up.
		if (!triggered || !spanRef.current) return;

		const obj = { val: 0 };
		scopeRef.current = createScope({ root: spanRef });

		// Animate val 0 → target and write each frame as a localized number.
		animate(obj, {
			val: [0, target],
			duration: 1800,
			easing: "easeOutExpo",
			onUpdate: () => {
				if (spanRef.current) {
					spanRef.current.textContent = Math.round(obj.val).toLocaleString();
				}
			},
		});

		return () => {
			scopeRef.current?.revert();
		};
	}, [triggered, target]);

	return (
		<span
			className={cn(
				"font-clash font-extrabold",
				/* Mobile: smaller pill text | Tablet: medium | Desktop: large */
				"text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
				accentClass,
			)}
		>
			<span ref={spanRef}>0</span>
			{suffix}
		</span>
	);
}

// One stat card with responsive pill (mobile) / card (tablet+) layout.
function StatCard({ card, triggered }: { card: StatCardData; triggered: boolean }) {
	return (
		<div
			className={cn(
				/* Shared styles */
				"bg-neutral-900/60 backdrop-blur-sm border border-neutral-800",
				"transition-all duration-300 hover:bg-neutral-900/80 hover:border-neutral-600",
				"shadow-lg shadow-black/30 hover:shadow-xl",

				/* Mobile: horizontal pill layout */
				"flex flex-row items-center gap-3 px-4 py-3 rounded-xl",

				/* Tablet+: vertical card layout */
				"sm:flex-col sm:items-start sm:gap-3 sm:p-4 sm:rounded-2xl",

				/* Desktop: generous padding */
				"lg:p-6",
			)}
		>
			<CounterValue
				target={card.value}
				suffix={card.suffix}
				triggered={triggered}
				accentClass={card.accentClass}
			/>

			{/* Card label + descriptive sublabel. */}
			<div className="flex flex-col gap-0.5 min-w-0">
				<span className="text-white text-xs sm:text-sm md:text-base font-semibold leading-tight truncate">
					{card.label}
				</span>
				<span className="text-neutral-500 text-[10px] sm:text-xs md:text-sm leading-snug truncate">
					{card.sublabel}
				</span>
			</div>
		</div>
	);
}

// Hardcoded years values — bump manually as time passes.
const YEARS_PROFESSIONAL = 1.4; // Jan 2026 – present
const YEARS_BUILDING = 5; // June 2024 – present

// Card definitions sans the live `value` (filled in at runtime).
const BASE_STATS: Omit<StatCardData, "value">[] = [
	{
		id: "commits",
		suffix: "+",
		label: "Total Commits",
		sublabel: "Across all public repositories",
		accentClass: "bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent",
		glowClass: "shadow-indigo-500/20",
	},
	{
		id: "repos",
		suffix: "+",
		label: "Public Repos",
		sublabel: "Projects shipped on GitHub",
		accentClass: "bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent",
		glowClass: "shadow-amber-500/20",
	},
	{
		id: "professional",
		suffix: " y",
		label: "Professional Experience",
		sublabel: "Years of internship & training",
		accentClass: "bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent",
		glowClass: "shadow-rose-500/20",
	},
	{
		id: "building",
		suffix: " y",
		label: "Years Building",
		sublabel: "Since writing my first serious line",
		accentClass: "bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent",
		glowClass: "shadow-emerald-500/20",
	},
];

// Top-level section component.
export default function ByTheNumbers() {
	// Whether the counters should start animating.
	const [triggered, setTriggered] = useState(false);
	// Live stat list once values have been resolved.
	const [stats, setStats] = useState<StatCardData[]>([]);
	const sectionRef = useRef<HTMLElement>(null);

	// Resolve initial stat values: GitHub data + static years.
	useEffect(() => {
		// Default values used until the GitHub fetch resolves (or fails).
		const placeholders: Record<string, number> = {
			commits: 0,
			repos: 0,
			professional: YEARS_PROFESSIONAL,
			building: YEARS_BUILDING,
		};

		// Fetch live stats from the API lib; merge into the card list.
		fetchGitHubStats()
			.then((data) => {
				placeholders.commits = data.totalCommits;
				placeholders.repos = data.publicRepos;
				setStats(BASE_STATS.map((s) => ({ ...s, value: placeholders[s.id] ?? 0 })));
			})
			.catch(() => {
				setStats(BASE_STATS.map((s) => ({ ...s, value: placeholders[s.id] ?? 0 })));
			});
	}, []);

	// Trigger the counter animation once the section enters the viewport.
	useEffect(() => {
		if (stats.length === 0) return;
		const el = sectionRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setTriggered(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.25 },
		);
		observer.observe(el);

		return () => observer.disconnect();
	}, [stats]);

	return (
		<ScrollSection id="by-the-numbers">
			{/* Section heading row. */}
			<div className="flex w-full gap-2 items-baseline mb-4 md:mb-6">
				<ScrollSectionHeading heading="by the numbers" />
			</div>

			{/* Card grid (or skeleton placeholders while stats are loading). */}
			<section ref={sectionRef} className="w-full space-y-4 md:space-y-6">
				{/* Stat cards — responsive grid */}
				<div
					className={cn(
						"grid gap-2",
						/* Mobile: 2-col pill grid */
						"grid-cols-2",
						/* Tablet: 2-col compact cards */
						"sm:gap-3",
						/* Desktop: 4-col full cards */
						"lg:grid-cols-4 lg:gap-4",
					)}
				>
					{stats.length > 0
						? stats.map((card) => <StatCard key={card.id} card={card} triggered={triggered} />)
						: Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className={cn(
										"rounded-xl sm:rounded-2xl bg-neutral-900/40 border border-neutral-800 animate-pulse",
										"h-16 sm:h-28 lg:h-36",
									)}
								/>
							))}
				</div>

				{/* Embeds:
				  • sm  (< 768px):  3 separate rows
				  • md  (768–1024): GitHub | LeetCode-solved+calendar (2 rows)
				  • lg+ (≥ 1024px): all 3 on one row, equal height
				*/}

				{/* lg+: single row of 3 equal-height columns */}
				<div className="hidden lg:grid lg:grid-cols-[1fr_200px_1fr] lg:gap-4 lg:items-stretch">
					<GitHubContributionCalendar className="h-full" />
					<LeetCodeSolvedTracker className="h-full" />
					<LeetCodeSubmissionCalendar className="h-full" />
				</div>

				{/* md: GitHub full width, then solved + submission side by side */}
				<div className="hidden md:flex lg:hidden flex-col gap-3">
					<GitHubContributionCalendar />
					<div className="grid grid-cols-[240px_1fr] gap-3 items-stretch">
						<LeetCodeSolvedTracker className="h-full" />
						<LeetCodeSubmissionCalendar className="h-full" />
					</div>
				</div>

				{/* sm/mobile: all three stacked */}
				<div className="flex md:hidden flex-col gap-3">
					<GitHubContributionCalendar />
					<LeetCodeSolvedTracker />
					<LeetCodeSubmissionCalendar />
				</div>
			</section>
		</ScrollSection>
	);
}
