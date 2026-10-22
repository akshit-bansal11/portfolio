/*
 * ShipDiagram.tsx
 * History diagram: a ship split into watertight compartments.
 * The bow compartments flood, and because the walls between
 * compartments stop below the top deck, water spills over
 * into the next one, like the Titanic in 1912.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchLine } from "@/lib/blog/sketch";

// Hull outline (stern on the left, bow on the right).
const HULL = "M14 70 L392 70 Q386 128 352 146 L54 146 Q22 132 14 70 Z";
const WATERLINE = sketchLine(0, 104, 420, 104, { seed: 3, bow: 3 });
const BULKHEADS = [64, 108, 152, 196, 240, 284, 318, 350];
const FLOODED_FROM = 240;
const SPILL = sketchArrow(256, 84, 228, 112, { seed: 7, curve: -0.6, headSize: 6 });

export default function ShipDiagram() {
  return (
    <svg
      viewBox="0 0 420 206"
      role="img"
      aria-label="Side view of a ship split into watertight compartments. The front compartments are flooded. The walls between compartments stop below the top deck, so water spills over the top of one wall into the next compartment."
      className="w-full"
    >
      {/* Sea */}
      <path d={`${WATERLINE} L420 196 L0 196 Z`} className="fill-pen-blue/10" />
      <path d={WATERLINE} fill="none" strokeWidth={1.5} className="stroke-pen-blue" />

      {/* Flooded compartments at the bow */}
      <clipPath id="ship-hull">
        <path d={HULL} />
      </clipPath>
      <g clipPath="url(#ship-hull)">
        <rect x={FLOODED_FROM} y={92} width={180} height={60} className="fill-pen-blue/40" />
        <rect x={196} y={124} width={44} height={30} className="fill-pen-blue/30" />
      </g>

      <path d={HULL} fill="none" strokeWidth={2} className="stroke-ink" />
      <path
        d={sketchLine(14, 70, 392, 70, { seed: 9 })}
        fill="none"
        strokeWidth={2}
        className="stroke-ink"
      />
      <text x={30} y={62} className="fill-ink-muted font-hand text-[14px]">
        stern
      </text>
      <text x={360} y={62} className="fill-ink-muted font-hand text-[14px]">
        bow
      </text>

      {/* Bulkheads stop short of the deck */}
      {BULKHEADS.map((x, index) => (
        <path
          key={x}
          d={sketchLine(x, 146, x, 86, { seed: index + 30, bow: 0.6 })}
          fill="none"
          strokeWidth={2}
          className="stroke-ink"
        />
      ))}

      {/* Annotations */}
      <g className="text-pen">
        <DrawnPath d={SPILL.shaft} delay={0.4} duration={0.6} />
        <DrawnPath d={SPILL.head} delay={1} duration={0.2} />
      </g>
      <text x={150} y={182} className="fill-pen font-hand text-[16px]">
        walls stopped below the deck,
      </text>
      <text x={150} y={196} className="fill-pen font-hand text-[16px]">
        so water spilled over the top
      </text>
      <text x={170} y={30} className="fill-pen-blue font-hand text-[16px]">
        iceberg damage: front compartments
      </text>
    </svg>
  );
}
