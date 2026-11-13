/*
 * BucketSim.tsx
 * A live token bucket or leaky bucket (2 per second, bursts of 5), using the same
 * limiter code as the big simulator.
 *  - Token bucket: a tap drips 2 tokens a second into a bucket that holds 5 (extra drips
 *    spill away when it is full). Each request takes a token and carries on to the
 *    server; with no token left it bounces off with a 429.
 *  - Leaky bucket: requests drop into the bucket and leak out to the server at a steady
 *    2 a second. A burst queues up instead of being served at once; a full bucket
 *    turns the extras away.
 * The bucket's fill is the real limiter state, so it works with reduced motion too; only
 * the flying dots and drips are switched off.
 */

"use client";

import { RotateCcw, Send, ServerCog, Zap } from "lucide-react";
import { type CSSProperties, useEffect, useEffectEvent, useRef, useState } from "react";
import { DemoButton } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./BucketSim.module.css";
import { ALGORITHMS, type Decision, type Limiter, type LimiterConfig } from "./limiters";

type Kind = "token" | "leaky";

const CONFIG: LimiterConfig = { rate: 2, burst: 5 };
const LANE = "58%";
const BURST = 8;

interface Response {
  id: number;
  decision: Decision;
}

interface Flight {
  id: number;
  out: Decision["outcome"];
  delay: number;
}

const create = (kind: Kind): Limiter =>
  ALGORITHMS[kind === "token" ? "tokenBucket" : "leakyBucket"].create(CONFIG);

function label(decision: Decision): string {
  if (decision.outcome === "accepted") return "200 OK";
  if (decision.outcome === "queued") return `202 · waits ${decision.waits?.toFixed(1)} s`;
  return `429 · retry in ${Math.max(0.1, decision.retryAfter ?? 0).toFixed(1)} s`;
}

function toneOf(decision: Decision): Tone {
  if (decision.outcome === "accepted") return "green";
  if (decision.outcome === "queued") return "amber";
  return "red";
}

