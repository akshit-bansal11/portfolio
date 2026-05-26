/*
 * use-hero-scroll-progress.ts
 * Hook that wires framer-motion's useScroll to the pinned hero
 * wrapper. Returns the wrapper ref to attach plus a 0..1
 * progress MotionValue that drives every hero stage animation.
 */

"use client";

import { type MotionValue, useScroll } from "framer-motion";
import { type RefObject, useRef } from "react";

// Public shape returned by the hook.
export interface HeroScrollRefs {
	wrapperRef: RefObject<HTMLDivElement | null>;
	progress: MotionValue<number>;
}

// Hook: returns a ref + scroll progress for the pinned hero wrapper.
export function useHeroScrollProgress(): HeroScrollRefs {
	// Attach this ref to the tall, pinned hero wrapper element.
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Track scroll progress (0..1) across the wrapper's full height.
	const { scrollYProgress } = useScroll({
		target: wrapperRef,
		offset: ["start start", "end end"],
	});

	return { wrapperRef, progress: scrollYProgress };
}
