/*
 * SkillTile.tsx
 * One skill as a hand-bordered sticker: icon + name, tilted a little, straightening and lifting
 * on hover and focus. A skill with `usedIn` is a button that reveals a handwritten paper slip
 * listing where it was used: hover previews it on fine pointers, a click or tap pins it, Esc,
 * blur and an outside click close it. A skill without extra info is a plain list item.
 */

"use client";

import { motion } from "framer-motion";
import {
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import TechIcon from "@/components/icons/TechIcon";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";

// Width of the slip (matches `w-56`); used to decide which side it opens towards.
const SLIP_WIDTH = 224;
const SCREEN_MARGIN = 16;

// Pop-in driven by the group's stagger (opacity and scale only).
const POP = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
};

// Tiny arrow from the slip up to its tile.
const SLIP_ARROW = sketchArrow(8, 16, 8, 2, { seed: 17, curve: 0.3, headSize: 5 });

// Resting tilts (all within -2..2deg), as full class names so Tailwind can see them.
export const TILTS = [
  "-rotate-[1.6deg]",
  "rotate-[1.2deg]",
  "-rotate-[0.7deg]",
  "rotate-[1.8deg]",
  "-rotate-[1.2deg]",
  "rotate-[0.8deg]",
] as const;

// Border colour per category (cycles through the three doodle tokens).
export const BORDERS = ["border-doodle-1", "border-doodle-2", "border-doodle-3"] as const;

const TILE =
  "hand-border inline-flex min-h-11 items-center gap-2 border-2 px-3 py-1.5 font-grotesk text-sm font-medium text-hero-ink transition-[rotate,translate,border-radius] duration-200 hover:-translate-y-[3px] hover:rotate-0 focus-visible:-translate-y-[3px] focus-visible:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-pen motion-reduce:transition-none";

interface SkillTileProps {
  skill: Skill;
  tilt: (typeof TILTS)[number];
  border: (typeof BORDERS)[number];
  alt: boolean;
}

// Renders one skill tile (a list item).
export default function SkillTile({ skill, tilt, border, alt }: SkillTileProps) {
  const { name, usedIn } = skill;
  const id = useId();
  const itemRef = useRef<HTMLLIElement>(null);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const open = hover || pinned;

  // Outside click closes a pinned slip.
  useEffect(() => {
    if (!pinned) return;
    const close = (event: globalThis.PointerEvent) => {
      if (!(event.target instanceof Node && itemRef.current?.contains(event.target))) {
        setPinned(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [pinned]);

  // Opens towards the side with room, so the slip never leaves the screen.
  const measure = () => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) setAlignRight(rect.left + SLIP_WIDTH > window.innerWidth - SCREEN_MARGIN);
  };

  const tileClass = cn(TILE, border, tilt, alt && "hand-border-alt");

  if (!usedIn?.length) {
    return (
      <motion.li variants={POP}>
        <span className={tileClass}>
          <TechIcon name={name} className="h-5 w-5" />
          {name}
        </span>
      </motion.li>
    );
  }

  return (
    <motion.li
      ref={itemRef}
      variants={POP}
      className={cn("relative", open && "z-40")}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setHover(false);
          setPinned(false);
        }
      }}
      onBlur={(event: FocusEvent) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node && event.currentTarget.contains(next))) setPinned(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        className={cn(tileClass, "cursor-pointer")}
        onPointerEnter={(event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          measure();
          setHover(true);
        }}
        onPointerLeave={() => setHover(false)}
        onClick={() => {
          measure();
          setPinned((value) => !value);
        }}
      >
        <TechIcon name={name} className="h-5 w-5" />
        {name}
      </button>
      <div
        id={id}
        hidden={!open}
        className={cn(
          "absolute top-full z-30 mt-3 w-56 max-w-[calc(100vw-2rem)] border border-page-border bg-page-bg px-3 py-2 text-page-ink",
          alignRight ? "right-0" : "left-0",
        )}
        style={{ boxShadow: "var(--note-shadow)" }}
      >
        <svg
          aria-hidden
          viewBox="0 0 16 18"
          className={cn(
            "absolute -top-4 h-4 w-4 overflow-visible text-hero-pen",
            alignRight ? "right-4" : "left-4",
          )}
        >
          <DrawnPath d={SLIP_ARROW.shaft} duration={0.3} />
          <DrawnPath d={SLIP_ARROW.head} delay={0.3} duration={0.15} />
        </svg>
        <ul className="flex flex-col gap-1 font-hand text-xl font-semibold leading-tight text-hero-pen">
          {usedIn.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}
