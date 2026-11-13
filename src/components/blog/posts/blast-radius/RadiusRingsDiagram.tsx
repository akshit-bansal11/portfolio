/*
 * RadiusRingsDiagram.tsx
 * "What it is": the same bug, drawn as five nested rings of growing damage (one request,
 * one server, one cell, one region, everyone). A shockwave grows from the bug and stops
 * at the wall you pick; rings outside the wall stay safe. It walks through the five
 * fates on its own until you pick one (hovering a fate previews it). Reduced motion shows
 * the chosen fate without the wave.
 */

"use client";

import { useReducedMotion } from "framer-motion";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";
import { useInView } from "./useInView";

interface Ring {
  label: string;
  note: string;
  rx: number;
  ry: number;
  tone: Tone;
}

const RINGS: Ring[] = [
  { label: "one request", note: "a retry fixes it", rx: 52, ry: 32, tone: "green" },
  { label: "one server", note: "the load balancer routes around it", rx: 86, ry: 52, tone: "cyan" },
  { label: "one cell", note: "a slice of customers notice", rx: 120, ry: 72, tone: "amber" },
  { label: "one region", note: "a country notices", rx: 154, ry: 92, tone: "pink" },
  { label: "everyone", note: "it's on the news", rx: 188, ry: 112, tone: "red" },
];

const CX = 200;
const CY = 124;
const CYCLE_MS = 2400;

export default function RadiusRingsDiagram() {
  const [picked, setPicked] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const reduced = useReducedMotion();

  // Walk through the five fates until the reader picks one.
  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const timer = window.setInterval(() => setPicked((p) => (p + 1) % RINGS.length), CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [auto, inView, reduced]);

  const shown = preview ?? picked;
  const wall = RINGS[shown];

  const choose = (index: number) => {
    setAuto(false);
    setPicked(index);
  };

  return (
    <div ref={rootRef} className="grid items-center gap-5 md:grid-cols-[1.35fr_1fr]">
      <svg
        viewBox="0 0 400 244"
        role="img"
        aria-label={`Five nested rings around one bug: one request, one server, one cell, one region, everyone. Showing: the wall holds at ${wall.label}, so ${wall.note}.`}
        className="w-full"
      >
        {/* Rings, outside in, so the inner ones sit on top. */}
        {RINGS.map((_, k) => {
          const index = RINGS.length - 1 - k;
          const ring = RINGS[index];
          const inside = index <= shown;
          const isWall = index === shown;
          return (
            <ellipse
              key={ring.label}
              data-tone={inside ? wall.tone : undefined}
              cx={CX}
              cy={CY}
              rx={ring.rx}
              ry={ring.ry}
              strokeWidth={isWall ? 2 : 1.2}
              strokeDasharray={inside ? undefined : "4 4"}
              className={cn(
                styles.ease,
                inside ? "fill-(--tone-soft) stroke-(--tone)" : "fill-transparent stroke-rule",
                isWall && !reduced && styles["wall-hit"],
              )}
              style={{ "--delay": `${(RINGS.length - index) * 40}ms` } as CSSProperties}
            />
          );
        })}

        {/* The shockwave: restarts whenever the wall moves. */}
        {!reduced && (
          <ellipse
            key={`wave-${shown}`}
            data-tone={wall.tone}
            cx={CX}
            cy={CY}
            rx={wall.rx}
            ry={wall.ry}
            fill="none"
            strokeWidth={3}
            className={cn("stroke-(--tone)", styles.wave)}
          />
        )}

        {RINGS.map((ring, index) => {
          const inside = index <= shown;
          return (
            <text
              key={ring.label}
              data-tone={inside ? wall.tone : undefined}
              x={CX}
              y={CY - ring.ry + 15}
              textAnchor="middle"
              className={cn(
                "text-[14px] font-semibold",
                styles.ease,
                inside ? "fill-(--tone)" : "fill-ink-muted",
              )}
            >
              {ring.label}
              {!inside && index === shown + 1 ? " · safe" : ""}
            </text>
          );
        })}

        <g data-tone="red">
          {!reduced && (
            <circle
              cx={CX}
              cy={CY + 6}
              r={6}
              className={cn("fill-(--tone)", styles["bug-pulse"])}
            />
          )}
          <circle cx={CX} cy={CY + 6} r={6} className="fill-(--tone)" />
          <text
            x={CX}
            y={CY + 26}
            textAnchor="middle"
            className="fill-ink font-mono text-[12px] font-semibold"
          >
            bug
          </text>
        </g>
      </svg>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
          Where does the wall hold?
        </p>
        <ul className="grid list-none gap-1.5 p-0">
          {RINGS.map((ring, index) => {
            const active = index === shown;
            return (
              <li key={ring.label}>
                <button
                  type="button"
                  data-tone={ring.tone}
                  aria-pressed={!auto && picked === index}
                  onClick={() => choose(index)}
                  onPointerEnter={() => setPreview(index)}
                  onPointerLeave={() => setPreview(null)}
                  onFocus={() => setPreview(index)}
                  onBlur={() => setPreview(null)}
                  className={cn(
                    styles.ease,
                    "flex min-h-10 w-full items-center gap-3 rounded-lg border px-3 py-1.5 text-left text-sm",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)",
                    active
                      ? "border-(--tone-line) bg-(--tone-soft)"
                      : "border-transparent hover:border-rule",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full border-2 border-(--tone)",
                      index <= shown && "bg-(--tone)",
                    )}
                  />
                  <span className="min-w-0">
                    <span className={cn("font-semibold", active ? "text-(--tone)" : "text-ink")}>
                      {ring.label}
                    </span>
                    <span className="text-ink-muted"> · {ring.note}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p aria-live="polite" className="mt-3 text-sm text-ink-muted">
          {auto
            ? "Playing through all five. Pick one to stop."
            : `Wall at ${wall.label}: ${wall.note}.`}
        </p>
      </div>
    </div>
  );
}
