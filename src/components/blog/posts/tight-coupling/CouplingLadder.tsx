/*
 * CouplingLadder.tsx
 * The classic ranking of coupling kinds from structured design, as a ladder you can
 * step down. Each rung is a button; the panel shows that rung as a tiny scene (module
 * A talking to module B, with a packet riding the link), a code example, and a meter of
 * how much A has to know about B. A marker slides along the tight-to-loose track as you
 * move. The printed copy lists every rung.
 */

"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

type Scene = "reach" | "shared" | "door" | "queue";

interface Rung {
  name: string;
  plain: string;
  like: string;
  code: string;
  scene: Scene;
  /** What rides along the link. */
  carry: string;
  /** The thing in the middle, for shared and queue scenes. */
  middle?: string;
  /** What A has to know about B. */
  knows: string;
}

const RUNGS: Rung[] = [
  {
    name: "Content",
    plain: "One module reaches inside another and reads or changes its private parts.",
    like: "a flatmate rummaging through your bag",
    code: "order._items.push(freeGift)",
    scene: "reach",
    carry: "_items",
    knows: "B's private fields",
  },
  {
    name: "Common",
    plain: "Several modules read and write the same global data.",
    like: "one office whiteboard that everyone erases",
    code: "globalConfig.taxRate = 0.18",
    scene: "shared",
    carry: "taxRate",
    middle: "globalConfig",
    knows: "a global, and everyone else who writes it",
  },
  {
    name: "External",
    plain: "Modules share a format, protocol or device that someone outside imposed.",
    like: "every gadget forced onto the same odd plug",
    code: 'parseVendorCsv(file) // column 7 = "price"',
    scene: "shared",
    carry: "col 7",
    middle: "vendor CSV",
    knows: "an outside format neither of them owns",
  },
  {
    name: "Control",
    plain: "One module passes a flag that tells another what to do inside.",
    like: "a back-seat driver",
    code: "render(page, true, false, LEGACY)",
    scene: "door",
    carry: "LEGACY",
    knows: "how B decides what to do inside",
  },
  {
    name: "Stamp",
    plain: "Passing a whole data structure when only a piece is needed.",
    like: "handing over your wallet to show your ID",
    code: "sendReceipt(user) // only needs email",
    scene: "door",
    carry: "{ user }",
    knows: "the whole shape of User",
  },
  {
    name: "Data",
    plain: "Passing only the simple values that are actually needed.",
    like: "just showing the ID card",
    code: "sendReceipt(email, orderId)",
    scene: "door",
    carry: "email",
    knows: "two plain values",
  },
  {
    name: "Message",
    plain: "Modules only exchange messages; no shared state, no direct calls.",
    like: "a note pinned on the noticeboard",
    code: 'bus.publish({ type: "OrderPlaced", orderId })',
    scene: "queue",
    carry: "msg",
    middle: "queue",
    knows: "only the message format",
  },
];

const toneFor = (i: number): Tone => (i < 3 ? "red" : i < 5 ? "amber" : "green");

// A link with a packet riding along it.
function Track({ label, reverse }: { label: string; reverse?: boolean }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-center font-mono text-[0.7rem] text-(--tone) sm:text-xs">
        {label}
      </p>
      <div className="relative mt-1 h-[2px] rounded-full bg-(--tone-line)">
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--tone) motion-safe:block",
            styles.ride,
          )}
          style={
            {
              animationDirection: reverse ? "reverse" : undefined,
              "--dur": "1.8s",
            } as CSSProperties
          }
        />
      </div>
    </div>
  );
}

function Box({ name, children }: { name: string; children?: ReactNode }) {
  return (
    <div className="shrink-0 rounded-xl border border-rule bg-paper px-2 py-2 text-center sm:px-3">
      <p className="text-xs font-bold text-ink sm:text-sm">{name}</p>
      {children}
    </div>
  );
}

function SceneView({ rung }: { rung: Rung }) {
  const reach = rung.scene === "reach";
  const target = (
    <Box name="Module B">
      <div className="mt-1.5 flex flex-col gap-1">
        <span
          className={cn(
            "rounded-md border px-1.5 py-0.5 font-mono text-[0.65rem] sm:text-[0.7rem]",
            reach ? "border-rule text-ink-muted" : "border-(--tone) bg-(--tone-soft) text-ink",
          )}
        >
          public API
        </span>
        <span
          className={cn(
            "rounded-md border px-1.5 py-0.5 font-mono text-[0.65rem] sm:text-[0.7rem]",
            reach
              ? "tut-shake border-(--tone) bg-(--tone-soft) text-ink"
              : "border-dashed border-rule text-ink-muted",
          )}
        >
          private
        </span>
      </div>
    </Box>
  );

  if (rung.scene === "shared") {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Box name="A" />
        <Track label={rung.carry} />
        <div className="shrink-0 rounded-lg border border-dashed border-(--tone) bg-(--tone-soft) px-2 py-2 font-mono text-[0.68rem] text-ink sm:text-xs">
          {rung.middle}
        </div>
        <Track label={rung.carry} reverse />
        <Box name="B" />
      </div>
    );
  }

  if (rung.scene === "queue") {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Box name="Module A" />
        <Track label={rung.carry} />
        <div className="flex shrink-0 gap-0.5 rounded-lg border border-(--tone) bg-(--tone-soft) p-1.5">
          {[0, 1, 2].map((n) => (
            <span key={n} className="h-4 w-2.5 rounded-sm bg-(--tone) opacity-60" />
          ))}
        </div>
        <Track label="later" />
        {target}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Box name="Module A" />
      <Track label={rung.carry} />
      {target}
    </div>
  );
}

