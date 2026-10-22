/*
 * RateLimiterDemo.tsx
 * Live rate-limiter simulator. Every request you send goes to
 * two limiters at once: a token bucket on the left and an
 * algorithm of your choice on the right. Both allow 2
 * requests per second on average with bursts of up to 5.
 * Spam the button and compare who says 200 and who says 429.
 */

"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { DemoButton, DemoToggle } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";
import {
  ALGORITHMS,
  type AlgorithmId,
  type Decision,
  type Limiter,
  type LimiterConfig,
} from "./limiters";

const CONFIG: LimiterConfig = { rate: 2, burst: 5 };
const WINDOW = CONFIG.burst / CONFIG.rate;
const TIMELINE_SECONDS = 8;
const AUTO_INTERVAL = 0.25;
const MAX_EVENTS = 60;

interface RequestEvent {
  id: number;
  t: number;
  left: Decision;
  right: Decision;
}

const RIGHT_OPTIONS: AlgorithmId[] = ["fixedWindow", "slidingLog", "slidingCounter", "leakyBucket"];

// Fresh pair of limiters: token bucket on the left, the chosen algorithm on the right.
function createLimiters(right: AlgorithmId): { left: Limiter; right: Limiter } {
  return { left: ALGORITHMS.tokenBucket.create(CONFIG), right: ALGORITHMS[right].create(CONFIG) };
}

// HTTP-style response line for a decision.
function responseLine(decision: Decision): string {
  if (decision.outcome === "accepted") return "200 OK";
  if (decision.outcome === "queued") return `202 queued · waits ${decision.waits?.toFixed(1)}s`;
  return `429 Too Many Requests · Retry-After: ${Math.ceil(decision.retryAfter ?? 1)}`;
}

