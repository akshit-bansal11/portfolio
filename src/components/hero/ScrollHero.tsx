/*
 * ScrollHero.tsx
 * Top-level pinned, four-stage scroll hero.
 * Owns the scroll-progress source, mounts each stage
 * (tagline, profile, socials, jumpto) plus the backdrop
 * and indicator, and reports completion to the context.
 */

"use client";

import { useMotionValueEvent } from "framer-motion";
import { HERO_HORIZONTAL_END, HERO_SCROLL_LENGTH_VH } from "@/config/heroStages";
import { useAnimation } from "@/context/AnimationContext";
import { useHeroScrollProgress } from "@/hooks/use-hero-scroll-progress";
import HeroBackdrop from "./HeroBackdrop";
import JumpToPanel from "./JumpToPanel";
import ProfileCluster from "./ProfileCluster";
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
				<SocialsStage progress={progress} />
				<JumpToPanel progress={progress} />

				{/* Scroll affordance hint. */}
				<ScrollIndicator progress={progress} />
			</div>
		</section>
	);
}
