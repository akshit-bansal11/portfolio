/*
 * TaglineDisplay.tsx
 * The animated word-by-word tagline text atom.
 * Extracted from TaglineStage so it can be used standalone
 * in the mobile two-stage layout without scroll-driven props.
 */

"use client";

import { TAGLINE, TAGLINE_ACCENT_CLASS, TAGLINE_CLASSNAME } from "@/data/heroContent";
import AnimatedText from "./AnimatedText";

// Public props.
interface TaglineDisplayProps {
	/** Gates the word-reveal animation; defaults to true for mobile use. */
	active?: boolean;
}

// Renders the tagline with its light gradient word-by-word reveal.
export default function TaglineDisplay({ active = true }: TaglineDisplayProps) {
	// Apply the custom light gradient class to all words.
	const accentForWord = () => TAGLINE_ACCENT_CLASS;

	return (
		<AnimatedText
			text={TAGLINE}
			stagger={150}
			animateBy="words"
			direction="top"
			active={active}
			wordClassName={accentForWord}
			className={TAGLINE_CLASSNAME}
		/>
	);
}
