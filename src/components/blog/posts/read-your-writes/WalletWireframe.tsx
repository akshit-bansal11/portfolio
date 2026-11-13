/*
 * WalletWireframe.tsx
 * A looping storyboard of three phone wireframes: tap "Add ₹100", see "added", refresh
 * and see the balance. Packets travel along the connectors as each step happens. In
 * "Without a fix" the refresh lands on a replica that is behind and the balance reads ₹0;
 * in "With a fix" the router only uses a node that has the write. Pause stops the loop;
 * reduced motion and print show the final frame.
 */

"use client";

import { CheckCircle2, Loader2, Pause, Play, RefreshCw, Wallet } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Wire } from "@/components/tutorials/Diagram";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

// 0 tap → 1 write travels → 2 success → 3 refresh travels → 4 balance shown
const LAST = 4;
const STEP_MS = 1400;

interface PhoneProps {
  title: string;
  server: string;
  serverTone: Tone;
  active: boolean;
  children: ReactNode;
}

function Phone({ title, server, serverTone, active, children }: PhoneProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <p
        className={cn(
          "text-xs font-bold tracking-[0.08em] uppercase transition-colors",
          active ? "text-ink" : "text-ink-muted",
        )}
      >
        {title}
      </p>
      <div
        className={cn(
          "w-full max-w-[15.5rem] rounded-[1.75rem] border bg-paper p-1.5 transition-[border-color,translate] duration-300",
          active ? "border-ink/40 motion-safe:-translate-y-1" : "border-rule",
        )}
      >
        <div className="flex min-h-[18rem] flex-col rounded-[1.4rem] bg-paper-raised p-3.5">
          <div
            aria-hidden
            className="mb-3 flex items-center justify-between text-[0.65rem] text-ink-muted"
          >
            <span className="font-semibold">9:41</span>
            <span className="h-1.5 w-12 rounded-full bg-rule" />
            <span className="font-mono">5G</span>
          </div>
          <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-ink">
            <Wallet className="h-4 w-4" aria-hidden /> PayWallet
          </p>
          {children}
        </div>
      </div>
      <p
        data-tone={serverTone}
        className="rounded-full border border-(--tone-line) bg-(--tone-soft) px-2.5 py-0.5 text-xs font-semibold text-(--tone)"
      >
        answered by {server}
      </p>
    </div>
  );
}

// Connector between phones: packets flow only while its step is happening.
function Hop({ label, tone, active }: { label: string; tone: Tone; active: boolean }) {
  return (
    <div
      data-tone={tone}
      className={cn(
        "dg-link flex flex-none flex-col items-center justify-center gap-1 py-2 text-(--tone) transition-opacity duration-300 md:px-1",
        active ? "opacity-100" : "opacity-55",
      )}
    >
      <span className="flex flex-col items-center md:hidden">
        <Wire axis="y" className="h-8" />
        <svg aria-hidden viewBox="0 0 12 8" className="h-2 w-3 fill-(--tone)">
          <path d="M0 0 L12 0 L6 8 Z" />
        </svg>
      </span>
      <span className="hidden items-center md:flex">
        <Wire axis="x" className="w-14" />
        <svg aria-hidden viewBox="0 0 8 12" className="h-3 w-2 fill-(--tone)">
          <path d="M0 0 L8 6 L0 12 Z" />
        </svg>
      </span>
      <span className="max-w-[9rem] text-center text-xs leading-snug font-medium">{label}</span>
    </div>
  );
}

