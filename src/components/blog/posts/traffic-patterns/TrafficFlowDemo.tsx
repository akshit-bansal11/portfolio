/*
 * TrafficFlowDemo.tsx
 * Main Traffic Patterns demo: a small data centre where one user request enters through
 * the gateway (north-south) and fans out into many service-to-service calls (east-west).
 * Highlight one direction, add a service mesh (a sidecar proxy next to every service,
 * encrypting and checking every call), and drop an intruder inside Recs to see whether
 * it can move sideways to the payments database. Clean SVG geometry in the tone palette;
 * packets ride every active link, and the scene's state changes animate in.
 */

"use client";

import { type CSSProperties, useId, useState } from "react";
import { DemoToggle, SegmentedControl } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";
import styles from "./TrafficFlowDemo.module.css";

type NodeId =
  | "users"
  | "gateway"
  | "web"
  | "orders"
  | "recs"
  | "payments"
  | "inventory"
  | "profile"
  | "db";
type Direction = "ns" | "ew" | "both";

interface NodeDef {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const NODES: Record<NodeId, NodeDef> = {
  users: { label: "users on the internet", x: 190, y: 28, w: 184, h: 32 },
  gateway: { label: "load balancer + gateway", x: 190, y: 108, w: 196, h: 32 },
  web: { label: "Web", x: 190, y: 178, w: 76, h: 32 },
  orders: { label: "Orders", x: 74, y: 246, w: 88, h: 32 },
  recs: { label: "Recs", x: 306, y: 246, w: 76, h: 32 },
  inventory: { label: "Inventory", x: 190, y: 296, w: 98, h: 32 },
  payments: { label: "Payments", x: 74, y: 318, w: 98, h: 32 },
  profile: { label: "Profile", x: 306, y: 318, w: 84, h: 32 },
  db: { label: "Payments DB", x: 74, y: 386, w: 116, h: 32 },
};

interface Edge {
  from: NodeId;
  to: NodeId;
  direction: "ns" | "ew";
}

const EDGES: Edge[] = [
  { from: "users", to: "gateway", direction: "ns" },
  { from: "gateway", to: "web", direction: "ns" },
  { from: "web", to: "orders", direction: "ew" },
  { from: "web", to: "recs", direction: "ew" },
  { from: "orders", to: "payments", direction: "ew" },
  { from: "orders", to: "inventory", direction: "ew" },
  { from: "recs", to: "profile", direction: "ew" },
  { from: "recs", to: "inventory", direction: "ew" },
  { from: "payments", to: "db", direction: "ew" },
];

const NODE_IDS = Object.keys(NODES) as NodeId[];
const SERVICES: NodeId[] = ["web", "orders", "recs", "payments", "inventory", "profile", "db"];
const EAST_WEST_CALLS = EDGES.filter((edge) => edge.direction === "ew").length;

const DIRECTION_OPTIONS = [
  { value: "ns" as const, label: "North-south" },
  { value: "ew" as const, label: "East-west" },
  { value: "both" as const, label: "Both" },
];

// Where the line from `a` towards `b` leaves a's box, `pad` units outside it.
function exitPoint(a: NodeDef, b: NodeDef, pad: number): [number, number] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(
    (a.w / 2 + pad) / Math.max(Math.abs(dx), 1e-6),
    (a.h / 2 + pad) / Math.max(Math.abs(dy), 1e-6),
  );
  return [a.x + dx * t, a.y + dy * t];
}

// Straight shaft plus a small solid arrowhead at the far end.
function edgeGeometry(edge: Edge) {
  const a = NODES[edge.from];
  const b = NODES[edge.to];
  const [x1, y1] = exitPoint(a, b, 2);
  const [x2, y2] = exitPoint(b, a, 3);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6.5;
  const corner = (spread: number) =>
    `${x2 - size * Math.cos(angle - spread)},${y2 - size * Math.sin(angle - spread)}`;
  const head = `${x2},${y2} ${corner(0.45)} ${corner(-0.45)}`;
  return { shaft: `M${x1} ${y1} L${x2} ${y2}`, head, mid: [(x1 + x2) / 2, (y1 + y2) / 2] };
}

// The intruder's path: from Recs, around Inventory, to the payments database.
const ATTACK = "M282 264 Q250 372 136 384";

// A clean padlock, centred on (x, y).
function Padlock({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g
      data-tone="green"
      aria-hidden
      className={styles.pop}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    >
      <rect
        x={x - 8}
        y={y - 8}
        width={16}
        height={16}
        rx={5}
        className="fill-paper stroke-(--tone)"
        strokeWidth={1}
      />
      <path
        d={`M${x - 2.5} ${y - 0.5} V${y - 2.5} a2.5 2.5 0 0 1 5 0 V${y - 0.5}`}
        fill="none"
        strokeWidth={1.3}
        className="stroke-(--tone)"
      />
      <rect x={x - 4} y={y - 1} width={8} height={5.5} rx={1.3} className="fill-(--tone)" />
    </g>
  );
}

