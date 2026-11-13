/*
 * LostUpdateReplay.tsx
 * The hook, played out. Two phones go offline in a basement, each adds one item, then
 * both reconnect and sync through a server. Switch the server's rule between
 * "last-write-wins" (keeps the newest save, so Meera's eggs vanish) and "merge"
 * (what a CRDT does: both edits survive). Loops on its own while on screen; the reader
 * can step through it. Without motion it shows the final state.
 */

"use client";

import { Check, Server, Smartphone, Wifi, WifiOff, X } from "lucide-react";
import { useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import Pipe from "./Pipe";
import StepControls from "./StepControls";
import { useStepper } from "./useStepper";

type Mode = "lww" | "merge";
type RowState = "plain" | "new" | "lost" | "stale";
interface Row {
  text: string;
  state: RowState;
}

const BASE = ["milk", "bread"];
const STEPS = 7;

const rows = (items: string[], state: RowState = "plain"): Row[] =>
  items.map((text) => ({ text, state }));

function meera(step: number, mode: Mode): Row[] {
  if (step < 2) return rows(BASE);
  if (step < 6) return [...rows(BASE), { text: "eggs", state: step === 2 ? "new" : "plain" }];
  return mode === "lww"
    ? [...rows(BASE), { text: "eggs", state: "lost" }, { text: "chai", state: "new" }]
    : [...rows(BASE), { text: "eggs", state: "plain" }, { text: "chai", state: "new" }];
}

function kabir(step: number, mode: Mode): Row[] {
  if (step < 3) return rows(BASE);
  if (step < 6) return [...rows(BASE), { text: "chai", state: step === 3 ? "new" : "plain" }];
  return mode === "lww"
    ? [...rows(BASE), { text: "chai", state: "plain" }]
    : [...rows(BASE), { text: "eggs", state: "new" }, { text: "chai", state: "plain" }];
}

function server(step: number, mode: Mode): Row[] {
  if (step < 5) return rows(BASE, step === 4 ? "stale" : "plain");
  return mode === "lww"
    ? [...rows(BASE), { text: "chai", state: step === 5 ? "new" : "plain" }]
    : [...rows(BASE), { text: "eggs", state: step === 5 ? "new" : "plain" }, {
        text: "chai",
        state: step === 5 ? "new" : "plain",
      }];
}

const NOTES: Record<Mode, string[]> = {
  lww: [
    "Both phones are online and agree: milk, bread.",
    "The basement has no signal. Each phone now keeps its own copy.",
    "Meera adds eggs. Her phone saves the list at 10:02.",
    "Kabir adds chai. His phone saves the list at 10:03.",
    "Back upstairs, both phones send their whole list to the server.",
    "Last-write-wins: the server keeps the newest save (10:03) and drops the other one.",
    "Both phones download the winner. Meera's eggs are gone, and nobody saw an error.",
  ],
  merge: [
    "Both phones are online and agree: milk, bread.",
    "The basement has no signal. Each phone now keeps its own copy.",
    "Meera adds eggs while offline.",
    "Kabir adds chai while offline.",
    "Back upstairs, both phones send their edits to the server.",
    "Merge: the server combines both edits. There is nothing to throw away.",
    "Both phones get the merged list. Eggs and chai both survive, on both phones.",
  ],
};

const ROW_TONE: Record<RowState, Tone | undefined> = {
  plain: undefined,
  stale: undefined,
  new: "green",
  lost: "red",
};

function List({ items }: { items: Row[] }) {
  return (
    <ul className="mt-2 space-y-1">
      {items.map((row) => (
        <li
          key={`${row.text}-${row.state}`}
          data-tone={ROW_TONE[row.state]}
          className={cn(
            "flex items-center gap-2 rounded-md border px-2 py-1 text-sm transition-colors",
            row.state === "plain" && "border-rule bg-paper text-ink",
            row.state === "stale" && "border-dashed border-rule text-ink-muted",
            row.state === "new" && "tut-pop border-(--tone-line) bg-(--tone-soft) text-ink",
            row.state === "lost" &&
              "tut-shake border-(--tone-line) bg-(--tone-soft) text-(--tone) line-through",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              row.state === "plain" || row.state === "stale" ? "bg-ink-muted/50" : "bg-(--tone)",
            )}
          />
          {row.text}
          {row.state === "new" && <Check className="ml-auto h-3.5 w-3.5 text-(--tone)" aria-hidden />}
          {row.state === "lost" && (
            <span className="ml-auto font-sans text-xs font-semibold no-underline">lost</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Phone({
  name,
  online,
  saved,
  items,
  tone,
}: {
  name: string;
  online: boolean;
  saved?: string;
  items: Row[];
  tone: Tone;
}) {
  return (
    <section
      data-tone={tone}
      aria-label={name}
      className={cn(
        "dg-node min-w-0 flex-1 rounded-2xl border bg-paper p-3 transition-[border-style,opacity] duration-300",
        online ? "border-(--tone-line)" : "border-dashed border-ink-muted/60",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold text-ink">
          <span className="dg-icon flex h-7 w-7 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone)">
            <Smartphone className="h-4 w-4" aria-hidden />
          </span>
          {name}
        </span>
        <span
          data-tone={online ? "green" : "amber"}
          className="inline-flex items-center gap-1 rounded-full bg-(--tone-soft) px-2 py-0.5 text-xs font-semibold text-(--tone)"
        >
          {online ? (
            <Wifi className="h-3 w-3" aria-hidden />
          ) : (
            <WifiOff className="h-3 w-3" aria-hidden />
          )}
          {online ? "online" : "offline"}
        </span>
      </div>
      <List items={items} />
      <p className="mt-2 h-4 font-mono text-[0.7rem] text-ink-muted">{saved ?? ""}</p>
    </section>
  );
}

export default function LostUpdateReplay() {
  const [mode, setMode] = useState<Mode>("lww");
  const { ref, step, last, playing, motion, go, toggle } = useStepper(STEPS, 2100);
  const online = step === 0 || step >= 4;
  const lww = mode === "lww";

  return (
    <div ref={ref}>
      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        <span className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
          Server rule
        </span>
        {(
          [
            ["lww", "Last-write-wins", "red"],
            ["merge", "Merge both (CRDT)", "green"],
          ] as const
        ).map(([value, label, tone]) => (
          <button
            key={value}
            type="button"
            data-tone={tone}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={cn(
              "min-h-10 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)",
              mode === value
                ? "border-(--tone) bg-(--tone-soft) text-(--tone)"
                : "border-rule text-ink-muted hover:border-(--tone-line) hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="img"
        aria-label={
          lww
            ? "Meera adds eggs and Kabir adds chai while offline. On reconnect the last-write-wins server keeps Kabir's later list, so both phones end with milk, bread, chai, and Meera's eggs are lost."
            : "Meera adds eggs and Kabir adds chai while offline. On reconnect the server merges both edits, so both phones end with milk, bread, eggs, chai."
        }
        className="flex flex-col items-stretch md:flex-row md:items-center"
      >
        <Phone
          name="Meera"
          tone="violet"
          online={online}
          saved={step >= 2 && step < 5 ? "saved 10:02" : undefined}
          items={meera(step, mode)}
        />
        <Pipe active={step === 4 || step === 6} reverse={step === 6} tone="violet" />

        <section
          data-tone={lww ? "red" : "green"}
          aria-label="Sync server"
          className={cn(
            "dg-node min-w-0 flex-1 rounded-2xl border border-(--tone-line) bg-(image:--tone-fill) p-3",
            step === 5 && "dg-pulse",
          )}
        >
          <span className="flex items-center gap-2 font-semibold text-ink">
            <span className="dg-icon flex h-7 w-7 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone)">
              <Server className="h-4 w-4" aria-hidden />
            </span>
            Sync server
          </span>
          <p className="mt-1 text-xs font-semibold text-(--tone)">
            {lww ? "keeps the newest save" : "merges every edit"}
          </p>
          <List items={server(step, mode)} />
          <p
            data-tone="red"
            className={cn(
              "mt-2 flex h-4 items-center gap-1 font-mono text-[0.7rem] text-(--tone) transition-opacity duration-300",
              !(lww && step >= 5) && "opacity-0",
            )}
          >
            <X className="h-3 w-3" aria-hidden /> dropped: 10:02 list (eggs)
          </p>
        </section>

        <Pipe active={step === 4 || step === 6} reverse={step === 4} tone="blue" />
        <Phone
          name="Kabir"
          tone="blue"
          online={online}
          saved={step >= 3 && step < 5 ? "saved 10:03" : undefined}
          items={kabir(step, mode)}
        />
      </div>

      <StepControls
        step={step}
        last={last}
        playing={playing}
        motion={motion}
        go={go}
        toggle={toggle}
        note={NOTES[mode][step]}
        tone={lww ? "red" : "green"}
      />
      <p className="hidden text-sm text-ink print:block">{NOTES[mode].join(" ")}</p>
    </div>
  );
}