export default function BucketSim({ kind }: { kind: Kind }) {
  const [limiter, setLimiter] = useState(() => create(kind));
  const [now, setNow] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [shake, setShake] = useState(0);
  const [announce, setAnnounce] = useState("");
  const startRef = useRef<number | null>(null);
  const idRef = useRef(0);

  const clock = () => {
    if (startRef.current === null) startRef.current = performance.now();
    return (performance.now() - startRef.current) / 1000;
  };

  const onFrame = useEffectEvent(() => setNow(clock()));

  // The limiter's clock. It runs with reduced motion too: refilling is the lesson.
  useEffect(() => {
    let frame = 0;
    const loop = () => {
      onFrame();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const send = (count: number) => {
    const t = clock();
    const batch: Response[] = [];
    for (let i = 0; i < count; i++) {
      batch.push({ id: idRef.current++, decision: limiter.tryRequest(t + i * 0.01) });
    }
    const launched = batch.map((r, i) => ({ id: r.id, out: r.decision.outcome, delay: i * 0.09 }));
    setResponses((previous) => [...batch.reverse(), ...previous].slice(0, 6));
    setFlights((previous) => [...previous, ...launched]);
    if (batch.some((r) => r.decision.outcome === "rejected")) setShake((s) => s + 1);
    const ok = batch.filter((r) => r.decision.outcome !== "rejected").length;
    setAnnounce(
      `${count === 1 ? label(batch[0].decision) : `${ok} of ${count} let in, ${count - ok} turned away`}. ${limiter.snapshot(t).readout}.`,
    );
    const ids = new Set(launched.map((f) => f.id));
    window.setTimeout(
      () => setFlights((previous) => previous.filter((f) => !ids.has(f.id))),
      1000 + count * 90,
    );
  };

  const reset = () => {
    setLimiter(create(kind));
    startRef.current = performance.now();
    setResponses([]);
    setFlights([]);
    setAnnounce("");
    setNow(0);
  };

  const snapshot = limiter.snapshot(now);
  // Token bucket: how many tokens are in it. Leaky bucket: how many requests are queued.
  const amount = Math.max(
    0,
    kind === "token" ? snapshot.level * CONFIG.burst : (1 - snapshot.level) * CONFIG.burst,
  );
  const full = amount > CONFIG.burst - 0.01;
  const fillTone: Tone = kind === "token" ? "amber" : "violet";

  return (
    <div className="space-y-4">
      <div
        role="img"
        aria-label={
          kind === "token"
            ? "A tap drips 2 tokens a second into a bucket that holds 5. Each request takes one token and goes on to the server; with no token left, the request is turned away with 429."
            : "Requests drop into a bucket that holds 5 and leak out to the server at a steady 2 a second. A burst waits in the bucket; when it is full, extra requests get 429."
        }
        className="relative mx-auto h-60 max-w-2xl select-none sm:h-64"
        style={{ "--lane": LANE } as CSSProperties}
      >
        {/* Labels. */}
        <p
          data-tone="blue"
          className="absolute left-0 text-xs font-semibold tracking-[0.08em] text-(--tone) uppercase"
          style={{ top: `calc(${LANE} - 1.9rem)` }}
        >
          requests
        </p>
        {kind === "token" ? (
          <p
            data-tone={fillTone}
            className="absolute top-0 left-[calc(50%+1.1rem)] font-mono text-[0.7rem] leading-tight font-semibold text-(--tone) sm:text-xs"
          >
            +2 tokens / s
            {full && (
              <span className="block font-sans font-normal text-ink-muted">full: extras spill</span>
            )}
          </p>
        ) : (
          <p
            data-tone={fillTone}
            className="absolute top-[13%] left-[calc(50%+3.4rem)] font-mono text-[0.7rem] leading-tight font-semibold text-(--tone) sm:text-xs"
          >
            leaks 2 / s
          </p>
        )}

        {/* Wires. */}
        <span
          aria-hidden
          data-tone="blue"
          className="absolute left-0 h-[2px] w-1/2 -translate-y-1/2 bg-(--tone-line)"
          style={{ top: LANE }}
        />
        <span
          aria-hidden
          data-tone="green"
          className="absolute left-1/2 h-[2px] w-[38%] -translate-y-1/2 bg-(--tone-line)"
          style={{ top: LANE }}
        />

        {/* Token bucket: the tap and its drip. */}
        {kind === "token" && (
          <>
            <span
              aria-hidden
              className="absolute top-[4%] left-[calc(50%-2.5rem)] h-2 w-[2.85rem] rounded-full bg-ink-muted/50"
            />
            <span
              aria-hidden
              className="absolute top-[4%] left-[calc(50%-0.3rem)] h-5 w-2 rounded-b-md bg-ink-muted/50"
            />
            <span aria-hidden data-tone={fillTone} data-full={full} className={styles.drip} />
          </>
        )}

        {/* The bucket. Re-keyed to shake when something is turned away. */}
        <div
          key={shake}
          className={cn(
            "absolute top-[22%] left-1/2 z-[2] h-[60%] w-[5.5rem] -translate-x-1/2",
            shake > 0 && "tut-shake",
          )}
        >
          <div
            data-tone={fillTone}
            className="flex h-full flex-col-reverse gap-1 rounded-b-2xl rounded-t-md border-2 border-t-0 border-(--tone-line) bg-paper/80 p-1.5"
          >
            {Array.from({ length: CONFIG.burst }, (_, i) => {
              const fill = Math.max(0, Math.min(1, amount - i));
              return (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed slots.
                  key={i}
                  className={cn(
                    styles.cell,
                    "relative flex-1 overflow-hidden rounded-md border border-(--tone-line)",
                    i === 0 && "rounded-b-xl",
                  )}
                >
                  <span
                    className="absolute inset-x-0 bottom-0 bg-(--tone) opacity-75"
                    style={{ height: `${fill * 100}%` }}
                  />
                </span>
              );
            })}
          </div>
          <p className="mt-1 text-center font-mono text-[0.7rem] text-ink-muted sm:text-xs">
            {amount.toFixed(1)} / {CONFIG.burst}
            <span className="block font-sans">{kind === "token" ? "tokens" : "queued"}</span>
          </p>
        </div>

        {/* Leaky bucket: the steady leak to the server. */}
        {kind === "leaky" && amount > 0.05 && (
          <>
            <span aria-hidden data-tone="green" className={styles.leak} />
            <span
              aria-hidden
              data-tone="green"
              className={styles.leak}
              style={{ animationDelay: "-0.25s" }}
            />
          </>
        )}

        {/* Requests in flight. */}
        {flights.map((flight) => (
          <span
            key={flight.id}
            aria-hidden
            data-out={flight.out}
            data-tone={
              flight.out === "rejected" ? "red" : flight.out === "queued" ? "amber" : "green"
            }
            className={styles.flight}
            style={{ animationDelay: `${flight.delay}s` }}
          />
        ))}

        <div className="absolute right-0 z-10 w-[28%] -translate-y-1/2" style={{ top: LANE }}>
          <div
            data-tone="green"
            className="flex flex-col items-center gap-1 rounded-xl border border-(--tone-line) bg-paper px-1.5 py-2 text-center"
          >
            <ServerCog className="h-5 w-5 text-(--tone)" aria-hidden />
            <span className="text-sm leading-tight font-semibold text-ink">Server</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-wrap gap-2">
        <DemoButton
          variant="solid"
          onClick={() => send(1)}
          className="min-h-11 basis-full sm:basis-auto"
        >
          <Send className="h-4 w-4" aria-hidden /> Send 1 request
        </DemoButton>
        <DemoButton onClick={() => send(BURST)} className="min-h-11 flex-1 sm:flex-none">
          <Zap className="h-4 w-4" aria-hidden /> Burst ×{BURST}
        </DemoButton>
        <DemoButton onClick={reset} className="min-h-11 flex-1 sm:flex-none">
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </DemoButton>
      </div>

      <ul
        aria-label="Latest responses, newest first"
        className="mx-auto flex min-h-8 max-w-2xl list-none flex-wrap gap-1.5 p-0"
      >
        {responses.length === 0 && (
          <li className="text-sm text-ink-muted">No requests yet. Press a button.</li>
        )}
        {responses.map((response, i) => (
          <li
            key={response.id}
            data-tone={toneOf(response.decision)}
            className={cn(
              "rounded-md border border-(--tone-line) bg-(--tone-soft) px-2 py-0.5 font-mono text-xs text-ink",
              i === 0 && "tut-pop",
              i > 2 && "opacity-60",
            )}
          >
            {label(response.decision)}
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