export default function TrafficFlowDemo() {
  const [direction, setDirection] = useState<Direction>("both");
  const [mesh, setMesh] = useState(false);
  const [intruder, setIntruder] = useState(false);
  const titleId = useId();

  const isActive = (edge: Edge) => direction === "both" || edge.direction === direction;
  const attackBlocked = intruder && mesh;
  const attackSucceeded = intruder && !mesh;

  let note = "One click on the website = 2 north-south hops, then 7 east-west calls inside.";
  let noteTone = "violet";
  if (direction === "ns") {
    note = "North-south: traffic crossing the wall between the internet and your data centre.";
    noteTone = "amber";
  }
  if (direction === "ew") {
    note = "East-west: services talking to each other. Notice there's far more of it.";
    noteTone = "blue";
  }
  if (mesh) {
    note =
      "With a mesh, every service gets a proxy. Every east-west call is encrypted, checked and traced.";
    noteTone = "green";
  }
  if (attackSucceeded) {
    note =
      "The front door was locked, but inside nothing checks who's calling. The intruder walks straight to the payments database.";
    noteTone = "red";
  }
  if (attackBlocked) {
    note =
      "The intruder got in, but the mesh only lets Payments talk to the payments database. Denied.";
    noteTone = "green";
  }

  const stats = [
    { label: "east-west calls encrypted", value: mesh ? EAST_WEST_CALLS : 0 },
    { label: "callers checked", value: mesh ? EAST_WEST_CALLS : 0 },
    { label: "calls traced", value: mesh ? EAST_WEST_CALLS : 0 },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <svg
        viewBox="0 0 380 420"
        role="img"
        aria-labelledby={titleId}
        className="mx-auto block w-full max-w-[34rem] select-none lg:order-1"
      >
        <title id={titleId}>
          {`Data centre diagram. ${direction === "ns" ? "North-south" : direction === "ew" ? "East-west" : "All"} traffic highlighted. Service mesh ${
            mesh ? "on" : "off"
          }. ${intruder ? (mesh ? "An intruder in Recs is blocked from the payments database." : "An intruder in Recs reaches the payments database.") : ""}`}
        </title>

        {/* Data centre wall */}
        <rect
          x={8}
          y={108}
          width={364}
          height={304}
          rx={16}
          fill="none"
          strokeWidth={1.4}
          strokeDasharray="6 5"
          className="stroke-ink-muted/50"
        />
        <text x={20} y={142} className="fill-ink-muted text-[12px] font-semibold tracking-wider">
          YOUR DATA CENTRE
        </text>
        <g data-tone="amber">
          <text x={366} y={70} textAnchor="end" className="fill-(--tone) text-[12px] font-bold">
            ↕ NORTH-SOUTH
          </text>
        </g>
        <g data-tone="blue">
          <text x={358} y={402} textAnchor="end" className="fill-(--tone) text-[12px] font-bold">
            ↔ EAST-WEST
          </text>
        </g>

        {/* Edges */}
        {EDGES.map((edge, index) => {
          const { shaft, head, mid } = edgeGeometry(edge);
          const active = isActive(edge);
          const isNs = edge.direction === "ns";
          return (
            <g
              key={`${edge.from}-${edge.to}`}
              data-tone={isNs ? "amber" : "blue"}
              className={cn("transition-opacity duration-300", active ? "" : "opacity-20")}
            >
              <path
                d={shaft}
                fill="none"
                strokeWidth={active ? 2 : 1.4}
                strokeLinecap="round"
                className="stroke-(--tone-line) transition-[stroke-width]"
              />
              <polygon points={head} className="fill-(--tone)" />
              {active && (
                <circle r={3.6} className={cn("fill-(--tone) stroke-paper", styles.packet)}>
                  <animateMotion
                    dur={isNs ? "1.6s" : "1.9s"}
                    begin={`${isNs ? index * 0.35 : 0.7 + index * 0.18}s`}
                    repeatCount="indefinite"
                    path={shaft}
                  />
                </circle>
              )}
              {mesh && !isNs && <Padlock x={mid[0]} y={mid[1]} delay={0.25 + index * 0.05} />}
            </g>
          );
        })}

        {/* Attack path */}
        {intruder && (
          <g data-tone="red">
            <path
              d={ATTACK}
              fill="none"
              strokeWidth={2.2}
              strokeDasharray="6 3"
              strokeLinecap="round"
              className={cn("stroke-(--tone)", styles.march)}
            />
            <circle r={4.5} className={cn("fill-(--tone) stroke-paper", styles.packet)}>
              {/* Blocked: the intruder's packet stops at the database's proxy. */}
              <animateMotion
                dur="2.2s"
                repeatCount="indefinite"
                path={ATTACK}
                keyPoints={attackBlocked ? "0;0.9" : "0;1"}
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
            {attackBlocked && (
              <g className={styles.shake}>
                <circle cx={158} cy={381} r={10} className="fill-paper stroke-(--tone)" />
                <path
                  d="M153 376 L163 386 M163 376 L153 386"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  className="stroke-(--tone)"
                />
                <text x={172} y={368} className="fill-(--tone) text-[12px] font-bold">
                  denied
                </text>
              </g>
            )}
          </g>
        )}

        {/* Nodes */}
        {NODE_IDS.map((id, index) => {
          const node = NODES[id];
          const isService = SERVICES.includes(id);
          const compromised = intruder && id === "recs";
          const stolen = attackSucceeded && id === "db";
          const tone =
            compromised || stolen ? "red" : id === "users" || id === "gateway" ? "amber" : "blue";
          const x = node.x - node.w / 2;
          const y = node.y - node.h / 2;
          return (
            <g key={id} data-tone={tone}>
              {stolen && (
                <rect
                  x={x}
                  y={y}
                  width={node.w}
                  height={node.h}
                  rx={8}
                  fill="none"
                  strokeWidth={2}
                  className={cn("stroke-(--tone)", styles.alarm)}
                />
              )}
              {/* Opaque base so lines behind never show through the tinted fill. */}
              <rect
                x={x}
                y={y}
                width={node.w}
                height={node.h}
                rx={id === "users" ? 16 : 8}
                className="fill-paper"
              />
              <rect
                x={x}
                y={y}
                width={node.w}
                height={node.h}
                rx={id === "users" ? 16 : 8}
                strokeWidth={compromised || stolen || id === "gateway" ? 1.6 : 1}
                className={cn(
                  "transition-colors duration-300",
                  compromised || stolen || id === "gateway"
                    ? "fill-(--tone-soft) stroke-(--tone)"
                    : "fill-paper stroke-(--tone-line)",
                )}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-ink text-[14px] font-semibold"
              >
                {node.label}
              </text>
              {/* Sidecar proxy badge */}
              {mesh && isService && (
                <g
                  data-tone="green"
                  className={styles.pop}
                  style={{ "--delay": `${index * 0.06}s` } as CSSProperties}
                >
                  <rect
                    x={x + node.w - 12}
                    y={y - 9}
                    width={20}
                    height={16}
                    rx={5}
                    strokeWidth={1.2}
                    className="fill-(--tone-soft) stroke-(--tone)"
                  />
                  <circle cx={x + node.w - 2} cy={y - 1} r={3} className="fill-(--tone)" />
                </g>
              )}
              {compromised && (
                <text
                  x={x + node.w - 16}
                  y={y - 6}
                  textAnchor="end"
                  className="fill-(--tone) text-[12px] font-bold"
                >
                  intruder!
                </text>
              )}
              {stolen && (
                <text
                  x={x + node.w + 8}
                  y={node.y + 4}
                  className="fill-(--tone) text-[12px] font-bold"
                >
                  data stolen
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-col gap-4 lg:order-2">
        <SegmentedControl
          label="Highlight"
          options={DIRECTION_OPTIONS}
          value={direction}
          onChange={setDirection}
        />
        <div className="flex flex-col gap-1">
          <DemoToggle label="Service mesh" checked={mesh} onChange={setMesh} />
          <DemoToggle label="Intruder inside Recs" checked={intruder} onChange={setIntruder} />
        </div>

        <div
          data-tone={noteTone}
          className="rounded-xl border border-(--tone-line) bg-(image:--tone-fill) px-4 py-3 transition-colors duration-300"
        >
          <p key={note} aria-live="polite" className="tut-pop leading-snug font-medium text-ink">
            {note}
          </p>
        </div>

        <ul className="grid list-none grid-cols-3 gap-2 p-0">
          {stats.map((s) => (
            <li
              key={s.label}
              data-tone={mesh ? "green" : "red"}
              className="rounded-lg border border-(--tone-line) bg-paper px-2 py-2 text-center transition-colors duration-300"
            >
              <span
                key={s.value}
                className="tut-pop block font-mono text-lg font-bold text-(--tone)"
              >
                {s.value}/{EAST_WEST_CALLS}
              </span>
              <span className="block text-[0.7rem] leading-tight text-ink-muted">{s.label}</span>
            </li>
          ))}
        </ul>
        <p data-tone="green" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            aria-hidden
            className="inline-block h-3 w-4 shrink-0 rounded-[4px] border border-(--tone) bg-(--tone-soft)"
          />
          badge = sidecar proxy · padlock = encrypted, checked call
        </p>
      </div>
    </div>
  );
}
