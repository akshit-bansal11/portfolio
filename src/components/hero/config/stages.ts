/**
 * Four-stage hero scroll timeline:
 *
 *  1. tagline  – full-screen word-by-word tagline reveal
 *  2. profile  – logo flips to image; hover callouts appear
 *  3. socials  – callouts fade; profile shrinks up; resume + icons rise
 *  4. jumpto   – profile+socials slide left; JumpTo panel slides in
 *
 * Each stage has an "entry" portion (motion) and a "dwell" portion
 * (hold — user must keep scrolling before the next beat begins).
 */

import type { HeroStage } from "../types";

export const HERO_STAGES = {
	tagline: { id: "tagline", range: [0.0, 0.18] },
	profile: { id: "profile", range: [0.18, 0.42] },
	socials: { id: "socials", range: [0.42, 0.62] },
	jumpto: { id: "jumpto", range: [0.62, 0.86] },
} as const satisfies Record<string, HeroStage>;

/** Fraction of each stage's window spent animating (rest = dwell). */
export const STAGE_ENTRY_RATIO = 0.5;

/** Progress value where the entry animation of a stage completes. */
export const entryEnd = (range: readonly [number, number], ratio = STAGE_ENTRY_RATIO): number =>
	range[0] + (range[1] - range[0]) * ratio;

/**
 * Progress threshold above which the hero is considered "done".
 * NavBar gating references this.
 */
export const HERO_HORIZONTAL_END = 0.88;

/** Total pinned wrapper height in viewport-heights. */
export const HERO_SCROLL_LENGTH_VH = 800;
