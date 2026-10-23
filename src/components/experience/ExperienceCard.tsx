/*
 * ExperienceCard.tsx
 * One experience entry as an index card taped to the board: cream ruled paper with a red
 * margin line and dark ink in both themes, a slight tilt, and a soft paper shadow. Shows the
 * logo (or the company's initials), company, role, location, a summary, the first two points
 * (a hand-drawn button reveals the rest) and the skills as icon stamps. Straightens and
 * lifts on hover and focus.
 */

"use client";

import Image from "next/image";
import { useId, useState } from "react";
import Stamp from "@/components/hero/elements/Stamp";
import Tape from "@/components/hero/elements/Tape";
import TechIcon from "@/components/icons/TechIcon";
import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { ExperienceItem, ExperiencePoint } from "@/types/experience";

// Points shown before the "show all" button.
const VISIBLE_POINTS = 2;

// Resting tilt per entry, within -1..1deg (full class names so Tailwind can see them).
const TILTS = [
  "-rotate-[0.8deg]",
  "rotate-[0.6deg]",
  "-rotate-[0.4deg]",
  "rotate-[0.9deg]",
  "-rotate-[0.7deg]",
  "rotate-[0.5deg]",
] as const;

// Ruled lines plus one red margin line, painted on the paper.
const PAPER_LINES = [
  "linear-gradient(to right, transparent calc(1.75rem - 1px), var(--card-margin) calc(1.75rem - 1px), var(--card-margin) 1.75rem, transparent 1.75rem)",
  "repeating-linear-gradient(to bottom, transparent 0 27px, var(--card-rule) 27px 28px)",
].join(", ");

// Small hand-drawn tick for each point.
const TICK = `${sketchLine(2, 11, 8, 17, { seed: 31, jitter: 0.5, bow: 0.5 })} ${sketchLine(
  8,
  17,
  18,
  3,
  { seed: 32, jitter: 0.5, bow: 1 },
)}`;

// Company initials for entries without a logo.
function initials(company: string): string {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// One bullet with its drawn tick.
function Point({ point }: { point: ExperiencePoint }) {
  return (
    <li className="flex items-start gap-2 font-grotesk text-sm leading-relaxed">
      <svg
        aria-hidden
        viewBox="0 0 22 22"
        className="mt-1 h-4 w-4 shrink-0 overflow-visible text-page-ink/70"
      >
        <path
          d={TICK}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        {typeof point === "string" ? (
          point
        ) : (
          <>
            <strong className="font-semibold">{point.label}:</strong> {point.body}
          </>
        )}
      </span>
    </li>
  );
}

interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
}

// Renders the card.
export default function ExperienceCard({ item, index }: ExperienceCardProps) {
  const { company, role, location, generalPoint, points, skills = [], logo } = item;
  const [expanded, setExpanded] = useState(false);
  const restId = useId();
  const shown = points.slice(0, VISIBLE_POINTS);
  const rest = points.slice(VISIBLE_POINTS);

  return (
    <div
      className={cn(
        "relative text-page-ink transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 focus-within:-translate-y-1 focus-within:rotate-0 motion-reduce:transition-none",
        TILTS[index % TILTS.length],
      )}
    >
      <div
        className="border border-page-border bg-page-bg py-5 pl-9 pr-4 sm:pr-6"
        style={{ backgroundImage: PAPER_LINES, boxShadow: "var(--note-shadow)" }}
      >
        <div className="flex items-center gap-3">
          {logo ? (
            <Image
              src={logo}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-md object-contain"
            />
          ) : (
            <span
              aria-hidden
              className="hand-border flex h-9 w-9 shrink-0 items-center justify-center border-2 border-page-ink font-display text-sm font-medium"
            >
              {initials(company)}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="font-display text-xl font-medium leading-tight tracking-[-0.01em]">
              {company}
            </h3>
            <p className="font-grotesk text-sm font-semibold leading-snug">{role}</p>
            <p className="font-grotesk text-xs text-page-muted">{location}</p>
          </div>
        </div>

        {generalPoint && (
          <p className="mt-3 font-grotesk text-sm leading-relaxed">{generalPoint}</p>
        )}

        {points.length > 0 && (
          <div className="mt-3">
            <ul className="flex flex-col gap-1.5">
              {shown.map((point) => (
                <Point key={typeof point === "string" ? point : point.label} point={point} />
              ))}
            </ul>
            {rest.length > 0 && (
              <>
                <div
                  id={restId}
                  inert={!expanded}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none",
                    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <ul className="flex flex-col gap-1.5 overflow-hidden">
                    {rest.map((point) => (
                      <Point key={typeof point === "string" ? point : point.label} point={point} />
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={restId}
                  onClick={() => setExpanded((value) => !value)}
                  className="hand-border hand-border-morph mt-3 inline-flex min-h-11 cursor-pointer items-center border-2 border-page-ink px-4 py-2 font-grotesk text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-ink motion-reduce:transition-none"
                >
                  {expanded ? "show less" : `show all ${points.length}`}
                </button>
              </>
            )}
          </div>
        )}

        {skills.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <Stamp
                key={skill}
                label={skill}
                index={i}
                onPaper
                icon={<TechIcon name={skill} className="h-3.5 w-3.5" />}
              />
            ))}
          </ul>
        )}
      </div>
      <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-2" />
    </div>
  );
}