// The selected rung, as a scene with its code and a "how much A knows" meter.
function RungDetail({ picked, onPick }: { picked: number; onPick: (index: number) => void }) {
  const rung = RUNGS[picked];
  const knowsWidth = ((RUNGS.length - picked) / RUNGS.length) * 100;

  return (
    <div
      data-tone={toneFor(picked)}
      className="rounded-2xl border border-(--tone-line) bg-paper-raised p-4 print:hidden"
    >
      <div key={picked} className="tut-pop">
        <p className="text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
          Rung {picked + 1} of {RUNGS.length}
        </p>
        <p className="mt-0.5 text-xl font-bold text-ink">{rung.name} coupling</p>
        <p aria-live="polite" className="mt-1 leading-snug text-ink">
          {rung.plain}
        </p>
        <div className="mt-4">
          <SceneView rung={rung} />
        </div>
        <code className="mt-4 block overflow-x-auto rounded-lg border border-rule bg-paper px-3 py-2 font-mono text-[0.8rem] whitespace-pre text-ink">
          {rung.code}
        </code>
        <div className="mt-4">
          <p className="flex justify-between gap-2 text-xs text-ink-muted">
            <span>How much A must know about B</span>
            <span className="text-right text-ink">{rung.knows}</span>
          </p>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-(--tone-soft)">
            <div
              className={cn("h-full origin-left rounded-full bg-(--tone)", styles.meter)}
              style={{ width: `${knowsWidth}%`, opacity: 0.75 }}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={picked === 0}
          onClick={() => onPick(picked - 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-rule bg-paper px-3 text-sm font-semibold text-ink transition hover:border-ink-muted active:translate-y-px disabled:opacity-40"
        >
          <ChevronUp className="h-4 w-4" aria-hidden /> Tighter
        </button>
        <button
          type="button"
          disabled={picked === RUNGS.length - 1}
          onClick={() => onPick(picked + 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-(--tone) px-3 text-sm font-semibold text-paper transition active:translate-y-px disabled:opacity-40"
        >
          <ChevronDown className="h-4 w-4" aria-hidden /> Looser
        </button>
      </div>
    </div>
  );
}

export default function CouplingLadder() {
  const [picked, setPicked] = useState(0);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
      {/* The ladder. On phones the selected rung opens in place. */}
      <div className="min-w-0 pl-6">
        <p className="mb-2 flex items-center gap-1 text-xs font-bold tracking-[0.08em] text-ink-muted uppercase">
          <ChevronUp className="h-3.5 w-3.5" aria-hidden /> tighter: avoid
        </p>
        <ol className="list-none space-y-2 p-0" aria-label="Kinds of coupling, tightest first">
          {RUNGS.map((r, i) => (
            <li key={r.name} data-tone={toneFor(i)} className="relative">
              {/* This rung's stretch of the tight-to-loose rail. */}
              <span
                aria-hidden
                className={cn(
                  "absolute -top-1 -bottom-1 -left-5 w-1.5 rounded-full transition-colors duration-300",
                  picked === i ? "bg-(--tone)" : "bg-(--tone-line)",
                )}
              />
              {picked === i && (
                <span
                  aria-hidden
                  className="tut-pop absolute top-3.5 -left-[1.6rem] h-4 w-4 rounded-full border-2 border-paper bg-(--tone)"
                />
              )}
              <button
                type="button"
                aria-pressed={picked === i}
                onClick={() => setPicked(i)}
                className={cn(
                  "dg-node flex min-h-11 w-full items-baseline gap-3 rounded-xl border px-3 py-2 text-left transition",
                  picked === i
                    ? "border-(--tone) bg-(--tone-soft)"
                    : "border-(--tone-line) bg-paper hover:bg-(--tone-soft)",
                )}
              >
                <span className="font-mono text-xs font-bold text-(--tone)">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="font-semibold text-ink">{r.name} coupling</span>
                  <span className="block text-sm leading-snug text-ink-muted">≈ {r.like}</span>
                  <span className="mt-1 hidden text-sm text-ink print:block">
                    {r.plain} <code>{r.code}</code>
                  </span>
                </span>
              </button>
              {picked === i && (
                <div className="mt-2 lg:hidden">
                  <RungDetail picked={picked} onPick={setPicked} />
                </div>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-2 flex items-center gap-1 text-xs font-bold tracking-[0.08em] text-ink-muted uppercase">
          <ChevronDown className="h-3.5 w-3.5" aria-hidden /> looser: aim here
        </p>
      </div>

      <div className="hidden lg:sticky lg:top-28 lg:block">
        <RungDetail picked={picked} onPick={setPicked} />
      </div>
    </div>
  );
}
