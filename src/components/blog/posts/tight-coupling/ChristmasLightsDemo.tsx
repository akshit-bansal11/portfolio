/*
 * ChristmasLightsDemo.tsx
 * Hook demo for the Tight Coupling post: a string of fairy
 * lights wired in series (old-school) or in parallel. Blow a
 * bulb and see whether the whole string goes dark.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type KeyboardEvent, useId, useState } from "react";
import { DemoButton, SegmentedControl } from "@/components/blog/DemoControls";
import { sketchCross, sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

type Wiring = "series" | "parallel";

const BULB_COUNT = 8;
const FIRST_X = 34;
const GAP = 42;
const RAIL_Y = 38;
const NEUTRAL_Y = 50;

// Lit colours cycle like a real string of lights.
const BULB_COLORS = ["text-pen", "text-ok", "text-pen-blue", "text-warn"] as const;

const WIRING_OPTIONS = [
  { value: "series" as const, label: "Series (old)" },
  { value: "parallel" as const, label: "Parallel (modern)" },
];

const bulbX = (index: number) => FIRST_X + index * GAP;

// One continuous sagging wire that passes *through* every bulb.
const SERIES_WIRE = (() => {
  let d = `M16 ${RAIL_Y}`;
  let previousX = 16;
  for (let i = 0; i < BULB_COUNT; i++) {
    const x = bulbX(i);
    d += ` Q${(previousX + x) / 2} ${RAIL_Y + 12} ${x} ${RAIL_Y}`;
    previousX = x;
  }
  return `${d} Q${previousX + 12} ${RAIL_Y + 10} ${previousX + 20} ${RAIL_Y - 2}`;
})();

// Two straight-ish rails; every bulb hangs between them on its own.
const LIVE_RAIL = sketchLine(16, RAIL_Y - 8, 352, RAIL_Y - 8, { seed: 31, bow: 2 });
const NEUTRAL_RAIL = sketchLine(16, NEUTRAL_Y - 2, 352, NEUTRAL_Y - 2, { seed: 32, bow: 2 });

// Teardrop bulb hanging from (x, top).
function bulbPath(x: number, top: number): string {
  return `M${x - 5} ${top} C${x - 13} ${top + 12} ${x - 9} ${top + 30} ${x} ${top + 32} C${x + 9} ${
    top + 30
  } ${x + 13} ${top + 12} ${x + 5} ${top}Z`;
}

export default function ChristmasLightsDemo() {
  const [wiring, setWiring] = useState<Wiring>("series");
  const [blown, setBlown] = useState<boolean[]>(() => Array(BULB_COUNT).fill(false));
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();

  const blownCount = blown.filter(Boolean).length;
  const isLit = (index: number) => (wiring === "series" ? blownCount === 0 : !blown[index]);
  const litCount = blown.reduce((count, _, index) => count + (isLit(index) ? 1 : 0), 0);
  const currentFlows = wiring === "parallel" || blownCount === 0;

  const toggleBulb = (index: number) =>
    setBlown((previous) => previous.map((value, i) => (i === index ? !value : value)));

  const onBulbKeyDown = (event: KeyboardEvent<SVGGElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleBulb(index);
    }
  };

  let note = "Tap a bulb to blow it.";
  if (blownCount > 0) {
    note =
      wiring === "series"
        ? "One dead bulb broke the only path for the current. Every bulb depends on every other bulb: that's tight coupling."
        : "Each bulb has its own path to power, so only the dead one goes dark. That's loose coupling.";
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <SegmentedControl
          label="Wiring"
          options={WIRING_OPTIONS}
          value={wiring}
          onChange={setWiring}
        />
        <DemoButton
          onClick={() => setBlown(Array(BULB_COUNT).fill(false))}
          disabled={blownCount === 0}
          className="sm:ml-auto"
        >
          Replace all bulbs
        </DemoButton>
      </div>

      <svg
        viewBox="0 0 370 112"
        role="group"
        aria-labelledby={titleId}
        className="w-full touch-manipulation select-none"
      >
        <title id={titleId}>
          String of {BULB_COUNT} lights wired in {wiring}. {litCount} of {BULB_COUNT} lit.
        </title>

        {/* Plug */}
        <rect
          x={2}
          y={RAIL_Y - 12}
          width={14}
          height={wiring === "series" ? 18 : 26}
          rx={3}
          className="fill-ink"
        />

        {/* Wires */}
        {wiring === "series" ? (
          <path d={SERIES_WIRE} fill="none" strokeWidth={2} className="stroke-ink-muted" />
        ) : (
          <g fill="none" strokeWidth={2} className="stroke-ink-muted">
            <path d={LIVE_RAIL} />
            <path d={NEUTRAL_RAIL} />
          </g>
        )}

        {/* Current flowing (only when the circuit is complete) */}
        {currentFlows && !prefersReducedMotion && (
          <circle r={2.5} className="fill-pen">
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              path={wiring === "series" ? SERIES_WIRE : LIVE_RAIL}
            />
          </circle>
        )}

        {/* Bulbs */}
        {blown.map((isBlown, index) => {
          const x = bulbX(index);
          const lit = isLit(index);
          const top = RAIL_Y + 14;
          const color = BULB_COLORS[index % BULB_COLORS.length];
          return (
            <g
              key={x}
              role="button"
              tabIndex={0}
              aria-pressed={isBlown}
              aria-label={`Bulb ${index + 1}: ${isBlown ? "blown" : lit ? "lit" : "dark"}. Activate to ${
                isBlown ? "replace" : "blow"
              } it.`}
              onClick={() => toggleBulb(index)}
              onKeyDown={(event) => onBulbKeyDown(event, index)}
              className="group cursor-pointer outline-none"
            >
              {/* Touch target */}
              <rect x={x - 19} y={RAIL_Y - 10} width={38} height={70} fill="transparent" />
              {/* Wire(s) down to the socket */}
              {wiring === "parallel" ? (
                <g strokeWidth={1.5} className="stroke-ink-muted">
                  <line x1={x - 3} y1={RAIL_Y - 8} x2={x - 3} y2={top - 4} />
                  <line x1={x + 3} y1={NEUTRAL_Y - 2} x2={x + 3} y2={top - 4} />
                </g>
              ) : (
                <line
                  x1={x}
                  y1={RAIL_Y}
                  x2={x}
                  y2={top - 4}
                  strokeWidth={1.5}
                  className="stroke-ink-muted"
                />
              )}
              {/* Socket */}
              <rect x={x - 5} y={top - 6} width={10} height={8} rx={1.5} className="fill-ink" />
              {/* Bulb */}
              <motion.path
                d={bulbPath(x, top + 2)}
                strokeWidth={1.8}
                initial={false}
                animate={{ opacity: lit ? 1 : isBlown ? 0.9 : 0.55 }}
                transition={{ duration: prefersReducedMotion ? 0 : lit ? 0.25 : 0.12 }}
                strokeDasharray={isBlown ? "3 3" : undefined}
                className={cn(
                  "transition-colors",
                  lit
                    ? cn(color, "fill-current stroke-current drop-shadow-[0_0_6px_currentColor]")
                    : "fill-paper-raised stroke-ink-muted",
                )}
              />
              {isBlown && (
                <path
                  d={sketchCross(x, top + 17, 12, index + 3)}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="stroke-danger"
                />
              )}
              {/* Keyboard focus ring */}
              <rect
                x={x - 16}
                y={top - 10}
                width={32}
                height={48}
                rx={8}
                fill="none"
                strokeWidth={2}
                strokeDasharray="3 3"
                className="stroke-pen opacity-0 group-focus-visible:opacity-100"
              />
            </g>
          );
        })}
      </svg>

      <div className="rounded-xl border-2 border-dashed border-rule px-4 py-3">
        <p aria-live="polite" className="font-hand text-[1.4rem] leading-snug text-pen">
          {note}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {litCount} of {BULB_COUNT} bulbs lit · {blownCount} blown
        </p>
      </div>
    </div>
  );
}
