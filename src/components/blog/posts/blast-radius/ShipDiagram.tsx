/*
 * ShipDiagram.tsx
 * Where the idea came from: a ship split into nine watertight compartments by eight
 * bulkheads. The bow is holed and its three compartments flood. Pick the wall height:
 * walls that stop below the deck let the water spill over the top into the next
 * compartment, one after another, while the bow tips down; walls that reach the deck
 * keep the flood where it started. The scene plays on a loop while on screen. A generic
 * ship, not a scale drawing of the Titanic. Reduced motion shows the end state.
 */

"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";
import { useInView } from "./useInView";

type Walls = "short" | "full";

const DECK = 60;
const KEEL = 150;
const WALL_X = [66, 104, 142, 180, 218, 256, 294, 332];
const EDGES = [20, ...WALL_X, 384];
const COMPARTMENTS = EDGES.length - 1;
const DAMAGED = [6, 7, 8];
const SHORT_TOP = 86;
const HULL = `M14 ${DECK} L390 ${DECK} L378 118 Q370 ${KEEL} 340 ${KEEL} L54 ${KEEL} Q24 ${KEEL} 18 112 Z`;
const STEP_MS = 850;

// A clean sine for the sea surface, a little wider than the view so it can slide.
const SEA = (() => {
  let d = "M-40 104";
  for (let x = -40; x <= 480; x += 10) d += ` L${x} ${(104 + Math.sin(x / 10) * 2).toFixed(2)}`;
  return `${d} L480 210 L-40 210 Z`;
})();

const OPTIONS = [
  { value: "short" as const, label: "Stop short" },
  { value: "full" as const, label: "Reach the deck" },
];

// Compartment index -> step at which it floods (Infinity = never).
function floodStep(index: number, walls: Walls) {
  if (DAMAGED.includes(index)) return 1;
  if (walls === "full") return Number.POSITIVE_INFINITY;
  return 2 + (DAMAGED[0] - 1 - index);
}

const LAST_STEP: Record<Walls, number> = { short: 2 + DAMAGED[0] - 1, full: 1 };
const HOLD_STEPS = 3;

