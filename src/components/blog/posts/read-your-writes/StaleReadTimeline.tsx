/*
 * StaleReadTimeline.tsx
 * A step-through sequence diagram with three lifelines (your app, the primary, a
 * replica). "The bug" shows the read racing the replication stream and losing. "With a
 * version token" shows the same race, but the replica admits it is behind and the read
 * falls back to the primary. The newest message has a packet riding its arrow. Arrows
 * are placed in percentages, so the diagram scales with the column. The printed copy
 * shows every step.
 */

"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

type Lane = 0 | 1 | 2;

interface Message {
  t: string;
  from: Lane;
  to: Lane;
  label: string;
  tone: Tone;
  /** Still travelling when the story ends (drawn dashed and faded). */
  slow?: boolean;
  /** Lane states after this message: [primary, replica]. */
  state: [string, string];
  note: string;
}

const LANES: { name: string; tone: Tone }[] = [
  { name: "Your app", tone: "violet" },
  { name: "Primary", tone: "pink" },
  { name: "Replica 2", tone: "blue" },
];

const SCENARIOS: { id: string; name: string; messages: Message[] }[] = [
  {
    id: "bug",
    name: "The bug",
    messages: [
      {
        t: "0 ms",
        from: 0,
        to: 1,
        label: "UPDATE balance + 100",
        tone: "violet",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "Writes always go to the primary. It commits the change and writes it to its log as entry 42.",
      },
      {
        t: "3 ms",
        from: 1,
        to: 0,
        label: "OK, committed",
        tone: "green",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "The primary answers at once. It does not wait for the replicas: that's asynchronous replication.",
      },
      {
        t: "3 ms",
        from: 1,
        to: 2,
        label: "log entry 42 shipping…",
        tone: "amber",
        slow: true,
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "In the background, the primary streams entry 42 to the replica. Today the replica is busy, so this takes about 900 ms.",
      },
      {
        t: "120 ms",
        from: 0,
        to: 2,
        label: "SELECT balance",
        tone: "violet",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "You pull to refresh. The load balancer sends reads to any node, and it picks Replica 2.",
      },
      {
        t: "121 ms",
        from: 2,
        to: 0,
        label: "₹0",
        tone: "red",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "The replica answers honestly with what it has. It has no idea it is behind. You see ₹0.",
      },
      {
        t: "900 ms",
        from: 1,
        to: 2,
        label: "entry 42 applied",
        tone: "amber",
        state: ["₹100 · LSN 42", "₹100 · LSN 42"],
        note: "The replica catches up. A refresh now would show ₹100, but you've already screenshotted ₹0 for support.",
      },
    ],
  },
  {
    id: "token",
    name: "With a version token",
    messages: [
      {
        t: "0 ms",
        from: 0,
        to: 1,
        label: "UPDATE balance + 100",
        tone: "violet",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "Same write, same primary.",
      },
      {
        t: "3 ms",
        from: 1,
        to: 0,
        label: "OK + token: LSN 42",
        tone: "green",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "This time the app also remembers how far the primary's log had got: position 42. That number is the token.",
      },
      {
        t: "3 ms",
        from: 1,
        to: 2,
        label: "log entry 42 shipping…",
        tone: "amber",
        slow: true,
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "Replication is just as slow as before. Nothing about the database changed.",
      },
      {
        t: "120 ms",
        from: 0,
        to: 2,
        label: "SELECT balance (need ≥ 42)",
        tone: "violet",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "The read carries the token: only answer if you have applied at least entry 42.",
      },
      {
        t: "121 ms",
        from: 2,
        to: 0,
        label: "I'm at 41, not yet",
        tone: "amber",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "The replica compares its own position with the token and refuses. (It could also wait a few ms instead.)",
      },
      {
        t: "122 ms",
        from: 0,
        to: 1,
        label: "fallback: SELECT balance",
        tone: "violet",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "The router falls back to the primary for this one read.",
      },
      {
        t: "124 ms",
        from: 1,
        to: 0,
        label: "₹100",
        tone: "green",
        state: ["₹100 · LSN 42", "₹0 · LSN 41"],
        note: "Correct. Once the token is older than the replicas, reads quietly go back to replicas.",
      },
    ],
  },
];

// Lifeline x positions (percent of the lanes area).
const X = [100 / 6, 50, 500 / 6];

