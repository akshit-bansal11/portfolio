/*
 * ChristmasLightsDemo.tsx
 * Hook demo for the Tight Coupling post: a string of fairy lights wired in series
 * (old-school, one path through every bulb) or in parallel (each bulb between two
 * rails). Current runs along the wires as moving dashes. Blow a bulb: in series the
 * current stops and the darkness spreads out from the dead bulb; in parallel only that
 * bulb goes out. Replacing bulbs relights the string from the plug outwards.
 */

"use client";

import { RotateCcw } from "lucide-react";
import { type CSSProperties, type KeyboardEvent, useId, useState } from "react";
import { SegmentedControl } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

type Wiring = "series" | "parallel";

const COUNT = 8;
const FIRST_X = 62;
const GAP = 38;
const TOP = 26; // series wire / live rail
const NEUTRAL = 40; // parallel return rail
const SOCKET = 60; // top of each socket
const BULB_Y = 82; // bulb centre
const END_X = FIRST_X + (COUNT - 1) * GAP + 26;

const BULB_TONES: Tone[] = ["amber", "pink", "green", "blue", "violet", "cyan"];

const WIRING_OPTIONS = [
  { value: "series" as const, label: "Series (old)" },
  { value: "parallel" as const, label: "Parallel (modern)" },
];

const bulbX = (i: number) => FIRST_X + i * GAP;

// One path that dips down through every socket and back up: the only way round.
const SERIES_PATH = (() => {
  let d = `M24 ${TOP}`;
  for (let i = 0; i < COUNT; i++) {
    const x = bulbX(i);
    d += ` H${x - 4} V${SOCKET + 4} H${x + 4} V${TOP}`;
  }
  return `${d} H${END_X} V12 H24`;
})();

const LIVE_PATH = `M24 ${TOP} H${END_X}`;
const NEUTRAL_PATH = `M24 ${NEUTRAL} H${END_X}`;

