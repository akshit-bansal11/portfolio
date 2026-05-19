"use client";

/**
 * Third beat: resume button + brand-coloured social icons rise from
 * the bottom of the canvas as the profile cluster shrinks upward.
 *
 * The resume button leads by a small offset so it lands a beat before
 * the social icons. Everything dwells docked once settled.
 */

import { type MotionValue, motion, useTransform } from "framer-motion";
import type { IconType } from "react-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { entryEnd, HERO_STAGES } from "../config/stages";
import { heroSocialLinks } from "../data/heroSocialLinks";
import { getSocialAccent } from "../data/socialAccents";
import ResumeButton from "./ResumeButton";

interface SocialsStageProps {
	progress: MotionValue<number>;
}

interface SocialItemProps {
	progress: MotionValue<number>;
	itemStart: number;
	itemEnd: number;
	href: string;
	label: string;
	Icon: IconType;
}

function SocialItem({ progress, itemStart, itemEnd, href, label, Icon }: SocialItemProps) {
	const y = useTransform(progress, [itemStart, itemEnd], [36, 0]);
	const opacity = useTransform(progress, [itemStart, itemEnd], [0, 1]);
	const accent = getSocialAccent(label);

	return (
		<motion.div style={{ y, opacity }} className="relative group">
			<Button
				asChild
				variant="outline"
				size="icon"
				aria-label={label}
				className={cn(
					"h-11 w-11 md:h-12 md:w-12 rounded-xl border-neutral-700 bg-neutral-900/60",
					"text-neutral-300 ring-1 transition-all duration-300",
					accent.ring,
					accent.hoverBg,
					accent.hoverBorder,
					accent.hoverText,
					"hover:scale-110",
				)}
			>
				<a href={href} target="_blank" rel="noopener noreferrer">
					<Icon className="h-5 w-5 md:h-6 md:w-6" />
				</a>
			</Button>
		</motion.div>
	);
}

export default function SocialsStage({ progress }: SocialsStageProps) {
	const [start] = HERO_STAGES.socials.range;
	const settled = entryEnd(HERO_STAGES.socials.range);
	const entrySpan = settled - start;

	// Whole container: rises from 80 → 0 across entry, dwells.
	const containerOpacity = useTransform(
		progress,
		[start, start + entrySpan * 0.3, settled, 1],
		[0, 1, 1, 1],
	);
	const containerY = useTransform(progress, [start, settled, 1], ["80px", "0px", "0px"]);

	// Resume button enters in the first 35% of the entry span.
	const resumeEnd = start + entrySpan * 0.35;
	const resumeOpacity = useTransform(progress, [start, resumeEnd], [0, 1]);
	const resumeY = useTransform(progress, [start, resumeEnd], [28, 0]);

	return (
		<motion.div
			style={{ opacity: containerOpacity, y: containerY }}
			className="absolute inset-x-0 bottom-16 md:bottom-20 flex flex-col items-center gap-4 md:gap-5"
		>
			{/* Resume CTA */}
			<motion.div style={{ opacity: resumeOpacity, y: resumeY }} className="pointer-events-auto">
				<ResumeButton />
			</motion.div>

			{/* Social icons row */}
			<div className="relative">
				<div
					aria-hidden
					className="absolute -inset-3 rounded-2xl bg-linear-to-r from-indigo-500/20 via-rose-500/20 to-amber-400/20 blur-xl"
				/>
				<div className="relative flex gap-3 md:gap-4 px-4 py-3 rounded-2xl bg-neutral-900/70 backdrop-blur-md border border-neutral-700/60 shadow-xl pointer-events-auto">
					{heroSocialLinks.map(({ Icon, href, name }, index) => {
						// Stagger each icon across the entry window.
						const itemStart = start + entrySpan * (0.2 + index * 0.1);
						const itemEnd = Math.min(settled, itemStart + entrySpan * 0.22);
						return (
							<SocialItem
								key={href}
								progress={progress}
								itemStart={itemStart}
								itemEnd={itemEnd}
								href={href}
								label={name}
								Icon={Icon}
							/>
						);
					})}
				</div>
			</div>
		</motion.div>
	);
}
