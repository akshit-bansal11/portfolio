/*
 * ReplicaLagSim.tsx
 * A live wallet on a primary + two replicas. "Add ₹100" commits on the primary and ships
 * the change to each replica after a lag you set. "Refresh" sends a read through a
 * router that follows the strategy you pick: any node, always the primary, primary for a
 * few seconds after a write, a version token, or synchronous replication. The phone
 * shows the balance it got back and flags a stale read; the counters show what each
 * strategy costs (primary load, write latency). The printed copy explains the strategies.
 */

"use client";

import { ArrowRightLeft, Database, RefreshCw, Smartphone, Zap } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { DemoSlider } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

type NodeId = "primary" | "r1" | "r2";
type ReplicaId = Exclude<NodeId, "primary">;
type Strategy = "any" | "primary" | "sticky" | "token" | "sync";

interface DbNode {
  name: string;
  tone: Tone;
  lsn: number;
  balance: number;
}

interface Shipment {
  id: number;
  to: ReplicaId;
  lsn: number;
  balance: number;
  sentAt: number;
  arriveAt: number;
}

interface PendingRead {
  to: NodeId;
  sentAt: number;
  arriveAt: number;
  /** Balance the user had been told about when the read left. */
  expected: number;
}

interface LogLine {
  id: number;
  t: number;
  text: string;
  tone: Tone;
}

interface World {
  nodes: Record<NodeId, DbNode>;
  shipments: Shipment[];
  read: PendingRead | null;
  /** A committed write whose "OK" has not reached the phone yet. */
  ack: { at: number; balance: number; lsn: number; startedAt: number } | null;
  /** When to fire the automatic refresh of "add, then refresh fast". */
  autoRefreshAt: number | null;
  wantsAutoRefresh: boolean;
  /** What the app has been told, and the token it holds. */
  ackedBalance: number;
  token: number;
  lastWriteAt: number | null;
  lastWriteMs: number | null;
  screen: { balance: number; from: NodeId | null; stale: boolean; status: string };
  route: string;
  stats: { reads: number; stale: number; primary: number };
  log: LogLine[];
  nextId: number;
}

const STRATEGIES: { id: Strategy; name: string; how: string }[] = [
  {
    id: "any",
    name: "Any node",
    how: "Reads go to any of the three nodes at random. This is the bug from the story.",
  },
  {
    id: "primary",
    name: "Always primary",
    how: "All of this user's reads go to the primary. Always fresh, but the replicas sit idle and the primary does every read.",
  },
  {
    id: "sticky",
    name: "Primary after a write",
    how: "For a few seconds after you write, your reads go to the primary; after that, any node. Fresh only if the window is longer than the lag.",
  },
  {
    id: "token",
    name: "Version token",
    how: "The write hands back its log position (LSN). A read only goes to a replica that has reached it, else to the primary.",
  },
  {
    id: "sync",
    name: "Sync replication",
    how: "The primary waits until every replica has applied the write before saying OK. Any node is fresh, but each write waits for the slowest replica.",
  },
];

const NET_MS = 60; // one hop between the app and a database
const READ_MS = 2 * NET_MS + 330; // drawn slower than real life so you can watch it
const AUTO_REFRESH_GAP = 150;
const LAG_FACTOR: Record<ReplicaId, number> = { r1: 1, r2: 1.6 };
const ALL: NodeId[] = ["primary", "r1", "r2"];
const REPLICAS: ReplicaId[] = ["r1", "r2"];

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

function freshWorld(): World {
  return {
    nodes: {
      primary: { name: "Primary", tone: "pink", lsn: 41, balance: 0 },
      r1: { name: "Replica 1", tone: "blue", lsn: 41, balance: 0 },
      r2: { name: "Replica 2", tone: "cyan", lsn: 41, balance: 0 },
    },
    shipments: [],
    read: null,
    ack: null,
    autoRefreshAt: null,
    wantsAutoRefresh: false,
    ackedBalance: 0,
    token: 0,
    lastWriteAt: null,
    lastWriteMs: null,
    screen: { balance: 0, from: null, stale: false, status: "Balance loaded" },
    route: "Waiting for your first request.",
    stats: { reads: 0, stale: 0, primary: 0 },
    log: [],
    nextId: 0,
  };
}