export default function ChristmasLightsDemo() {
  const [wiring, setWiring] = useState<Wiring>("series");
  const [blown, setBlown] = useState<boolean[]>(() => Array(COUNT).fill(false));
  const titleId = useId();

  const blownCount = blown.filter(Boolean).length;
  const firstBlown = blown.indexOf(true);
  const isLit = (i: number) => (wiring === "series" ? blownCount === 0 : !blown[i]);
  const litCount = blown.reduce((n, _, i) => n + (isLit(i) ? 1 : 0), 0);
  const flowing = wiring === "parallel" || blownCount === 0;

  const toggle = (i: number) => setBlown((prev) => prev.map((v, j) => (j === i ? !v : v)));
  const onKey = (event: KeyboardEvent<SVGGElement>, i: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(i);
    }
  };

  // Darkness spreads out from the dead bulb; light returns from the plug.
  const delayFor = (i: number) => {
    if (wiring === "parallel") return 0;
    if (firstBlown >= 0) return Math.abs(i - firstBlown) * 70;
    return i * 60;
  };

  let note = "Tap a bulb to blow it. Tap it again to replace it.";
  if (blownCount > 0) {
    note =
      wiring === "series"
        ? "One dead bulb broke the only path, so every bulb went dark. Each bulb depends on all the others: tight coupling."
        : "Each bulb has its own path to power, so only the dead one is out. That's loose coupling.";
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
        <button
          type="button"
          onClick={() => setBlown(Array(COUNT).fill(false))}
          disabled={blownCount === 0}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rule bg-paper px-4 text-sm font-semibold text-ink transition hover:border-ink-muted active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 sm:ml-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Replace all bulbs
        </button>
      </div>

      <div className="rounded-xl border border-rule bg-paper p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${END_X + 14} 112`}
          role="group"
          aria-labelledby={titleId}
          className="w-full touch-manipulation select-none"
        >
          <title id={titleId}>
            String of {COUNT} lights wired in {wiring}. {litCount} of {COUNT} lit.
          </title>

          {/* Plug */}
          <g>
            <rect
              x={6}
              y={8}
              width={18}
              height={38}
              rx={4}
              className="fill-paper-raised stroke-ink-muted/60"
            />
            <rect x={2} y={18} width={4} height={4} rx={1} className="fill-ink-muted" />
            <rect x={2} y={30} width={4} height={4} rx={1} className="fill-ink-muted" />
          </g>

          {/* Bare wires */}
          <g fill="none" strokeWidth={1.6} strokeLinejoin="round" className="stroke-ink-muted/60">
            {wiring === "series" ? (
              <path d={SERIES_PATH} />
            ) : (
              <>
                <path d={LIVE_PATH} />
                <path d={NEUTRAL_PATH} />
                {blown.map((_, i) => {
                  const x = bulbX(i);
                  return (
                    <g key={x}>
                      <path d={`M${x - 4} ${TOP} V${SOCKET}`} />
                      <path d={`M${x + 4} ${NEUTRAL} V${SOCKET}`} />
                    </g>
                  );
                })}
              </>
            )}
          </g>

          {/* Current: dashes moving along every live path */}
          {flowing && (
            <g
              data-tone="amber"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-(--tone)"
            >
              {wiring === "series" ? (
                <path d={SERIES_PATH} className={styles.flow} />
              ) : (
                <>
                  <path d={LIVE_PATH} className={styles.flow} />
                  {blown.map((isBlown, i) =>
                    isBlown ? null : (
                      <path
                        key={bulbX(i)}
                        d={`M${bulbX(i) - 4} ${TOP} V${SOCKET}`}
                        className={styles.flow}
                      />
                    ),
                  )}
                </>
              )}
            </g>
          )}

          {/* Bulbs */}
          {blown.map((isBlown, i) => {
            const x = bulbX(i);
            const lit = isLit(i);
            const tone = BULB_TONES[i % BULB_TONES.length];
            return (
              <g
                key={x}
                data-tone={isBlown ? "red" : tone}
                role="button"
                tabIndex={0}
                aria-pressed={isBlown}
                aria-label={`Bulb ${i + 1}: ${isBlown ? "blown" : lit ? "lit" : "dark"}. Activate to ${
                  isBlown ? "replace" : "blow"
                } it.`}
                onClick={() => toggle(i)}
                onKeyDown={(event) => onKey(event, i)}
                className="group cursor-pointer outline-none"
              >
                <rect x={x - 19} y={SOCKET - 10} width={38} height={56} fill="transparent" />
                {/* Focus / hover ring */}
                <rect
                  x={x - 16}
                  y={SOCKET - 6}
                  width={32}
                  height={48}
                  rx={10}
                  fill="none"
                  strokeWidth={1.5}
                  className="stroke-(--tone-line) opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <rect
                  x={x - 5}
                  y={SOCKET}
                  width={10}
                  height={9}
                  rx={2}
                  className="fill-paper-raised stroke-ink-muted"
                  strokeWidth={1}
                />
                <g
                  className={cn(lit && styles.twinkle)}
                  style={{ "--delay": `${-i * 0.33}s` } as CSSProperties}
                >
                  <circle
                    cx={x}
                    cy={BULB_Y}
                    r={11}
                    strokeWidth={1.5}
                    strokeDasharray={isBlown ? "3 3" : undefined}
                    className={cn(
                      "transition-[fill,stroke,fill-opacity] duration-300",
                      lit
                        ? "fill-(--tone) stroke-(--tone)"
                        : "fill-paper-raised stroke-ink-muted/50",
                    )}
                    style={{ fillOpacity: lit ? 0.5 : 1, transitionDelay: `${delayFor(i)}ms` }}
                  />
                  {/* Filament */}
                  <path
                    d={`M${x - 4} ${BULB_Y + 2} q2 -6 4 0 q2 6 4 0`}
                    fill="none"
                    strokeWidth={1.3}
                    className={cn(
                      "transition-[stroke] duration-300",
                      lit ? "stroke-ink" : "stroke-ink-muted/50",
                    )}
                    style={{ transitionDelay: `${delayFor(i)}ms` }}
                  />
                </g>
                {isBlown && (
                  <g className="tut-pop">
                    <circle
                      cx={x}
                      cy={BULB_Y}
                      r={11}
                      fill="none"
                      strokeWidth={1.5}
                      className={cn("stroke-(--tone)", styles.ring)}
                    />
                    <path
                      d={`M${x - 5} ${BULB_Y - 5} l10 10 m0 -10 l-10 10`}
                      strokeWidth={2}
                      strokeLinecap="round"
                      className="stroke-(--tone)"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div
        data-tone={blownCount === 0 ? "amber" : wiring === "series" ? "red" : "green"}
        className="rounded-xl border border-(--tone-line) bg-(image:--tone-fill) px-4 py-3 transition-colors"
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn("h-2 w-2 rounded-full bg-(--tone)", flowing && "tut-ping")}
            />
            {flowing ? "Current flowing" : "Circuit open"}
          </span>
          <span className="font-mono font-semibold tracking-normal text-ink-muted normal-case">
            {litCount}/{COUNT} lit · {blownCount} blown
          </span>
        </p>
        <p aria-live="polite" className="mt-1.5 leading-snug text-ink">
          {note}
        </p>
      </div>
    </div>
  );
}
