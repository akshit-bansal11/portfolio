/*
 * RolloutStrategies.tsx
 * Rolling update, blue-green and canary, stepped through one frame at a time (or played).
 * A Service splits traffic between v1 and v2; packets flow down a wire into every pod that
 * gets a share, faster for a bigger share. New pods drop in, starting pods wait dashed for
 * their readiness probe, and removed pods fade out of the row, so each strategy's shape
 * plays out on screen. The printed copy lists every step of every strategy.
 */

"use client";

import { ChevronLeft, ChevronRight, Network, Pause, Play } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { Wire } from "@/components/tutorials/Diagram";
import { cn } from "@/lib/utils";
import { BUTTON, CHOICE, FRAME, motion, PRIMARY, tabKeys } from "./ui";

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

const PLAY_MS = 2400;

const POD_STYLE: Record<Pod, { tone: "blue" | "green"; label: string; state: string }> = {
  v1: { tone: "blue", label: "v1", state: "ready" },
  v2: { tone: "green", label: "v2", state: "ready" },
  "v2-starting": { tone: "green", label: "v2", state: "starting" },
  "v1-idle": { tone: "blue", label: "v1", state: "idle" },
};

// Stable slot keys (v1-0, v1-1… then v2-0…), so a pod that changes state keeps its box.
function slots(pods: Pod[]): Map<string, Pod> {
  let one = 0;
  let two = 0;
  return new Map(pods.map((pod) => [pod.startsWith("v1") ? `v1-${one++}` : `v2-${two++}`, pod]));
}

// The pods to draw: this frame's, plus the ones that just left (animated out, then gone).
function rowFor(frame: Frame, previous?: Frame) {
  const now = slots(frame.pods);
  const before = previous ? slots(previous.pods) : new Map<string, Pod>();
  const keys = [...new Set([...before.keys(), ...now.keys()])].sort((a, b) => {
    const [ga, ia] = a.split("-");
    const [gb, ib] = b.split("-");
    return ga === gb ? Number(ia) - Number(ib) : ga.localeCompare(gb);
  });

  return keys.map((key) => ({
    key,
    pod: (now.get(key) ?? before.get(key)) as Pod,
    gone: !now.has(key),
  }));
}

// Share of all requests one pod gets in this frame.
function shareOf(frame: Frame, pod: Pod): number {
  const v1 = frame.pods.filter((p) => p === "v1").length;
  const v2 = frame.pods.filter((p) => p === "v2").length;
  if (pod === "v1" && v1) return (100 - frame.v2) / v1;
  if (pod === "v2" && v2) return frame.v2 / v2;
  return 0;
}

function routeLabel(id: string, frame: Frame): string {
  if (id === "blue-green") return `selector: version=${frame.v2 === 100 ? "green (v2)" : "blue (v1)"}`;
  if (id === "canary") return `route weights ${100 - frame.v2} / ${frame.v2}`;
  return "sends to every ready pod";
}