export default function ShipDiagram() {
  const [walls, setWalls] = useState<Walls>("short");
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const reduced = useReducedMotion();
  const last = LAST_STEP[walls];

  // Play the flood, hold the end for a moment, then start again.
  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setInterval(
      () => setStep((s) => (s >= last + HOLD_STEPS ? 0 : s + 1)),
      STEP_MS,
    );
    return () => window.clearInterval(timer);
  }, [inView, reduced, last]);

  const now = reduced ? last : Math.min(step, last);
  const flooded = Array.from({ length: COMPARTMENTS }, (_, i) => floodStep(i, walls) <= now);
  const floodedCount = flooded.filter(Boolean).length;
  const spills = floodedCount - DAMAGED.length;
  const tilt = walls === "short" ? floodedCount * 0.45 : floodedCount * 0.3;
  const wallScale = walls === "short" ? (KEEL - SHORT_TOP) / (KEEL - DECK) : 1;
  const waterTop = walls === "short" ? SHORT_TOP - 8 : DECK + 6;

  const status =
    walls === "short"
      ? spills > 0
        ? `Water spilled over ${spills} wall${spills === 1 ? "" : "s"}: ${floodedCount} of ${COMPARTMENTS} compartments flooded and the bow is going under.`
        : `${floodedCount} of ${COMPARTMENTS} compartments flooded at the bow. Watch the wall tops.`
      : `${floodedCount} of ${COMPARTMENTS} compartments flooded. The walls reach the deck, so the water stays where it came in.`;

  return (
    <div ref={rootRef} className="space-y-4">
      <SegmentedControl
        label="Bulkheads (the walls)"
        options={OPTIONS}
        value={walls}
        onChange={(value) => {
          setWalls(value);
          setStep(0);
        }}
      />

      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label={`Side view of a ship split into ${COMPARTMENTS} compartments by walls called bulkheads. The bow is holed. ${status}`}
        className="mx-auto block w-full max-w-2xl"
      >
        <defs>
          <clipPath id="br-ship-hull">
            <path d={HULL} />
          </clipPath>
          {/* Fade the sea out at the sides and the bottom, so it has no hard box edges. */}
          <linearGradient id="br-sea-x" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.12" stopColor="white" stopOpacity="1" />
            <stop offset="0.88" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="br-sea-y" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0.5" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="br-sea-fade-y" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="200">
            <rect x="0" y="90" width="400" height="110" fill="url(#br-sea-y)" />
          </mask>
          <mask id="br-sea-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="200">
            <rect
              x="0"
              y="0"
              width="400"
              height="200"
              fill="url(#br-sea-x)"
              mask="url(#br-sea-fade-y)"
            />
          </mask>
        </defs>

        <g className={styles.tilt} style={{ transform: `rotate(${tilt}deg)` }}>
          {/* Hull body */}
          <path d={HULL} className="fill-paper stroke-none" />

          {/* Water inside the compartments */}
          <g clipPath="url(#br-ship-hull)" data-tone="blue">
            {flooded.map((isFlooded, index) => (
              <rect
                key={EDGES[index]}
                x={EDGES[index]}
                y={waterTop}
                width={EDGES[index + 1] - EDGES[index]}
                height={KEEL - waterTop + 4}
                className={cn("fill-(--tone) opacity-35", styles.fill)}
                style={{ transform: `scaleY(${isFlooded ? 1 : 0})` }}
              />
            ))}
          </g>

          {/* Spill streams over the tops of short walls */}
          {walls === "short" && (
            <g data-tone="blue" fill="none" strokeWidth={2.2} strokeLinecap="round">
              {WALL_X.map((x, k) => {
                // Wall k sits between compartment k and k+1; water pours sternwards over it.
                const pouring =
                  !DAMAGED.includes(k) && flooded[k + 1] && floodStep(k, walls) === now;
                if (!pouring) return null;
                return (
                  <path
                    key={x}
                    d={`M${x + 6} ${SHORT_TOP - 4} Q${x} ${SHORT_TOP - 10} ${x - 6} ${SHORT_TOP + 2} L${x - 8} ${KEEL - 12}`}
                    className={cn("stroke-(--tone)", styles.stream)}
                  />
                );
              })}
            </g>
          )}

          {/* Bulkheads */}
          {WALL_X.map((x) => (
            <rect
              key={x}
              x={x - 1.5}
              y={DECK}
              width={3}
              height={KEEL - DECK}
              rx={1}
              className={cn("fill-ink", styles.wall)}
              style={{ transform: `scaleY(${wallScale})` }}
            />
          ))}

          {/* Hull outline and deck */}
          <path d={HULL} fill="none" strokeWidth={2} className="stroke-ink" />

          {/* Damage at the bow */}
          <g data-tone="red" strokeWidth={2.5} strokeLinecap="round">
            {[
              [300, 136, 312, 132],
              [322, 140, 334, 135],
              [346, 138, 358, 130],
            ].map(([x1, y1, x2, y2]) => (
              <line key={x1} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-(--tone)" />
            ))}
          </g>

          <text x={30} y={52} className="fill-ink-muted text-[15px] font-semibold">
            stern
          </text>
          <text
            x={370}
            y={52}
            textAnchor="end"
            className="fill-ink-muted text-[15px] font-semibold"
          >
            bow
          </text>
        </g>

        {/* Sea in front of the hull */}
        <g data-tone="blue">
          <g mask="url(#br-sea-fade)">
            <path d={SEA} className={cn("fill-(--tone-soft) stroke-(--tone-line)", styles.sea)} />
          </g>
        </g>

        <g data-tone="red">
          <text
            x={330}
            y={186}
            textAnchor="middle"
            className="fill-(--tone) text-[15px] font-semibold"
          >
            holed here
          </text>
        </g>
      </svg>

      <p
        aria-live="polite"
        data-tone={walls === "short" && spills > 0 ? "red" : "green"}
        className={cn(
          styles.ease,
          "rounded-xl border border-(--tone-line) bg-(--tone-soft) px-4 py-3 text-sm leading-relaxed text-ink",
        )}
      >
        {status}
      </p>
    </div>
  );
}
