/*
 * LayerCacheDemo.tsx
 * Pick a badly ordered or well ordered Dockerfile, pick what you changed (app code,
 * dependencies, base image) and watch the build run: steps go top to bottom, cached ones
 * tick past, and from the first cache miss down every step rebuilds. A step reruns when it
 * reads something that changed, or any step before it reran. The final state is what
 * reduced-motion readers and the PDF see.
 */

"use client";

import { Check, Hammer, Loader2, Play, RotateCw } from "lucide-react";
import { type CSSProperties, useState } from "react";
import { cn } from "@/lib/utils";
import { BUTTON, CHOICE, FRAME, motion } from "./ui";

type Change = "app" | "deps" | "base";
type Order = "bad" | "good";

interface Step {
  line: string;
  /** Changes that make this step's own result different. */
  reads: Change[];
  /** A slow step (installing packages). */
  slow?: boolean;
}

const DOCKERFILES: Record<Order, Step[]> = {
  bad: [
    { line: "FROM node:24-alpine", reads: ["base"] },
    { line: "WORKDIR /app", reads: [] },
    { line: "COPY . .", reads: ["app", "deps"] },
    { line: "RUN npm install --omit=dev", reads: [], slow: true },
    { line: 'CMD ["node", "server.js"]', reads: [] },
  ],
  good: [
    { line: "FROM node:24-alpine", reads: ["base"] },
    { line: "WORKDIR /app", reads: [] },
    { line: "COPY package.json ./", reads: ["deps"] },
    { line: "RUN npm install --omit=dev", reads: [], slow: true },
    { line: "COPY server.js ./", reads: ["app"] },
    { line: 'CMD ["node", "server.js"]', reads: [] },
  ],
};

const CHANGES: { id: Change; label: string; file: string }[] = [
  { id: "app", label: "I edited server.js", file: "server.js" },
  { id: "deps", label: "I added a dependency", file: "package.json" },
  { id: "base", label: "The base image updated", file: "the base image" },
];

const ORDERS: { id: Order; label: string }[] = [
  { id: "bad", label: "Bad order" },
  { id: "good", label: "Good order" },
];

// Seconds each step takes in the replay (illustrative, not measured).
const CACHED_S = 0.18;
const RUN_S = 0.55;
const SLOW_S = 1.2;

// Marks each step as rerun or cached for one kind of change.
function plan(steps: Step[], change: Change): boolean[] {
  let dirty = false;

  return steps.map((step) => {
    dirty = dirty || step.reads.includes(change);
    return dirty;
  });
}

// When each step starts and how long it runs in the replay: a build runs one step at a time.
function schedule(steps: Step[], rerun: boolean[]): { start: number; length: number }[] {
  const lengths = steps.map((step, i) => (rerun[i] ? (step.slow ? SLOW_S : RUN_S) : CACHED_S));
  return lengths.map((length, i) => ({
    start: 0.25 + lengths.slice(0, i).reduce((sum, l) => sum + l, 0),
    length,
  }));
}

