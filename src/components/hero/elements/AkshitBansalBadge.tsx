/*
 * AkshitBansalBadge.tsx
 * Online-status pill badge — "● Akshit Bansal".
 * Extracted as a standalone atom so it can be used in
 * both the desktop scroll hero (TaglineStage) and the
 * mobile two-stage layout.
 */

"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";

// Public props.
interface AkshitBansalBadgeProps {
	/** When false the badge stays invisible (used by TaglineStage while welcome plays). */
	active?: boolean;
}

// Renders the green-dot "Akshit Bansal" pill.
export default function AkshitBansalBadge({ active = true }: AkshitBansalBadgeProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/3 border border-white/10"
		>
			<Circle className="h-2 w-2 fill-green-500 text-green-500" />
			<span className="text-xs md:text-sm text-white/70 tracking-[0.3em] uppercase">
				Akshit Bansal
			</span>
		</motion.div>
	);
}
