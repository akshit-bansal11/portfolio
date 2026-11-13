/*
 * CircuitBreakerDiagram.tsx
 * Step 3, live: an app calls a service through a circuit breaker. Calls ride the lane as
 * packets: through and back when the service is healthy, lost at a broken service,
 * bounced straight back by an open breaker. Break the service and watch the breaker
 * count failures, trip open, wait out its cool-down, try one test call (half-open), and
 * close again once you fix the service. The three states and the four ways between them
 * light up as they happen. The loop only runs while the demo is on screen.
 */

"use client";

import { Server, ShieldCheck, Smartphone, Wrench, Zap } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { DemoButton } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";
import { useInView } from "./useInView";

type State = "closed" | "open" | "half";
type Move = "trip" | "cool" | "heal" | "retrip";
type PacketKind = "ok" | "lost" | "fast" | "test-ok" | "test-lost";

interface Packet {
  id: number;
  kind: PacketKind;
  born: number;
}

interface World {
  tick: number;
  state: State;
  failures: number;
  openedAt: number;
  lastMove: Move | null;
  movedAt: number;
  packets: Packet[];
  sent: number;
  failedFast: number;
  nextId: number;
}

const TICK_MS = 750;
const THRESHOLD = 3;
const COOL_TICKS = 4;

const STATES: { id: State; title: string; sub: string; tone: Tone }[] = [
  { id: "closed", title: "Closed", sub: "calls go through", tone: "green" },
  { id: "open", title: "Open", sub: "fail fast, no calls", tone: "red" },
  { id: "half", title: "Half-open", sub: "try one test call", tone: "amber" },
];

const MOVES: { id: Move; from: State; to: State; label: string }[] = [
  { id: "trip", from: "closed", to: "open", label: "too many failures" },
  { id: "cool", from: "open", to: "half", label: "after a cool-down" },
  { id: "heal", from: "half", to: "closed", label: "test call worked" },
  { id: "retrip", from: "half", to: "open", label: "test call failed" },
];

const PACKET: Record<PacketKind, { tone: Tone; to: string; dur: string; anim?: string }> = {
  ok: { tone: "green", to: "100%", dur: "1.4s", anim: styles.packetBack },
  lost: { tone: "red", to: "100%", dur: "0.9s" },
  fast: { tone: "amber", to: "50%", dur: "0.8s", anim: styles.packetBounce },
  "test-ok": { tone: "blue", to: "100%", dur: "1.4s", anim: styles.packetBack },
  "test-lost": { tone: "blue", to: "100%", dur: "0.9s" },
};

const fresh = (): World => ({
  tick: 0,
  state: "closed",
  failures: 0,
  openedAt: 0,
  lastMove: null,
  movedAt: 0,
  packets: [],
  sent: 0,
  failedFast: 0,
  nextId: 1,
});

function step(world: World, healthy: boolean): World {
  const tick = world.tick + 1;
  let { state, failures, openedAt, lastMove, sent, failedFast } = world;
  const before = lastMove === world.lastMove ? world.movedAt : 0;
  let kind: PacketKind;

  if (state === "closed") {
    sent += 1;
    if (healthy) {
      kind = "ok";
      failures = 0;
    } else {
      kind = "lost";
      failures += 1;
      if (failures >= THRESHOLD) {
        state = "open";
        openedAt = tick;
        lastMove = "trip";
      }
    }
  } else if (state === "open") {
    kind = "fast";
    failedFast += 1;
    if (tick - openedAt >= COOL_TICKS) {
      state = "half";
      lastMove = "cool";
    }
  } else {
    sent += 1;
    if (healthy) {
      kind = "test-ok";
      state = "closed";
      failures = 0;
      lastMove = "heal";
    } else {
      kind = "test-lost";
      state = "open";
      openedAt = tick;
      lastMove = "retrip";
    }
  }

  const packets = [
    ...world.packets.filter((p) => tick - p.born < 3),
    { id: world.nextId, kind, born: tick },
  ];
  return {
    tick,
    state,
    failures,
    openedAt,
    lastMove,
    movedAt: state !== world.state ? tick : before,
    packets,
    sent,
    failedFast,
    nextId: world.nextId + 1,
  };
}

