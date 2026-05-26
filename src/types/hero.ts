/*
 * hero.ts
 * Type definitions for the scroll hero stages and
 * animated text component props.
 */

export type HeroStageId = "tagline" | "profile" | "socials" | "jumpto";

export interface HeroStage {
	id: HeroStageId;
	range: readonly [number, number];
}

export interface AnimatedTextProps {
	text: string;
	stagger?: number;
	animateBy?: "words" | "letters";
	direction?: "top" | "bottom";
	className?: string;
	onComplete?: () => void;
	active?: boolean;
	wordClassName?: (segment: string, index: number) => string | undefined;
	delayOffset?: number;
}

export interface JumpToCardData {
	label: string;
	sectionId: string;
	description: string;
	detail: string;
	colorClass: string;
}
