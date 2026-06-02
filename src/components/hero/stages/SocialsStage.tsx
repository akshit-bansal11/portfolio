/*
 * SocialsStage.tsx
 * Hero stage 3 — resume CTA + social icons rise from
 * the bottom while the profile shrinks upward, then
 * the whole group slides left during stage 4 (jumpto).
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import type { IconType } from "react-icons";
import { Button } from "@/components/ui/button";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { heroSocialLinks } from "@/data/heroSocialLinks";
import { getSocialAccent } from "@/data/socialAccents";
import { cn } from "@/lib/utils";
import ResumeButton from "../elements/ResumeButton";

// Public props for the stage.
interface SocialsStageProps {
	progress: MotionValue<number>;
}

// Per-icon props for one social button.
interface SocialItemProps {
	progress: MotionValue<number>;
	itemStart: number;
	itemEnd: number;
	href: string;
	label: string;
	Icon: IconType;
}

// Renders one staggered social icon button.
function SocialItem({ progress, itemStart, itemEnd, href, label, Icon }: SocialItemProps) {
	// Per-icon rise + fade tied to its slice of the entry span.
	const y = useTransform(progress, [itemStart, itemEnd], [36, 0]);
	const opacity = useTransform(progress, [itemStart, itemEnd], [0, 1]);
	// Brand accent classes for hover and ring colors.
	const accent = getSocialAccent(label);

	return (
		<motion.div style={{ y, opacity }} className="relative group">
			<Button
				asChild
				variant="outline"
				size="icon"
				aria-label={label}
				className={cn(
					"h-9 w-9 md:h-10 md:w-10 rounded-lg border-neutral-700 bg-neutral-900/60",
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

// Renders the full socials stage layout (resume + icon row).
export default function SocialsStage({ progress }: SocialsStageProps) {
	// Stage 3 progress range / span.
	const [start] = HERO_STAGES.socials.range;
	const settled = entryEnd(HERO_STAGES.socials.range);
	const entrySpan = settled - start;

	// Stage 4 thresholds drive the left-slide of this whole group.
	const jumptoStart = HERO_STAGES.jumpto.range[0];
	const jumptoSettled = entryEnd(HERO_STAGES.jumpto.range);

	// ── Rise from bottom during socials entry ─────────────────────────
	const containerOpacity = useTransform(
		progress,
		[start, start + entrySpan * 0.3, settled, 1],
		[0, 1, 1, 1],
	);
	const containerY = useTransform(progress, [start, settled, 1], ["80px", "0px", "0px"]);

	// ── Slide left during jumpto entry ────────────────────────────────
	const containerX = useTransform(
		progress,
		[jumptoStart, jumptoSettled, 1],
		["0vw", "-28vw", "-28vw"],
	);

	// Resume button leads the reveal during the first 35% of the entry span.
	const resumeEnd = start + entrySpan * 0.35;
	const resumeOpacity = useTransform(progress, [start, resumeEnd], [0, 1]);
	const resumeY = useTransform(progress, [start, resumeEnd], [28, 0]);

	return (
		<motion.div
			style={{ opacity: containerOpacity, y: containerY, x: containerX }}
			className="absolute inset-x-0 bottom-16 md:bottom-20 flex flex-col items-center gap-4 md:gap-5"
		>
			{/* Resume CTA */}
			<motion.div style={{ opacity: resumeOpacity, y: resumeY }} className="pointer-events-auto">
				<ResumeButton />
			</motion.div>

			{/* Social icons row */}
			<div className="relative">
				{/* Soft colored glow behind the icon strip. */}
				<div
					aria-hidden
					className="absolute -inset-3 rounded-xl bg-linear-to-r from-indigo-500/20 via-rose-500/20 to-amber-400/20 blur-xl"
				/>
				<div className="relative flex gap-2.5 md:gap-3 px-3 py-2.5 rounded-xl bg-neutral-900/70 backdrop-blur-md border border-neutral-700/60 shadow-xl pointer-events-auto">
					{/* Each icon gets its own staggered reveal window. */}
					{heroSocialLinks.map(({ Icon, href, name }, index) => {
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
