/*
 * BouncerDiagram.tsx
 * "What it is" diagram: a line of requests, a bouncer (the rate
 * limiter) at the door, the server inside. Some requests get
 * in; the rest are turned away with a 429.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

const QUEUE = [
  { x: 20, ok: false },
  { x: 48, ok: false },
  { x: 76, ok: true },
  { x: 104, ok: true },
  { x: 132, ok: true },
];

const IN_ARROW = sketchArrow(190, 92, 262, 92, { seed: 2, curve: 0.05 });
const OUT_ARROW = sketchArrow(176, 118, 120, 176, { seed: 3, curve: -0.2 });

// A little stick-figure "request".
function Person({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  return (
    <g className={cn(ok ? "text-ink" : "text-danger")}>
      <circle cx={x} cy={y - 18} r={6} fill="none" stroke="currentColor" strokeWidth={1.8} />
      <path
        d={`M${x} ${y - 12} V${y + 4} M${x - 8} ${y - 6} H${x + 8} M${x} ${y + 4} L${x - 6} ${y + 16} M${x} ${y + 4} L${x + 6} ${y + 16}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </g>
  );
}

export default function BouncerDiagram() {
  return (
    <svg
      viewBox="0 0 400 210"
      role="img"
      aria-label="A queue of requests waits at a door. The rate limiter, drawn as a bouncer, lets a steady number into the server and turns the extras away with a 429 Too Many Requests response."
      className="w-full"
    >
      {QUEUE.map((person) => (
        <Person key={person.x} x={person.x} y={92} ok={person.ok} />
      ))}
      <text x={76} y={128} textAnchor="middle" className="fill-ink-muted font-hand text-[15px]">
        requests
      </text>

      {/* Bouncer */}
      <rect
        x={160}
        y={52}
        width={30}
        height={70}
        rx={8}
        className="fill-pen/20 stroke-pen"
        strokeWidth={2}
      />
      <text x={175} y={44} textAnchor="middle" className="fill-pen font-hand text-[16px] font-bold">
        rate limiter
      </text>

      {/* Server */}
      <path
        d={sketchRect(270, 40, 118, 106, { seed: 4 })}
        fill="none"
        strokeWidth={2}
        className="stroke-ink"
      />
      <text
        x={329}
        y={92}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[14px] font-bold"
      >
        your server
      </text>
      <text x={329} y={110} textAnchor="middle" className="fill-ink-muted text-[11px]">
        stays healthy
      </text>

      <g className="text-ok">
        <DrawnPath d={IN_ARROW.shaft} strokeWidth={2.2} />
        <DrawnPath d={IN_ARROW.head} strokeWidth={2.2} delay={0.9} duration={0.15} />
        <text x={226} y={80} textAnchor="middle" className="fill-ok font-hand text-[15px]">
          200 OK
        </text>
      </g>
      <g className="text-danger">
        <DrawnPath d={OUT_ARROW.shaft} strokeWidth={2.2} delay={0.5} />
        <DrawnPath d={OUT_ARROW.head} strokeWidth={2.2} delay={1.4} duration={0.15} />
        <text x={200} y={200} textAnchor="middle" className="fill-danger font-hand text-[16px]">
          429 Too Many Requests · Retry-After: 2
        </text>
      </g>
    </svg>
  );
}
