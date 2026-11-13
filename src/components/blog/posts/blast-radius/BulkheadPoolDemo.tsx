/*
 * BulkheadPoolDemo.tsx
 * Step 2, live: a web server with 100 worker threads serving three kinds of call
 * (recommendations, payments, everything else). Requests stream in and each holds a
 * thread until it finishes. Make recommendations slow and, with one shared pool, its
 * stuck calls swallow every thread until payments have nowhere to run. Turn bulkheads
 * on and recommendations can only tie up its own 10 threads; extra calls fail fast and
 * payments keep flowing. The loop only runs while the demo is on screen.
 */

"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DemoButton, DemoToggle, SegmentedControl } from "@/components/blog/DemoControls";
import { Wire } from "@/components/tutorials/Diagram";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";
import { useInView } from "./useInView";

type Kind = "recs" | "pay" | "other";

interface Slot {
  kind: Kind;
  until: number;
}

interface World {
  tick: number;
  slots: (Slot | null)[];
  /** Recent payment outcomes, newest last. */
  payLog: boolean[];
  /** Recommendation calls refused at once by a full bulkhead. */
  failedFast: number;
}

const THREADS = 100;
const TICK_MS = 170;
const LOG = 10;
const ARRIVALS: Kind[] = ["recs", "pay", "recs", "other"];

const POOLS: { kind: Kind; title: string; from: number; to: number; cols: string }[] = [
  { kind: "recs", title: "Recommendations", from: 0, to: 10, cols: "grid-cols-5" },
  { kind: "pay", title: "Payments", from: 10, to: 50, cols: "grid-cols-10" },
  { kind: "other", title: "Everything else", from: 50, to: 100, cols: "grid-cols-10" },
];

const KIND: Record<Kind, { tone: Tone; label: string }> = {
  recs: { tone: "violet", label: "recommendations call" },
  pay: { tone: "green", label: "payment" },
  other: { tone: "blue", label: "other work" },
};

const fresh = (): World => ({
  tick: 0,
  slots: Array(THREADS).fill(null),
  payLog: [],
  failedFast: 0,
});

function step(world: World, slow: boolean, bulkheads: boolean): World {
  const tick = world.tick + 1;
  const slots = world.slots.map((slot) => (slot && slot.until > tick ? slot : null));
  const payLog = [...world.payLog];
  let failedFast = world.failedFast;

  for (const kind of ARRIVALS) {
    const pool = POOLS.find((p) => p.kind === kind);
    const from = bulkheads && pool ? pool.from : 0;
    const to = bulkheads && pool ? pool.to : THREADS;
    let free = -1;
    for (let i = from; i < to; i++) {
      if (!slots[i]) {
        free = i;
        break;
      }
    }
    if (free >= 0) {
      const stuck = kind === "recs" && slow;
      slots[free] = {
        kind,
        until: stuck ? Number.POSITIVE_INFINITY : tick + 3 + Math.floor(Math.random() * 3),
      };
    } else if (kind === "recs" && bulkheads) {
      failedFast += 1;
    }
    if (kind === "pay") payLog.push(free >= 0);
  }

  return { tick, slots, payLog: payLog.slice(-LOG), failedFast };
}

const SPEED_OPTIONS = [
  { value: "fast" as const, label: "Healthy" },
  { value: "slow" as const, label: "Slow (30 s a call)" },
];

function ThreadSlot({ slot }: { slot: Slot | null }) {
  const stuck = slot?.until === Number.POSITIVE_INFINITY;
  const tone = slot ? (stuck ? "amber" : KIND[slot.kind].tone) : undefined;
  return (
    <span
      data-tone={tone}
      title={slot ? (stuck ? "stuck waiting on recommendations" : KIND[slot.kind].label) : "free"}
      className={cn(
        styles.ease,
        "block h-[22px] w-[22px] rounded-[5px] border",
        !slot && "border-rule bg-paper",
        slot && !stuck && "border-(--tone-line) bg-(--tone-line)",
        stuck && "border-2 border-(--tone) bg-(--tone-line)",
      )}
    />
  );
}

