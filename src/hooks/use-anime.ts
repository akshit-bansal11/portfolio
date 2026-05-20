/*
 * use-anime.ts
 * Hook wrapper around anime.js for simple ref-driven animations.
 * Returns a ref to attach to the target element; the animation
 * runs on mount and respects the user's reduced-motion preference.
 */

import { type AnimationParams, animate, type JSAnimation } from "animejs";
import { useEffect, useRef } from "react";

// Hook that animates a single element using anime.js params.
export const useAnime = <T extends HTMLElement>(params: AnimationParams) => {
	// Ref attached to the DOM node we want to animate.
	const ref = useRef<T>(null);

	// Holds the active animation handle so we can pause it on cleanup.
	const animationRef = useRef<JSAnimation | null>(null);

	useEffect(() => {
		if (!ref.current) return;

		// Skip animation entirely if the user prefers reduced motion.
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReducedMotion) {
			return;
		}

		// Strip the `targets` key — we always animate the captured ref.
		const rest = Object.fromEntries(Object.entries(params).filter(([key]) => key !== "targets"));

		// Kick off the animation against the bound ref.
		animationRef.current = animate(ref.current, rest);

		// Pause the animation when the consumer unmounts.
		return () => {
			if (animationRef.current?.pause) {
				animationRef.current.pause();
			}
		};
	}, [params]);

	return ref;
};
