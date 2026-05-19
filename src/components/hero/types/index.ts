/**
 * Shared type definitions for the scroll hero feature.
 */

export type HeroStageId = "tagline" | "profile" | "socials";

export interface HeroStage {
	id: HeroStageId;
	/**
	 * Normalised progress range [start, end] within the pinned scroll
	 * timeline. Both bounds are 0..1.
	 */
	range: readonly [number, number];
}

export interface AnimatedTextProps {
	text: string;
	/** Delay between each segment, in milliseconds. */
	stagger?: number;
	/** Animate by individual letters or whole words. */
	animateBy?: "words" | "letters";
	/** Direction blur enters from. */
	direction?: "top" | "bottom";
	className?: string;
	/** Fires when last segment finishes its animation. */
	onComplete?: () => void;
	/** Gate animation behind an external readiness flag. */
	active?: boolean;
	/** Optional per-segment className resolver, e.g. for coloured words. */
	wordClassName?: (segment: string, index: number) => string | undefined;
}
