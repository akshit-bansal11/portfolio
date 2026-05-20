"use client";

/**
 * First beat of the hero: a single tagline that animates word-by-word
 * onto a black canvas. Fades out as the user scrolls into stage two.
 *
 * Selected words receive a brand-aligned gradient so the line picks
 * up the same indigo/rose/amber palette used elsewhere on the site.
 */

import { type MotionValue, motion, useTransform } from "framer-motion";
import { Circle } from "lucide-react";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { TAGLINE } from "@/data/heroContent";
import AnimatedText from "./AnimatedText";

interface TaglineStageProps {
	progress: MotionValue<number>;
	active: boolean;
}

const ACCENT_WORDS: Record<string, string> = {
	Fast: "bg-clip-text text-transparent bg-linear-to-r from-amber-300 via-amber-400 to-rose-400",
	"Production-Grade":
		"bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-violet-300 to-rose-300",
	"Next.js": "bg-clip-text text-transparent bg-linear-to-r from-cyan-300 via-sky-300 to-indigo-300",
};

const accentForWord = (segment: string): string | undefined => {
	const cleaned = segment.replace(/[.,!?]+$/g, "");
	return ACCENT_WORDS[cleaned];
};

export default function TaglineStage({ progress, active }: TaglineStageProps) {
	const [start, end] = HERO_STAGES.tagline.range;
	// Tagline holds full opacity throughout most of its window, then
	// fades out only in the final ~20% so the dwell feels intentional.
	const fadeStart = start + (end - start) * 0.78;
	const settled = entryEnd(HERO_STAGES.tagline.range);

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

			<AnimatedText
				text={TAGLINE}
				stagger={150}
				animateBy="words"
				direction="top"
				active={active}
				wordClassName={accentForWord}
				className="w-fit mx-auto xl:text-[120px] lg:text-[80px] md:text-[60px] text-[30px] font-thin items-center justify-center text-white drop-shadow-2xl flex-wrap"
			/>
		</motion.div>
	);
}
