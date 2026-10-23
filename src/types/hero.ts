/*
 * hero.ts
 * Type definitions for the scroll hero stages and
 * animated text component props.
 */

import type { ReactNode } from "react";

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
  /** Swaps the rendered content of a segment (e.g. to wrap it in a hand-drawn mark). */
  renderWord?: (segment: string, index: number) => ReactNode;
  delayOffset?: number;
}

export interface JumpToCardData {
  label: string;
  sectionId: string;
  description: string;
}
