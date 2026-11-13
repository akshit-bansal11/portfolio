/*
 * OtTransformDemo.tsx
 * Operational Transformation on one real example. Both phones hold "teaa milk".
 * Meera inserts "oat " at position 5 while Kabir deletes the extra "a" at position 2.
 * The two operations cross on the network, then each phone applies the other's.
 * With transformation on, Kabir's phone shifts Meera's insert to position 4 and both
 * end with "tea oat milk". With it off, Kabir's phone gets "tea moat ilk" and the two
 * copies disagree. Every character cell shows its position, so the shift is visible.
 */

"use client";

import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";
import StepControls from "./StepControls";
import { useStepper } from "./useStepper";

const START = "teaa milk";
const INSERT = "oat ";

type Mark = "added" | "removed" | "wrong";
interface Cell {
  char: string;
  mark?: Mark;
}

const cells = (text: string, marks: Record<number, Mark> = {}): Cell[] =>
  [...text].map((char, i) => ({ char, mark: marks[i] }));

const range = (from: number, length: number, mark: Mark) =>
  Object.fromEntries(Array.from({ length }, (_, i) => [from + i, mark]));

function meeraCells(step: number): Cell[] {
  if (step === 0) return cells(START);
  if (step < 3) return cells("teaa oat milk", range(5, 4, "added"));
  // Kabir's "delete @2" is before her insert, so it applies unchanged.
  return cells("tea oat milk", range(4, 4, "added"));
}

function kabirCells(step: number, transform: boolean): Cell[] {
  if (step === 0) return cells(START);
  if (step < 3) return cells(START, { 2: "removed" });
  return transform
    ? cells("tea oat milk", range(4, 4, "added"))
    : cells("tea moat ilk", range(5, 4, "wrong"));
}

const MARK_TONE: Record<Mark, Tone> = { added: "green", removed: "red", wrong: "red" };

function Text({ label, tone, row }: { label: string; tone: Tone; row: Cell[] }) {
  const text = row
    .filter((c) => c.mark !== "removed")
    .map((c) => c.char)
    .join("");
  return (
    <div data-tone={tone}>
      <p className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-(--tone)">{label}</span>
        <span className="font-mono text-xs text-ink-muted">“{text}”</span>
      </p>
      <ol className="flex list-none gap-[3px] p-0" aria-hidden>
        {row.map((cell, i) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional.
            key={`${i}-${cell.char}-${cell.mark ?? ""}`}
            data-tone={cell.mark ? MARK_TONE[cell.mark] : undefined}
            className={cn(
              "flex w-[1.3rem] flex-col items-center rounded-md border py-1 sm:w-8",
              !cell.mark && "border-rule bg-paper",
              cell.mark && "tut-pop border-(--tone-line) bg-(--tone-soft)",
              cell.mark === "wrong" && "tut-shake",
            )}
          >
            <span
              className={cn(
                "font-mono text-[0.95rem] leading-5 font-semibold sm:text-lg",
                cell.mark ? "text-(--tone)" : "text-ink",
                cell.mark === "removed" && "line-through",
              )}
            >
              {cell.char === " " ? "␣" : cell.char}
            </span>
            <span className="font-mono text-[0.55rem] leading-3 text-ink-muted sm:text-[0.65rem]">
              {i}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function OpChip({ tone, children }: { tone: Tone; children: string }) {
  return (
    <span
      data-tone={tone}
      className="inline-flex items-center gap-1 rounded-full border border-(--tone-line) bg-paper px-2.5 py-1 font-mono text-xs whitespace-nowrap text-(--tone)"
    >
      {children}
    </span>
  );
}

export default function OtTransformDemo() {
  const [transform, setTransform] = useState(true);
  const { ref, step, last, playing, motion, go, toggle } = useStepper(4, 2300);
  const meera = meeraCells(step);
  const kabir = kabirCells(step, transform);
  const same = step === 3 && transform;

  const notes = [
    "Both phones hold the same text. The small numbers are positions, counted from 0.",
    "At the same moment: Meera inserts “oat ” at position 5. Kabir deletes the extra “a” at position 2.",
    "Each phone sends its edit as an operation. The two operations cross on the network.",
    transform
      ? "Kabir's phone transforms Meera's insert: a character before position 5 was deleted, so it now goes at 4. Both phones read “tea oat milk”."
      : "No transform: Kabir's phone inserts at 5 in a text that has shifted left. It reads “tea moat ilk” while Meera's reads “tea oat milk”.",
  ];

  return (
    <div ref={ref}>
      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        <span className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
          Kabir's phone
        </span>
        {(
          [
            [true, "Transforms the insert", "green"],
            [false, "Applies it as sent", "red"],
          ] as const
        ).map(([value, label, tone]) => (
          <button
            key={label}
            type="button"
            data-tone={tone}
            aria-pressed={transform === value}
            onClick={() => setTransform(value)}
            className={cn(
              "min-h-10 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)",
              transform === value
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
        aria-label={`Meera's text: ${meera.map((c) => c.char).join("")}. Kabir's text: ${kabir
          .filter((c) => c.mark !== "removed")
          .map((c) => c.char)
          .join("")}.`}
        className="overflow-hidden"
      >
        <Text label="Meera's phone" tone="violet" row={meera} />

        {/* The network band between the two phones. */}
        <div className="relative my-2 h-20 rounded-xl border border-dashed border-rule">
          {step !== 3 && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.65rem] font-semibold tracking-[0.12em] text-ink-muted/70 uppercase">
              network
            </span>
          )}
          {step === 2 && (
            <>
              <span
                className={cn(
                  "absolute top-1/2 left-[24%] -translate-x-1/2 -translate-y-1/2",
                  styles.crossDown,
                )}
              >
                <OpChip tone="violet">insert “oat ” @5 ↓</OpChip>
              </span>
              <span
                className={cn(
                  "absolute top-1/2 left-[76%] -translate-x-1/2 -translate-y-1/2",
                  styles.crossUp,
                )}
              >
                <OpChip tone="blue">delete @2 ↑</OpChip>
              </span>
            </>
          )}
          {step === 3 && (
            <div className="tut-pop absolute inset-0 flex flex-wrap items-center justify-center gap-2 px-2">
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                <OpChip tone="blue">delete @2</OpChip>
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                <OpChip tone={transform ? "green" : "red"}>
                  {transform ? "insert “oat ” @5 → @4" : "insert “oat ” @5"}
                </OpChip>
              </span>
            </div>
          )}
        </div>

        <Text label="Kabir's phone" tone="blue" row={kabir} />

        <p
          data-tone={same ? "green" : "red"}
          className={cn(
            "mt-3 flex items-center gap-1.5 text-sm font-semibold text-(--tone) transition-opacity duration-300",
            step !== 3 && "opacity-0",
          )}
        >
          {same ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <X className="h-4 w-4" aria-hidden />
          )}
          {same ? "Same text on both phones" : "The copies now disagree, and one is garbled"}
        </p>
      </div>

      <StepControls
        step={step}
        last={last}
        playing={playing}
        motion={motion}
        go={go}
        toggle={toggle}
        note={notes[step]}
        tone="violet"
      />
      <p className="hidden text-sm text-ink print:block">{notes.join(" ")}</p>
    </div>
  );
}
