/*
 * WindowBoundary.tsx
 * The fixed-window flaw, played out. With "5 per minute", a client fires 5 requests at
 * the end of minute 1 and 5 at the start of minute 2. In "Fixed window" mode each
 * minute's counter only ever sees 5, so all 10 get in. Switch to "Sliding log" and a
 * 60-second frame follows the newest request instead: it already holds 5, so the next
 * 5 get 429. The burst plays itself once when scrolled into view and can be replayed.
 * The first render (and print, and reduced motion) shows the finished burst.
 */

"use client";

import { RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DemoButton, SegmentedControl } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";

type Mode = "fixed" | "sliding";

const LIMIT = 5;
const SPAN = 120; // seconds shown on the axis
// Five requests in the last seconds of minute 1, five in the first seconds of minute 2.
const TIMES = [56, 56.8, 57.6, 58.4, 59.2, 60.4, 61.2, 62, 62.8, 63.6];
const STEP_MS = 320;

const pct = (t: number) => `${(t / SPAN) * 100}%`;
const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

// Which requests get in, per mode. The log only stores accepted requests.
function decide(mode: Mode): boolean[] {
  if (mode === "fixed") return TIMES.map(() => true);
  const log: number[] = [];
  return TIMES.map((t) => {
    const live = log.filter((stamp) => stamp > t - 60);
    if (live.length >= LIMIT) return false;
    log.push(t);
    return true;
  });
}

