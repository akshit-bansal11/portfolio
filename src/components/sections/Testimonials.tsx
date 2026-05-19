"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/common/sections/ScrollSection";
import { testimonials } from "@/data/testimonialsData";

// ─── Individual card ─────────────────────────────────────────────────────────

function TestimonialCard({
	name,
	email,
	role,
	company,
	initials,
	accentColor,
	text,
}: (typeof testimonials)[number]) {
	return (
		<div
			className={[
				"shrink-0 w-[300px] md:w-[360px] lg:w-[400px]",
				"flex flex-col gap-4 p-5 md:p-6 rounded-2xl",
				"bg-neutral-900/60 backdrop-blur-sm",
				"border border-neutral-800 hover:border-neutral-600",
				"transition-all duration-300 hover:bg-neutral-900/80",
				"shadow-lg shadow-black/30",
			].join(" ")}
		>
			{/* Quote mark */}
			<span className="text-3xl leading-none text-neutral-600 font-serif select-none">"</span>

			{/* Testimonial text */}
			<p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light flex-1">
				{text}
			</p>

			{/* Author row */}
			<div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
				{/* Avatar */}
				<div
					className={`w-10 h-10 rounded-full ${accentColor} flex items-center justify-center shrink-0`}
				>
					<span className="text-white text-xs font-bold tracking-wide">{initials}</span>
				</div>

				{/* Name / role */}
				<div className="flex flex-col min-w-0">
					<span className="text-white text-sm font-semibold truncate">{name}</span>
					<span className="text-neutral-500 text-xs truncate">
						{role} · {company}
					</span>
					<span className="text-neutral-600 text-[10px] truncate">{email}</span>
				</div>
			</div>
		</div>
	);
}

// ─── Auto-scrolling track ─────────────────────────────────────────────────────

function ScrollTrack({ children }: { children: React.ReactNode }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const animFrameRef = useRef<number | null>(null);
	const speed = 0.5; // px per frame

	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;

		let isPaused = false;

		const onEnter = () => {
			isPaused = true;
		};
		const onLeave = () => {
			isPaused = false;
		};

		el.addEventListener("mouseenter", onEnter);
		el.addEventListener("mouseleave", onLeave);
		el.addEventListener("touchstart", onEnter, { passive: true });
		el.addEventListener("touchend", onLeave);

		const tick = () => {
			if (!isPaused && el) {
				el.scrollLeft += speed;
				// Seamless loop: when we've scrolled past the first half, jump back
				if (el.scrollLeft >= el.scrollWidth / 2) {
					el.scrollLeft = 0;
				}
			}
			animFrameRef.current = requestAnimationFrame(tick);
		};

		animFrameRef.current = requestAnimationFrame(tick);

		return () => {
			if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
			el.removeEventListener("mouseenter", onEnter);
			el.removeEventListener("mouseleave", onLeave);
			el.removeEventListener("touchstart", onEnter);
			el.removeEventListener("touchend", onLeave);
		};
	}, []);

	return (
		<div
			ref={trackRef}
			className="flex gap-4 overflow-x-auto scroll-smooth"
			style={{
				// Hide native scrollbar visually but keep it functional
				scrollbarWidth: "none",
				msOverflowStyle: "none",
			}}
		>
			{children}
		</div>
	);
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function Testimonials() {
	// Duplicate cards for seamless infinite loop
	const doubled = [...testimonials, ...testimonials];

	return (
		<ScrollSection id="testimonials">
			{/* Heading */}
			<div className="flex w-full gap-2 items-baseline mb-4 md:mb-6">
				<ScrollSectionHeading heading="testimonials" />
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true, amount: 0.1 }}
				transition={{ duration: 0.6 }}
				className="relative w-full overflow-hidden"
			>
				{/* Left fade mask */}
				<div className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-28 z-10 bg-linear-to-r from-background to-transparent" />
				{/* Right fade mask */}
				<div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-28 z-10 bg-linear-to-l from-background to-transparent" />

				<ScrollTrack>
					{doubled.map((t, i) => (
						<TestimonialCard key={`${t.id}-${i}`} {...t} />
					))}
				</ScrollTrack>
			</motion.div>
		</ScrollSection>
	);
}
