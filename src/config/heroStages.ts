/*
 * heroStages.ts
 * Configuration for the four-stage scroll hero timeline.
 * Each stage owns a [start, end] progress range plus helpers
 * to compute when its entry animation completes. Components
 * read these values to drive every hero motion.
 */

import type { HeroStage } from "@/types";

// Progress ranges (0..1) for each of the four hero beats.
export const HERO_STAGES = {
	tagline: { id: "tagline", range: [0.0, 0.18] },
	profile: { id: "profile", range: [0.18, 0.42] },
	socials: { id: "socials", range: [0.42, 0.62] },
	jumpto: { id: "jumpto", range: [0.62, 0.86] },
} as const satisfies Record<string, HeroStage>;

// Fraction of each stage spent animating in (the rest is dwell).
export const STAGE_ENTRY_RATIO = 0.5;

// Convert a stage range to the progress where its entry settles.
export const entryEnd = (range: readonly [number, number], ratio = STAGE_ENTRY_RATIO): number =>
	range[0] + (range[1] - range[0]) * ratio;

// Progress value past which the hero is considered finished.
export const HERO_HORIZONTAL_END = 0.88;

// Total pinned wrapper height in viewport heights.
export const HERO_SCROLL_LENGTH_VH = 800;
