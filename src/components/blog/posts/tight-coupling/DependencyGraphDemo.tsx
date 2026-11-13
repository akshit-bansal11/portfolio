/*
 * DependencyGraphDemo.tsx
 * The main Tight Coupling demo. A small online store drawn as a module graph that can be
 * wired tightly or loosely. Calls carry small packets; messages through the event bus run
 * as moving dashes. Click (or press Enter on) a module to break it or change it: the
 * failure travels back along the arrows hop by hop, and each hit module takes on its new
 * state. Hover or focus a module to trace its arrows. Switching the wiring slides every
 * module to its new place.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { type KeyboardEvent, useId, useState } from "react";
import { SegmentedControl } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import {
  type Action,
  type Architecture,
  computeImpact,
  EDGES,
  type Edge,
  type Impact,
  isEdgeHot,
  LAYOUTS,
  MODULES,
  type ModuleId,
  modulesFor,
  type NodeState,
  VIEWBOX,
} from "./dependencyGraph";
import styles from "./motion.module.css";

// Seconds between each hop of the cascade.
const HOP = 0.38;

// Tone and tag for each state. No tone = neutral.
const STATE_LOOK: Record<
  NodeState,
  { tone?: Tone; tag?: string; label: string; dashed?: boolean }
> = {
  healthy: { label: "working" },
  broken: { tone: "red", tag: "broken", label: "broken" },
  changed: { tone: "green", tag: "changed", label: "changed" },
  down: { tone: "red", tag: "down", label: "down", dashed: true },
  degraded: { tone: "amber", tag: "fallback", label: "running a fallback" },
  waiting: { tone: "blue", tag: "holding msgs", label: "holding messages" },
  idle: { tag: "idle", label: "idle", dashed: true },
  edit: { tone: "red", tag: "must edit", label: "must be edited", dashed: true },
  retest: { tone: "amber", tag: "re-test", label: "must be re-tested" },
};

const ARCHITECTURE_OPTIONS = [
  { value: "tight" as const, label: "Tightly coupled" },
  { value: "loose" as const, label: "Loosely coupled" },
];

const ACTION_OPTIONS = [
  { value: "break" as const, label: "Break it" },
  { value: "change" as const, label: "Change it" },
];

// Point where the line from box centre (x, y) towards (tx, ty) leaves the box.
function exitPoint(
  x: number,
  y: number,
  tx: number,
  ty: number,
  halfW: number,
  halfH: number,
  pad: number,
): [number, number] {
  const dx = tx - x;
  const dy = ty - y;
  const t = Math.min(
    dx === 0 ? Number.POSITIVE_INFINITY : (halfW + pad) / Math.abs(dx),
    dy === 0 ? Number.POSITIVE_INFINITY : (halfH + pad) / Math.abs(dy),
  );
  return [x + dx * t, y + dy * t];
}

// How far each arrow bows sideways, as a share of its length. A small default bend keeps
// two-way pairs apart; a few long arrows bow further to route around boxes in their way.
const BEND: Record<string, number> = {
  "checkout-email": 0.7,
  "cart-inventory": -0.22,
};
const DEFAULT_BEND = 0.12;

// Gently curved arrow between two modules, plus an arrowhead at the dependency's end.
function edgeGeometry(edge: Edge, architecture: Architecture) {
  const layout = LAYOUTS[architecture];
  const a = layout[edge.from];
  const b = layout[edge.to];
  if (!a || !b) return null;
  const A = MODULES[edge.from];
  const B = MODULES[edge.to];
  const bend = BEND[`${edge.from}-${edge.to}`] ?? DEFAULT_BEND;
  // Control point: the midpoint pushed out along the normal.
  const cx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
  const cy = (a.y + b.y) / 2 + (b.x - a.x) * bend;
  const [x1, y1] = exitPoint(a.x, a.y, cx, cy, A.width / 2, A.height / 2, 2);
  const [x2, y2] = exitPoint(b.x, b.y, cx, cy, B.width / 2, B.height / 2, 4);
  const angle = Math.atan2(y2 - cy, x2 - cx);
  const size = 6;
  const head = [
    [x2, y2],
    [x2 - size * Math.cos(angle - 0.45), y2 - size * Math.sin(angle - 0.45)],
    [x2 - size * Math.cos(angle + 0.45), y2 - size * Math.sin(angle + 0.45)],
  ]
    .map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`)
    .join(" ");
  const f = (n: number) => n.toFixed(1);
  return { d: `M${f(x1)} ${f(y1)} Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`, head };
}

export default function DependencyGraphDemo() {
  const [architecture, setArchitecture] = useState<Architecture>("tight");
  const [action, setAction] = useState<Action>("break");
  const [target, setTarget] = useState<ModuleId | null>(null);
  const [traced, setTraced] = useState<ModuleId | null>(null);
  const reduced = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  const impact: Impact | null = target ? computeImpact(architecture, action, target) : null;
  const modules = modulesFor(architecture);
  const edges = EDGES[architecture];
  const hop = reduced ? 0 : HOP;
  const busDown = impact?.states.bus?.state === "broken";

  const changeArchitecture = (next: Architecture) => {
    setArchitecture(next);
    setTarget(null);
  };
  const changeAction = (next: Action) => {
    setAction(next);
    setTarget(null);
  };
  const toggleTarget = (id: ModuleId) => setTarget((current) => (current === id ? null : id));
  const onNodeKey = (event: KeyboardEvent<SVGGElement>, id: ModuleId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTarget(id);
    }
  };

  const affected = impact
    ? modules.filter((id) => {
        const state = impact.states[id]?.state;
        return state && state !== "idle" && state !== "waiting";
      })
    : [];
  const statesInUse = impact
    ? [...new Set(Object.values(impact.states).map((entry) => entry.state))]
    : [];

  const idleNote =
    action === "break"
      ? "Tap any box to break it. Tap it again to fix it. Hover a box to trace its arrows."
      : "Tap any box to change its insides.";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SegmentedControl
          label="Wiring"
          options={ARCHITECTURE_OPTIONS}
          value={architecture}
          onChange={changeArchitecture}
        />
        <SegmentedControl
          label="When I tap a box"
          options={ACTION_OPTIONS}
          value={action}
          onChange={changeAction}
        />
        <button
          type="button"
          onClick={() => setTarget(null)}
          disabled={!target}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rule bg-paper px-4 text-sm font-semibold text-ink transition hover:border-ink-muted active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 sm:ml-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>

      <div className="dg-canvas rounded-xl border border-rule p-1 sm:p-3">
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          role="group"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="mx-auto w-full max-w-2xl touch-manipulation select-none"
        >
          <title id={titleId}>
            {architecture === "tight" ? "Tightly coupled" : "Loosely coupled"} online store module
            graph
          </title>
          <desc id={descId}>
            Each box is a module. Arrows point from a module to the module it depends on. Dashed
            arrows are messages through the event bus. Activate a module to {action} it.
          </desc>

          {/* Edges */}
          <AnimatePresence mode="popLayout">
            <motion.g
              key={architecture}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {edges.map((edge) => {
                const geo = edgeGeometry(edge, architecture);
                if (!geo) return null;
                const hot = isEdgeHot(edge, impact);
                const isEvent = edge.kind === "event";
                const quiet = isEvent && busDown;
                const touchesTrace =
                  traced !== null && (edge.from === traced || edge.to === traced);
                const faded = traced !== null && !touchesTrace;
                const depth = impact?.states[edge.from]?.depth ?? 0;
                const tone: Tone | undefined = hot
                  ? "red"
                  : isEvent
                    ? "blue"
                    : touchesTrace
                      ? "violet"
                      : undefined;
                return (
                  <g
                    key={`${edge.from}-${edge.to}`}
                    data-tone={tone}
                    className={cn(
                      "transition-opacity duration-300",
                      tone
                        ? "stroke-(--tone) fill-(--tone)"
                        : "stroke-ink-muted/55 fill-ink-muted/70",
                    )}
                    style={{
                      opacity: faded ? 0.15 : 1,
                      transitionDelay: `${hot ? depth * hop : 0}s`,
                    }}
                  >
                    <path
                      d={geo.d}
                      fill="none"
                      strokeWidth={hot || touchesTrace ? 2 : 1.3}
                      strokeLinecap="round"
                      className={cn(
                        "transition-[stroke-width]",
                        hot ? styles.flowBack : isEvent && !quiet ? styles.flow : undefined,
                        quiet && "[stroke-dasharray:3_9]",
                      )}
                    />
                    <polygon points={geo.head} strokeWidth={0} />
                    {/* A request riding along each healthy call. */}
                    {!isEvent && !hot && !reduced && (
                      <circle r={2.4} strokeWidth={0} className="opacity-80">
                        <animateMotion
                          dur={`${2 + ((edge.from.length + edge.to.length) % 5) * 0.25}s`}
                          repeatCount="indefinite"
                          path={geo.d}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </motion.g>
          </AnimatePresence>

          {/* Nodes */}
          {modules.map((id) => {
            const position = LAYOUTS[architecture][id];
            if (!position) return null;
            const box = MODULES[id];
            const entry = impact?.states[id];
            const state: NodeState = entry?.state ?? "healthy";
            const look = STATE_LOOK[state];
            const delay = (entry?.depth ?? 0) * hop;
            const isTarget = id === target;
            const halfW = box.width / 2;
            const halfH = box.height / 2;
            const rx = id === "bus" ? 17 : 8;
            const faded =
              traced !== null &&
              traced !== id &&
              !edges.some(
                (e) => (e.from === traced && e.to === id) || (e.to === traced && e.from === id),
              );

            return (
              <motion.g
                key={id}
                initial={false}
                animate={{ x: position.x, y: position.y, opacity: faded ? 0.4 : 1 }}
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 22 }
                }
              >
                <g
                  role="button"
                  tabIndex={0}
                  aria-pressed={isTarget}
                  aria-label={`${box.label}: ${look.label}. ${
                    isTarget ? "Activate to reset." : `Activate to ${action} this module.`
                  }`}
                  data-tone={look.tone ?? (id === "bus" ? "blue" : undefined)}
                  onClick={() => toggleTarget(id)}
                  onKeyDown={(event) => onNodeKey(event, id)}
                  onPointerEnter={() => setTraced(id)}
                  onPointerLeave={() => setTraced(null)}
                  onFocus={() => setTraced(id)}
                  onBlur={() => setTraced(null)}
                  className="group cursor-pointer outline-none"
                >
                  <rect
                    x={-halfW - 6}
                    y={-halfH - 8}
                    width={box.width + 12}
                    height={box.height + 22}
                    fill="transparent"
                  />
                  <rect
                    x={-halfW - 4}
                    y={-halfH - 4}
                    width={box.width + 8}
                    height={box.height + 8}
                    rx={rx + 3}
                    fill="none"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    className="stroke-ink-muted opacity-0 group-focus-visible:opacity-100"
                  />
                  <g className={cn(state === "broken" && "tut-shake")}>
                    <rect
                      x={-halfW}
                      y={-halfH}
                      width={box.width}
                      height={box.height}
                      rx={rx}
                      className="fill-paper"
                    />
                    <rect
                      x={-halfW}
                      y={-halfH}
                      width={box.width}
                      height={box.height}
                      rx={rx}
                      strokeWidth={state === "healthy" ? 1.2 : 1.8}
                      strokeDasharray={look.dashed ? "5 3" : undefined}
                      className={cn(
                        "transition-[fill,stroke] duration-300 group-hover:stroke-ink",
                        look.tone || id === "bus"
                          ? "fill-(--tone-soft) stroke-(--tone)"
                          : "fill-transparent stroke-ink-muted/60",
                      )}
                      style={{ transitionDelay: `${delay}s` }}
                    />
                    {isTarget && (
                      <rect
                        x={-halfW}
                        y={-halfH}
                        width={box.width}
                        height={box.height}
                        rx={rx}
                        fill="none"
                        strokeWidth={1.5}
                        className={cn("stroke-(--tone)", styles.ring)}
                      />
                    )}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cn(
                        "text-[14px] font-semibold",
                        state === "idle" ? "fill-ink-muted" : "fill-ink",
                      )}
                    >
                      {box.label}
                    </text>
                  </g>
                  <AnimatePresence>
                    {look.tag && (
                      <motion.text
                        key={state}
                        y={halfH + 12}
                        textAnchor="middle"
                        initial={{ opacity: 0, y: halfH + 6 }}
                        animate={{
                          opacity: 1,
                          y: halfH + 12,
                          transition: { delay: delay + 0.15 },
                        }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "font-mono text-[11px] font-bold",
                          look.tone ? "fill-(--tone)" : "fill-ink-muted",
                        )}
                      >
                        {look.tag}
                      </motion.text>
                    )}
                  </AnimatePresence>
                </g>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Running commentary, announced to screen readers. */}
      <div
        data-tone={
          !impact ? "violet" : affected.length > 1 && architecture === "tight" ? "red" : "green"
        }
        className="rounded-xl border border-(--tone-line) bg-(image:--tone-fill) px-4 py-3 transition-colors"
      >
        <p aria-live="polite" className="leading-snug text-ink">
          {impact ? impact.note : idleNote}
        </p>
        {impact && (
          <div className="mt-2 flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-(--tone)">
              {affected.length}/{modules.length} affected
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--tone-soft)">
              <span
                key={`${architecture}-${action}-${target}`}
                className={cn("block h-full origin-left rounded-full bg-(--tone)", styles.meter)}
                style={{ width: `${(affected.length / modules.length) * 100}%`, opacity: 0.75 }}
              />
            </span>
          </div>
        )}
      </div>

      {statesInUse.length > 0 && (
        <ul aria-label="Legend" className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted">
          {statesInUse.map((state) => {
            const look = STATE_LOOK[state];
            return (
              <li key={state} data-tone={look.tone} className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "inline-block h-3.5 w-5 rounded border",
                    look.dashed && "border-dashed",
                    look.tone ? "border-(--tone) bg-(--tone-soft)" : "border-ink-muted",
                  )}
                />
                {look.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
