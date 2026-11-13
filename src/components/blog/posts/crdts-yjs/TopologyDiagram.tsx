/*
 * TopologyDiagram.tsx
 * Who has to be online for edits to merge. Left: OT, where every client talks only to
 * the central server that orders and transforms edits. Right: a CRDT, where replicas
 * can sync through a server or directly with each other. Edits flow along the links as
 * marching dashes. "Take the server down" cuts the server: OT stops merging, the CRDT
 * peers keep syncing directly. Two SVGs with viewBoxes, side by side from `sm` up.
 */

"use client";

import { Power, Server } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

interface Point {
  x: number;
  y: number;
}

const OT_SERVER: Point = { x: 120, y: 46 };
const OT_CLIENTS: Point[] = [
  { x: 42, y: 150 },
  { x: 120, y: 162 },
  { x: 198, y: 150 },
];

const MESH_SERVER: Point = { x: 120, y: 105 };
const PEERS: Point[] = [
  { x: 42, y: 46 },
  { x: 198, y: 46 },
  { x: 198, y: 162 },
  { x: 42, y: 162 },
];
// Ring of direct peer-to-peer links.
const RING = PEERS.map((p, i) => [p, PEERS[(i + 1) % PEERS.length]] as const);

function LinkLine({ a, b, live, tone }: { a: Point; b: Point; live: boolean; tone: Tone }) {
  return (
    <g data-tone={tone}>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        strokeWidth={1.5}
        className="stroke-(--tone-line)"
        opacity={live ? 1 : 0.35}
      />
      {live && (
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          strokeWidth={2.4}
          strokeLinecap="round"
          className={cn("stroke-(--tone)", styles.flow)}
          opacity={0.9}
        />
      )}
    </g>
  );
}

function Box({
  at,
  label,
  sub,
  tone,
  wide,
  down,
  downSub,
}: {
  at: Point;
  label: string;
  sub?: string;
  tone: Tone;
  wide?: boolean;
  down?: boolean;
  /** Second line while the box is down. */
  downSub?: string;
}) {
  const w = wide ? 92 : 56;
  const h = sub ? 36 : 26;
  return (
    <g data-tone={down ? "red" : tone} className={styles.svgNode}>
      <rect x={at.x - w / 2} y={at.y - h / 2} width={w} height={h} rx={8} className="fill-paper" />
      <rect
        x={at.x - w / 2}
        y={at.y - h / 2}
        width={w}
        height={h}
        rx={8}
        strokeWidth={1.4}
        strokeDasharray={down ? "4 3" : undefined}
        className="fill-(--tone-soft) stroke-(--tone)"
      />
      <text
        x={at.x}
        y={sub ? at.y - 4 : at.y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[11px] font-semibold"
      >
        {down ? `${label} (down)` : label}
      </text>
      {sub && (
        <text
          x={at.x}
          y={at.y + 9}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-(--tone) text-[9px]"
        >
          {down ? downSub : sub}
        </text>
      )}
    </g>
  );
}

function Panel({
  title,
  tone,
  verdict,
  ok,
  label,
  children,
}: {
  title: string;
  tone: Tone;
  verdict: string;
  ok: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-tone={tone}
      className="dg-enter min-w-0 rounded-2xl border border-(--tone-line) bg-paper/60 p-3"
    >
      <p className="text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">{title}</p>
      <svg viewBox="0 0 240 200" role="img" aria-label={label} className="mt-1 w-full">
        {children}
      </svg>
      <p
        data-tone={ok ? "green" : "red"}
        className="mt-1 rounded-lg bg-(--tone-soft) px-2.5 py-1.5 text-center text-sm font-semibold text-(--tone) transition-colors"
      >
        {verdict}
      </p>
    </div>
  );
}

export default function TopologyDiagram() {
  const [down, setDown] = useState(false);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel
          title="OT: one referee"
          tone="amber"
          ok={!down}
          verdict={down ? "Edits pile up. Nothing merges." : "Every edit goes through the server"}
          label={
            down
              ? "OT: three clients connect only to a central server, which is down, so no edits merge."
              : "OT: three clients connect only to a central server, which orders and transforms every edit."
          }
        >
          {OT_CLIENTS.map((c) => (
            <LinkLine key={c.x} a={OT_SERVER} b={c} live={!down} tone="amber" />
          ))}
          <Box
            at={OT_SERVER}
            label="server"
            sub="orders + transforms"
            downSub="no one to referee"
            tone="pink"
            wide
            down={down}
          />
          {OT_CLIENTS.map((c, i) => (
            <Box key={c.x} at={c} label={`client ${i + 1}`} tone="violet" />
          ))}
          {down && (
            <text x={120} y={192} textAnchor="middle" className="fill-ink-muted text-[10px]">
              clients wait for the server
            </text>
          )}
        </Panel>

        <Panel
          title="CRDT: sync with anyone"
          tone="green"
          ok
          verdict={down ? "Peers keep syncing directly" : "Any path, any order, same result"}
          label={
            down
              ? "CRDT: four peers. The server in the middle is down, but the peers still sync directly with each other and converge."
              : "CRDT: four peers sync with each other directly and through an optional server. Edits can take any path in any order."
          }
        >
          {PEERS.map((p) => (
            <LinkLine key={`s-${p.x}-${p.y}`} a={MESH_SERVER} b={p} live={!down} tone="cyan" />
          ))}
          {RING.map(([a, b]) => (
            <LinkLine key={`${a.x}-${a.y}-${b.x}-${b.y}`} a={a} b={b} live tone="green" />
          ))}
          <Box
            at={MESH_SERVER}
            label="server"
            sub="optional relay"
            downSub="peers don't need it"
            tone="cyan"
            wide
            down={down}
          />
          {PEERS.map((p, i) => (
            <Box key={`${p.x}-${p.y}`} at={p} label={`peer ${i + 1}`} tone="green" />
          ))}
        </Panel>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-tone={down ? "green" : "red"}
          aria-pressed={down}
          onClick={() => setDown(!down)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-(--tone-line) bg-(--tone-soft) px-3 text-sm font-semibold text-(--tone) transition-[translate,border-color] hover:border-(--tone) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone) active:translate-y-px"
        >
          {down ? (
            <Server className="h-4 w-4" aria-hidden />
          ) : (
            <Power className="h-4 w-4" aria-hidden />
          )}
          {down ? "Bring the server back" : "Take the server down"}
        </button>
        <p aria-live="polite" className="text-sm text-ink-muted">
          {down
            ? "The server is down. Only the CRDT side is still merging."
            : "Both servers are up. Try taking them down."}
        </p>
      </div>
    </div>
  );
}
