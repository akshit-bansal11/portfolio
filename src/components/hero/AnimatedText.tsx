/*
 * AnimatedText.tsx
 * Reusable word/letter blur-reveal text animation.
 * Splits the text into segments and animates each
 * with a staggered blur+slide entry. Supports gating
 * via the `active` flag and per-segment styling.
 */

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { AnimatedTextProps } from "@/types";

// Internal: a single keyframe-state snapshot.
type Snapshot = Record<string, string | number>;

// Build a per-property keyframe array from a `from` snapshot and intermediate `steps`.
const buildKeyframes = (from: Snapshot, steps: Snapshot[]) => {
	const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
	const keyframes: Record<string, (string | number)[]> = {};
	keys.forEach((k) => {
		keyframes[k] = [from[k], ...steps.map((s) => s[k])];
	});
	return keyframes;
};

// Per-step duration of the blur-reveal animation.
const STEP_DURATION = 0.35;

// Renders the staggered word/letter reveal.
export default function AnimatedText({
	text,
	stagger = 150,
	animateBy = "words",
	direction = "top",
	className = "",
	onComplete,
	active = true,
	wordClassName,
	delayOffset = 0,
}: AnimatedTextProps) {
	// Split target text into words or letters depending on the mode.
	const elements = useMemo(
		() => (animateBy === "words" ? text.split(" ") : text.split("")),
		[text, animateBy],
	);

	// Pre-compute the from/to keyframes, total duration, and timing array.
	const { fromSnapshot, animateKeyframes, totalDuration, times } = useMemo(() => {
		// Initial state — blurred and offset above or below.
		const from: Snapshot =
			direction === "top"
				? { filter: "blur(10px)", opacity: 0, y: -50 }
				: { filter: "blur(10px)", opacity: 0, y: 50 };

		// Two-step settle: half-blur halfway, fully sharp at the end.
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
				// Per-segment transition with a stagger offset.
				const transition = {
					duration: totalDuration,
					times,
					delay: (index * stagger + delayOffset) / 1000,
					ease: (t: number) => t,
				};

				return (
					<motion.span
						key={`${segment}-${index}`}
						className={`inline-block py-3 will-change-[transform,filter,opacity] ${
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
