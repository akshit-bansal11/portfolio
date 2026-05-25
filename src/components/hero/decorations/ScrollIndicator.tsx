/*
 * ScrollIndicator.tsx
 * Bottom-right "Scroll" affordance for the hero.
 * Visible across the full hero range and fades out at
 * the very end. Pure visual; non-interactive.
 */

"use client";

import { type MotionValue, motion, useMotionValueEvent, useTransform } from "framer-motion";
import { useState } from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import { HERO_HORIZONTAL_END } from "@/config/heroStages";
import { useAnimation } from "@/context/AnimationContext";
import { cn } from "@/lib/utils";

// Public props for the indicator.
interface ScrollIndicatorProps {
	progress: MotionValue<number>;
}

// Renders the scroll hint with mouse-shape and arrow.
export default function ScrollIndicator({ progress }: ScrollIndicatorProps) {
	const { isWelcomeComplete } = useAnimation();
	const [isVertical, setIsVertical] = useState(false);

	useMotionValueEvent(progress, "change", (latest) => {
		setIsVertical(latest >= HERO_HORIZONTAL_END);
	});

	// Stay fully visible across the hero, fade out at the very end.
	const opacity = useTransform(progress, [0, 0.96, 1], [1, 1, 0]);

	// Hold off until the welcome overlay has finished, then appear with the hero.
	if (!isWelcomeComplete) return null;

	return (
		<motion.div
			layout
			initial={{ y: 8 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			style={{ opacity }}
			className={cn(
				"pointer-events-none absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 flex items-center justify-center",
				"bg-neutral-950/65 backdrop-blur-md border border-neutral-800/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] rounded-2xl transition-all duration-500",
				isVertical ? "flex-col px-3.5 py-4 gap-3" : "flex-row px-4 py-3.5 gap-3",
			)}
			aria-hidden
		>
			{/* Mouse-shape outline that morphs size dynamically. */}
			<motion.div
				layout
				className={cn(
					"rounded-full border border-neutral-600/70 relative transition-all duration-500 overflow-hidden",
					isVertical ? "h-9 w-6 md:h-10 md:w-7" : "w-9 h-6 md:w-10 md:h-7",
				)}
			>
				{/* Vertical Dot - only active and bouncing along Y axis in vertical mode */}
				<motion.span
					animate={isVertical ? { opacity: 1, y: [0, 6, 0] } : { opacity: 0, y: 0 }}
					transition={{
						opacity: { duration: 0.2 },
						y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
					}}
					className="absolute top-1.5 left-1/2 -translate-x-1/2 block h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
				/>

				{/* Horizontal Dot - only active and bouncing along X axis in horizontal mode */}
				<motion.span
					animate={!isVertical ? { opacity: 1, x: [0, 6, 0] } : { opacity: 0, x: 0 }}
					transition={{
						opacity: { duration: 0.2 },
						x: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
					}}
					className="absolute left-1.5 top-1/2 -translate-y-1/2 block h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
				/>
			</motion.div>

			{/* Arrow container handling rotation. */}
			<motion.div
				layout
				animate={{ rotate: isVertical ? 0 : -90 }}
				transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
				className="text-amber-400 flex items-center justify-center"
			>
				{/* Inner arrow handling continuous bouncing along local Y axis. */}
				<motion.div
					animate={{ y: [0, 3, 0] }}
					transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
					className="flex"
				>
					<FaArrowDownLong className="h-3.5 w-3.5 md:h-4 md:w-4" />
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
