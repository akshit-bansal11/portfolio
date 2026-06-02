/*
 * TaglineStage.tsx
 * Hero stage 1 — single tagline animated word-by-word.
 * Selected words receive a brand-aligned gradient.
 * Whole stage fades and blurs out during the final
 * portion of its progress window.
 *
 * Badge and tagline rendering are delegated to the
 * shared atoms (AkshitBansalBadge, TaglineDisplay).
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import AkshitBansalBadge from "../elements/AkshitBansalBadge";
import TaglineDisplay from "../elements/TaglineDisplay";

// Public props for the stage.
interface TaglineStageProps {
	progress: MotionValue<number>;
	active: boolean;
}

// Renders the tagline stage (badge + animated single tagline).
export default function TaglineStage({ progress, active }: TaglineStageProps) {
	// Stage 1 range; tagline holds full opacity for most of it then fades.
	const [start, end] = HERO_STAGES.tagline.range;
	const fadeStart = start + (end - start) * 0.78;
	const settled = entryEnd(HERO_STAGES.tagline.range);

	// Outgoing fade + lift + blur during the last ~20% of the stage.
	const opacity = useTransform(progress, [start, fadeStart, end], [1, 1, 0]);
	const y = useTransform(progress, [start, settled, fadeStart, end], [0, 0, 0, -40]);
	const filter = useTransform(
		progress,
		[start, settled, fadeStart, end],
		["blur(0px)", "blur(0px)", "blur(0px)", "blur(8px)"],
	);

	return (
		<motion.div
			style={{ opacity, y, filter }}
			className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-6 md:gap-10"
		>
			{/* Top "online status" pill above the tagline. */}
			<AkshitBansalBadge active={active} />

			{/* Word-by-word reveal of the single tagline with light gradient. */}
			<TaglineDisplay active={active} />
		</motion.div>
	);
}
