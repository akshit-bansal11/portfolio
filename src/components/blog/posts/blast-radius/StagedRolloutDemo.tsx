/*
 * StagedRolloutDemo.tsx
 * Blast radius in *time*: ship an update to 100 machines
 * either all at once or in stages (1% -> 10% -> 50% -> 100%)
 * with a health check between stages. With a bad update, the
 * staged rollout stops at the canary and rolls back.
 */

"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DemoButton, SegmentedControl } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";

type Strategy = "all" | "staged";
type Quality = "good" | "bad";
type DeviceState = "old" | "updated" | "crashed" | "rolledBack";

const DEVICES = 100;
const COLS = 10;
const STAGE_MS = 1100;
const STAGES: Record<Strategy, number[]> = { all: [100], staged: [1, 10, 50, 100] };

// Spread rollout order across the grid (37 is coprime with 100, so this visits every slot once).
const ROLLOUT_ORDER = Array.from({ length: DEVICES }, (_, i) => (i * 37) % DEVICES);

const DEVICE_STATES: DeviceState[] = ["old", "updated", "crashed", "rolledBack"];

const DEVICE_CLASS: Record<DeviceState, string> = {
  old: "fill-paper stroke-ink-muted",
  updated: "fill-ok/70 stroke-ok",
  crashed: "fill-danger stroke-danger",
  rolledBack: "fill-warn/40 stroke-warn",
};

const DEVICE_LABEL: Record<DeviceState, string> = {
  old: "old version",
  updated: "updated, healthy",
  crashed: "crashed",
  rolledBack: "rolled back",
};

const STRATEGY_OPTIONS = [
  { value: "all" as const, label: "All at once" },
  { value: "staged" as const, label: "Staged" },
];

const QUALITY_OPTIONS = [
  { value: "good" as const, label: "Good update" },
  { value: "bad" as const, label: "Bad update" },
];

const freshDevices = (): DeviceState[] => Array(DEVICES).fill("old");

export default function StagedRolloutDemo() {
  const [strategy, setStrategy] = useState<Strategy>("all");
  const [quality, setQuality] = useState<Quality>("bad");
  const [devices, setDevices] = useState<DeviceState[]>(freshDevices);
  const [stageIndex, setStageIndex] = useState(-1);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "halted">("idle");
  const timers = useRef<number[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Cancel pending stages when leaving the page.
  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const reset = () => {
    clearTimers();
    setDevices(freshDevices());
    setStageIndex(-1);
    setStatus("idle");
  };

  const ship = () => {
    clearTimers();
    setDevices(freshDevices());
    setStatus("running");
    const stages = STAGES[strategy];
    const delay = prefersReducedMotion ? 0 : STAGE_MS;
    const updatedState: DeviceState = quality === "good" ? "updated" : "crashed";

    stages.forEach((percent, index) => {
      const timer = window.setTimeout(
        () => {
          setStageIndex(index);
          setDevices((previous) =>
            previous.map((state, slot) =>
              ROLLOUT_ORDER.indexOf(slot) < percent ? updatedState : state,
            ),
          );

          const isLast = index === stages.length - 1;
          // Health check after each stage: a bad update halts a staged rollout and rolls back.
          if (quality === "bad" && strategy === "staged") {
            clearTimers();
            const rollback = window.setTimeout(() => {
              setDevices((previous) =>
                previous.map((state) => (state === "crashed" ? "rolledBack" : state)),
              );
              setStatus("halted");
            }, delay);
            timers.current.push(rollback);
          } else if (isLast) {
            setStatus("done");
          }
        },
        delay * index + (prefersReducedMotion ? 0 : 300),
      );
      timers.current.push(timer);
    });
  };

  const crashed = devices.filter((state) => state === "crashed" || state === "rolledBack").length;
  const stages = STAGES[strategy];

  let note = "Pick a strategy and ship it.";
  if (status === "running") note = "Rolling out…";
  if (status === "done" && quality === "bad") {
    note = `All ${DEVICES} machines took the bad update at once. There was no moment to notice and stop.`;
  }
  if (status === "done" && quality === "good") {
    note =
      strategy === "staged"
        ? "Slower, but every stage passed its health check."
        : "It worked this time. All at once is fast… until the day it isn't.";
  }
  if (status === "halted") {
    note = `The canary caught it: only ${crashed} machine${crashed === 1 ? "" : "s"} hit, then rolled back automatically.`;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SegmentedControl
          label="Rollout"
          options={STRATEGY_OPTIONS}
          value={strategy}
          onChange={(value) => {
            setStrategy(value);
            reset();
          }}
        />
        <SegmentedControl
          label="The update is"
          options={QUALITY_OPTIONS}
          value={quality}
          onChange={(value) => {
            setQuality(value);
            reset();
          }}
        />
        <div className="flex gap-2 sm:ml-auto">
          <DemoButton variant="solid" onClick={ship} disabled={status === "running"}>
            Ship it
          </DemoButton>
          <DemoButton onClick={reset} disabled={status === "idle"}>
            Reset
          </DemoButton>
        </div>
      </div>

      {/* Stage tracker */}
      <ol aria-label="Rollout stages" className="flex flex-wrap items-center gap-2 text-sm">
        {stages.map((percent, index) => (
          <li
            key={percent}
            aria-current={index === stageIndex ? "step" : undefined}
            className={cn(
              "rounded-full border-2 px-3 py-1 font-semibold transition-colors",
              index < stageIndex || (index === stageIndex && status !== "halted")
                ? "border-ink bg-ink text-paper"
                : index === stageIndex && status === "halted"
                  ? "border-danger text-danger"
                  : "border-rule text-ink-muted",
            )}
          >
            {percent}%
          </li>
        ))}
        {status === "halted" && (
          <li className="font-hand text-xl text-danger">✋ halted + rolled back</li>
        )}
      </ol>

      <svg
        viewBox="0 0 360 196"
        role="img"
        aria-label={`${DEVICES} machines. ${crashed} hit by the update.`}
        className="w-full"
      >
        {devices.map((state, slot) => {
          const x = 8 + (slot % COLS) * 35;
          const y = 6 + Math.floor(slot / COLS) * 19;
          return (
            <g key={slot}>
              <rect
                x={x}
                y={y}
                width={28}
                height={14}
                rx={2}
                strokeWidth={1.3}
                className={cn("transition-colors duration-300", DEVICE_CLASS[state])}
              >
                <title>{DEVICE_LABEL[state]}</title>
              </rect>
            </g>
          );
        })}
      </svg>

      <div className="rounded-xl border-2 border-dashed border-rule px-4 py-3">
        <p aria-live="polite" className="font-hand text-[1.4rem] leading-snug text-pen">
          {note}
        </p>
        <ul
          aria-label="Legend"
          className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted"
        >
          {DEVICE_STATES.map((state) => (
            <li key={state} className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "inline-block h-3 w-5 rounded-sm border-2",
                  state === "old" && "border-ink-muted bg-paper",
                  state === "updated" && "border-ok bg-ok/70",
                  state === "crashed" && "border-danger bg-danger",
                  state === "rolledBack" && "border-warn bg-warn/40",
                )}
              />
              {DEVICE_LABEL[state]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