// Gauge: five slots showing how much capacity is left right now.
function Gauge({ level }: { level: number }) {
  const filled = level * CONFIG.burst;
  return (
    <svg viewBox="0 0 150 34" aria-hidden className="h-9 w-full max-w-[12rem]">
      {Array.from({ length: CONFIG.burst }, (_, index) => {
        const amount = Math.max(0, Math.min(1, filled - index));
        return (
          <g key={index}>
            <circle
              cx={15 + index * 30}
              cy={17}
              r={12}
              strokeWidth={2}
              className="fill-paper stroke-ink"
            />
            <circle
              cx={15 + index * 30}
              cy={17}
              r={9 * amount}
              className={cn(level < 0.2 ? "fill-danger" : "fill-pen")}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Timeline of the last few seconds: one mark per request.
function Timeline({
  events,
  side,
  now,
  showWindows,
}: {
  events: RequestEvent[];
  side: "left" | "right";
  now: number;
  showWindows: boolean;
}) {
  const start = now - TIMELINE_SECONDS;
  const x = (t: number) => 4 + ((t - start) / TIMELINE_SECONDS) * 292;
  const boundaries: number[] = [];
  if (showWindows) {
    for (let b = Math.ceil(start / WINDOW) * WINDOW; b <= now; b += WINDOW) boundaries.push(b);
  }

  return (
    <svg viewBox="0 0 300 44" aria-hidden className="w-full">
      <line x1={4} y1={30} x2={296} y2={30} strokeWidth={1} className="stroke-rule" />
      {boundaries.map((b) => (
        <line
          key={b}
          x1={x(b)}
          y1={4}
          x2={x(b)}
          y2={40}
          strokeWidth={1}
          strokeDasharray="3 3"
          className="stroke-ink-muted"
        />
      ))}
      {events
        .filter((event) => event.t >= start)
        .map((event, index) => {
          const decision = event[side];
          const cx = x(event.t);
          const cy = 30 - (index % 3) * 8;
          if (decision.outcome === "rejected") {
            return (
              <path
                key={event.id}
                d={`M${cx - 4} ${cy - 4} L${cx + 4} ${cy + 4} M${cx + 4} ${cy - 4} L${cx - 4} ${cy + 4}`}
                strokeWidth={2}
                className="stroke-danger"
              />
            );
          }
          return (
            <circle
              key={event.id}
              cx={cx}
              cy={cy}
              r={4}
              className={decision.outcome === "queued" ? "fill-warn" : "fill-ok"}
            />
          );
        })}
      <line x1={296} y1={2} x2={296} y2={42} strokeWidth={2} className="stroke-pen" />
      <text x={292} y={10} textAnchor="end" className="fill-pen font-hand text-[12px]">
        now
      </text>
    </svg>
  );
}

export default function RateLimiterDemo() {
  const [rightAlgorithm, setRightAlgorithm] = useState<AlgorithmId>("fixedWindow");
  const [events, setEvents] = useState<RequestEvent[]>([]);
  const [now, setNow] = useState(0);
  const [steady, setSteady] = useState(false);
  const startRef = useRef<number | null>(null);
  const nextIdRef = useRef(0);
  const nextAutoRef = useRef(0);
  const [limiters, setLimiters] = useState(() => createLimiters("fixedWindow"));
  const selectId = useId();

  const clock = () => {
    if (startRef.current === null) startRef.current = performance.now();
    return (performance.now() - startRef.current) / 1000;
  };

  // Sends one request at time t to both limiters.
  const send = (t = clock()) => {
    const event: RequestEvent = {
      id: nextIdRef.current++,
      t,
      left: limiters.left.tryRequest(t),
      right: limiters.right.tryRequest(t),
    };
    setEvents((previous) => [...previous.slice(-(MAX_EVENTS - 1)), event]);
  };

  const burst = () => {
    const t = clock();
    for (let i = 0; i < 10; i++) send(t + i * 0.01);
  };

  const reset = (algorithm = rightAlgorithm) => {
    setLimiters(createLimiters(algorithm));
    startRef.current = performance.now();
    nextAutoRef.current = 0;
    setEvents([]);
    setNow(0);
  };

  // One animation frame: advance the clock and, in steady mode, send the next request.
  const onFrame = useEffectEvent(() => {
    const t = clock();
    setNow(t);
    if (steady && t >= nextAutoRef.current) {
      nextAutoRef.current = t + AUTO_INTERVAL;
      send(t);
    }
  });

  // The simulation clock (refill / leak / window timing). Runs even with reduced motion,
  // because time passing is the thing being demonstrated.
  useEffect(() => {
    let frame = 0;
    const loop = () => {
      onFrame();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const tally = (side: "left" | "right") => ({
    ok: events.filter((event) => event[side].outcome !== "rejected").length,
    rejected: events.filter((event) => event[side].outcome === "rejected").length,
  });
  const lastEvent = events.at(-1);
  const leftSnapshot = limiters.left.snapshot(now);
  const rightSnapshot = limiters.right.snapshot(now);

  const panels = [
    { side: "left" as const, title: "Token bucket", snapshot: leftSnapshot, windows: false },
    {
      side: "right" as const,
      title: ALGORITHMS[rightAlgorithm].label,
      snapshot: rightSnapshot,
      windows: rightAlgorithm !== "leakyBucket",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DemoButton
          variant="solid"
          onClick={() => send()}
          className="min-h-14 flex-1 text-base sm:flex-none sm:px-8"
        >
          Send request
        </DemoButton>
        <DemoButton onClick={burst}>Burst ×10</DemoButton>
        <DemoButton onClick={() => reset()}>Reset</DemoButton>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <DemoToggle label="Steady traffic (4 per second)" checked={steady} onChange={setSteady} />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={selectId}
            className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase"
          >
            Compare with
          </label>
          <select
            id={selectId}
            value={rightAlgorithm}
            onChange={(event) => {
              const next =
                RIGHT_OPTIONS.find((option) => option === event.target.value) ?? "fixedWindow";
              setRightAlgorithm(next);
              reset(next);
            }}
            className="min-h-11 rounded-xl border-2 border-ink bg-paper px-3 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
          >
            {RIGHT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {ALGORITHMS[option].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {panels.map((panel) => {
          const counts = tally(panel.side);
          const last = lastEvent?.[panel.side];
          return (
            <section
              key={panel.side}
              aria-label={`${panel.title}: ${counts.ok} allowed, ${counts.rejected} rejected`}
              className="rounded-xl border-2 border-ink bg-paper p-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-bold text-ink">{panel.title}</h4>
                <p className="text-xs text-ink-muted">
                  <span className="font-semibold text-ok">{counts.ok} ok</span> ·{" "}
                  <span className="font-semibold text-danger">{counts.rejected} × 429</span>
                </p>
              </div>
              <Gauge level={panel.snapshot.level} />
              <p className="font-hand text-lg leading-tight text-pen">{panel.snapshot.readout}</p>
              <Timeline events={events} side={panel.side} now={now} showWindows={panel.windows} />
              <p
                className={cn(
                  "mt-1 truncate rounded-md px-2 py-1 font-mono text-xs",
                  !last && "text-ink-muted",
                  last?.outcome === "accepted" && "bg-ok/15 text-ink",
                  last?.outcome === "queued" && "bg-warn/15 text-ink",
                  last?.outcome === "rejected" && "bg-danger/15 text-ink",
                )}
              >
                {last ? responseLine(last) : "waiting for a request…"}
              </p>
            </section>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {lastEvent
          ? `Token bucket: ${responseLine(lastEvent.left)}. ${ALGORITHMS[rightAlgorithm].label}: ${responseLine(lastEvent.right)}.`
          : ""}
      </p>
      <p className="text-sm text-ink-muted">
        Both limiters: 2 requests per second on average, bursts of up to 5. Dashed lines mark window
        boundaries ({WINDOW}s). Green = allowed, amber = queued, red ✕ = 429.
      </p>
    </div>
  );
}