function addLog(world: World, t: number, text: string, tone: Tone): World {
  const line = { id: world.nextId, t, text, tone };
  return { ...world, nextId: world.nextId + 1, log: [line, ...world.log].slice(0, 6) };
}

interface Settings {
  strategy: Strategy;
  lag: number;
  sticky: number;
}

// The router: decides which node serves a read, and says why.
function route(world: World, t: number, s: Settings): { to: NodeId; why: string } {
  switch (s.strategy) {
    case "primary":
      return { to: "primary", why: "Your own wallet: always read from the primary." };
    case "sticky": {
      const since = world.lastWriteAt === null ? Infinity : t - world.lastWriteAt;
      if (since < s.sticky) {
        return {
          to: "primary",
          why: `You wrote ${seconds(since)} ago (< ${seconds(s.sticky)} window): primary.`,
        };
      }
      const to = pick(ALL);
      return {
        to,
        why: `No write in the last ${seconds(s.sticky)}: any node (${world.nodes[to].name}).`,
      };
    }
    case "token": {
      if (world.token === 0) {
        const to = pick(ALL);
        return { to, why: `No token yet: any node (${world.nodes[to].name}).` };
      }
      const ready = REPLICAS.filter((id) => world.nodes[id].lsn >= world.token);
      const behind = REPLICAS.filter((id) => world.nodes[id].lsn < world.token)
        .map((id) => `${world.nodes[id].name} at ${world.nodes[id].lsn}`)
        .join(", ");
      if (ready.length > 0) {
        const to = pick(ready);
        return {
          to,
          why: `Need LSN ≥ ${world.token}. ${world.nodes[to].name} has ${world.nodes[to].lsn}: use it.${behind ? ` Skipped ${behind}.` : ""}`,
        };
      }
      return {
        to: "primary",
        why: `Need LSN ≥ ${world.token}, but ${behind}. Fall back to the primary.`,
      };
    }
    default: {
      const to = pick(ALL);
      return { to, why: `Load balancer picked ${world.nodes[to].name} at random.` };
    }
  }
}

function sendRead(world: World, t: number, s: Settings): World {
  if (world.read) return world;
  const { to, why } = route(world, t, s);
  return addLog(
    {
      ...world,
      read: { to, sentAt: t, arriveAt: t + READ_MS, expected: world.ackedBalance },
      route: why,
      screen: { ...world.screen, status: "Refreshing…" },
    },
    t,
    `Refresh → ${world.nodes[to].name}`,
    "violet",
  );
}

function sendWrite(world: World, t: number, s: Settings, autoRefresh: boolean): World {
  if (world.ack) return world;
  const primary = world.nodes.primary;
  const lsn = primary.lsn + 1;
  const balance = primary.balance + 100;
  let nextId = world.nextId;

  // Ship to each replica after its lag, never overtaking an earlier change.
  const shipments = [...world.shipments];
  for (const to of REPLICAS) {
    const queuedUntil = Math.max(t, ...shipments.filter((x) => x.to === to).map((x) => x.arriveAt));
    const arriveAt = Math.max(queuedUntil + 30, t + s.lag * LAG_FACTOR[to]);
    shipments.push({ id: nextId++, to, lsn, balance, sentAt: t, arriveAt });
  }

  // Async: OK after one hop back. Sync: OK only once the slowest replica has applied it.
  const applied = Math.max(...shipments.filter((x) => x.lsn === lsn).map((x) => x.arriveAt));
  const at = s.strategy === "sync" ? applied + NET_MS : t + 2 * NET_MS;

  return addLog(
    {
      ...world,
      nextId,
      nodes: { ...world.nodes, primary: { ...primary, lsn, balance } },
      shipments,
      ack: { at, balance, lsn, startedAt: t },
      wantsAutoRefresh: autoRefresh,
      screen: {
        ...world.screen,
        status: s.strategy === "sync" ? "Adding… waiting for replicas" : "Adding…",
      },
    },
    t,
    `Write +₹100 → Primary (LSN ${lsn})`,
    "pink",
  );
}

