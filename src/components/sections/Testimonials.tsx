/*
 * Testimonials.tsx
 * Auto-scrolling testimonials section.
 * Renders an infinite horizontal track of testimonial
 * cards that pauses on hover or touch. Uses fade masks
 * on the edges and seamlessly loops via duplicate cards.
 */

"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/common/sections/ScrollSection";
import { testimonials } from "@/data/testimonialsData";

// One testimonial card.
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
			{/* Decorative serif quote mark. */}
			<span className="text-3xl leading-none text-neutral-600 font-serif select-none">&quot;</span>

			{/* Testimonial body text. */}
			<p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light flex-1">
				{text}
			</p>

			{/* Author row: avatar + name/role/email. */}
			<div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
				{/* Initials avatar tinted with the per-author accent color. */}
				<div
					className={`w-10 h-10 rounded-full ${accentColor} flex items-center justify-center shrink-0`}
				>
					<span className="text-white text-xs font-bold tracking-wide">{initials}</span>
				</div>

				{/* Name / role / email column. */}
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

// Auto-scrolling track that pauses on hover/touch and loops seamlessly.
function ScrollTrack({ children }: { children: React.ReactNode }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const animFrameRef = useRef<number | null>(null);
	// Auto-scroll speed in pixels per frame.
	const speed = 0.5;

	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;

		// Whether the user is currently hovering/holding the track.
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

		// Per-frame scroll tick that loops back at the half-mark.
		const tick = () => {
			if (!isPaused && el) {
				el.scrollLeft += speed;
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
				// NOTE: scrollbarWidth and msOverflowStyle are non-standard vendor properties not supported by Tailwind utilities
				scrollbarWidth: "none",
				msOverflowStyle: "none",
			}}
		>
			{children}
		</div>
	);
}

// Top-level Testimonials section component.
export default function Testimonials() {
	// Duplicate the cards so the seamless loop has continuous content.
	const doubled = [...testimonials, ...testimonials];

	return (
		<ScrollSection id="testimonials">
			{/* Heading row. */}
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
				{/* Edge fade masks on either side of the track. */}
				<div className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-28 z-10 bg-linear-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-28 z-10 bg-linear-to-l from-background to-transparent" />

				{/* The auto-scrolling cards track. */}
				<ScrollTrack>
					{doubled.map((t, i) => (
						<TestimonialCard key={`${t.id}-${i}`} {...t} />
					))}
				</ScrollTrack>
			</motion.div>
		</ScrollSection>
	);
}
