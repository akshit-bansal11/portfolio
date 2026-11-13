/*
 * CounterMerge.tsx
 * A grow-only counter you can poke. Two phones each keep one slot per replica (A, B, C)
 * and only ever bump their own slot. Merging copies the max of each slot across, with a
 * packet riding the wire in the merge's direction. Merge in either order, or twice, and
 * both phones land on the same slots and the same total. Starts from the numbers in
 * the post (A: 3,0,1 and B: 1,2,0).
 */

"use client";

import { Check, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";
import Pipe from "./Pipe";

type Slots = [number, number, number];
type Side = "a" | "b";

const START: Record<Side, Slots> = { a: [3, 0, 1], b: [1, 2, 0] };
const OWNER: Record<Side, number> = { a: 0, b: 1 };
const NAMES = ["A", "B", "C"];

const sum = (slots: Slots) => slots[0] + slots[1] + slots[2];
const max = (x: Slots, y: Slots): Slots => [
  Math.max(x[0], y[0]),
  Math.max(x[1], y[1]),
  Math.max(x[2], y[2]),
];

function Replica({
  side,
  slots,
  changed,
  onBump,
}: {
  side: Side;
  slots: Slots;
  changed: number[];
  onBump: () => void;
}) {
  const tone: Tone = side === "a" ? "violet" : "blue";
  return (
    <section
      data-tone={tone}
      aria-label={`Phone ${NAMES[OWNER[side]]}`}
      className="dg-node min-w-0 flex-1 rounded-2xl border border-(--tone-line) bg-paper p-3"
    >
      <p className="flex items-center justify-between gap-2">
        <span className="font-semibold text-ink">Phone {NAMES[OWNER[side]]}</span>
        <span className="font-mono text-sm text-ink-muted">
          total <b className="text-lg text-(--tone)">{sum(slots)}</b>
        </span>
      </p>
      <ol className="mt-2 grid list-none grid-cols-3 gap-2 p-0">
        {slots.map((value, i) => {
          const own = i === OWNER[side];
          return (
            <li
              key={`${NAMES[i]}-${value}`}
              data-tone={own ? tone : changed.includes(i) ? "green" : undefined}
              className={cn(
                "flex flex-col items-center rounded-lg border py-1.5",
                own || changed.includes(i)
                  ? "border-(--tone-line) bg-(--tone-soft)"
                  : "border-rule bg-paper-raised",
                changed.includes(i) && styles.flash,
                changed.includes(i) && "tut-pop",
              )}
            >
              <span className="font-mono text-xl leading-7 font-bold text-ink">{value}</span>
              <span className="text-[0.7rem] text-ink-muted">
                slot {NAMES[i]}
                {own ? " (mine)" : ""}
              </span>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={onBump}
        className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-(--tone-line) bg-(--tone-soft) text-sm font-semibold text-(--tone) transition-[translate,background-color] hover:bg-(--tone)/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone) active:translate-y-px"
      >
        <Plus className="h-4 w-4" aria-hidden /> Like on phone {NAMES[OWNER[side]]}
      </button>
    </section>
  );
}

export default function CounterMerge() {
  const [state, setState] = useState(START);
  const [changed, setChanged] = useState<Record<Side, number[]>>({ a: [], b: [] });
  const [shot, setShot] = useState<{ to: Side; id: number } | null>(null);
  const [note, setNote] = useState(
    "Each phone only bumps its own slot. Merge in either direction, as often as you like.",
  );

  const bump = (side: Side) => {
    const next = [...state[side]] as Slots;
    next[OWNER[side]] += 1;
    setState({ ...state, [side]: next });
    setChanged({ a: [], b: [] });
    setShot(null);
    setNote(
      `Phone ${NAMES[OWNER[side]]} bumped its own slot. The phones disagree until they merge.`,
    );
  };

  const merge = (to: Side) => {
    const from: Side = to === "a" ? "b" : "a";
    const merged = max(state[to], state[from]);
    const diff = merged.flatMap((v, i) => (v !== state[to][i] ? [i] : []));
    setState({ ...state, [to]: merged });
    setChanged({ a: [], b: [], [to]: diff });
    setShot({ to, id: (shot?.id ?? 0) + 1 });
    setNote(
      diff.length === 0
        ? `Nothing new for phone ${NAMES[OWNER[to]]}: merging again changes nothing. That's idempotent.`
        : `Phone ${NAMES[OWNER[to]]} took the max of each slot: ${merged.join(", ")} = ${sum(merged)}.`,
    );
  };

  const agree = state.a.every((v, i) => v === state.b[i]);

  return (
    <div>
      <div className="flex flex-col items-stretch md:flex-row md:items-center">
        <Replica side="a" slots={state.a} changed={changed.a} onBump={() => bump("a")} />
        <Pipe
          key={shot?.id ?? 0}
          active={shot !== null}
          reverse={shot?.to === "a"}
          tone="green"
          label="max per slot"
        />
        <Replica side="b" slots={state.b} changed={changed.b} onBump={() => bump("b")} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["b", "Merge A → B"],
            ["a", "Merge B → A"],
          ] as const
        ).map(([to, label]) => (
          <button
            key={to}
            type="button"
            data-tone="green"
            onClick={() => merge(to)}
            className="inline-flex min-h-10 items-center rounded-lg border border-(--tone-line) bg-(image:--tone-fill) px-3 text-sm font-semibold text-(--tone) transition-[translate,border-color] hover:border-(--tone) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone) active:translate-y-px"
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setState(START);
            setChanged({ a: [], b: [] });
            setShot(null);
            setNote("Back to the start: A has 3, 0, 1 and B has 1, 2, 0.");
          }}
          className="ml-auto inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-[0.95rem] leading-snug text-ink">
          {note}
        </p>
        <span
          data-tone={agree ? "green" : "amber"}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-(--tone-soft) px-2.5 py-1 text-xs font-semibold text-(--tone) sm:self-auto"
        >
          {agree && <Check className="h-3.5 w-3.5" aria-hidden />}
          {agree ? `Both say ${sum(state.a)}` : `A says ${sum(state.a)}, B says ${sum(state.b)}`}
        </span>
      </div>
    </div>
  );
}