function Stage({
  strategy,
  frame,
  previous,
  n,
}: {
  strategy: string;
  frame: Frame;
  previous?: Frame;
  n: number;
}) {
  const row = rowFor(frame, previous);

  return (
    <div className="dg-canvas rounded-xl border border-rule p-3 sm:p-4">
      {/* The Service and how it splits traffic. */}
      <div className="rounded-xl border border-(--tone-line) bg-paper p-2.5">
        <p className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-ink">
          <Network className="h-4 w-4 text-(--tone)" aria-hidden />
          <b>Service</b>
          <span className="font-mono text-xs text-ink-muted">{routeLabel(strategy, frame)}</span>
        </p>
        <div className="flex h-7 overflow-hidden rounded-lg border border-rule text-xs font-semibold">
          {(["v1", "v2"] as const).map((version) => {
            const pct = version === "v1" ? 100 - frame.v2 : frame.v2;
            return (
              <div
                key={version}
                data-tone={version === "v1" ? "blue" : "green"}
                className={cn(
                  motion.stripes,
                  "flex min-w-0 items-center justify-center overflow-hidden bg-(--tone-soft) whitespace-nowrap text-(--tone)",
                  "motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-in-out",
                  version === "v2" && pct > 0 && pct < 100 && "border-l border-(--tone-line)",
                )}
                style={{ width: `${pct}%` }}
              >
                {pct >= 12 ? `${version} ${pct}%` : pct > 0 ? `${pct}%` : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* A wire into each pod; packets flow only where traffic goes. */}
      <ul className="mx-auto flex max-w-2xl list-none justify-center gap-1.5 p-0 sm:gap-2">
        {row.map(({ key, pod, gone }) => {
          const style = POD_STYLE[pod];
          const share = gone ? 0 : shareOf(frame, pod);
          const dur = Math.max(0.8, 2.6 - share * 0.045);
          return (
            <li
              key={gone ? `${key}-gone-${n}` : key}
              aria-hidden={gone || undefined}
              data-tone={style.tone}
              className={cn(
                "flex max-w-16 min-w-0 flex-1 flex-col items-center",
                gone ? motion.ghost : motion["drop-in"],
              )}
              style={{ "--dur": `${dur}s` } as CSSProperties}
            >
              {share > 0 ? (
                <Wire axis="y" className="h-9" />
              ) : (
                <span aria-hidden className="block h-9 border-l-[1.5px] border-dashed border-rule" />
              )}
              <span
                className={cn(
                  "flex h-14 w-full flex-col items-center justify-center rounded-lg border font-mono text-sm font-bold text-(--tone) transition-[opacity,border-color,background-color] duration-500",
                  style.state === "ready" && "border-(--tone-line) bg-(--tone-soft)",
                  style.state === "starting" && "border-dashed border-(--tone) bg-paper",
                  style.state === "idle" && "border-(--tone-line) bg-paper opacity-40",
                  gone && "border-dashed",
                )}
              >
                <span className={cn(style.state === "starting" && motion.breathe)}>
                  {style.label}
                </span>
                <span className="hidden font-sans text-[0.62rem] font-semibold tracking-wide text-ink-muted uppercase sm:block">
                  {gone ? "gone" : style.state}
                </span>
              </span>
              <span className="mt-1 h-4 font-mono text-[0.65rem] text-ink-muted">
                {share > 0 ? `${Math.round(share)}%` : ""}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span data-tone="blue" className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-(--tone) bg-(--tone-soft)" /> v1
          ready
        </span>
        <span data-tone="green" className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-(--tone) bg-(--tone-soft)" /> v2
          ready
        </span>
        <span data-tone="green" className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-(--tone)" /> starting
        </span>
        <span>% = share of requests</span>
      </p>
    </div>
  );
}

export default function RolloutStrategies() {
  const [picked, setPicked] = useState(0);
  const [view, setView] = useState<{ step: number; prev?: number; n: number }>({
    step: 0,
    n: 0,
  });
  const [playing, setPlaying] = useState(false);
  const strategy = STRATEGIES[picked];
  const { step } = view;
  const frame = strategy.frames[step];
  const last = strategy.frames.length - 1;

  const go = (next: number) =>
    setView((v) => ({ step: next, prev: v.step, n: v.n + 1 }));

  // Auto-advance while playing; stop at the end.
  useEffect(() => {
    if (!playing || step >= last) return;
    const timer = window.setTimeout(() => {
      setView((v) => ({ step: v.step + 1, prev: v.step, n: v.n + 1 }));
      if (step + 1 >= last) setPlaying(false);
    }, PLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, step, last]);

  const choose = (index: number) => {
    setPicked(index);
    setPlaying(false);
    setView((v) => ({ step: 0, n: v.n + 1 }));
  };

  return (
    <div data-widget="rollout-strategies" data-tone="violet" className={FRAME}>
      <div className="print:hidden">
        <div role="tablist" aria-label="Rollout strategy" className="flex flex-wrap gap-2">
          {STRATEGIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={picked === i}
              tabIndex={picked === i ? 0 : -1}
              onClick={() => choose(i)}
              onKeyDown={(event) => tabKeys(event, i, STRATEGIES.length, choose)}
              className={CHOICE}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-muted">{strategy.how}</p>
        <div className="mt-4">
          <Stage
            strategy={strategy.id}
            frame={frame}
            previous={view.prev === undefined ? undefined : strategy.frames[view.prev]}
            n={view.n}
          />
        </div>
        <p aria-live="polite" className="mt-3 min-h-12 text-ink">
          <b>
            Step {step + 1}/{last + 1}:
          </b>{" "}
          <span key={view.n} className={motion["slide-in"]}>
            {frame.note}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => {
              setPlaying(false);
              go(step - 1);
            }}
            className={BUTTON}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden /> Back
          </button>
          <button
            type="button"
            onClick={() => {
              if (step >= last) go(0);
              setPlaying(!playing);
            }}
            className={cn(PRIMARY, "min-w-24")}
          >
            {playing ? (
              <Pause className="h-4 w-4" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
            {playing ? "Pause" : step >= last ? "Replay" : "Play"}
          </button>
          <button
            type="button"
            disabled={step === last}
            onClick={() => {
              setPlaying(false);
              go(step + 1);
            }}
            className={BUTTON}
          >
            Next <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <ol aria-label="Steps" className="ml-auto flex list-none p-0">
            {strategy.frames.map((f, i) => (
              <li key={f.note}>
                <button
                  type="button"
                  aria-label={`Step ${i + 1}`}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => {
                    setPlaying(false);
                    go(i);
                  }}
                  className="group flex h-10 w-6 cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-(--tone)"
                >
                  <span
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === step
                        ? "w-4 bg-(--tone)"
                        : i < step
                          ? "w-2 bg-(--tone-line)"
                          : "w-2 bg-rule group-hover:bg-(--tone-line)",
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
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
