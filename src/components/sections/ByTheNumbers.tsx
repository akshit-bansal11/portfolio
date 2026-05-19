"use client";

import { animate, createScope } from "animejs";
import { useEffect, useRef, useState } from "react";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/common/sections/ScrollSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
	id: string;
	value: number;
	suffix: string;
	label: string;
	sublabel: string;
	accentClass: string;
	glowClass: string;
}

// ─── Animated counter ─────────────────────────────────────────────────────────

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
	const spanRef = useRef<HTMLSpanElement>(null);
	const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

	useEffect(() => {
		if (!triggered || !spanRef.current) return;

		const obj = { val: 0 };
		scopeRef.current = createScope({ root: spanRef });

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

// ─── Stat card ────────────────────────────────────────────────────────────────

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

			<div className="flex flex-col gap-0.5">
				<span className="text-white text-sm md:text-base font-semibold leading-tight">
					{card.label}
				</span>
				<span className="text-neutral-500 text-xs md:text-sm leading-snug">{card.sublabel}</span>
			</div>
		</div>
	);
}

// ─── Main section ─────────────────────────────────────────────────────────────

// ↓ Update these manually as time passes
const YEARS_PROFESSIONAL = 1.4; // Jan 2026 – present
const YEARS_BUILDING = 5; // June 2024 – present

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

export default function ByTheNumbers() {
	const [triggered, setTriggered] = useState(false);
	const [stats, setStats] = useState<StatCard[]>([]);
	const sectionRef = useRef<HTMLElement>(null);

	// Compute time-based stats on mount
	useEffect(() => {
		// These will be replaced by live GitHub data if the API succeeds
		const placeholders: Record<string, number> = {
			commits: 0,
			repos: 0,
			professional: YEARS_PROFESSIONAL,
			building: YEARS_BUILDING,
		};

		// Fetch live GitHub stats
		fetch("/api/github-stats")
			.then((r) => r.json())
			.then((data: { publicRepos: number; totalCommits: number }) => {
				placeholders.commits = data.totalCommits;
				placeholders.repos = data.publicRepos;
				setStats(BASE_STATS.map((s) => ({ ...s, value: placeholders[s.id] ?? 0 })));
			})
			.catch(() => {
				setStats(BASE_STATS.map((s) => ({ ...s, value: placeholders[s.id] ?? 0 })));
			});
	}, []);

	// Trigger counter animation when section scrolls into view
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
			<div className="flex w-full gap-2 items-baseline mb-4 md:mb-6">
				<ScrollSectionHeading heading="by the numbers" />
			</div>

			<section ref={sectionRef} className="w-full">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
					{stats.length > 0
						? stats.map((card) => <StatCard key={card.id} card={card} triggered={triggered} />)
						: // Skeleton while stats load
							Array.from({ length: 4 }).map((_, i) => (
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
