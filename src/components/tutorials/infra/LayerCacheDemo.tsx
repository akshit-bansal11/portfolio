/*
 * LayerCacheDemo.tsx
 * Pick a badly ordered or well ordered Dockerfile, pick what you changed (app code,
 * dependencies, base image) and see which build steps reuse the cache and which rerun.
 * A step reruns when it reads something that changed, or any step before it reran.
 */

"use client";

import { Check, RotateCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Change = "app" | "deps" | "base";
type Order = "bad" | "good";

interface Step {
  line: string;
  /** Changes that make this step's own result different. */
  reads: Change[];
}

const DOCKERFILES: Record<Order, Step[]> = {
  bad: [
    { line: "FROM node:24-alpine", reads: ["base"] },
    { line: "WORKDIR /app", reads: [] },
    { line: "COPY . .", reads: ["app", "deps"] },
    { line: "RUN npm install --omit=dev", reads: [] },
    { line: 'CMD ["node", "server.js"]', reads: [] },
  ],
  good: [
    { line: "FROM node:24-alpine", reads: ["base"] },
    { line: "WORKDIR /app", reads: [] },
    { line: "COPY package.json ./", reads: ["deps"] },
    { line: "RUN npm install --omit=dev", reads: [] },
    { line: "COPY server.js ./", reads: ["app"] },
    { line: 'CMD ["node", "server.js"]', reads: [] },
  ],
};

const CHANGES: { id: Change; label: string }[] = [
  { id: "app", label: "I edited server.js" },
  { id: "deps", label: "I added a dependency" },
  { id: "base", label: "The base image updated" },
];

const ORDERS: { id: Order; label: string }[] = [
  { id: "bad", label: "Bad order" },
  { id: "good", label: "Good order" },
];

// Marks each step as rerun or cached for one kind of change.
function plan(steps: Step[], change: Change): boolean[] {
  let dirty = false;

  return steps.map((step) => {
    dirty = dirty || step.reads.includes(change);
    return dirty;
  });
}

// A row of pressable choices; the pressed one is filled.
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
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "min-h-11 cursor-pointer rounded-lg border-2 border-pen px-3 text-sm font-medium text-ink",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
            "aria-pressed:bg-pen aria-pressed:text-paper",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function LayerCacheDemo() {
  const [order, setOrder] = useState<Order>("bad");
  const [change, setChange] = useState<Change>("app");
  const steps = DOCKERFILES[order];
  const rerun = plan(steps, change);
  const rebuilt = rerun.filter(Boolean).length;

  return (
    <div className="my-8 rounded-xl border-2 border-ink p-4">
      <div className="space-y-3">
        <Choice label="Dockerfile order" options={ORDERS} value={order} onChange={setOrder} />
        <Choice label="What changed" options={CHANGES} value={change} onChange={setChange} />
      </div>
      <ol className="mt-4 list-none space-y-1.5 p-0">
        {steps.map((step, index) => (
          <li
            key={step.line}
            data-tone={rerun[index] ? "amber" : "green"}
            className="flex items-center gap-3 rounded-lg border border-(--tone) bg-(--tone-soft) px-3 py-2"
          >
            <code className="min-w-0 flex-1 font-mono text-sm break-words text-ink">
              {step.line}
            </code>
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-(--tone)">
              {rerun[index] ? (
                <RotateCw className="h-4 w-4" aria-hidden />
              ) : (
                <Check className="h-4 w-4" aria-hidden />
              )}
              {rerun[index] ? "rebuilt" : "cached"}
            </span>
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="mt-3 font-semibold text-ink">
        {rebuilt} of {steps.length} steps rebuilt.
        {order === "bad" && change === "app" && " A one-line code edit reinstalls every package."}
      </p>
    </div>
  );
}