function Station({
  icon,
  title,
  note,
  tone,
  pulse,
}: {
  icon: ReactNode;
  title: string;
  note: string;
  tone: Tone;
  pulse?: boolean;
}) {
  return (
    <div
      data-tone={tone}
      className={cn(
        styles.ease,
        "relative z-10 flex w-[6.5rem] flex-col items-center rounded-xl border border-(--tone-line) bg-paper px-2 py-2 text-center sm:w-36",
        pulse && "dg-pulse",
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone) [&_svg]:h-[18px] [&_svg]:w-[18px]">
        {icon}
      </span>
      <span className="mt-1 text-sm leading-tight font-semibold text-ink">{title}</span>
      <span className={cn(styles.ease, "text-xs leading-tight font-semibold text-(--tone)")}>
        {note}
      </span>
    </div>
  );
}

export default function CircuitBreakerDiagram() {
  const [healthy, setHealthy] = useState(true);
  const [world, setWorld] = useState<World>(fresh);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => setWorld((w) => step(w, healthy)), TICK_MS);
    return () => window.clearInterval(timer);
  }, [inView, healthy]);

  const current = STATES.find((s) => s.id === world.state) ?? STATES[0];
  const cooling = world.state === "open" ? Math.min(1, (world.tick - world.openedAt) / COOL_TICKS) : 0;

  let note = "The service is healthy. Calls go through and come back.";
  if (world.state === "closed" && !healthy) {
    note = `Calls are failing: ${world.failures} of ${THRESHOLD} in a row. One more streak and the breaker trips.`;
  }
  if (world.state === "open") {
    note = "Open: calls fail at once, without touching the service. No stuck threads, no flood of retries while it recovers.";
  }
  if (world.state === "half") {
    note = "Cool-down over. Half-open: one test call goes through to see if the service is back.";
  }
  if (world.state === "closed" && healthy && world.lastMove === "heal") {
    note = "The test call worked, so the breaker closed again. Business as usual.";
  }

  return (
    <div ref={rootRef} className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <DemoButton
          variant={healthy ? "solid" : "outline"}
          onClick={() => setHealthy(!healthy)}
          aria-pressed={!healthy}
        >
          {healthy ? (
            <>
              <Zap className="h-4 w-4" aria-hidden /> Break the service
            </>
          ) : (
            <>
              <Wrench className="h-4 w-4" aria-hidden /> Fix the service
            </>
          )}
        </DemoButton>
        <p className="font-mono text-sm text-ink-muted">
          sent {world.sent} · failed fast {world.failedFast}
        </p>
      </div>

      {/* The lane: app -> breaker -> service, with calls riding it. */}
      <div className="relative flex items-center justify-between">
        <span aria-hidden className="absolute inset-x-12 top-1/2 h-[2px] bg-rule sm:inset-x-16">
          {inView &&
            world.packets.map((packet) => {
              const look = PACKET[packet.kind];
              return (
                <span
                  key={packet.id}
                  data-tone={look.tone}
                  className={cn(styles.packet, look.anim)}
                  style={{ "--to": look.to, "--dur": look.dur } as CSSProperties}
                />
              );
            })}
        </span>
        <Station icon={<Smartphone />} title="Your app" note="makes calls" tone="violet" />
        <Station
          icon={<ShieldCheck />}
          title="Breaker"
          note={current.title.toLowerCase()}
          tone={current.tone}
          pulse={world.state !== "closed"}
        />
        <Station
          icon={<Server />}
          title="Service"
          note={healthy ? "healthy" : "down"}
          tone={healthy ? "green" : "red"}
        />
      </div>

      {/* The state machine */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STATES.map((s) => {
          const active = s.id === world.state;
          return (
            <div
              key={s.id}
              data-tone={s.tone}
              aria-current={active ? "step" : undefined}
              className={cn(
                styles.ease,
                "rounded-xl border px-2 py-2.5 text-center sm:px-3",
                active ? "border-(--tone) bg-(--tone-soft)" : "border-rule bg-paper opacity-70",
              )}
            >
              <p className={cn("font-bold", active ? "text-(--tone)" : "text-ink")}>{s.title}</p>
              <p className="text-xs leading-snug text-ink-muted sm:text-sm">{s.sub}</p>
              {s.id === "closed" && (
                <p className="mt-1.5 font-mono text-xs text-ink-muted">
                  failures {world.failures}/{THRESHOLD}
                </p>
              )}
              {s.id === "open" && (
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-rule">
                  <span
                    className={cn(styles.ease, "block h-full rounded-full bg-(--tone)")}
                    style={{ width: `${cooling * 100}%`, transition: "width 0.7s linear" }}
                  />
                </span>
              )}
              {s.id === "half" && (
                <p className="mt-1.5 font-mono text-xs text-ink-muted">1 call allowed</p>
              )}
            </div>
          );
        })}
      </div>

      <ul aria-label="Ways between the states" className="grid list-none gap-1.5 p-0 sm:grid-cols-2">
        {MOVES.map((move) => {
          const from = STATES.find((s) => s.id === move.from);
          const to = STATES.find((s) => s.id === move.to);
          const last = world.lastMove === move.id;
          return (
            <li
              key={`${move.id}-${last ? world.movedAt : 0}`}
              data-tone={to?.tone}
              className={cn(
                "flex min-h-10 items-center gap-2 rounded-lg border px-3 py-1.5 text-sm",
                last ? cn("border-(--tone-line) bg-(--tone-soft)", styles.pop) : "border-rule",
              )}
            >
              <span className="font-mono text-xs text-ink-muted">
                {from?.title} → {to?.title}
              </span>
              <span className={cn("ml-auto font-semibold", last ? "text-(--tone)" : "text-ink")}>
                {move.label}
              </span>
            </li>
          );
        })}
      </ul>

      <p
        aria-live="polite"
        data-tone={current.tone}
        className={cn(
          styles.ease,
          "rounded-xl border border-(--tone-line) bg-(--tone-soft) px-4 py-3 text-sm leading-relaxed text-ink",
        )}
      >
        {note}
      </p>
    </div>
  );
}
