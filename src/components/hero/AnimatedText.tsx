"use client";

/**
 * Reusable word/letter blur-reveal text animation.
 *
 * Extracted from the original About implementation so it can be reused
 * by both the tagline and the about line in the scroll hero. Honors an
 * `active` flag so the parent can gate the animation behind external
 * readiness signals (welcome animation finishing, scroll progress, …).
 */

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { AnimatedTextProps } from "@/types";

type Snapshot = Record<string, string | number>;

const buildKeyframes = (from: Snapshot, steps: Snapshot[]) => {
	const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
	const keyframes: Record<string, (string | number)[]> = {};
	keys.forEach((k) => {
		keyframes[k] = [from[k], ...steps.map((s) => s[k])];
	});
	return keyframes;
};

const STEP_DURATION = 0.35;

export default function AnimatedText({
	text,
	stagger = 150,
	animateBy = "words",
	direction = "top",
	className = "",
	onComplete,
	active = true,
	wordClassName,
}: AnimatedTextProps) {
	const elements = useMemo(
		() => (animateBy === "words" ? text.split(" ") : text.split("")),
		[text, animateBy],
	);

	const { fromSnapshot, animateKeyframes, totalDuration, times } = useMemo(() => {
		const from: Snapshot =
			direction === "top"
				? { filter: "blur(10px)", opacity: 0, y: -50 }
				: { filter: "blur(10px)", opacity: 0, y: 50 };

		const to: Snapshot[] = [
			{ filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
			{ filter: "blur(0px)", opacity: 1, y: 0 },
		];

		const stepCount = to.length + 1;
		return {
			fromSnapshot: from,
			animateKeyframes: buildKeyframes(from, to),
			totalDuration: STEP_DURATION * (stepCount - 1),
			times: Array.from({ length: stepCount }, (_, i) =>
				stepCount === 1 ? 0 : i / (stepCount - 1),
			),
		};
	}, [direction]);

	return (
		<p className={`flex flex-wrap ${className}`}>
			{elements.map((segment, index) => {
				const transition = {
					duration: totalDuration,
					times,
					delay: (index * stagger) / 1000,
					ease: (t: number) => t,
				};

				return (
					<motion.span
						key={`${segment}-${index}`}
						className={`inline-block will-change-[transform,filter,opacity] ${
							wordClassName?.(segment, index) ?? ""
						}`}
						initial={fromSnapshot}
						animate={active ? animateKeyframes : fromSnapshot}
						transition={transition}
						onAnimationComplete={index === elements.length - 1 ? onComplete : undefined}
					>
						{segment === " " ? "\u00A0" : segment}
						{animateBy === "words" && index < elements.length - 1 && "\u00A0"}
					</motion.span>
				);
			})}
		</p>
	);
}