function Arrow({ message, live }: { message: Message; live: boolean }) {
  const left = Math.min(X[message.from], X[message.to]);
  const width = Math.abs(X[message.to] - X[message.from]);
  const rightward = message.to > message.from;

  return (
    <div
      data-tone={message.tone}
      className="absolute top-0 h-full"
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <p
        className={cn(
          "absolute inset-x-0 top-0 truncate px-2 text-center font-hand text-lg leading-6 font-bold text-(--tone) sm:text-xl",
          message.slow && "opacity-80",
        )}
      >
        {message.label}
      </p>
      <div
        className={cn(
          "absolute inset-x-1 top-8 border-t-[2.5px] border-(--tone)",
          message.slow && "border-dashed",
        )}
      />
      <svg
        aria-hidden
        viewBox="0 0 10 10"
        className={cn(
          "absolute top-[1.62rem] h-3 w-3 fill-(--tone)",
          rightward ? "right-0" : "left-0 rotate-180",
        )}
      >
        <path d="M0 0 L10 5 L0 10 Z" />
      </svg>
      {live && (
        <div className="absolute inset-x-1 top-8">
          <span
            className={cn(
              "tut-travel absolute -top-[7px] block h-3 w-3 -translate-x-1/2 rounded-full bg-(--tone) shadow-[0_0_10px_var(--tone)]",
              !rightward && "[animation-direction:reverse]",
            )}
            style={{ "--dur": message.slow ? "3s" : "1.1s" } as CSSProperties}
          />
        </div>
      )}
    </div>
  );
}

export default function StaleReadTimeline() {
  const [picked, setPicked] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scenario = SCENARIOS[picked];
  const last = scenario.messages.length - 1;
  const current = scenario.messages[step];

  // Auto-advance while playing; stop at the end.
  useEffect(() => {
    if (!playing || step >= last) return;
    const timer = window.setTimeout(() => {
      setStep(step + 1);
      if (step + 1 >= last) setPlaying(false);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [playing, step, last]);

  const choose = (index: number) => {
    setPicked(index);
    setStep(0);
    setPlaying(false);
  };

  return (
    <div className="my-10 rounded-2xl border border-rule bg-paper-raised p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div role="tablist" aria-label="Scenario" className="flex flex-wrap gap-2">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={picked === i}
              data-tone={i === 0 ? "red" : "green"}
              onClick={() => choose(i)}
              className={cn(
                "rounded-lg border-2 border-(--tone) px-3 py-1.5 text-sm font-semibold transition",
                picked === i ? "bg-(--tone) text-paper" : "text-(--tone) hover:bg-(--tone-soft)",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
        <span data-tone="term" className="font-hand text-xl text-(--tone)">
          press play, or step through
        </span>
      </div>

      {/* Lane heads with the current state of each database. */}
      <div className="mt-4 grid grid-cols-[3.5rem_1fr] gap-2 sm:grid-cols-[4.5rem_1fr]">
        <span />
        <div className="grid grid-cols-3 gap-2">
          {LANES.map((lane, i) => (
            <div
              key={lane.name}
              data-tone={lane.tone}
              className="tut-glow rounded-lg border-2 border-(--tone) bg-(image:--tone-fill) px-2 py-1.5 text-center"
            >
              <p className="font-hand text-xl leading-6 font-bold text-(--tone)">{lane.name}</p>
              <p className="font-mono text-[0.7rem] text-ink sm:text-xs">
                {i === 0 ? "phone + server" : current.state[i - 1]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Messages. Lifelines run behind them. */}
      <ol className="relative mt-1 list-none p-0">
        {scenario.messages.map((message, i) => (
          <li
            key={`${scenario.id}-${message.label}`}
            className={cn(
              "grid grid-cols-[3.5rem_1fr] gap-2 sm:grid-cols-[4.5rem_1fr]",
              i > step && "hidden print:grid",
              i === step && "tut-pop",
            )}
          >
            <span className="pt-6 text-right font-mono text-xs text-ink-muted">{message.t}</span>
            <div className="relative h-12">
              {X.map((x) => (
                <span
                  key={x}
                  aria-hidden
                  className="absolute inset-y-0 border-l-2 border-dashed border-rule"
                  style={{ left: `${x}%` }}
                />
              ))}
              <Arrow message={message} live={i === step} />
            </div>
          </li>
        ))}
      </ol>

      <p aria-live="polite" className="mt-3 min-h-12 text-ink print:hidden">
        <b>
          Step {step + 1}/{last + 1}:
        </b>{" "}
        {current.note}
      </p>

      <ol className="mt-3 hidden list-decimal space-y-1 pl-5 text-sm text-ink print:block">
        {scenario.messages.map((m) => (
          <li key={m.label}>{m.note}</li>
        ))}
      </ol>

      <div className="mt-3 flex flex-wrap items-center gap-2 print:hidden">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => {
            setPlaying(false);
            setStep(step - 1);
          }}
          className="inline-flex min-h-10 items-center rounded-md border border-rule px-3 text-sm text-ink disabled:opacity-35"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden /> Back
        </button>
        <button
          type="button"
          data-tone="violet"
          onClick={() => {
            if (step >= last) setStep(0);
            setPlaying(!playing);
          }}
          className="inline-flex min-h-10 items-center gap-1 rounded-md bg-(--tone) px-3 text-sm font-semibold text-paper"
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
            setStep(step + 1);
          }}
          className="inline-flex min-h-10 items-center rounded-md border border-rule px-3 text-sm text-ink disabled:opacity-35"
        >
          Next <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => choose(picked)}
          className="ml-auto inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-sm text-ink-muted hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>
    </div>
  );
}
