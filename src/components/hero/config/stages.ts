/**
 * Three-stage hero scroll timeline:
 *
 *  1. tagline  – full-screen word-by-word tagline reveal
 *  2. profile  – image + name + role slide in, centre, dwell large
 *  3. socials  – profile shrinks + floats up; resume + social icons
 *                rise from the bottom
 *
 * Each stage has an "entry" window (motion happens) and a "dwell"
 * window (hold – user must keep scrolling). After all stages there is
 * a trailing buffer so the page doesn't jump into vertical sections.
 */

import type { HeroStage } from "../types";

export const HERO_STAGES = {
	tagline: { id: "tagline", range: [0.0, 0.22] },
	profile: { id: "profile", range: [0.22, 0.52] },
	socials: { id: "socials", range: [0.52, 0.82] },
} as const satisfies Record<string, HeroStage>;

/** Fraction of each stage's window spent animating (rest = dwell). */
export const STAGE_ENTRY_RATIO = 0.55;

/** Progress value where the entry animation of a stage completes. */
export const entryEnd = (range: readonly [number, number], ratio = STAGE_ENTRY_RATIO): number =>
	range[0] + (range[1] - range[0]) * ratio;

/**
 * Progress threshold above which the hero is considered "done". The
 * NavBar gate and the trailing buffer both reference this value.
 */
export const HERO_HORIZONTAL_END = 0.85;

/** Total height of the pinned wrapper in viewport-heights. */
export const HERO_SCROLL_LENGTH_VH = 700;
