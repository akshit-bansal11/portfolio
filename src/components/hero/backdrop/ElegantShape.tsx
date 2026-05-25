/*
 * ElegantShape.tsx
 * Slowly drifting blurred sphere accent.
 * Used by HeroBackdrop to scatter colored, pill-like
 * gradients behind the hero canvas for depth and warmth.
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Public props for the shape.
interface ElegantShapeProps {
	className?: string;
	delay?: number;
	width?: number;
	height?: number;
	rotate?: number;
	gradient?: string;
}

// Renders the floating blurred sphere accent.
export default function ElegantShape({
	className,
	delay = 0,
	width = 400,
	height = 100,
	rotate = 0,
	gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
	return (
		// Outer wrapper handles the initial fade/rotate-in entrance.
		<motion.div
			initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
			animate={{ opacity: 1, y: 0, rotate }}
			transition={{
				duration: 2.4,
				delay,
				ease: [0.23, 0.86, 0.39, 0.96],
				opacity: { duration: 1.2 },
			}}
			className={cn("absolute", className)}
		>
			{/* Inner wrapper drives the slow, looping vertical drift. */}
			<motion.div
				animate={{ y: [0, 15, 0] }}
				transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
				style={{ width, height }}
				className="relative"
			>
				{/* Final visual: a blurred gradient pill with a soft inner glow. */}
				<div
					className={cn(
						"absolute inset-0 rounded-full",
						"bg-linear-to-r to-transparent",
						gradient,
						"backdrop-blur-[2px] border-2 border-white/15 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
						"after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
					)}
				/>
			</motion.div>
		</motion.div>
	);
}
