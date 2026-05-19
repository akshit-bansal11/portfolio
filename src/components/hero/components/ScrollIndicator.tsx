"use client";

/**
 * Bottom-centre scroll affordance shown twice during the hero:
 *  - At the very start, hinting "scroll to begin"
 *  - At the very end, hinting "scroll to continue"
 *
 * It hides itself in the middle of the timeline so it doesn't fight
 * the choreography. Pure visual / non-interactive.
 */

import { type MotionValue, motion, useTransform } from "framer-motion";
import { FaArrowDownLong } from "react-icons/fa6";

interface ScrollIndicatorProps {
	progress: MotionValue<number>;
}

export default function ScrollIndicator({ progress }: ScrollIndicatorProps) {
	// Visible throughout the entire horizontal scroll, fades in at start and out at the very end.
	const opacity = useTransform(progress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

	return (
		<motion.div
			style={{ opacity }}
			className="pointer-events-none absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-center justify-center"
			aria-hidden
		>
			<div className="flex flex-col items-center gap-2 text-neutral-400">
				<span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-light">Scroll</span>
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
