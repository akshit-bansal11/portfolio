/*
 * StateVectorSync.tsx
 * How two Yjs documents catch up. Each square is one item, in rows per client, so a
 * row's length is that client's entry in the state vector ("A up to 12"). The phone
 * sends its vector, the laptop works out exactly which items the phone lacks, and only
 * those travel; the phone's own offline items go the other way. Ends with both rows
 * identical. Loops on its own while on screen.
 */

"use client";

import { Laptop, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import Pipe from "./Pipe";
import StepControls from "./StepControls";
import { useStepper } from "./useStepper";

type Client = "A" | "B" | "P";
type Vector = Record<Client, number>;

const CLIENTS: Client[] = ["A", "B", "P"];
// Highest counter held, or -1 for none.
const LAPTOP: Vector = { A: 12, B: 7, P: -1 };
const PHONE: Vector = { A: 9, B: 7, P: 2 };
const WIDTH: Vector = { A: 13, B: 8, P: 3 };

const fmt = (v: Vector) =>
  CLIENTS.filter((c) => v[c] >= 0)
    .map((c) => `${c}:${v[c]}`)
    .join(" ");

const NOTES = [
  "The laptop and the phone hold the same document, but the phone was offline for a day. Each square is one item.",
  `The phone sends its state vector, a few numbers: “${fmt(PHONE)}”. That's “the highest counter I have from each client”.`,
  "The laptop compares: the phone lacks A:10 to A:12. The laptop lacks P:0 to P:2, which the phone typed offline.",
  "Only the missing items travel, three each way. Nothing already held is sent again.",
  "Both documents now hold exactly the same items, so both show exactly the same content.",
];

function Squares({
  have,
  lacks,
  incoming,
  tone,
}: {
  have: Vector;
  /** Items the other side needs from me (highlighted). */
  lacks?: Vector;
  /** Items arriving from the other side (pop in). */
  incoming?: Vector;
  tone: Tone;
}) {
  return (
    <div className="mt-2 space-y-1.5">
      {CLIENTS.map((client) => (
        <div key={client} className="flex items-center gap-2">
          <span className="w-4 font-mono text-xs font-semibold text-ink-muted">{client}</span>
          <ol className="flex list-none flex-wrap gap-[3px] p-0">
            {Array.from({ length: WIDTH[client] }, (_, i) => {
              const held = i <= have[client];
              const arriving = incoming !== undefined && i > have[client] && i <= incoming[client];
              const asked = lacks !== undefined && held && i > lacks[client];
              return (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: squares are positional.
                  key={`${i}-${held}-${arriving}`}
                  data-tone={arriving ? "green" : asked ? "amber" : tone}
                  className={cn(
                    "h-3.5 w-3.5 rounded-[3px] border sm:h-4 sm:w-4",
                    held || arriving ? "border-(--tone-line)" : "border-dashed border-rule",
                    held && !asked && "bg-(--tone)/25",
                    asked && "bg-(--tone) dg-pulse",
                    arriving && "tut-pop bg-(--tone)/70",
                  )}
                />
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}

function Doc({
  name,
  icon,
  tone,
  vector,
  children,
}: {
  name: string;
  icon: ReactNode;
  tone: Tone;
  vector: string;
  children: ReactNode;
}) {
  return (
    <section
      data-tone={tone}
      aria-label={name}
      className="dg-node min-w-0 flex-1 rounded-2xl border border-(--tone-line) bg-paper p-3"
    >
      <p className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold text-ink">
          <span className="dg-icon flex h-7 w-7 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone) [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
          {name}
        </span>
        <code className="rounded bg-(--tone-soft) px-1.5 py-0.5 font-mono text-xs text-(--tone)">
          {vector}
        </code>
      </p>
      {children}
    </section>
  );
}

export default function StateVectorSync() {
  const { ref, step, last, playing, motion, go, toggle } = useStepper(NOTES.length, 2400);
  const done = step >= 4;
  const merged: Vector = { A: 12, B: 7, P: 2 };
  // From step 3 on, the items that travelled stay green so you can see what moved.
  const arrived = step >= 3 ? merged : undefined;

  const pipe =
    step === 1
      ? { active: true, reverse: true, label: `vector ${fmt(PHONE)}` }
      : step === 3
        ? { active: true, reverse: false, label: "A:10–12 → · ← P:0–2" }
        : { active: false, reverse: false, label: undefined };

  return (
    <div ref={ref}>
      <div
        role="img"
        aria-label="Laptop has A up to 12 and B up to 7. Phone has A up to 9, B up to 7 and its own P up to 2. They swap state vectors, send only the missing items (A 10 to 12 to the phone, P 0 to 2 to the laptop), and end up identical."
        className="flex flex-col items-stretch md:flex-row"
      >
        <Doc name="Laptop" icon={<Laptop />} tone="blue" vector={fmt(done ? merged : LAPTOP)}>
          <Squares
            have={LAPTOP}
            tone="blue"
            lacks={step === 2 || step === 3 ? PHONE : undefined}
            incoming={arrived}
          />
        </Doc>
        <Pipe tone={step === 1 ? "violet" : "green"} {...pipe} />
        <Doc name="Phone (offline a day)" icon={<Smartphone />} tone="violet" vector={fmt(done ? merged : PHONE)}>
          <Squares
            have={PHONE}
            tone="violet"
            lacks={step === 2 || step === 3 ? LAPTOP : undefined}
            incoming={arrived}
          />
        </Doc>
      </div>

      <StepControls
        step={step}
        last={last}
        playing={playing}
        motion={motion}
        go={go}
        toggle={toggle}
        note={NOTES[step]}
        tone="blue"
      />
      <ol className="mt-3 hidden list-decimal space-y-1 pl-5 text-sm text-ink print:block">
        {NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ol>
    </div>
  );
}
