/*
 * RolloutStrategies.tsx
 * Rolling update, blue-green and canary, stepped through one frame at a time: which pods
 * run which version and how much traffic the new version gets. The printed copy lists
 * every step of every strategy.
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Pod = "v1" | "v2" | "v2-starting" | "v1-idle";

interface Frame {
  pods: Pod[];
  /** Percent of requests going to v2. */
  v2: number;
  note: string;
}

const STRATEGIES: { id: string; name: string; how: string; frames: Frame[] }[] = [
  {
    id: "rolling",
    name: "Rolling update",
    how: "Built into every Deployment (maxSurge 1, maxUnavailable 0 here). What you do in the walkthrough.",
    frames: [
      { pods: ["v1", "v1", "v1", "v1"], v2: 0, note: "Four v1 pods serve everything." },
      {
        pods: ["v1", "v1", "v1", "v1", "v2-starting"],
        v2: 0,
        note: "One extra v2 pod starts. It gets no traffic until its readiness probe passes.",
      },
      {
        pods: ["v1", "v1", "v1", "v2"],
        v2: 25,
        note: "v2 is ready, so one v1 pod is removed. A quarter of requests now hit v2.",
      },
      {
        pods: ["v1", "v1", "v2", "v2"],
        v2: 50,
        note: "Repeat: surge one, wait for ready, remove one.",
      },
      {
        pods: ["v1", "v2", "v2", "v2"],
        v2: 75,
        note: "Both versions serve at once the whole time, so they must be compatible.",
      },
      {
        pods: ["v2", "v2", "v2", "v2"],
        v2: 100,
        note: "Done. kubectl rollout undo walks the same steps backwards.",
      },
    ],
  },
  {
    id: "blue-green",
    name: "Blue-green",
    how: "Two full Deployments; the Service selector (or a Gateway route) flips between them.",
    frames: [
      { pods: ["v1", "v1", "v1", "v1"], v2: 0, note: "Blue (v1) is live." },
      {
        pods: ["v1", "v1", "v1", "v1", "v2-starting", "v2-starting", "v2-starting", "v2-starting"],
        v2: 0,
        note: "Green (v2) starts in full beside it. You test it privately. Costs double for a while.",
      },
      {
        pods: ["v1-idle", "v1-idle", "v1-idle", "v1-idle", "v2", "v2", "v2", "v2"],
        v2: 100,
        note: "One switch moves all traffic. Rollback is the same switch back: instant.",
      },
      { pods: ["v2", "v2", "v2", "v2"], v2: 100, note: "After a soak period, blue is deleted." },
    ],
  },
  {
    id: "canary",
    name: "Canary",
    how: "Send a small share to v2 and watch errors and latency. Done with Gateway API route weights or a tool such as Argo Rollouts.",
    frames: [
      { pods: ["v1", "v1", "v1", "v1"], v2: 0, note: "v1 serves everything." },
      {
        pods: ["v1", "v1", "v1", "v1", "v2"],
        v2: 5,
        note: "One canary pod gets 5% of requests. Watch the dashboards.",
      },
      {
        pods: ["v1", "v1", "v1", "v2", "v2"],
        v2: 25,
        note: "Metrics look healthy, so the weight goes up.",
      },
      {
        pods: ["v1", "v1", "v2", "v2", "v2"],
        v2: 50,
        note: "If errors spike at any step, the weight goes back to 0 and only a few users noticed.",
      },
      { pods: ["v2", "v2", "v2", "v2"], v2: 100, note: "Promoted." },
    ],
  },
];

const POD_STYLE: Record<Pod, { tone: string; label: string; dim?: boolean; dashed?: boolean }> = {
  v1: { tone: "blue", label: "v1" },
  v2: { tone: "green", label: "v2" },
  "v2-starting": { tone: "green", label: "v2…", dashed: true },
  "v1-idle": { tone: "blue", label: "v1", dim: true },
};

function Pods({ frame }: { frame: Frame }) {
  return (
    <div>
      <ul className="flex list-none flex-wrap gap-2 p-0">
        {frame.pods.map((pod, i) => {
          const s = POD_STYLE[pod];
          return (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: pods are positional slots.
              key={i}
              data-tone={s.tone}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg border-2 border-(--tone) font-mono text-sm font-bold text-(--tone) transition-all",
                s.dashed ? "border-dashed" : "tut-glow bg-(--tone-soft)",
                s.dim && "opacity-35",
              )}
            >
              {s.label}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex h-6 overflow-hidden rounded-full border border-rule text-xs font-semibold">
        <div
          data-tone="blue"
          className="flex items-center justify-center bg-(--tone) text-paper transition-all"
          style={{ width: `${100 - frame.v2}%` }}
        >
          {frame.v2 < 100 && `v1 ${100 - frame.v2}%`}
        </div>
        <div
          data-tone="green"
          className="flex items-center justify-center bg-(--tone) text-paper transition-all"
          style={{ width: `${frame.v2}%` }}
        >
          {frame.v2 > 0 && `v2 ${frame.v2}%`}
        </div>
      </div>
    </div>
  );
}

export default function RolloutStrategies() {
  const [picked, setPicked] = useState(0);
  const [step, setStep] = useState(0);
  const strategy = STRATEGIES[picked];
  const frame = strategy.frames[step];
  const last = strategy.frames.length - 1;

  return (
    <div className="my-8 rounded-2xl border border-rule bg-paper-raised p-5">
      <div className="print:hidden">
        <div role="tablist" aria-label="Rollout strategy" className="flex flex-wrap gap-2">
          {STRATEGIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={picked === i}
              data-tone="violet"
              onClick={() => {
                setPicked(i);
                setStep(0);
              }}
              className={cn(
                "rounded-lg border-2 border-(--tone) px-3 py-1.5 text-sm font-semibold transition",
                picked === i ? "bg-(--tone) text-paper" : "text-(--tone) hover:bg-(--tone-soft)",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-muted">{strategy.how}</p>
        <div className="mt-4">
          <Pods frame={frame} />
        </div>
        <p aria-live="polite" className="mt-3 min-h-12 text-ink">
          <b>
            Step {step + 1}/{last + 1}:
          </b>{" "}
          {frame.note}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center rounded-md border border-rule px-3 py-1 text-sm text-ink disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden /> Back
          </button>
          <button
            type="button"
            disabled={step === last}
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center rounded-md border border-rule px-3 py-1 text-sm text-ink disabled:opacity-35"
          >
            Next <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="hidden space-y-6 print:block">
        {STRATEGIES.map((s) => (
          <section key={s.id}>
            <p className="font-bold text-ink">{s.name}</p>
            <p className="text-sm text-ink-muted">{s.how}</p>
            <ol className="mt-2 list-decimal pl-5 text-sm text-ink">
              {s.frames.map((f) => (
                <li key={f.note}>
                  [{f.pods.join(" ")}] v2 traffic {f.v2}%: {f.note}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