// One tick of simulated time: apply arrivals, deliver OKs and read results.
function advance(world: World, t: number, s: Settings): World {
  let w = world;

  const arrived = w.shipments.filter((x) => x.arriveAt <= t);
  if (arrived.length > 0) {
    const nodes = { ...w.nodes };
    for (const x of arrived) {
      if (x.lsn > nodes[x.to].lsn) nodes[x.to] = { ...nodes[x.to], lsn: x.lsn, balance: x.balance };
    }
    w = { ...w, nodes, shipments: w.shipments.filter((x) => x.arriveAt > t) };
    for (const x of arrived) {
      w = addLog(w, x.arriveAt, `${w.nodes[x.to].name} applied LSN ${x.lsn}`, "amber");
    }
  }

  if (w.ack && w.ack.at <= t) {
    const { balance, lsn, at, startedAt } = w.ack;
    w = addLog(
      {
        ...w,
        ack: null,
        ackedBalance: balance,
        token: lsn,
        lastWriteAt: at,
        lastWriteMs: at - startedAt,
        autoRefreshAt: w.wantsAutoRefresh ? at + AUTO_REFRESH_GAP : null,
        wantsAutoRefresh: false,
        screen: { ...w.screen, status: `${rupees(100)} added ✓` },
      },
      at,
      `OK after ${Math.round(at - startedAt)} ms${s.strategy === "token" ? ` · token LSN ${lsn}` : ""}`,
      "green",
    );
  }

  if (w.autoRefreshAt !== null && w.autoRefreshAt <= t) {
    w = sendRead({ ...w, autoRefreshAt: null }, t, s);
  }

  if (w.read && w.read.arriveAt <= t) {
    const { to, expected } = w.read;
    const answer = w.nodes[to].balance;
    const stale = answer < expected;
    w = addLog(
      {
        ...w,
        read: null,
        screen: {
          balance: answer,
          from: to,
          stale,
          status: stale ? `Stale! You were told ${rupees(expected)}` : "Up to date",
        },
        stats: {
          reads: w.stats.reads + 1,
          stale: w.stats.stale + (stale ? 1 : 0),
          primary: w.stats.primary + (to === "primary" ? 1 : 0),
        },
      },
      t,
      `${w.nodes[to].name} answered ${rupees(answer)}${stale ? " (stale)" : ""}`,
      stale ? "red" : "green",
    );
  }

  return w;
}

