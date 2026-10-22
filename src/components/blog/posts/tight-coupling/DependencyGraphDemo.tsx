/*
 * DependencyGraphDemo.tsx
 * The main Tight Coupling demo. A small online store drawn as
 * a module graph that can be wired tightly or loosely. Click
 * (or tap, or press Enter on) a module to break it or change
 * it, and watch the failure or the change cascade hop by hop.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type KeyboardEvent, useId, useState } from "react";
import { DemoButton, SegmentedControl } from "@/components/blog/DemoControls";
import { clipToBox, sketchArrow, sketchCross, sketchRect } from "@/lib/blog/sketch";
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

// Seconds between each hop of the cascade.
const HOP_DELAY = 0.38;

// Visual treatment for each state (Tailwind classes on SVG elements).
const STATE_STYLE: Record<
  NodeState,
  { box: string; text: string; tag?: string; tagFill?: string }
> = {
  healthy: { box: "fill-paper-raised stroke-ink", text: "fill-ink" },
  broken: {
    box: "fill-danger/20 stroke-danger",
    text: "fill-ink",
    tag: "broken",
    tagFill: "fill-danger",
  },
  changed: { box: "fill-ok/20 stroke-ok", text: "fill-ink", tag: "changed", tagFill: "fill-ok" },
  down: {
    box: "fill-danger/10 stroke-danger",
    text: "fill-ink",
    tag: "down",
    tagFill: "fill-danger",
  },
  degraded: {
    box: "fill-warn/15 stroke-warn",
    text: "fill-ink",
    tag: "fallback",
    tagFill: "fill-warn",
  },
  waiting: {
    box: "fill-pen-blue/15 stroke-pen-blue",
    text: "fill-ink",
    tag: "holding msgs",
    tagFill: "fill-pen-blue",
  },
  idle: {
    box: "fill-paper-raised stroke-ink-muted",
    text: "fill-ink-muted",
    tag: "idle",
    tagFill: "fill-ink-muted",
  },
  edit: {
    box: "fill-danger/10 stroke-danger",
    text: "fill-ink",
    tag: "must edit",
    tagFill: "fill-danger",
  },
  retest: {
    box: "fill-warn/15 stroke-warn",
    text: "fill-ink",
    tag: "re-test",
    tagFill: "fill-warn",
  },
};

// Plain-language state names for screen readers and the legend.
const STATE_LABEL: Record<NodeState, string> = {
  healthy: "working",
  broken: "broken",
  changed: "changed",
  down: "down",
  degraded: "running a fallback",
  waiting: "holding messages",
  idle: "idle",
  edit: "must be edited",
  retest: "must be re-tested",
};

const ARCHITECTURE_OPTIONS = [
  { value: "tight" as const, label: "Tightly coupled" },
  { value: "loose" as const, label: "Loosely coupled" },
];

const ACTION_OPTIONS = [
  { value: "break" as const, label: "Break it" },
  { value: "change" as const, label: "Change it" },
];

// Small hash so every edge/box gets its own stable wobble.
function seedFor(text: string): number {
  let hash = 7;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash) + 1;
}

// Arrow path from the dependent's border to the dependency's border.
function edgePaths(edge: Edge, architecture: Architecture) {
  const layout = LAYOUTS[architecture];
  const from = layout[edge.from];
  const to = layout[edge.to];
  if (!from || !to) return null;
  const fromBox = MODULES[edge.from];
  const toBox = MODULES[edge.to];
  const [x1, y1] = clipToBox(to.x, to.y, from.x, from.y, fromBox.width / 2, fromBox.height / 2, 2);
  const [x2, y2] = clipToBox(from.x, from.y, to.x, to.y, toBox.width / 2, toBox.height / 2, 5);
  return sketchArrow(x1, y1, x2, y2, {
    seed: seedFor(`${edge.from}-${edge.to}`),
    curve: 0.08,
    headSize: 7,
  });
}

export default function DependencyGraphDemo() {
  const [architecture, setArchitecture] = useState<Architecture>("tight");
  const [action, setAction] = useState<Action>("break");
  const [target, setTarget] = useState<ModuleId | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  const impact: Impact | null = target ? computeImpact(architecture, action, target) : null;
  const modules = modulesFor(architecture);
  const edges = EDGES[architecture];
  const hop = prefersReducedMotion ? 0 : HOP_DELAY;

  // Switching wiring or action resets the experiment.
  const changeArchitecture = (next: Architecture) => {
    setArchitecture(next);
    setTarget(null);
  };
  const changeAction = (next: Action) => {
    setAction(next);
    setTarget(null);
  };

  // Clicking the same module again repairs it.
  const toggleTarget = (id: ModuleId) => setTarget((current) => (current === id ? null : id));

  const onNodeKeyDown = (event: KeyboardEvent<SVGGElement>, id: ModuleId) => {
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
      ? "Tap any box to break it. Tap it again to fix it."
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
        <DemoButton onClick={() => setTarget(null)} disabled={!target} className="sm:ml-auto">
          Reset
        </DemoButton>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        role="group"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full touch-manipulation select-none"
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
            animate={{ opacity: 1, transition: { delay: prefersReducedMotion ? 0 : 0.35 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {edges.map((edge) => {
              const paths = edgePaths(edge, architecture);
              if (!paths) return null;
              const hot = isEdgeHot(edge, impact);
              const depth = impact?.states[edge.from]?.depth ?? 0;
              const isEvent = edge.kind === "event";
              const busDown = impact?.states.bus?.state === "broken";
              return (
                <g
                  key={`${edge.from}-${edge.to}`}
                  className={cn(
                    "transition-colors",
                    hot ? "text-danger" : isEvent ? "text-pen-blue" : "text-ink-muted",
                  )}
                  style={{
                    transitionDelay: `${hot ? depth * hop : 0}s`,
                    transitionDuration: "300ms",
                  }}
                >
                  <path
                    d={paths.shaft}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={hot ? 2.2 : 1.4}
                    strokeLinecap="round"
                    strokeDasharray={isEvent || hot ? "5 4" : undefined}
                    className={cn(hot && "motion-safe:animate-dash-flow")}
                  />
                  <path
                    d={paths.head}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={hot ? 2.2 : 1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Little messages travelling along event edges. */}
                  {isEvent && !busDown && !prefersReducedMotion && (
                    <circle r={2.6} className="fill-pen-blue">
                      <animateMotion
                        dur={`${2.2 + (seedFor(edge.to) % 5) * 0.2}s`}
                        repeatCount="indefinite"
                        path={paths.shaft}
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
          const style = STATE_STYLE[state];
          const delay = (entry?.depth ?? 0) * hop;
          const isTarget = id === target;
          const halfW = box.width / 2;
          const halfH = box.height / 2;

          return (
            <motion.g
              key={id}
              initial={false}
              animate={{ x: position.x, y: position.y }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
              <g
                role="button"
                tabIndex={0}
                aria-pressed={isTarget}
                aria-label={`${box.label}: ${STATE_LABEL[state]}. ${
                  isTarget ? "Activate to reset." : `Activate to ${action} this module.`
                }`}
                onClick={() => toggleTarget(id)}
                onKeyDown={(event) => onNodeKeyDown(event, id)}
                className="group cursor-pointer outline-none"
              >
                {/* Generous invisible hit area for touch. */}
                <rect
                  x={-halfW - 6}
                  y={-halfH - 8}
                  width={box.width + 12}
                  height={box.height + 16}
                  fill="transparent"
                />
                {/* Keyboard focus ring. */}
                <rect
                  x={-halfW - 5}
                  y={-halfH - 5}
                  width={box.width + 10}
                  height={box.height + 10}
                  rx={10}
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  className="stroke-pen opacity-0 group-focus-visible:opacity-100"
                />
                <motion.g
                  initial={false}
                  animate={
                    state === "broken" && !prefersReducedMotion
                      ? { rotate: [0, -4, 4, -2, 0], transition: { duration: 0.4 } }
                      : { rotate: 0 }
                  }
                >
                  <rect
                    x={-halfW}
                    y={-halfH}
                    width={box.width}
                    height={box.height}
                    rx={id === "bus" ? 17 : 6}
                    strokeWidth={0}
                    className={cn("transition-colors", style.box)}
                    style={{ transitionDelay: `${delay}s`, transitionDuration: "300ms" }}
                  />
                  <path
                    d={sketchRect(-halfW, -halfH, box.width, box.height, {
                      seed: seedFor(id),
                      bow: 1.6,
                    })}
                    fill="none"
                    strokeWidth={state === "healthy" ? 1.6 : 2.4}
                    strokeLinecap="round"
                    strokeDasharray={state === "down" ? "6 3" : undefined}
                    className={cn("transition-colors", style.box, "fill-none")}
                    style={{ transitionDelay: `${delay}s`, transitionDuration: "300ms" }}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={cn("text-[14px] font-semibold", style.text)}
                  >
                    {box.label}
                  </text>
                  {state === "broken" && (
                    <path
                      d={sketchCross(halfW - 4, -halfH + 2, 12, seedFor(id))}
                      fill="none"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      className="stroke-danger"
                    />
                  )}
                </motion.g>
                <AnimatePresence>
                  {style.tag && (
                    <motion.text
                      key={state}
                      y={halfH + 12}
                      textAnchor="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: delay + 0.15 } }}
                      exit={{ opacity: 0 }}
                      className={cn("font-hand text-[15px] font-bold", style.tagFill)}
                    >
                      {style.tag}
                    </motion.text>
                  )}
                </AnimatePresence>
              </g>
            </motion.g>
          );
        })}
      </svg>

      {/* Running commentary, announced to screen readers. */}
      <div className="rounded-xl border-2 border-dashed border-rule px-4 py-3">
        <p aria-live="polite" className="font-hand text-[1.4rem] leading-snug text-pen">
          {impact ? impact.note : idleNote}
        </p>
        {impact && (
          <p className="mt-1 text-sm text-ink-muted">
            Affected: {affected.length} of {modules.length} modules.
          </p>
        )}
      </div>

      {statesInUse.length > 0 && (
        <ul aria-label="Legend" className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted">
          {statesInUse.map((state) => (
            <li key={state} className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className={cn("inline-block h-3.5 w-5 rounded border-2", legendSwatch(state))}
              />
              {STATE_LABEL[state]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// HTML (non-SVG) classes for legend swatches.
function legendSwatch(state: NodeState): string {
  switch (state) {
    case "broken":
      return "border-danger bg-danger/20";
    case "down":
    case "edit":
      return "border-dashed border-danger bg-danger/10";
    case "degraded":
    case "retest":
      return "border-warn bg-warn/15";
    case "waiting":
      return "border-pen-blue bg-pen-blue/15";
    case "changed":
      return "border-ok bg-ok/20";
    case "idle":
      return "border-ink-muted";
    default:
      return "border-ink";
  }
}