// A row of pressable choices; the pressed one is tinted.
function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-xs font-bold tracking-[0.08em] text-ink-muted uppercase sm:w-32">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
            className={CHOICE}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LayerCacheDemo() {
  const [order, setOrder] = useState<Order>("bad");
  const [change, setChange] = useState<Change>("app");
  const [run, setRun] = useState(0);
  const steps = DOCKERFILES[order];
  const rerun = plan(steps, change);
  const rebuilt = rerun.filter(Boolean).length;
  const miss = rerun.indexOf(true);
  const file = CHANGES.find((c) => c.id === change)?.file;

  const timing = schedule(steps, rerun);

  return (
    <div data-widget="layer-cache" data-tone="docker" className={FRAME}>
      <div className="space-y-3">
        <Choice label="Dockerfile" options={ORDERS} value={order} onChange={setOrder} />
        <Choice label="What changed" options={CHANGES} value={change} onChange={setChange} />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-rule bg-paper">
        <div className="flex items-center gap-2 border-b border-rule px-3 py-1.5">
          <Hammer className="h-4 w-4 text-(--tone)" aria-hidden />
          <code className="flex-1 font-mono text-sm text-ink">docker build .</code>
          <button
            type="button"
            onClick={() => setRun(run + 1)}
            className={cn(BUTTON, "border-transparent bg-transparent text-ink-muted print:hidden")}
          >
            <Play className="h-4 w-4" aria-hidden /> Replay build
          </button>
        </div>

        <ol key={`${order}-${change}-${run}`} className="list-none space-y-1.5 p-2 sm:p-3">
          {steps.map((step, index) => {
            const dirty = rerun[index];
            const { start, length } = timing[index];
            const done = { "--done": `${start + length}s` } as CSSProperties;
            return (
              <li
                key={step.line}
                data-tone={dirty ? "amber" : "green"}
                style={{ "--delay": `${start}s` } as CSSProperties}
                className={cn(
                  motion.queued,
                  "relative grid min-h-11 grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 overflow-hidden rounded-lg border px-3 py-2 sm:grid-cols-[1.25rem_minmax(0,1fr)_auto_auto]",
                  dirty ? "border-(--tone-line)" : "border-rule",
                  index === miss && "border-(--tone)",
                )}
              >
                {/* The step's work: a bar that fills while it runs. */}
                <span
                  aria-hidden
                  className={cn(
                    motion.fill,
                    "absolute inset-0 bg-(--tone-soft)",
                    !dirty && "opacity-60",
                  )}
                  style={{ "--delay": `${start}s`, "--dur": `${length}s` } as CSSProperties}
                />
                <span className="relative font-mono text-xs text-ink-muted">{index + 1}</span>
                <code className="relative min-w-0 font-mono text-sm break-words text-ink">
                  {step.line}
                </code>
                {index === miss && (
                  <span
                    className={cn(
                      motion.done,
                      "relative rounded-full border border-(--tone) bg-paper px-2 text-xs font-semibold text-(--tone)",
                      "max-sm:order-last max-sm:col-span-2 max-sm:col-start-2 justify-self-start",
                    )}
                    style={{ "--done": `${start}s` } as CSSProperties}
                  >
                    cache miss: {step.reads.includes(change) ? `reads ${file}` : "changed"}
                  </span>
                )}
                {index > miss && miss >= 0 && step.slow && (
                  <span className="relative max-sm:order-last max-sm:col-span-2 max-sm:col-start-2 justify-self-start text-xs font-semibold text-(--tone)">
                    slow step, rerun anyway
                  </span>
                )}
                <span className="relative grid shrink-0 justify-self-end text-sm font-semibold text-(--tone) sm:col-start-4 [&>*]:[grid-area:1/1]">
                  <span
                    aria-hidden
                    className={cn(motion.wait, "items-center gap-1 text-ink-muted")}
                    style={done}
                  >
                    <Loader2 className={cn("h-4 w-4", motion.spin)} aria-hidden />
                    {dirty ? "running" : "checking"}
                  </span>
                  <span className={cn(motion.done, "flex items-center gap-1")} style={done}>
                    {dirty ? (
                      <RotateCw className="h-4 w-4" aria-hidden />
                    ) : (
                      <Check className="h-4 w-4" aria-hidden />
                    )}
                    {dirty ? "rebuilt" : "cached"}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Cached against rebuilt, one segment per step. */}
      <div aria-hidden className="mt-3 flex gap-1">
        {rerun.map((dirty, i) => (
          <span
            key={steps[i].line}
            data-tone={dirty ? "amber" : "green"}
            className={cn(
              "h-1.5 rounded-full bg-(--tone) transition-[flex-grow] duration-500",
              steps[i].slow ? "flex-[3]" : "flex-1",
              !dirty && "opacity-50",
            )}
          />
        ))}
      </div>
      <p aria-live="polite" className="mt-2 text-ink">
        <b>
          {rebuilt} of {steps.length} steps rebuilt.
        </b>
        {order === "bad" && change === "app" && " A one-line code edit reinstalls every package."}
        {order === "good" &&
          change === "app" &&
          " The slow install stays cached: only your code is copied again."}
        {change === "base" && " A new base image invalidates everything, in any order."}
      </p>
    </div>
  );
}
