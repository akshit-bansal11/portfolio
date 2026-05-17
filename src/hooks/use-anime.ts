import { type AnimationParams, animate, type JSAnimation } from "animejs";
import { useEffect, useRef } from "react";

export const useAnime = <T extends HTMLElement>(params: AnimationParams) => {
	const ref = useRef<T>(null);

	const animationRef = useRef<JSAnimation | null>(null);

	useEffect(() => {
		if (!ref.current) return;

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReducedMotion) {
			return;
		}

		const rest = Object.fromEntries(Object.entries(params).filter(([key]) => key !== "targets"));

		animationRef.current = animate(ref.current, rest);

		return () => {
			if (animationRef.current?.pause) {
				animationRef.current.pause();
			}
		};
	}, [params]);

	return ref;
};
