/*
 * SlidingCounter.tsx
 * The sliding-window-counter estimate, live. Two fixed minutes sit side by side; a
 * 60-second frame ends at "now" and slides through the current minute. The estimate
 * weights the previous minute's count by how much of it is still inside the frame and
 * adds the current minute's count. Next to it is the exact count a sliding log would
 * give, so you can watch how close the cheap estimate stays. The frame plays on a loop
 * once it is on screen (unless motion is reduced); the slider takes over by hand.
 */

"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { DemoButton, DemoSlider } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";

const LIMIT = 10;
// The previous minute held 9 requests, spread evenly (the estimate's own assumption).
const PREVIOUS = Array.from({ length: 9 }, (_, i) => 60 / 18 + (i * 60) / 9);
// Requests in the current minute, in seconds after it started.
const CURRENT = [2, 5, 8, 14, 27, 41];
const LOOP_SECONDS = 12; // one simulated minute per 12 real seconds

const pct = (t: number) => `${(t / 120) * 100}%`;

export default function SlidingCounter() {
  const [elapsed, setElapsed] = useState(15);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<number | null>(null);

  const weight = 1 - elapsed / 60;
  const current = CURRENT.filter((t) => t <= elapsed).length;
  const estimate = PREVIOUS.length * weight + current;
  const exact = PREVIOUS.filter((t) => t > elapsed).length + current;
  const allowed = estimate < LIMIT;

  const onFrame = useEffectEvent((time: number) => {
    const last = lastRef.current ?? time;
    lastRef.current = time;
    setElapsed((e) => (e + ((time - last) / 1000) * (60 / LOOP_SECONDS)) % 60);
  });

  // Start playing the first time the figure is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setPlaying(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    lastRef.current = null;
    const loop = (time: number) => {
      onFrame(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <div ref={rootRef} className="space-y-4">
      <div
        role="img"
        aria-label={`Previous minute: ${PREVIOUS.length} requests. ${Math.round(elapsed)} seconds into the current minute, ${current} requests so far. Estimate ${PREVIOUS.length} × ${weight.toFixed(2)} + ${current} = ${estimate.toFixed(1)}, against a limit of ${LIMIT}.`}
        className="select-none"
      >
        <div className="grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
          <p
            data-tone="blue"
            className="rounded-lg border border-(--tone-line) bg-(--tone-soft) px-2 py-1.5"
          >
            <span className="font-semibold text-(--tone)">Previous minute</span>{" "}
            <span className="font-mono text-ink">{PREVIOUS.length}</span>
          </p>
          <p
            data-tone="cyan"
            className="rounded-lg border border-(--tone-line) bg-(--tone-soft) px-2 py-1.5"
          >
            <span className="font-semibold text-(--tone)">Current minute</span>{" "}
            <span className="font-mono text-ink">{current}</span>
          </p>
        </div>

        <div className="relative mt-2 h-28 sm:h-32">
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

          {/* The 60-second frame, and the slice of the previous minute it still covers. */}
          <span
            aria-hidden
            data-tone="amber"
            className="absolute inset-y-0 rounded-lg border-2 border-(--tone) bg-(--tone-soft)"
            style={{ left: pct(elapsed), width: pct(60) }}
          >
            <span className="absolute top-1 right-2 font-mono text-[0.7rem] font-semibold text-(--tone) sm:text-xs">
              now
            </span>
          </span>
          <span
            aria-hidden
            data-tone="amber"
            className="absolute bottom-0 h-1.5 rounded-full bg-(--tone)"
            style={{ left: pct(elapsed), width: pct(60 - elapsed) }}
          />
          <span
            data-tone="amber"
            className="absolute top-1 font-mono text-[0.7rem] whitespace-nowrap text-(--tone) sm:text-xs"
            style={{ left: `calc(${pct(elapsed)} + 0.5rem)` }}
          >
            {Math.round(weight * 100)}% overlap
          </span>

          {PREVIOUS.map((t, i) => (
            <span
              key={t}
              aria-hidden
              data-tone="blue"
              className={cn(
                "absolute h-3 w-3 -translate-x-1/2 rounded-full bg-(--tone) transition-opacity duration-200",
                t <= elapsed && "opacity-25",
              )}
              style={{ left: pct(t), bottom: i % 2 ? "2.6rem" : "1.6rem" }}
            />
          ))}
          {CURRENT.map((t, i) =>
            t <= elapsed ? (
              <span
                key={t}
                aria-hidden
                data-tone="cyan"
                className="tut-pop absolute h-3 w-3 -translate-x-1/2 rounded-full bg-(--tone)"
                style={{ left: pct(60 + t), bottom: i % 2 ? "2.6rem" : "1.6rem" }}
              />
            ) : null,
          )}
        </div>
        <div className="relative mt-1 h-5 border-t border-rule font-mono text-[0.7rem] text-ink-muted sm:text-xs">
          <span className="absolute top-1 left-0">0:00</span>
          <span className="absolute top-1 left-1/2 -translate-x-1/2">1:00</span>
          <span className="absolute top-1 right-0">2:00</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <DemoSlider
          label="Seconds into the current minute"
          value={Math.round(elapsed)}
          min={0}
          max={59}
          onChange={(value) => {
            setPlaying(false);
            setElapsed(value);
          }}
          valueText={`${Math.round(elapsed)} s`}
        />
        <DemoButton onClick={() => setPlaying(!playing)} className="min-h-11">
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden />
          ) : (
            <Play className="h-4 w-4" aria-hidden />
          )}
          {playing ? "Pause" : "Play"}
        </DemoButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <p
          aria-live={playing ? "off" : "polite"}
          data-tone={allowed ? "green" : "red"}
          className="rounded-lg border border-(--tone-line) bg-(--tone-soft) px-3 py-2 text-sm text-ink transition-colors duration-200"
        >
          <span className="block text-xs font-semibold tracking-[0.08em] text-(--tone) uppercase">
            Estimate (two counters)
          </span>
          <span className="font-mono">
            {PREVIOUS.length} × {weight.toFixed(2)} + {current} = {estimate.toFixed(1)}
          </span>
          <span className="font-semibold text-(--tone)">
            {allowed ? ` < ${LIMIT}: next request allowed` : ` ≥ ${LIMIT}: next request gets 429`}
          </span>
        </p>
        <p
          data-tone="violet"
          className="rounded-lg border border-(--tone-line) bg-(--tone-soft) px-3 py-2 text-sm text-ink"
        >
          <span className="block text-xs font-semibold tracking-[0.08em] text-(--tone) uppercase">
            Exact (sliding log)
          </span>
          <span className="font-mono">{exact} requests in the last 60 s</span>
        </p>
      </div>
    </div>
  );
}
