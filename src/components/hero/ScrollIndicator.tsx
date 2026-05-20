/*
 * ScrollIndicator.tsx
 * Bottom-right "Scroll" affordance for the hero.
 * Visible across the full hero range and fades out at
 * the very end. Pure visual; non-interactive.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { FaArrowDownLong } from "react-icons/fa6";

// Public props for the indicator.
interface ScrollIndicatorProps {
	progress: MotionValue<number>;
}

// Renders the scroll hint with mouse-shape and arrow.
export default function ScrollIndicator({ progress }: ScrollIndicatorProps) {
	// Fade in at the start, fade out at the end of the hero scroll.
	const opacity = useTransform(progress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

	return (
		<motion.div
			style={{ opacity }}
			className="pointer-events-none absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-center justify-center"
			aria-hidden
		>
			<div className="flex flex-col items-center gap-2 text-neutral-400">
				<span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-light">Scroll</span>
				{/* Mouse-shape outline with a bouncing inner dot. */}
				<motion.div
					animate={{ y: [0, 6, 0] }}
					transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
					className="h-9 w-6 md:h-10 md:w-7 rounded-full border border-neutral-600/70 flex items-start justify-center pt-1.5"
				>
					<motion.span
						animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
						transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
						className="block h-1.5 w-1 rounded-full bg-amber-400"
					/>
				</motion.div>
				{/* Bouncing amber arrow under the mouse shape. */}
				<motion.div
					animate={{ y: [0, 3, 0], opacity: [0.4, 1, 0.4] }}
					transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
					className="text-amber-400/80"
				>
					<FaArrowDownLong className="h-3 w-3 md:h-3.5 md:w-3.5" />
				</motion.div>
			</div>
		</motion.div>
	);
}