export default function WalletWireframe() {
  const [fixed, setFixed] = useState(false);
  const [step, setStep] = useState(LAST);
  const [playing, setPlaying] = useState(true);

  // Loop the story unless paused or the reader prefers less motion.
  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setStep((s) => (s >= LAST ? 0 : s + 1)),
      step >= LAST ? STEP_MS * 2.2 : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const shown = step >= LAST;
  const stale = !fixed && shown;

  return (
    <figure className="my-10">
      <div className="dg-canvas rounded-2xl border border-rule p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div role="tablist" aria-label="Scenario" className="flex gap-2">
            {[
              { label: "Without a fix", value: false, tone: "red" },
              { label: "With a fix", value: true, tone: "green" },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                role="tab"
                aria-selected={fixed === option.value}
                data-tone={option.tone}
                onClick={() => {
                  setFixed(option.value);
                  setStep(0);
                  setPlaying(true);
                }}
                className={cn(
                  "min-h-10 rounded-lg border border-(--tone-line) px-3 text-sm font-semibold transition-colors",
                  fixed === option.value
                    ? "bg-(--tone) text-paper"
                    : "text-(--tone) hover:bg-(--tone-soft)",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-rule px-3 text-sm text-ink-muted hover:text-ink"
          >
            {playing ? (
              <Pause className="h-4 w-4" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <div className="flex flex-col items-stretch md:flex-row md:items-center">
          <Phone title="1 · Add money" server="primary" serverTone="pink" active={step === 0}>
            <p className="text-xs text-ink-muted">Amount</p>
            <p className="mt-1 rounded-lg border border-rule bg-paper px-3 py-2 text-2xl font-bold text-ink">
              ₹ 100
            </p>
            <span
              data-tone="green"
              className={cn(
                "mt-auto block rounded-xl bg-(--tone) py-2.5 text-center text-sm font-bold text-paper transition-transform duration-200",
                step === 0 && "dg-pulse motion-safe:scale-95",
              )}
            >
              Add ₹100
            </span>
          </Phone>

          <Hop label="UPDATE to the primary" tone="pink" active={step === 1} />

          <Phone title="2 · Success" server="primary" serverTone="pink" active={step === 2}>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              {step < 2 ? (
                <Loader2
                  className="h-12 w-12 text-ink-muted motion-safe:animate-spin"
                  aria-hidden
                />
              ) : (
                <span data-tone="green" className="tut-pop text-(--tone)">
                  <CheckCircle2 className="h-12 w-12" aria-hidden />
                </span>
              )}
              <p className="mt-3 font-bold text-ink">{step < 2 ? "Adding…" : "₹100 added"}</p>
              <p className="mt-1 text-xs text-ink-muted">Txn #8812</p>
            </div>
          </Phone>

          <Hop
            label={fixed ? "refresh, routed to a fresh node" : "refresh 0.1 s later"}
            tone={fixed ? "green" : "red"}
            active={step === 3}
          />

          <Phone
            title="3 · Refresh"
            server={fixed ? "replica 1 (caught up)" : "replica 2 (behind)"}
            serverTone={fixed ? "green" : "red"}
            active={step === 4}
          >
            <p className="flex items-center gap-1.5 text-xs text-ink-muted">
              <RefreshCw
                className={cn("h-3 w-3", step === 3 && "motion-safe:animate-spin")}
                aria-hidden
              />
              Wallet balance
            </p>
            <p
              key={`${fixed}-${shown}`}
              data-tone={!shown ? "violet" : stale ? "red" : "green"}
              className={cn(
                "mt-1 w-fit rounded-lg px-1 text-4xl font-bold text-(--tone)",
                stale && "tut-shake bg-(--tone-soft) ring-2 ring-(--tone-line)",
              )}
            >
              {!shown ? "…" : fixed ? "₹100.00" : "₹0.00"}
            </p>
            {stale && (
              <p data-tone="red" className="tut-pop mt-2 text-sm font-semibold text-(--tone)">
                Where did my ₹100 go?
              </p>
            )}
            <p className="mt-4 text-xs font-semibold text-ink-muted">Recent</p>
            {shown && fixed ? (
              <p className="tut-pop mt-1 flex justify-between rounded-lg border border-rule bg-paper px-2 py-1.5 text-xs text-ink">
                <span>Added money</span>
                <span data-tone="green" className="font-bold text-(--tone)">
                  +₹100
                </span>
              </p>
            ) : (
              <p className="mt-1 rounded-lg border border-dashed border-rule px-2 py-1.5 text-xs text-ink-muted">
                {shown ? "No transactions yet" : "Loading…"}
              </p>
            )}
          </Phone>
        </div>
      </div>
      <figcaption
        aria-live="polite"
        className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-muted"
      >
        {fixed
          ? "With a fix, the refresh is only answered by a node that already has the write."
          : "The write landed on the primary. The refresh was answered by a replica that hasn't heard about it yet."}
      </figcaption>
    </figure>
  );
}
