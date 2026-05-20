/*
 * JumpToPanel.tsx
 * Hero stage-4 "Jump to" panel.
 * Slides in from the right and renders a near-square
 * grid of cards that smooth-scroll to in-page sections
 * (auto-picks 2/3/4 columns based on card count).
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { JUMP_TO_CARDS } from "@/data/jumpToCards";

// Public props for the panel.
interface JumpToPanelProps {
	progress: MotionValue<number>;
}

// Pick a grid column count that produces the most square layout.
function gridCols(count: number): string {
	if (count <= 4) return "grid-cols-2";
	if (count <= 9) return "grid-cols-3";
	return "grid-cols-4";
}

// Smooth-scroll to a section by id.
function scrollToSection(id: string) {
	const el = document.getElementById(id);
	if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Renders the slide-in jump-to panel.
export default function JumpToPanel({ progress }: JumpToPanelProps) {
	// Stage 4 progress range and span used for staggered reveals.
	const [start] = HERO_STAGES.jumpto.range;
	const settled = entryEnd(HERO_STAGES.jumpto.range);
	const entrySpan = settled - start;

	// Whole-panel slide and fade-in.
	const x = useTransform(progress, [start, settled, 1], ["60vw", "0vw", "0vw"]);
	const opacity = useTransform(progress, [start, start + entrySpan * 0.25, settled], [0, 0.9, 1]);

	// "scroll too" hint reveals only after the entry settles.
	const hintOpacity = useTransform(progress, [settled - 0.01, settled], [0, 1]);

	return (
		<motion.div
			style={{ x, opacity }}
			className="absolute inset-0 flex items-center justify-end pr-4 md:pr-10 lg:pr-16 pl-[44vw] md:pl-[46vw] pointer-events-none"
		>
			<div className="flex flex-col gap-3 w-full max-w-sm md:max-w-md lg:max-w-lg pointer-events-auto">
				{/* Panel label. */}
				<p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-500">
					Jump to
				</p>

				{/* Card grid — column count adapts to the configured cards length. */}
				<div className={`grid ${gridCols(JUMP_TO_CARDS.length)} gap-2 md:gap-3`}>
					{JUMP_TO_CARDS.map((card, i) => {
						// Staggered per-card reveal window inside the entry span.
						const cardStart = start + entrySpan * (0.08 + i * 0.09);
						const cardEnd = Math.min(settled, cardStart + entrySpan * 0.28);
						return (
							<CardItem
								key={card.sectionId}
								card={card}
								progress={progress}
								cardStart={cardStart}
								cardEnd={cardEnd}
							/>
						);
					})}
				</div>

				{/* Hint reminding the user they can also just keep scrolling. */}
				<motion.p
					style={{ opacity: hintOpacity }}
					className="text-center text-[10px] md:text-xs text-neutral-600 tracking-wide pt-1"
				>
					you can simply scroll too ↓
				</motion.p>
			</div>
		</motion.div>
	);
}

// Per-card props for one jump-to button.
interface CardItemProps {
	card: (typeof JUMP_TO_CARDS)[number];
	progress: MotionValue<number>;
	cardStart: number;
	cardEnd: number;
}

// Renders one jump-to button card with its own staggered reveal.
function CardItem({ card, progress, cardStart, cardEnd }: CardItemProps) {
	// Per-card y/opacity tied to its own portion of progress.
	const y = useTransform(progress, [cardStart, cardEnd], [18, 0]);
	const opacity = useTransform(progress, [cardStart, cardEnd], [0, 1]);

	return (
		<motion.button
			style={{ y, opacity }}
			type="button"
			onClick={() => scrollToSection(card.sectionId)}
			className={[
				"group flex flex-col items-start gap-3 p-5 md:p-6 rounded-2xl cursor-pointer text-left",
				"bg-neutral-950/70 backdrop-blur-sm",
				"border transition-all duration-300",
				"hover:scale-[1.04] hover:-translate-y-0.5",
				card.colorClass,
			].join(" ")}
		>
			<span className="text-base md:text-lg font-semibold text-white leading-tight">
				{card.label}
			</span>
			<span className="text-xs md:text-sm text-neutral-400 font-medium leading-tight">
				{card.description}
			</span>
			<span className="text-[10px] md:text-xs text-neutral-600 leading-snug hidden md:block">
				{card.detail}
			</span>
		</motion.button>
	);
}