export default function WindowBoundary() {
  const [mode, setMode] = useState<Mode>("fixed");
  const [shown, setShown] = useState(TIMES.length);
  const [run, setRun] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const allowed = decide(mode);
  const visible = TIMES.slice(0, shown);
  const latest = visible.at(-1) ?? TIMES[0];
  const accepted = allowed.slice(0, shown).filter(Boolean).length;
  const rejected = shown - accepted;
  const minute1 = visible.filter((t) => t < 60).length;
  const minute2 = visible.filter((t) => t >= 60).length;
  const inFrame = TIMES.filter((t, i) => i < shown && allowed[i] && t > latest - 60).length;
  const done = shown === TIMES.length;

  const replay = () => {
    setShown(0);
    setRun((r) => r + 1);
  };

  // Play the burst once when it first scrolls into view (if motion is welcome).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(0);
        setRun((r) => r + 1);
      },
      { threshold: 0.5 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Reveal one request at a time.
  useEffect(() => {
    if (run === 0 || shown >= TIMES.length) return;
    const timer = window.setTimeout(() => setShown((s) => s + 1), shown === 0 ? 250 : STEP_MS);
    return () => window.clearTimeout(timer);
  }, [run, shown]);

  const summary =
    mode === "fixed"
      ? `Fixed window: minute 1 counted ${minute1} and minute 2 counted ${minute2}, so ${accepted} of ${shown} requests were allowed within a few seconds.`
      : `Sliding log: the last 60 seconds already hold ${inFrame} accepted requests, so ${accepted} were allowed and ${rejected} got 429.`;

  return (
    <div ref={rootRef} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SegmentedControl
          label="Count with"
          options={[
            { value: "fixed", label: "Fixed window" },
            { value: "sliding", label: "Sliding log" },
          ]}
          value={mode}
          onChange={(next) => {
            setMode(next);
            replay();
          }}
        />
        <DemoButton onClick={replay} className="min-h-11">
          <RotateCcw className="h-4 w-4" aria-hidden /> Fire the burst again
        </DemoButton>
      </div>

      <div
        role="img"
        aria-label={`Timeline of two one-minute windows, limit ${LIMIT} per minute. ${summary}`}
        className="relative select-none"
      >
        {/* Window headers. */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
          {[
            { name: "Minute 1", count: minute1, tone: "blue" },
            { name: "Minute 2", count: minute2, tone: "cyan" },
          ].map((w) => (
            <p
              key={w.name}
              data-tone={w.tone}
              className={cn(
                "rounded-lg border border-(--tone-line) bg-(--tone-soft) px-2 py-1.5 transition-opacity duration-300",
                mode === "sliding" && "opacity-45",
              )}
            >
              <span className="font-semibold text-(--tone)">{w.name}</span>{" "}
              <span className="font-mono text-ink">
                {w.count}/{LIMIT}
              </span>
            </p>
          ))}
        </div>

        {/* Plot: window tints, the boundary, the sliding frame and the requests. */}
        <div className="relative mt-2 h-36 sm:h-40">
          <span
            aria-hidden
            data-tone="blue"
            className="absolute inset-y-0 left-0 w-1/2 rounded-l-lg bg-(--tone-soft) opacity-60"
          />
          <span
            aria-hidden
            data-tone="cyan"
            className="absolute inset-y-0 right-0 w-1/2 rounded-r-lg bg-(--tone-soft) opacity-60"
          />
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-ink-muted/60"
          />
          <span
            className={cn(
              "absolute top-1 left-1/2 ml-1.5 text-[0.7rem] leading-tight text-ink-muted transition-opacity duration-300 sm:text-xs",
              mode === "sliding" && "opacity-0",
            )}
          >
            counter
            <br />
            resets
          </span>

          {mode === "sliding" && (
            <span
              aria-hidden
              data-tone="amber"
              className="absolute inset-y-0 rounded-lg border-2 border-(--tone) bg-(--tone-soft) transition-[left] duration-300 ease-out"
              style={{ left: pct(Math.max(0, latest - 60)), width: pct(60) }}
            >
              <span className="absolute top-1 left-2 font-mono text-[0.7rem] font-semibold text-(--tone) sm:text-xs">
                last 60 s: {inFrame}/{LIMIT}
              </span>
            </span>
          )}

          {/* Two towers of requests either side of the boundary. */}
          {TIMES.map((t, i) => {
            if (i >= shown) return null;
            const ok = allowed[i];
            const tower = t < 60 ? 0 : 1;
            const level = i % 5;
            return (
              <span
                key={`${run}-${mode}-${t}`}
                data-tone={ok ? "green" : "red"}
                className={cn(
                  "absolute flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border",
                  ok
                    ? "border-(--tone) bg-(--tone) tut-pop"
                    : "border-(--tone) bg-(--tone-soft) text-(--tone) tut-shake",
                )}
                style={{
                  left: tower === 0 ? "44%" : "56%",
                  bottom: `${0.5 + level * 1.35}rem`,
                }}
              >
                {!ok && <X className="h-3 w-3" strokeWidth={3} aria-hidden />}
              </span>
            );
          })}
        </div>

        {/* Axis. */}
        <div className="relative mt-1 h-5 border-t border-rule font-mono text-[0.7rem] text-ink-muted sm:text-xs">
          {[0, 60, 120].map((t) => (
            <span
              key={t}
              className={cn(
                "absolute top-1",
                t === 0 && "left-0",
                t === 60 && "left-1/2 -translate-x-1/2",
                t === 120 && "right-0",
              )}
            >
              {clock(t)}
            </span>
          ))}
        </div>
      </div>

      <p
        aria-live="polite"
        data-tone={mode === "fixed" ? "red" : "green"}
        className={cn(
          "rounded-lg border border-(--tone-line) bg-(--tone-soft) px-3 py-2 text-sm leading-snug text-ink transition-opacity duration-300",
          !done && "opacity-60",
        )}
      >
        <span className="font-semibold text-(--tone)">
          {mode === "fixed"
            ? `${accepted} allowed in a few seconds`
            : `${accepted} allowed · ${rejected} × 429`}
        </span>{" "}
        {mode === "fixed"
          ? `Each minute only ever counted ${LIMIT}, so twice the limit got through.`
          : "The frame slides with time, so the burst can't hide behind a boundary."}
      </p>
    </div>
  );
}
