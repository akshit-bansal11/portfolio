"use client";

/**
 * Three-stage scroll-driven hero:
 *
 *   Stage 1 – tagline   : word-by-word reveal on black
 *   Stage 2 – profile   : image + name + role slide in and peak large
 *   Stage 3 – socials   : profile shrinks + floats up; resume + social
 *                         icons rise from the bottom
 *
 * Vertical scroll is consumed by the tall wrapper while the canvas
 * stays sticky. A trailing buffer prevents accidental jumps into the
 * vertical sections that follow.
 */

import { useMotionValueEvent } from "framer-motion";
import { useAnimation } from "@/context/AnimationContext";
import HeroBackdrop from "./components/HeroBackdrop";
import ProfileCluster from "./components/ProfileCluster";
import ScrollIndicator from "./components/ScrollIndicator";
import SocialsStage from "./components/SocialsStage";
import TaglineStage from "./components/TaglineStage";
import { HERO_HORIZONTAL_END, HERO_SCROLL_LENGTH_VH } from "./config/stages";
import { useHeroScrollProgress } from "./hooks/useHeroScrollProgress";

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

				<ScrollIndicator progress={progress} />
			</div>
		</section>
	);
}
