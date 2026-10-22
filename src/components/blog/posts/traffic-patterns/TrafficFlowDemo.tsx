/*
 * TrafficFlowDemo.tsx
 * Main Traffic Patterns demo: a small data centre where one
 * user request enters through the gateway (north-south) and
 * fans out into many service-to-service calls (east-west).
 * Toggle which direction to highlight, add a service mesh
 * (a proxy next to every service, encrypting and checking
 * every call), and drop an intruder inside to see whether it
 * can move sideways to the payments database.
 */

"use client";

import { useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { DemoToggle, SegmentedControl } from "@/components/blog/DemoControls";
import { clipToBox, sketchArrow, sketchCross, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

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
  users: { label: "users on the internet", x: 190, y: 26, w: 170, h: 30 },
  gateway: { label: "load balancer + gateway", x: 190, y: 104, w: 176, h: 30 },
  web: { label: "Web", x: 190, y: 172, w: 72, h: 32 },
  orders: { label: "Orders", x: 70, y: 240, w: 80, h: 32 },
  recs: { label: "Recs", x: 310, y: 240, w: 72, h: 32 },
  profile: { label: "Profile", x: 310, y: 312, w: 78, h: 32 },
  payments: { label: "Payments", x: 70, y: 312, w: 86, h: 32 },
  inventory: { label: "Inventory", x: 190, y: 290, w: 88, h: 32 },
  db: { label: "Payments DB", x: 70, y: 378, w: 104, h: 30 },
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

const NODE_IDS: NodeId[] = [
  "users",
  "gateway",
  "web",
  "orders",
  "recs",
  "payments",
  "inventory",
  "profile",
  "db",
];
const SERVICES: NodeId[] = ["web", "orders", "recs", "payments", "inventory", "profile", "db"];
const EAST_WEST_CALLS = EDGES.filter((edge) => edge.direction === "ew").length;

const DIRECTION_OPTIONS = [
  { value: "ns" as const, label: "North-south" },
  { value: "ew" as const, label: "East-west" },
  { value: "both" as const, label: "Both" },
];

// Hand-drawn arrow between two node borders.
function edgePath(from: NodeId, to: NodeId, seed: number) {
  const a = NODES[from];
  const b = NODES[to];
  const [x1, y1] = clipToBox(b.x, b.y, a.x, a.y, a.w / 2, a.h / 2, 2);
  const [x2, y2] = clipToBox(a.x, a.y, b.x, b.y, b.w / 2, b.h / 2, 5);
  return sketchArrow(x1, y1, x2, y2, { seed, curve: 0.06, headSize: 7 });
}

// Tiny padlock drawn at (x, y): a shackle and a body.
function Padlock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 5} ${y - 6})`} aria-hidden>
      <path d="M2 6 V3.5 a3 3 0 0 1 6 0 V6" fill="none" strokeWidth={1.4} className="stroke-ok" />
      <rect x={0} y={5.5} width={10} height={7} rx={1.5} className="fill-ok" />
    </g>
  );
}

export default function TrafficFlowDemo() {
  const [direction, setDirection] = useState<Direction>("both");
  const [mesh, setMesh] = useState(false);
  const [intruder, setIntruder] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();

  const isActive = (edge: Edge) => direction === "both" || edge.direction === direction;
  const attackBlocked = intruder && mesh;
  const attackSucceeded = intruder && !mesh;
  const attack = sketchArrow(
    NODES.recs.x - 40,
    NODES.recs.y + 14,
    NODES.db.x + 54,
    NODES.db.y - 8,
    {
      seed: 99,
      curve: -0.18,
      headSize: 8,
    },
  );

  let note = "One click on the website = 2 north-south hops, then 7 east-west calls inside.";
  if (direction === "ns")
    note = "North-south: traffic crossing the wall between the internet and your data centre.";
  if (direction === "ew")
    note = "East-west: services talking to each other. Notice there's far more of it.";
  if (mesh)
    note =
      "With a mesh, every service gets a proxy. Every east-west call is encrypted, checked and traced.";
  if (attackSucceeded)
    note =
      "The front door was locked, but inside nothing checks who's calling. The intruder walks straight to the payments database.";
  if (attackBlocked)
    note =
      "The intruder got in, but the mesh only lets Payments talk to the payments database. Denied.";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SegmentedControl
          label="Highlight"
          options={DIRECTION_OPTIONS}
          value={direction}
          onChange={setDirection}
        />
        <div className="flex flex-col gap-1 sm:ml-auto">
          <DemoToggle label="Service mesh" checked={mesh} onChange={setMesh} />
          <DemoToggle label="Intruder inside Recs" checked={intruder} onChange={setIntruder} />
        </div>
      </div>

      <svg
        viewBox="0 0 380 410"
        role="img"
        aria-labelledby={titleId}
        className="w-full select-none"
      >
        <title id={titleId}>
          {`Data centre diagram. ${direction === "ns" ? "North-south" : direction === "ew" ? "East-west" : "All"} traffic highlighted. Service mesh ${
            mesh ? "on" : "off"
          }. ${intruder ? (mesh ? "An intruder in Recs is blocked from the payments database." : "An intruder in Recs reaches the payments database.") : ""}`}
        </title>

        {/* Data centre wall */}
        <path
          d={sketchRect(8, 76, 364, 326, { seed: 3, bow: 2 })}
          fill="none"
          strokeWidth={1.6}
          strokeDasharray="6 4"
          className="stroke-ink-muted"
        />
        <text x={16} y={94} className="fill-ink-muted font-hand text-[15px]">
          your data centre
        </text>
        <text x={372} y={66} textAnchor="end" className="fill-pen font-hand text-[15px]">
          ↕ north-south
        </text>
        <text x={372} y={392} textAnchor="end" className="fill-pen-blue font-hand text-[15px]">
          ↔ east-west
        </text>

        {/* Edges */}
        {EDGES.map((edge, index) => {
          const paths = edgePath(edge.from, edge.to, index + 7);
          const active = isActive(edge);
          const isNs = edge.direction === "ns";
          const a = NODES[edge.from];
          const b = NODES[edge.to];
          return (
            <g
              key={`${edge.from}-${edge.to}`}
              className={cn(
                "transition-opacity duration-300",
                isNs ? "text-pen" : "text-pen-blue",
                active ? "opacity-100" : "opacity-20",
              )}
            >
              <path
                d={paths.shaft}
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? 2 : 1.4}
                strokeLinecap="round"
              />
              <path
                d={paths.head}
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? 2 : 1.4}
                strokeLinecap="round"
              />
              {active && !prefersReducedMotion && (
                <circle r={3.4} className={isNs ? "fill-pen" : "fill-pen-blue"}>
                  <animateMotion
                    dur={isNs ? "1.6s" : "1.9s"}
                    begin={`${isNs ? index * 0.35 : 0.7 + index * 0.18}s`}
                    repeatCount="indefinite"
                    path={paths.shaft}
                  />
                </circle>
              )}
              {mesh && !isNs && <Padlock x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2} />}
            </g>
          );
        })}

        {/* Attack path */}
        {intruder && (
          <g className="text-danger">
            <path
              d={attack.shaft}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeDasharray="5 4"
              className="motion-safe:animate-dash-flow"
            />
            {attackSucceeded && (
              <path d={attack.head} fill="none" stroke="currentColor" strokeWidth={2.4} />
            )}
            {attackBlocked && (
              <path
                d={sketchCross(NODES.db.x + 50, NODES.db.y - 14, 14, 4)}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
              />
            )}
          </g>
        )}

        {/* Nodes */}
        {NODE_IDS.map((id, index) => {
          const node = NODES[id];
          const isService = SERVICES.includes(id);
          const compromised = intruder && id === "recs";
          const stolen = attackSucceeded && id === "db";
          return (
            <g key={id}>
              <rect
                x={node.x - node.w / 2}
                y={node.y - node.h / 2}
                width={node.w}
                height={node.h}
                rx={id === "users" ? 15 : 6}
                className={cn(
                  "transition-colors",
                  compromised || stolen
                    ? "fill-danger/20"
                    : id === "gateway"
                      ? "fill-pen/15"
                      : "fill-paper-raised",
                )}
              />
              <path
                d={sketchRect(node.x - node.w / 2, node.y - node.h / 2, node.w, node.h, {
                  seed: index + 30,
                  bow: 1.4,
                })}
                fill="none"
                strokeWidth={1.8}
                className={compromised || stolen ? "stroke-danger" : "stroke-ink"}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-ink text-[12.5px] font-semibold"
              >
                {node.label}
              </text>
              {/* Sidecar proxy */}
              {mesh && isService && (
                <g>
                  <rect
                    x={node.x + node.w / 2 - 10}
                    y={node.y - node.h / 2 - 9}
                    width={22}
                    height={14}
                    rx={4}
                    strokeWidth={1.4}
                    className="fill-ok/25 stroke-ok"
                  />
                  <text
                    x={node.x + node.w / 2 + 1}
                    y={node.y - node.h / 2 - 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-ink text-[8px] font-bold"
                  >
                    proxy
                  </text>
                </g>
              )}
              {compromised && (
                <text
                  x={node.x}
                  y={node.y + node.h / 2 + 13}
                  textAnchor="middle"
                  className="fill-danger font-hand text-[15px] font-bold"
                >
                  intruder!
                </text>
              )}
              {stolen && (
                <text
                  x={node.x + node.w / 2 + 6}
                  y={node.y + 4}
                  className="fill-danger font-hand text-[15px] font-bold"
                >
                  data stolen
                </text>
              )}
            </g>
          );
        })}
        {attackBlocked && (
          <text
            x={NODES.db.x + 62}
            y={NODES.db.y - 22}
            className="fill-danger font-hand text-[15px] font-bold"
          >
            denied
          </text>
        )}
      </svg>

      <div className="rounded-xl border-2 border-dashed border-rule px-4 py-3">
        <p aria-live="polite" className="font-hand text-[1.4rem] leading-snug text-pen">
          {note}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          East-west calls encrypted: {mesh ? EAST_WEST_CALLS : 0} of {EAST_WEST_CALLS} · traced:{" "}
          {mesh ? EAST_WEST_CALLS : 0} of {EAST_WEST_CALLS}
        </p>
      </div>
    </div>
  );
}
