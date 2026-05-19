"use client";

/**
 * Encapsulates the scroll-progress wiring for the pinned hero.
 *
 * The outer wrapper is `HERO_SCROLL_LENGTH_VH` viewport-heights tall.
 * The inner canvas is sticky-positioned, occupying one viewport.
 * As the user scrolls through the wrapper, framer-motion's
 * useScroll yields a 0..1 progress that drives every stage animation.
 */

import { type MotionValue, useScroll } from "framer-motion";
import { type RefObject, useRef } from "react";

export interface HeroScrollRefs {
	wrapperRef: RefObject<HTMLDivElement | null>;
	progress: MotionValue<number>;
}

export function useHeroScrollProgress(): HeroScrollRefs {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: wrapperRef,
		offset: ["start start", "end end"],
	});

	return { wrapperRef, progress: scrollYProgress };
}