function NodeCard({ id, world, now }: { id: NodeId; world: World; now: number }) {
  const node = world.nodes[id];
  const incoming = world.shipments.filter((x) => x.to === id);
  const serving = world.read?.to === id;
  const behind = world.nodes.primary.lsn - node.lsn;

  return (
    <section
      data-tone={node.tone}
      aria-label={`${node.name}: ${rupees(node.balance)}, log position ${node.lsn}`}
      className={cn(
        "tut-glow rounded-xl border-2 border-(--tone) bg-(image:--tone-fill) p-3 transition-shadow",
        serving && "tut-ping",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 font-hand text-2xl leading-6 font-bold text-(--tone)">
          <Database className="h-5 w-5" aria-hidden />
          {node.name}
        </p>
        <p className="text-right font-mono text-xs text-ink">
          LSN {node.lsn}
          {id !== "primary" && (
            <span
              data-tone={behind > 0 ? "red" : "green"}
              className="ml-1.5 rounded bg-(--tone-soft) px-1 font-semibold text-(--tone)"
            >
              {behind > 0 ? `${behind} behind` : "in sync"}
            </span>
          )}
        </p>
      </div>
      <p className="mt-1 text-2xl font-bold text-ink">{rupees(node.balance)}</p>
      {serving && (
        <p className="mt-1 font-hand text-lg leading-5 text-(--tone)">answering your refresh…</p>
      )}
      {incoming.length > 0 && (
        <ul className="mt-2 list-none space-y-1.5 p-0">
          {incoming.map((x) => {
            const progress = Math.min(1, Math.max(0, (now - x.sentAt) / (x.arriveAt - x.sentAt)));
            return (
              <li key={x.id} data-tone="amber">
                <p className="flex justify-between text-[0.7rem] text-ink-muted">
                  <span>incoming LSN {x.lsn} (+₹100)</span>
                  <span>{seconds(Math.max(0, x.arriveAt - now))}</span>
                </p>
                <div className="relative mt-0.5 h-2 rounded-full bg-(--tone-soft)">
                  <div
                    className="h-full rounded-full bg-(--tone)"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function ReplicaLagSim() {
  const [strategy, setStrategy] = useState<Strategy>("any");
  const [lag, setLag] = useState(1500);
  const [sticky, setSticky] = useState(2000);
  const [world, setWorld] = useState(freshWorld);
  const [now, setNow] = useState(0);
  const startRef = useRef<number | null>(null);

  const settings: Settings = { strategy, lag, sticky };
  const clock = () => {
    if (startRef.current === null) startRef.current = performance.now();
    return performance.now() - startRef.current;
  };

  const onFrame = useEffectEvent(() => {
    const t = clock();
    setNow(t);
    setWorld((w) => advance(w, t, settings));
  });

  // Simulated time runs on the real clock, even with reduced motion: the lag is the lesson.
  useEffect(() => {
    let frame = 0;
    const loop = () => {
      onFrame();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const reset = (next = strategy) => {
    setStrategy(next);
    setWorld(freshWorld());
  };

  const busyWrite = world.ack !== null;
  const busyRead = world.read !== null || world.autoRefreshAt !== null;
  const current = STRATEGIES.find((s) => s.id === strategy) ?? STRATEGIES[0];
  const { reads, stale, primary } = world.stats;

  return (
    <div className="space-y-4">
      <div className="print:hidden">
        <div role="tablist" aria-label="Read routing strategy" className="flex flex-wrap gap-2">
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={strategy === s.id}
              data-tone={s.id === "any" ? "red" : "violet"}
              onClick={() => reset(s.id)}
              className={cn(
                "min-h-10 rounded-lg border-2 border-(--tone) px-3 text-sm font-semibold transition",
                strategy === s.id
                  ? "bg-(--tone) text-paper"
                  : "text-(--tone) hover:bg-(--tone-soft)",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-muted">{current.how}</p>
        <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
          <DemoSlider
            label="Replication lag"
            min={0}
            max={4000}
            step={100}
            value={lag}
            onChange={setLag}
            valueText={`${seconds(lag)} (replica 2: ${seconds(lag * LAG_FACTOR.r2)})`}
          />
          {strategy === "sticky" && (
            <DemoSlider
              label="Primary window after a write"
              min={0}
              max={5000}
              step={250}
              value={sticky}
              onChange={setSticky}
              valueText={seconds(sticky)}
            />
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
        {/* The phone */}
        <div className="flex flex-col items-center gap-3">
          <div className="tut-sketch-alt w-full max-w-[17rem] border-[2.5px] border-ink bg-paper p-2">
            <div className="flex min-h-[15rem] flex-col rounded-[1.1rem] border border-rule bg-paper-raised p-3">
              <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                <Smartphone className="h-4 w-4" aria-hidden /> PayWallet
              </p>
              <p className="mt-4 text-xs text-ink-muted">Wallet balance</p>
              <p
                data-tone={world.screen.stale ? "red" : "green"}
                className={cn(
                  "text-4xl font-bold text-(--tone)",
                  world.screen.stale && "tut-shake",
                )}
              >
                {rupees(world.screen.balance)}
              </p>
              <p
                aria-live="polite"
                data-tone={world.screen.stale ? "red" : "violet"}
                className="mt-2 font-hand text-xl leading-5 text-(--tone)"
              >
                {world.screen.status}
              </p>
              <p className="mt-auto pt-3 text-xs text-ink-muted">
                {world.screen.from
                  ? `answered by ${world.nodes[world.screen.from].name}`
                  : "not refreshed yet"}
              </p>
            </div>
          </div>
          <div className="grid w-full max-w-[17rem] gap-2 print:hidden">
            <button
              type="button"
              data-tone="green"
              disabled={busyWrite}
              onClick={() => setWorld((w) => sendWrite(w, clock(), settings, false))}
              className="tut-glow min-h-11 rounded-xl bg-(--tone) text-sm font-bold text-paper disabled:opacity-50"
            >
              Add ₹100
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-tone="violet"
                disabled={busyRead}
                onClick={() => setWorld((w) => sendRead(w, clock(), settings))}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-(--tone) text-sm font-semibold text-(--tone) disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" aria-hidden /> Refresh
              </button>
              <button
                type="button"
                data-tone="amber"
                disabled={busyWrite || busyRead}
                onClick={() => setWorld((w) => sendWrite(w, clock(), settings, true))}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-(--tone) px-1 text-sm font-semibold text-(--tone) disabled:opacity-50"
              >
                <Zap className="h-4 w-4" aria-hidden /> Add + refresh
              </button>
            </div>
            <button
              type="button"
              onClick={() => reset()}
              className="min-h-9 text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              Reset
            </button>
          </div>
        </div>

        {/* The cluster */}
        <div className="min-w-0 space-y-3">
          <div
            data-tone="violet"
            className="flex items-start gap-2 rounded-xl border border-dashed border-(--tone) bg-(--tone-soft) px-3 py-2"
          >
            <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-(--tone)" aria-hidden />
            <p className="text-sm text-ink">
              <b className="text-(--tone)">Router: </b>
              {world.route}
            </p>
          </div>
          <NodeCard id="primary" world={world} now={now} />
          <div className="grid gap-3 sm:grid-cols-2">
            <NodeCard id="r1" world={world} now={now} />
            <NodeCard id="r2" world={world} now={now} />
          </div>

          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "stale reads", value: `${stale} / ${reads}`, tone: "red" as Tone },
              {
                label: "reads on primary",
                value: reads ? `${Math.round((primary / reads) * 100)}%` : "–",
                tone: "pink" as Tone,
              },
              {
                label: "last write took",
                value: world.lastWriteMs === null ? "–" : `${Math.round(world.lastWriteMs)} ms`,
                tone: "amber" as Tone,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                data-tone={stat.tone}
                className="rounded-lg border border-(--tone)/50 bg-(--tone-soft) px-2 py-1.5"
              >
                <dt className="text-[0.7rem] font-semibold tracking-wide text-ink-muted uppercase">
                  {stat.label}
                </dt>
                <dd className="font-mono text-lg font-bold text-(--tone)">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <ol aria-label="Event log" className="list-none space-y-0.5 p-0 font-mono text-xs">
            {world.log.length === 0 && (
              <li className="text-ink-muted">Tap “Add + refresh” to reproduce the bug.</li>
            )}
            {world.log.map((line) => (
              <li key={line.id} data-tone={line.tone} className="flex gap-2">
                <span className="w-14 shrink-0 text-right text-ink-muted">{seconds(line.t)}</span>
                <span className="text-(--tone)">●</span>
                <span className="text-ink">{line.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="hidden text-sm text-ink print:block">
        <p className="font-semibold">Routing strategies in this simulator:</p>
        <ul className="list-disc pl-5">
          {STRATEGIES.map((s) => (
            <li key={s.id}>
              <b>{s.name}:</b> {s.how}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
