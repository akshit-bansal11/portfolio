/*
 * RetryJitter.tsx
 * Eight clients all get a 429 at the same moment and retry with exponential backoff,
 * waiting 0.5 s, 1 s, 2 s, then 4 s (the polite-client code in the post). Without jitter every client
 * retries in the same instant, so the server gets the whole crowd again and again. With
 * jitter (a random extra of up to 250 ms each time) the retries spread out. A playhead
 * sweeps the timeline and each retry flashes as it is reached; hover to pause.
 */

"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { SegmentedControl } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";
import styles from "./RetryJitter.module.css";

const CLIENTS = 8;
const WAITS = [0.5, 1, 2, 4]; // 2 ** attempt * 500 ms
const SPAN = 8; // seconds on the axis
const PERIOD = 6; // seconds per sweep
const JITTER_MAX = 0.25;

// Fixed "random" wobble per client and attempt, so server and browser agree.
const wobble = (client: number, attempt: number) =>
  (((client * 37 + attempt * 61 + 11) % 97) / 97) * JITTER_MAX;

const pct = (t: number) => `${(t / SPAN) * 100}%`;

// Most retries landing within 20 ms of each other.
function peak(times: number[]): number {
  const sorted = [...times].sort((a, b) => a - b);
  let best = 0;
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j < sorted.length && sorted[j] - sorted[i] <= 0.02) j++;
    best = Math.max(best, j - i);
  }
  return best;
}

export default function RetryJitter() {
  const [jitter, setJitter] = useState<"off" | "on">("off");
  const rows = Array.from({ length: CLIENTS }, (_, c) => {
    let t = 0;
    return WAITS.map((wait, a) => {
      t += wait + (jitter === "on" ? wobble(c, a) : 0);
      return t;
    });
  });
  const worst = peak(rows.flat());

  return (
    <div className="space-y-4">
      <div className="flex">
        <SegmentedControl
          label="Retry with"
          options={[
            { value: "off", label: "Backoff only" },
            { value: "on", label: "Backoff + jitter" },
          ]}
          value={jitter}
          onChange={setJitter}
        />
      </div>

      <div
        role="img"
        aria-label={`${CLIENTS} clients retry, waiting 0.5, 1, 2 and then 4 seconds. ${jitter === "on" ? "With jitter the retries spread out" : "Without jitter they all retry at the same instant"}: at most ${worst} arrive within 20 milliseconds.`}
        className={cn(styles.scene, "relative select-none")}
        style={{ "--period": `${PERIOD}s` } as CSSProperties}
      >
        <div className="relative ml-8 sm:ml-12">
          {/* Attempt guides. */}
          {rows[0].map((_, a) => {
            const t = WAITS.slice(0, a + 1).reduce((sum, w) => sum + w, 0);
            return (
              <span
                key={t}
                aria-hidden
                className="absolute inset-y-0 border-l border-dashed border-rule"
                style={{ left: pct(t) }}
              />
            );
          })}
          <span
            aria-hidden
            data-tone="violet"
            className={cn(
              styles.head,
              "absolute inset-y-0 z-10 w-[2px] -translate-x-1/2 bg-(--tone)",
            )}
          />

          <ol className="relative list-none space-y-1.5 p-0 py-1">
            {rows.map((times, c) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: clients are positional.
              <li key={c} className="relative h-3.5">
                <span className="absolute top-1/2 -left-8 -translate-y-1/2 font-mono text-[0.65rem] text-ink-muted sm:-left-12 sm:text-xs">
                  #{c + 1}
                </span>
                <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-rule" />
                <span
                  aria-hidden
                  data-tone="red"
                  className="absolute top-1/2 left-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-(--tone)"
                />
                {times.map((t) => (
                  <span
                    key={t}
                    aria-hidden
                    data-tone={jitter === "on" ? "green" : "amber"}
                    className={cn(
                      styles.hit,
                      "absolute top-1/2 -mt-[5px] -ml-[5px] h-2.5 w-2.5 rounded-full bg-(--tone) transition-[left] duration-500 ease-out",
                    )}
                    style={
                      {
                        left: pct(t),
                        "--delay": `${(t / SPAN) * PERIOD - PERIOD}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </li>
            ))}
          </ol>
        </div>

        <div className="relative mt-1 ml-8 h-10 border-t border-rule font-mono text-[0.65rem] text-ink-muted sm:ml-12 sm:text-xs">
          {[0.5, 1.5, 3.5, 7.5].map((t) => (
            <span key={t} className="absolute top-1 -translate-x-1/2" style={{ left: pct(t) }}>
              {t}
            </span>
          ))}
          <span className="absolute top-5 left-0 font-sans">seconds after the first 429</span>
        </div>
      </div>

      <p
        aria-live="polite"
        data-tone={jitter === "on" ? "green" : "amber"}
        className="rounded-lg border border-(--tone-line) bg-(--tone-soft) px-3 py-2 text-sm leading-snug text-ink"
      >
        <span className="font-semibold text-(--tone)">
          {worst} {worst === 1 ? "retry" : "retries"} in the same 20 ms
        </span>{" "}
        {jitter === "on"
          ? "The random extra spreads the crowd out, so the server gets a trickle, not a wave."
          : "Every client waits exactly as long as the others, so they all hit the server together, four times over."}
      </p>
    </div>
  );
}