export default function BulkheadPoolDemo() {
  const [speed, setSpeed] = useState<"fast" | "slow">("fast");
  const [bulkheads, setBulkheads] = useState(false);
  const [world, setWorld] = useState<World>(fresh);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const slow = speed === "slow";

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => setWorld((w) => step(w, slow, bulkheads)), TICK_MS);
    return () => window.clearInterval(timer);
  }, [inView, slow, bulkheads]);

  const restart = () => setWorld(fresh());

  const busy = world.slots.filter(Boolean).length;
  const stuck = world.slots.filter((s) => s?.until === Number.POSITIVE_INFINITY).length;
  const paidOk = world.payLog.filter(Boolean).length;
  const payHealth = world.payLog.length ? paidOk / world.payLog.length : 1;
  const paymentsDown = payHealth < 0.5;

  let note = "Everything is quick. Threads free up as fast as requests arrive.";
  if (slow && !bulkheads) {
    note =
      busy >= THREADS
        ? "All 100 threads are stuck waiting on recommendations. Payments is perfectly healthy, but there is no thread left to run it."
        : "Recommendation calls are piling up. Every stuck call holds a thread, and none come back.";
  } else if (slow && bulkheads) {
    note =
      "Recommendations can only tie up its own 10 threads. Extra calls fail fast (the page just shows no recommendations). Payments keep flowing.";
  } else if (!slow && stuck > 0) {
    note =
      "Recommendations recovered. New calls finish quickly; old stuck calls clear when you restart.";
  }

  return (
    <div ref={rootRef} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SegmentedControl
          label="Recommendations service"
          options={SPEED_OPTIONS}
          value={speed}
          onChange={setSpeed}
        />
        <DemoToggle
          label="Bulkheads: a separate pool per dependency"
          checked={bulkheads}
          onChange={(on) => {
            setBulkheads(on);
            restart();
          }}
        />
        <DemoButton onClick={restart} className="sm:ml-auto">
          <RotateCcw className="h-4 w-4" aria-hidden /> Restart
        </DemoButton>
      </div>

      {/* Incoming traffic */}
      <div className="flex items-center gap-3 text-sm text-ink-muted">
        <span className="shrink-0 font-semibold text-ink">requests in</span>
        <span data-tone="violet" className="flex-1">
          <Wire axis="x" className="w-full" />
        </span>
        <span className="shrink-0 text-right font-mono">
          {busy}/100 busy
          {world.failedFast > 0 && <span className="block">{world.failedFast} failed fast</span>}
        </span>
      </div>

      {bulkheads ? (
        <div key="split" className={cn("flex flex-wrap gap-3", styles.pop)}>
          {POOLS.map((pool) => {
            const used = world.slots.slice(pool.from, pool.to).filter(Boolean).length;
            return (
              <section
                key={pool.kind}
                data-tone={KIND[pool.kind].tone}
                className="rounded-xl border border-(--tone-line) bg-(--tone-soft) p-2.5"
              >
                <p className="mb-2 flex items-baseline justify-between gap-3 text-xs font-bold tracking-[0.06em] text-(--tone) uppercase">
                  {pool.title}
                  <span className="font-mono font-semibold text-ink-muted normal-case">
                    {used}/{pool.to - pool.from}
                  </span>
                </p>
                <div className={cn("grid w-max gap-1", pool.cols)}>
                  {world.slots.slice(pool.from, pool.to).map((slot, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: thread slots are positional.
                    <ThreadSlot key={pool.from + i} slot={slot} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <section
          key="shared"
          className={cn(
            "w-max max-w-full rounded-xl border border-rule bg-paper p-2.5",
            styles.pop,
          )}
        >
          <p className="mb-2 text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">
            One shared pool · 100 threads
          </p>
          <div className="grid w-max grid-cols-10 gap-1 sm:grid-cols-20">
            {world.slots.map((slot, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: thread slots are positional.
              <ThreadSlot key={i} slot={slot} />
            ))}
          </div>
        </section>
      )}

      <ul aria-label="Legend" className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
        {(["recs", "pay", "other"] as Kind[]).map((kind) => (
          <li key={kind} data-tone={KIND[kind].tone} className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="h-3 w-3 rounded-sm border border-(--tone-line) bg-(--tone-line)"
            />
            {KIND[kind].label}
          </li>
        ))}
        <li data-tone="amber" className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 rounded-sm border-2 border-(--tone) bg-(--tone-line)"
          />
          stuck waiting
        </li>
      </ul>

      <div
        data-tone={paymentsDown ? "red" : slow ? "amber" : "green"}
        className={cn(
          styles.ease,
          "grid gap-3 rounded-xl border border-(--tone-line) bg-(--tone-soft) px-4 py-3 sm:grid-cols-[auto_1fr] sm:items-center",
        )}
      >
        <p
          key={paymentsDown ? "down" : "up"}
          className={cn(
            "font-mono text-sm font-semibold text-(--tone)",
            paymentsDown && styles.shake,
          )}
        >
          payments: {Math.round(payHealth * 100)}% served
        </p>
        <p aria-live="polite" className="text-sm leading-relaxed text-ink">
          {note}
        </p>
      </div>
    </div>
  );
}
