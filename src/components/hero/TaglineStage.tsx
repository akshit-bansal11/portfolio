/*
 * TaglineStage.tsx
 * Hero stage 1 — single tagline animated word-by-word.
 * Selected words receive a brand-aligned gradient.
 * Whole stage fades and blurs out during the final
 * portion of its progress window.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { Circle } from "lucide-react";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { TAGLINE, TAGLINE_ACCENT_CLASS, TAGLINE_CLASSNAME } from "@/data/heroContent";
import AnimatedText from "./AnimatedText";

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

	// Apply the custom light gradient class to all words.
	const accentForWord = () => TAGLINE_ACCENT_CLASS;

	return (
		<motion.div
			style={{ opacity, y, filter }}
			className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-6 md:gap-10"
		>
			{/* Top "online status" pill above the tagline. */}
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

			{/* Word-by-word reveal of the single tagline with light gradient. */}
			<AnimatedText
				text={TAGLINE}
				stagger={150}
				animateBy="words"
				direction="top"
				active={active}
				wordClassName={accentForWord}
				className={TAGLINE_CLASSNAME}
			/>
		</motion.div>
	);
}
