/*
 * YjsItemChain.tsx
 * How Yjs stores the word "chai", built up one step at a time. Every character is an
 * item with an ID (client, counter) and the ID of the item it was typed after. Client B
 * types "y" and deletes it: the item stays as a tombstone. Client A, who still saw
 * "chay", then types "i" after B:0, and the tombstone tells every replica where it
 * goes. The newest item pops in and the item it points to pulses.
 */

"use client";

import { ArrowRight } from "lucide-react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import StepControls from "./StepControls";
import { useStepper } from "./useStepper";

interface Item {
  char: string;
  id: string;
  after: string;
  /** Step at which it appears. */
  from: number;
  /** Step at which it is deleted. */
  deletedAt?: number;
}

const ITEMS: Item[] = [
  { char: "c", id: "A:0", after: "start", from: 0 },
  { char: "h", id: "A:1", after: "A:0", from: 0 },
  { char: "a", id: "A:2", after: "A:1", from: 0 },
  { char: "y", id: "B:0", after: "A:2", from: 1, deletedAt: 2 },
  { char: "i", id: "A:3", after: "B:0", from: 3 },
];

const NOTES = [
  "Client A types “cha”. Each letter becomes an item: an ID (who typed it + their counter) and the item it was typed after.",
  "Client B types “y” after A:2. It's B's first item, so its ID is B:0. The text reads “chay”.",
  "B deletes “y”. Yjs doesn't remove the item. It marks it deleted: a tombstone. The text reads “cha”.",
  "Client A was offline and still saw “chay”. It types “i” after B:0. Because the tombstone is still there, every replica knows where “i” goes: “chai”.",
];

const CLIENT_TONE: Record<string, Tone> = { A: "violet", B: "blue" };

export default function YjsItemChain() {
  const { ref, step, last, playing, motion, go, toggle } = useStepper(NOTES.length, 2600);
  const items = ITEMS.filter((item) => item.from <= step);
  const newest = items.filter((item) => item.from === step).map((item) => item.id);
  const pointedAt = step === 0 ? [] : items.filter((i) => i.from === step).map((i) => i.after);
  const isDead = (item: Item) => item.deletedAt !== undefined && item.deletedAt <= step;
  const visible = items.filter((item) => !isDead(item)).map((item) => item.char).join("");
  const tombstones = items.filter(isDead).length;

  return (
    <div ref={ref}>
      <div
        role="img"
        aria-label={`Items stored: ${items
          .map((i) => `${i.char} (${i.id}${isDead(i) ? ", deleted" : ""}, after ${i.after})`)
          .join(", ")}. Visible text: ${visible}.`}
      >
        <ol className="flex min-h-[7.5rem] list-none flex-wrap items-center gap-y-3 p-0">
          {items.map((item, index) => {
            const dead = isDead(item);
            const tone = dead ? "red" : CLIENT_TONE[item.id[0]];
            return (
              <li key={item.id} className="flex items-center">
                {index > 0 && (
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 text-ink-muted sm:mx-1.5 sm:h-4 sm:w-4"
                    aria-hidden
                  />
                )}
                <div
                  data-tone={tone}
                  className={cn(
                    "dg-node flex w-[3.1rem] flex-col items-center rounded-xl border bg-paper px-1 py-2 sm:w-20",
                    dead ? "border-dashed border-(--tone-line)" : "border-(--tone-line)",
                    newest.includes(item.id) && "tut-pop",
                    pointedAt.includes(item.id) && "dg-pulse",
                  )}
                >
                  <span
                    className={cn(
                      "text-2xl leading-8 font-bold sm:text-3xl sm:leading-10",
                      dead ? "text-ink-muted line-through" : "text-ink",
                    )}
                  >
                    {item.char}
                  </span>
                  <span className="rounded bg-(--tone-soft) px-1 font-mono text-[0.7rem] font-semibold text-(--tone)">
                    {item.id}
                  </span>
                  <span className="mt-1 text-center font-mono text-[0.6rem] leading-tight text-ink-muted sm:text-[0.65rem]">
                    {dead ? (
                      "deleted"
                    ) : (
                      <>
                        after
                        <br />
                        {item.after}
                      </>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-3 text-sm">
          <span className="text-ink-muted">
            Visible text:{" "}
            <b data-tone="term" className="font-mono text-base text-(--tone)">
              “{visible}”
            </b>
          </span>
          <span className="font-mono text-xs text-ink-muted">
            stored: {items.length} items, {tombstones} tombstone{tombstones === 1 ? "" : "s"}
          </span>
          <span className="ml-auto flex items-center gap-3 text-xs text-ink-muted">
            <span data-tone="violet" className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-(--tone)" aria-hidden /> client A
            </span>
            <span data-tone="blue" className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-(--tone)" aria-hidden /> client B
            </span>
          </span>
        </div>
      </div>

      <StepControls
        step={step}
        last={last}
        playing={playing}
        motion={motion}
        go={go}
        toggle={toggle}
        note={NOTES[step]}
        tone="violet"
      />
      <ol className="mt-3 hidden list-decimal space-y-1 pl-5 text-sm text-ink print:block">
        {NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ol>
    </div>
  );
}
