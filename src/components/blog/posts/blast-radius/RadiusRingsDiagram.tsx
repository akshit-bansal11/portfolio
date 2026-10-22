/*
 * RadiusRingsDiagram.tsx
 * "What it is" diagram: the same bug, drawn as rings of
 * growing damage depending on how far it is allowed to reach
 * (one request -> one server -> one cell -> one region -> everyone).
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchEllipse } from "@/lib/blog/sketch";

const RINGS = [
  { label: "one request", rx: 34, ry: 22, note: "a retry fixes it" },
  { label: "one server", rx: 66, ry: 42, note: "the load balancer routes around it" },
  { label: "one cell", rx: 100, ry: 64, note: "a slice of customers notice" },
  { label: "one region", rx: 136, ry: 88, note: "a country notices" },
  { label: "everyone", rx: 172, ry: 112, note: "it's on the news" },
];

const ARROW = sketchArrow(316, 58, 266, 96, { seed: 5, curve: 0.25 });

export default function RadiusRingsDiagram() {
  return (
    <svg
      viewBox="0 0 400 250"
      role="img"
      aria-label="Five nested rings around one bug: one request, one server, one cell, one region, everyone. The wider the ring, the more people a single failure reaches."
      className="w-full"
    >
      {RINGS.map((ring, index) => (
        <g
          key={ring.label}
          className={index === RINGS.length - 1 ? "text-danger" : "text-ink-muted"}
        >
          <DrawnPath
            d={sketchEllipse(186, 132, ring.rx, ring.ry, { seed: index + 2, jitter: 0.03 })}
            strokeWidth={index === RINGS.length - 1 ? 2.2 : 1.5}
            delay={index * 0.25}
          />
          <text
            x={186}
            y={132 - ring.ry + 15}
            textAnchor="middle"
            className="fill-current font-hand text-[15px]"
          >
            {ring.label}
          </text>
        </g>
      ))}
      <circle cx={186} cy={138} r={6} className="fill-danger" />
      <text x={186} y={156} textAnchor="middle" className="fill-ink text-[11px] font-semibold">
        bug
      </text>
      <g className="text-pen">
        <DrawnPath d={ARROW.shaft} delay={1.4} duration={0.4} />
        <DrawnPath d={ARROW.head} delay={1.8} duration={0.2} />
        <text x={292} y={16} className="fill-pen font-hand text-[16px]">
          same bug,
        </text>
        <text x={292} y={32} className="fill-pen font-hand text-[16px]">
          five fates.
        </text>
        <text x={292} y={48} className="fill-pen font-hand text-[16px]">
          keep it small!
        </text>
      </g>
    </svg>
  );
}
