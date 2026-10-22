/*
 * OtVsCrdtDiagram.tsx
 * Side-by-side topologies: Operational Transformation needs a
 * central server to order and transform every edit; a CRDT lets
 * replicas exchange edits in any order, through a server or
 * directly, and still converge.
 */

import { sketchLine, sketchRect } from "@/lib/blog/sketch";

const OT_CLIENTS = [
  { x: 40, y: 150 },
  { x: 100, y: 170 },
  { x: 160, y: 150 },
];

const CRDT_PEERS = [
  { x: 250, y: 70 },
  { x: 360, y: 70 },
  { x: 250, y: 160 },
  { x: 360, y: 160 },
];

function Device({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x - 16}
        y={y - 12}
        width={32}
        height={24}
        rx={5}
        className="fill-paper-raised stroke-ink"
        strokeWidth={1.6}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[10px] font-bold"
      >
        {label}
      </text>
    </g>
  );
}

export default function OtVsCrdtDiagram() {
  return (
    <svg
      viewBox="0 0 400 210"
      role="img"
      aria-label="Left: operational transformation. Three clients all connect to one central server, which orders and transforms every edit. Right: CRDTs. Four peers connect to each other in a mesh; edits can travel by any path in any order and every peer ends up with the same result."
      className="w-full"
    >
      <text x={100} y={18} textAnchor="middle" className="fill-ink text-[12px] font-bold">
        OT: one referee
      </text>
      <text x={305} y={18} textAnchor="middle" className="fill-ink text-[12px] font-bold">
        CRDT: sync with anyone
      </text>
      <path
        d={sketchLine(204, 30, 204, 200, { seed: 1 })}
        fill="none"
        strokeWidth={1}
        strokeDasharray="4 4"
        className="stroke-rule"
      />

      {/* OT: star around a server */}
      <path
        d={sketchRect(48, 48, 104, 40, { seed: 2 })}
        fill="none"
        strokeWidth={2}
        className="stroke-pen"
      />
      <text x={100} y={64} textAnchor="middle" className="fill-ink text-[11px] font-bold">
        server
      </text>
      <text x={100} y={78} textAnchor="middle" className="fill-ink-muted text-[9px]">
        orders + transforms
      </text>
      {OT_CLIENTS.map((client, index) => (
        <g key={client.x}>
          <path
            d={sketchLine(client.x, client.y - 12, 100, 88, { seed: index + 5 })}
            fill="none"
            strokeWidth={1.4}
            className="stroke-ink-muted"
          />
          <Device {...client} label={`C${index + 1}`} />
        </g>
      ))}
      <text x={100} y={202} textAnchor="middle" className="fill-pen font-hand text-[14px]">
        server down = no merging
      </text>

      {/* CRDT: full mesh */}
      {CRDT_PEERS.flatMap((a, i) =>
        CRDT_PEERS.slice(i + 1).map((b, j) => (
          <path
            key={`${i}-${j}`}
            d={sketchLine(a.x, a.y, b.x, b.y, { seed: i * 4 + j + 10 })}
            fill="none"
            strokeWidth={1.2}
            className="stroke-ink-muted"
          />
        )),
      )}
      {CRDT_PEERS.map((peer, index) => (
        <Device key={`${peer.x}-${peer.y}`} {...peer} label={`P${index + 1}`} />
      ))}
      <text x={305} y={202} textAnchor="middle" className="fill-pen font-hand text-[14px]">
        any order, any path, same result
      </text>
    </svg>
  );
}
