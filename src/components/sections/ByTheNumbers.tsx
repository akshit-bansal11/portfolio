/*
 * ByTheNumbers.tsx
 * "By The Numbers" stats section.
 * Fetches live GitHub stats via the api lib, combines them
 * with hardcoded years values, and animates each card's
 * value with a number counter on scroll-in.
 */

"use client";

import { animate, createScope } from "animejs";
import { useEffect, useRef, useState } from "react";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import { fetchGitHubStats } from "@/lib/api/github";

// Shape of a single stat card displayed in the section.
interface StatCard {
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
		<span className={`font-clash text-4xl md:text-5xl lg:text-6xl font-extrabold ${accentClass}`}>
			<span ref={spanRef}>0</span>
			{suffix}
		</span>
	);
}

// One stat card, including the counter and label rows.
function StatCard({ card, triggered }: { card: StatCard; triggered: boolean }) {
	return (
		<div
			className={[
				"flex flex-col items-start gap-3 p-5 md:p-7 rounded-2xl",
				"bg-neutral-900/60 backdrop-blur-sm",
				"border border-neutral-800",
				`hover:${card.glowClass}`,
				"transition-all duration-300 hover:bg-neutral-900/80 hover:border-neutral-600",
				"shadow-lg shadow-black/30 hover:shadow-xl",
				"flex-1 min-w-[160px]",
			].join(" ")}
		>
			<CounterValue
				target={card.value}
				suffix={card.suffix}
				triggered={triggered}
				accentClass={card.accentClass}
			/>

			{/* Card label + descriptive sublabel. */}
			<div className="flex flex-col gap-0.5">
				<span className="text-white text-sm md:text-base font-semibold leading-tight">
					{card.label}
				</span>
				<span className="text-neutral-500 text-xs md:text-sm leading-snug">{card.sublabel}</span>
			</div>
		</div>
	);
}

// Hardcoded years values — bump manually as time passes.
const YEARS_PROFESSIONAL = 1.4; // Jan 2026 – present
const YEARS_BUILDING = 5; // June 2024 – present

// Card definitions sans the live `value` (filled in at runtime).
const BASE_STATS: Omit<StatCard, "value">[] = [
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
	const [stats, setStats] = useState<StatCard[]>([]);
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
			<section ref={sectionRef} className="w-full">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
					{stats.length > 0
						? stats.map((card) => <StatCard key={card.id} card={card} triggered={triggered} />)
						: Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="rounded-2xl bg-neutral-900/40 border border-neutral-800 h-36 animate-pulse flex-1 min-w-[160px]"
								/>
							))}
				</div>
			</section>
		</ScrollSection>
	);
}
