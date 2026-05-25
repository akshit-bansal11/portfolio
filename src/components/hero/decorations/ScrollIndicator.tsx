/*
 * ScrollIndicator.tsx
 * Fixed, always-on-top scroll affordance.
 * Reads the hero progress MotionValue from a ref in AnimationContext
 * so it can live outside the hero DOM tree as a true fixed overlay.
 * Switches orientation (horizontal ↔ vertical) as the hero
 * crosses the horizontal-end threshold.
 *
 * Split into an outer shell (gates on readiness) and an inner
 * component (safe to call useMotionValueEvent with a non-null value).
 */

"use client";

import { type MotionValue, motion, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import { HERO_HORIZONTAL_END } from "@/config/heroStages";
import { useAnimation } from "@/context/AnimationContext";
import { cn } from "@/lib/utils";

// Inner component — only rendered once progress is confirmed non-null.
function Indicator({ progress }: { progress: MotionValue<number> }) {
	const [isVertical, setIsVertical] = useState(false);

	useMotionValueEvent(progress, "change", (latest: number) => {
		setIsVertical(latest >= HERO_HORIZONTAL_END);
	});

	return (
		<motion.div
			layout
			initial={{ y: 8, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className={cn(
				"pointer-events-none fixed bottom-4 right-4 md:bottom-7 md:right-7 z-[9999] flex items-center justify-center",
				"bg-neutral-950/65 backdrop-blur-md border border-neutral-800/80 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.7)] rounded-xl transition-all duration-500",
				isVertical ? "flex-col px-2.5 py-3 gap-2" : "flex-row px-3 py-2.5 gap-2",
			)}
			aria-hidden
		>
			{/* Mouse-shape outline that morphs between portrait and landscape. */}
			<motion.div
				layout
				className={cn(
					"rounded-full border border-neutral-600/70 relative transition-all duration-500 overflow-hidden",
					isVertical ? "h-7 w-[18px]" : "w-7 h-[18px]",
				)}
			>
				{/* Vertical dot — bounces along Y when in vertical scroll phase. */}
				<motion.span
					animate={isVertical ? { opacity: 1, y: [0, 4, 0] } : { opacity: 0, y: 0 }}
					transition={{
						opacity: { duration: 0.3 },
						y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
					}}
					className="absolute top-1 left-1/2 -translate-x-1/2 block h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]"
				/>

				{/* Horizontal dot — bounces along X when in horizontal scroll phase. */}
				<motion.span
					animate={!isVertical ? { opacity: 1, x: [0, 4, 0] } : { opacity: 0, x: 0 }}
					transition={{
						opacity: { duration: 0.3 },
						x: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
					}}
					className="absolute left-1 top-1/2 -translate-y-1/2 block h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]"
				/>
			</motion.div>

			{/* Arrow — rotates 90° between horizontal and vertical orientations. */}
			<motion.div
				layout
				animate={{ rotate: isVertical ? 0 : -90 }}
				transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
				className="text-amber-400 flex items-center justify-center"
			>
				{/* Bouncing nudge along the arrow's local Y axis. */}
				<motion.div
					animate={{ y: [0, 2, 0] }}
					transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
					className="flex"
				>
					<FaArrowDownLong className="h-2.5 w-2.5 md:h-3 md:w-3" />
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

// Outer shell — gates rendering until the welcome overlay and hero progress are ready.
export default function ScrollIndicator() {
	const { isWelcomeComplete, heroProgress, isHeroProgressReady } = useAnimation();

	if (!isWelcomeComplete || !isHeroProgressReady || !heroProgress) return null;

	return <Indicator progress={heroProgress} />;
}
