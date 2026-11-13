/*
 * ui.ts
 * Shared class strings for the infra widgets, so every control has the same thin outline,
 * tinted fill, focus ring and press feedback. Colour comes from the nearest `data-tone`.
 */

import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import s from "./infra.module.css";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)";

/** The widget frame: raised paper, hairline rule, rounded. */
export const FRAME = "my-10 rounded-2xl border border-rule bg-paper-raised p-4 sm:p-5";

/** A quiet button: hairline rule, ink text, tone on hover. */
export const BUTTON = cn(
  s.press,
  FOCUS,
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-rule bg-paper px-3 text-sm font-medium text-ink",
  "hover:border-(--tone-line) hover:text-(--tone) disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-rule disabled:hover:text-ink",
);

/** A tinted primary button (play, answer). */
export const PRIMARY = cn(
  s.press,
  FOCUS,
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-(--tone-line) bg-(--tone-soft) px-3 text-sm font-semibold text-(--tone)",
  "hover:border-(--tone) disabled:cursor-not-allowed disabled:opacity-35",
);

/** A choice in a tab row or toggle group; selected via aria-selected / aria-pressed. */
export const CHOICE = cn(
  s.press,
  FOCUS,
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-rule bg-paper px-3 text-sm font-semibold text-ink-muted",
  "hover:border-(--tone-line) hover:text-(--tone)",
  "aria-selected:border-(--tone) aria-selected:bg-(--tone-soft) aria-selected:text-(--tone)",
  "aria-pressed:border-(--tone) aria-pressed:bg-(--tone-soft) aria-pressed:text-(--tone)",
);

/**
 * Arrow keys, Home and End move between the tabs of a tablist (the tabs must be its
 * direct children). Call from each tab's onKeyDown.
 */
export function tabKeys(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  select: (next: number) => void,
) {
  const moves: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowDown: index + 1,
    ArrowLeft: index - 1,
    ArrowUp: index - 1,
    Home: 0,
    End: count - 1,
  };
  if (!(event.key in moves)) return;
  event.preventDefault();
  const next = (moves[event.key] + count) % count;
  select(next);
  const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]');
  tabs?.[next]?.focus();
}

export { s as motion };
