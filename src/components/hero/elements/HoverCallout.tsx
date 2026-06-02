/*
 * HoverCallout.tsx
 * Floating callouts shown around the profile circle.
 * Left side: "Hi! 👋" speech bubble (gated on hover).
 * Right side: "Click me" hint with a curved arrow.
 * Both fade out as the socials stage begins.
 */

"use client";

import { AnimatePresence, type MotionValue, motion, useTransform } from "framer-motion";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";

// Public props for a single callout.
interface HoverCalloutProps {
	side: "left" | "right";
	progress: MotionValue<number>;
	hovered?: boolean;
}

// Renders the appropriate callout based on `side`.
export default function HoverCallout({ side, progress, hovered = false }: HoverCalloutProps) {
	// Compute the hero stage progress thresholds we need below.
	const profileSettled = entryEnd(HERO_STAGES.profile.range);
	const socialsStart = HERO_STAGES.socials.range[0];
	const socialsSettled = entryEnd(HERO_STAGES.socials.range);

	// Shared opacity: visible during profile dwell, fades out once socials begin.
	const sharedOpacity = useTransform(
		progress,
		[profileSettled, profileSettled + 0.012, socialsStart, socialsSettled],
		[0, 1, 1, 0],
	);

	if (side === "left") {
		// ── Left callout — "Hi! 👋" speech bubble (mounts only on hover). ───
		return (
			<motion.div
				style={{ opacity: sharedOpacity }}
				className="pointer-events-none absolute left-[calc(50%-17rem)] top-1/2 -translate-y-[80%]"
			>
				<AnimatePresence>
					{hovered && (
						<motion.div
							key="hi-callout"
							initial={{ opacity: 0, x: -10, scale: 0.88 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, x: -10, scale: 0.88 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							{/* Bubble body. */}
							<div className="relative px-3 py-2 rounded-xl bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 shadow-xl">
								<span className="text-sm md:text-base font-light text-white tracking-wide">
									Hi! 👋
								</span>
								{/* Right-pointing tail toward the image */}
								<div
									aria-hidden
									className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0"
									style={{
										borderTop: "6px solid transparent",
										borderBottom: "6px solid transparent",
										borderLeft: "7px solid rgba(38,38,38,0.85)",
									}}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		);
	}

	// ── Right callout — always-visible "Click me" hint with arrow. ────────
	return (
		<motion.div
			style={{ opacity: sharedOpacity }}
			className="pointer-events-none absolute right-[calc(50%-17rem)] top-1/2 -translate-y-[80%] flex flex-col items-start gap-1"
		>
			<span className="text-xs md:text-sm text-neutral-300 font-light tracking-wide whitespace-nowrap">
				Click me
			</span>
			{/* Short curved dashed arrow pointing left toward the image */}
			<svg
				className="w-12 md:w-16 h-5 text-amber-400/80 overflow-visible self-start"
				viewBox="0 0 64 20"
				fill="none"
				role="img"
				aria-label="arrow pointing to profile image"
			>
				<path
					d="M62 16 C 48 16, 18 8, 4 3"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeDasharray="4 3"
				/>
				<path
					d="M10 1 L2 3 L8 8"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</motion.div>
	);
}
