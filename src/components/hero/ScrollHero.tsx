/*
 * ScrollHero.tsx
 * Top-level pinned, four-stage scroll hero.
 * Owns the scroll-progress source, mounts each stage
 * (tagline, profile, socials, jumpto) plus the backdrop
 * and indicator, and reports completion to the context.
 */

"use client";

import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import ScrollingRibbon from "@/components/hero/ScrollingRibbon";
import {
	entryEnd,
	HERO_HORIZONTAL_END,
	HERO_SCROLL_LENGTH_VH,
	HERO_STAGES,
} from "@/config/heroStages";
import { useAnimation } from "@/context/AnimationContext";
import { useHeroScrollProgress } from "@/hooks/use-hero-scroll-progress";
import HeroBackdrop from "./HeroBackdrop";
import JumpToPanel from "./JumpToPanel";
import ProfileCluster from "./ProfileCluster";
import QuoteCard from "./QuoteCard";
import ScrollIndicator from "./ScrollIndicator";
import SocialsStage from "./SocialsStage";
import TaglineStage from "./TaglineStage";

// Renders the full pinned scroll hero.
export default function ScrollHero() {
	// Tall wrapper ref + 0..1 progress driving every stage.
	const { wrapperRef, progress } = useHeroScrollProgress();
	const { isWelcomeComplete, isHeroComplete, setHeroComplete } = useAnimation();

	// Mark the hero "complete" once progress crosses the horizontal end threshold.
	useMotionValueEvent(progress, "change", (latest) => {
		const shouldBeComplete = latest >= HERO_HORIZONTAL_END;
		if (shouldBeComplete !== isHeroComplete) {
			setHeroComplete(shouldBeComplete);
		}
	});

	// ── Ribbon Animation logic ──────────────────────────────────────────
	const socialsRange = HERO_STAGES.socials.range;
	const socialsStart = socialsRange[0];
	const socialsSettled = entryEnd(socialsRange);

	const jumptoRange = HERO_STAGES.jumpto.range;
	const jumptoStart = jumptoRange[0];
	const jumptoSettled = entryEnd(jumptoRange);

	// Ribbon entry opacity in stage 3 (socials)
	const ribbonOpacity = useTransform(
		progress,
		[
			socialsStart,
			socialsStart + (socialsSettled - socialsStart) * 0.35,
			socialsSettled,
			jumptoStart,
			1,
		],
		[0, 1, 1, 1, 1],
	);

	// Ribbon Y slide-up entry: from 30px offset to 0px
	const ribbonY = useTransform(progress, [socialsStart, socialsSettled, 1], ["30px", "0px", "0px"]);

	// Ribbon X slide-left during jumpto (stage 4)
	const ribbonX = useTransform(
		progress,
		[jumptoStart, jumptoSettled, 1],
		["0vw", "-28vw", "-28vw"],
	);

	// ── Stage 4 flex layout ─────────────────────────────────────────────
	// The three-column row slides in from the right during the jumpto stage.
	const entrySpan = jumptoSettled - jumptoStart;
	const stage4X = useTransform(progress, [jumptoStart, jumptoSettled, 1], ["60vw", "0vw", "0vw"]);
	const stage4Opacity = useTransform(
		progress,
		[jumptoStart, jumptoStart + entrySpan * 0.25, jumptoSettled],
		[0, 0.9, 1],
	);

	return (
		<section
			id="profile"
			ref={wrapperRef}
			className="relative w-full"
			style={{ height: `${HERO_SCROLL_LENGTH_VH}vh` }}
			aria-label="Hero introduction"
		>
			{/* Pinned, viewport-sized inner canvas. */}
			<div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030303]">
				{/* Decorative ambient backdrop. */}
				<HeroBackdrop />

				{/* The four hero stages — each consumes the same scroll progress. */}
				<TaglineStage progress={progress} active={isWelcomeComplete} />
				<ProfileCluster progress={progress} />

				{/* Scrolling Ribbon positioned between the profile cluster and the socials stage */}
				<motion.div
					style={{
						opacity: ribbonOpacity,
						y: ribbonY,
						x: ribbonX,
						top: "66%",
					}}
					className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-auto w-64 sm:w-72 md:w-80 lg:w-[360px]"
				>
					<ScrollingRibbon />
				</motion.div>

				<SocialsStage progress={progress} />

				{/* ── Stage 4: Three-column flex layout ────────────────────────
				     Uses justify-between so the QuoteCard naturally centres
				     between the left profile/socials region and the right
				     JumpTo panel. Each column is a flex item. */}
				<motion.div
					style={{ x: stage4X, opacity: stage4Opacity }}
					className="absolute inset-0 flex items-center justify-between px-8 md:px-12 lg:px-16 pointer-events-none z-20"
				>
					{/* Left spacer — matches the space occupied by profile + socials */}
					<div className="w-[28vw] shrink-0" />

					{/* Centre — Quote card */}
					<div className="flex items-center justify-center flex-1">
						<QuoteCard progress={progress} />
					</div>

					{/* Right — Jump to panel */}
					<div className="shrink-0">
						<JumpToPanel />
					</div>
				</motion.div>

				{/* Scroll affordance hint. */}
				<ScrollIndicator progress={progress} />
			</div>
		</section>
	);
}
