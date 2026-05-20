"use client";

/**
 * Four-stage scroll-driven hero:
 *
 *   Stage 1 – tagline   : word-by-word reveal on black
 *   Stage 2 – profile   : logo flips to photo; hover callouts appear
 *   Stage 3 – socials   : callouts fade; profile shrinks up; resume +
 *                         social icons rise from the bottom
 *   Stage 4 – jumpto    : profile + socials slide left; JumpTo panel
 *                         slides in from the right
 */

import { useMotionValueEvent } from "framer-motion";
import { useAnimation } from "@/context/AnimationContext";
import HeroBackdrop from "./components/HeroBackdrop";
import JumpToPanel from "./components/JumpToPanel";
import ProfileCluster from "./components/ProfileCluster";
import ScrollIndicator from "./components/ScrollIndicator";
import SocialsStage from "./components/SocialsStage";
import TaglineStage from "./components/TaglineStage";
import { HERO_HORIZONTAL_END, HERO_SCROLL_LENGTH_VH } from "./config/stages";
import { useHeroScrollProgress } from "./hooks/use-hero-scroll-progress";

export default function ScrollHero() {
	const { wrapperRef, progress } = useHeroScrollProgress();
	const { isWelcomeComplete, isHeroComplete, setHeroComplete } = useAnimation();

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
			<div className="sticky top-0 h-screen w-full overflow-hidden bg-[#030303]">
				<HeroBackdrop />

				<TaglineStage progress={progress} active={isWelcomeComplete} />
				<ProfileCluster progress={progress} />
				<SocialsStage progress={progress} />
				<JumpToPanel progress={progress} />

				<ScrollIndicator progress={progress} />
			</div>
		</section>
	);
}
