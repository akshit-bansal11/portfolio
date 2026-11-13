/*
 * StagedRolloutDemo.tsx
 * Blast radius in *time*: ship an update to 100 machines either all at once or in
 * stages (1% -> 10% -> 50% -> 100%) with a health check between stages. Each wave of
 * machines pops as it takes the update; the health check pings while it watches. With a
 * bad update, the staged rollout stops at the canary and rolls back.
 */

"use client";

import { useReducedMotion } from "framer-motion";
import { Activity, Rocket, RotateCcw } from "lucide-react";
import { type CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import { DemoButton, SegmentedControl } from "@/components/blog/DemoControls";
import { Wire } from "@/components/tutorials/Diagram";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

type Strategy = "all" | "staged";
type Quality = "good" | "bad";
type DeviceState = "old" | "updated" | "crashed" | "rolledBack";

const DEVICES = 100;
const STAGE_MS = 1100;
const STAGES: Record<Strategy, number[]> = { all: [100], staged: [1, 10, 50, 100] };

// Spread rollout order across the grid (37 is coprime with 100, so this visits every slot once).
const ROLLOUT_ORDER = Array.from({ length: DEVICES }, (_, i) => (i * 37) % DEVICES);
const RANK = ROLLOUT_ORDER.reduce<number[]>((rank, slot, i) => {
  rank[slot] = i;
  return rank;
}, []);

const DEVICE_STATES: DeviceState[] = ["old", "updated", "crashed", "rolledBack"];

const DEVICE_TONE: Record<DeviceState, Tone | undefined> = {
  old: undefined,
  updated: "green",
  crashed: "red",
  rolledBack: "amber",
};

const DEVICE_CLASS: Record<DeviceState, string> = {
  old: "border-rule bg-paper",
  updated: "border-(--tone) bg-(--tone-line)",
  crashed: "border-(--tone) bg-(--tone)",
  rolledBack: "border-(--tone) bg-(--tone-soft)",
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
            previous.map((state, slot) => (RANK[slot] < percent ? updatedState : state)),
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
  const previousPercent = stageIndex > 0 ? stages[stageIndex - 1] : 0;

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

  const noteTone: Tone =
    status === "done" && quality === "bad"
      ? "red"
      : status === "halted"
        ? "amber"
        : status === "done"
          ? "green"
          : "violet";

  const health =
    status === "running"
      ? { tone: "blue" as Tone, text: "health check: watching" }
      : status === "halted"
        ? { tone: "red" as Tone, text: "health check: FAILED, stopped" }
        : status === "done" && quality === "bad"
          ? { tone: "red" as Tone, text: "health check: too late" }
          : status === "done"
            ? { tone: "green" as Tone, text: "health check: OK" }
            : { tone: "violet" as Tone, text: "health check: idle" };

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
            <Rocket className="h-4 w-4" aria-hidden /> Ship it
          </DemoButton>
          <DemoButton onClick={reset} disabled={status === "idle"}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </DemoButton>
        </div>
      </div>

      {/* Stage tracker: pills joined by wires; the wire to the next stage carries the rollout. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <ol aria-label="Rollout stages" className="flex list-none items-center gap-1 p-0 text-sm">
          {stages.map((percent, index) => {
            const done = index < stageIndex || (index === stageIndex && status !== "halted");
            const stopped = index === stageIndex && status === "halted";
            return (
              <Fragment key={percent}>
                {index > 0 && (
                  <li aria-hidden data-tone={index <= stageIndex ? "green" : "violet"}>
                    {status === "running" && index === stageIndex + 1 ? (
                      <Wire axis="x" className="w-6 sm:w-10" />
                    ) : (
                      <span className="block h-[2px] w-6 bg-(--tone-line) sm:w-10" />
                    )}
                  </li>
                )}
                <li
                  aria-current={index === stageIndex ? "step" : undefined}
                  data-tone={stopped ? "red" : done ? "green" : "violet"}
                  className={cn(
                    styles.ease,
                    "rounded-full border px-3 py-1 font-mono font-semibold",
                    done || stopped
                      ? "border-(--tone) bg-(--tone-soft) text-(--tone)"
                      : "border-rule text-ink-muted",
                    index === stageIndex && status === "running" && "dg-pulse",
                  )}
                >
                  {percent}%
                </li>
              </Fragment>
            );
          })}
        </ol>
        <span
          data-tone={health.tone}
          className={cn(
            styles.ease,
            "inline-flex items-center gap-1.5 rounded-full border border-(--tone-line) bg-(--tone-soft) px-3 py-1 text-sm font-semibold text-(--tone)",
            status === "running" && "dg-pulse",
          )}
        >
          <Activity className="h-4 w-4" aria-hidden />
          {health.text}
        </span>
      </div>

      <div
        role="img"
        aria-label={`${DEVICES} machines. ${crashed} hit by the update.`}
        className="grid grid-cols-10 gap-1 sm:gap-1.5"
      >
        {devices.map((state, slot) => {
          const tone = DEVICE_TONE[state];
          // Machines in the newest wave pop in a little after each other.
          const fresh = state !== "old" && RANK[slot] >= previousPercent;
          return (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: machines are positional.
              key={`${slot}-${state}`}
              data-tone={tone}
              title={DEVICE_LABEL[state]}
              className={cn(
                styles.ease,
                "block h-4 rounded-[4px] border sm:h-5",
                DEVICE_CLASS[state],
                state === "crashed" ? styles.shake : state !== "old" && styles.pop,
              )}
              style={
                {
                  animationDelay: fresh
                    ? `${((RANK[slot] - previousPercent) % 25) * 18}ms`
                    : undefined,
                } as CSSProperties
              }
            />
          );
        })}
      </div>

      <div
        data-tone={noteTone}
        className={cn(
          styles.ease,
          "rounded-xl border border-(--tone-line) bg-(--tone-soft) px-4 py-3",
        )}
      >
        <p aria-live="polite" className="leading-snug font-semibold text-ink">
          {note}
        </p>
        <ul
          aria-label="Legend"
          className="mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm text-ink-muted"
        >
          {DEVICE_STATES.map((state) => (
            <li
              key={state}
              data-tone={DEVICE_TONE[state]}
              className="inline-flex items-center gap-2"
            >
              <span
                aria-hidden
                className={cn("inline-block h-3 w-5 rounded-sm border", DEVICE_CLASS[state])}
              />
              {DEVICE_LABEL[state]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
