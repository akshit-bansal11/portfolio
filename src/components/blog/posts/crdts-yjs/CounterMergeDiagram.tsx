/*
 * CounterMergeDiagram.tsx
 * A state-based CRDT in one picture: a "grow-only counter".
 * Each replica keeps one slot per replica and only ever bumps
 * its own. Merging takes the max of each slot, so merges can
 * happen in any order, any number of times, and still agree.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchRect } from "@/lib/blog/sketch";

interface Replica {
  label: string;
  x: number;
  y: number;
  slots: [number, number, number];
  highlight?: number;
}

const REPLICAS: Replica[] = [
  { label: "phone A", x: 14, y: 20, slots: [3, 0, 1], highlight: 0 },
  { label: "phone B", x: 14, y: 110, slots: [1, 2, 0], highlight: 1 },
  { label: "merged (max of each slot)", x: 240, y: 64, slots: [3, 2, 1] },
];

const ARROW_A = sketchArrow(160, 44, 236, 82, { seed: 1, curve: -0.1 });
const ARROW_B = sketchArrow(160, 134, 236, 100, { seed: 2, curve: 0.1 });

function ReplicaBox({ replica, seed }: { replica: Replica; seed: number }) {
  const total = replica.slots.reduce((sum, value) => sum + value, 0);
  return (
    <g>
      <text x={replica.x} y={replica.y - 6} className="fill-ink text-[11px] font-bold">
        {replica.label}
      </text>
      <path
        d={sketchRect(replica.x, replica.y, 144, 46, { seed })}
        fill="none"
        strokeWidth={1.6}
        className="stroke-ink"
      />
      {replica.slots.map((value, index) => (
        <g key={index}>
          <rect
            x={replica.x + 8 + index * 34}
            y={replica.y + 8}
            width={28}
            height={30}
            rx={4}
            className={
              index === replica.highlight ? "fill-pen/25 stroke-pen" : "fill-paper stroke-ink-muted"
            }
            strokeWidth={1.4}
          />
          <text
            x={replica.x + 22 + index * 34}
            y={replica.y + 23}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink text-[14px] font-bold"
          >
            {value}
          </text>
          <text
            x={replica.x + 22 + index * 34}
            y={replica.y + 58}
            textAnchor="middle"
            className="fill-ink-muted text-[9px]"
          >
            {["A", "B", "C"][index]}
          </text>
        </g>
      ))}
      <text
        x={replica.x + 112}
        y={replica.y + 28}
        className="fill-pen font-hand text-[17px] font-bold"
      >
        ={total}
      </text>
    </g>
  );
}

export default function CounterMergeDiagram() {
  return (
    <svg
      viewBox="0 0 400 190"
      role="img"
      aria-label="Two replicas of a grow-only counter, each with slots for A, B and C. Phone A has 3, 0, 1 and phone B has 1, 2, 0. Merging takes the maximum of each slot, giving 3, 2, 1, a total of 6, no matter which order the merges happen in."
      className="w-full"
    >
      {REPLICAS.map((replica, index) => (
        <ReplicaBox key={replica.label} replica={replica} seed={index + 3} />
      ))}
      <g className="text-pen">
        <DrawnPath d={ARROW_A.shaft} strokeWidth={1.8} />
        <DrawnPath d={ARROW_A.head} strokeWidth={1.8} delay={0.9} duration={0.15} />
        <DrawnPath d={ARROW_B.shaft} strokeWidth={1.8} delay={0.4} />
        <DrawnPath d={ARROW_B.head} strokeWidth={1.8} delay={1.3} duration={0.15} />
      </g>
      <text x={240} y={148} className="fill-pen font-hand text-[15px]">
        merge in any order,
      </text>
      <text x={240} y={164} className="fill-pen font-hand text-[15px]">
        any number of times:
      </text>
      <text x={240} y={180} className="fill-pen font-hand text-[15px]">
        same answer
      </text>
    </svg>
  );
}
