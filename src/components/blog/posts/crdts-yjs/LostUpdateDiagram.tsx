/*
 * LostUpdateDiagram.tsx
 * Hook diagram: two phones edit the same list offline. When
 * they sync with "last write wins", the later save replaces
 * the earlier one wholesale, and one person's edit vanishes.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchLine, sketchRect } from "@/lib/blog/sketch";

const LANES = [
  { y: 50, name: "Meera (offline)", list: "milk, bread, eggs", added: "+ eggs" },
  { y: 130, name: "Kabir (offline)", list: "milk, bread, chai", added: "+ chai" },
];

const TO_SERVER_A = sketchArrow(232, 56, 300, 84, { seed: 2, curve: -0.1 });
const TO_SERVER_B = sketchArrow(232, 128, 300, 104, { seed: 3, curve: 0.1 });

export default function LostUpdateDiagram() {
  return (
    <svg
      viewBox="0 0 400 190"
      role="img"
      aria-label="Meera adds eggs and Kabir adds chai, both while offline. When they reconnect, the server keeps only whichever list was saved last. Kabir saved last, so the server's list is milk, bread, chai, and Meera's eggs are lost."
      className="w-full"
    >
      <path
        d={sketchLine(10, 176, 390, 176, { seed: 1 })}
        fill="none"
        strokeWidth={1.2}
        className="stroke-ink-muted"
      />
      <text x={390} y={170} textAnchor="end" className="fill-ink-muted font-hand text-[14px]">
        time →
      </text>

      {LANES.map((lane, index) => (
        <g key={lane.name}>
          <text x={12} y={lane.y - 18} className="fill-ink text-[12px] font-bold">
            {lane.name}
          </text>
          <path
            d={sketchRect(12, lane.y - 10, 220, 30, { seed: index + 4 })}
            fill="none"
            strokeWidth={1.6}
            className="stroke-ink"
          />
          <text x={22} y={lane.y + 5} dominantBaseline="central" className="fill-ink text-[12px]">
            {lane.list}
          </text>
          <text
            x={176}
            y={lane.y + 5}
            dominantBaseline="central"
            className="fill-ok font-hand text-[15px] font-bold"
          >
            {lane.added}
          </text>
        </g>
      ))}

      <path
        d={sketchRect(294, 74, 102, 40, { seed: 9 })}
        fill="none"
        strokeWidth={1.8}
        className="stroke-ink"
      />
      <text x={346} y={88} textAnchor="middle" className="fill-ink text-[11px] font-bold">
        server (LWW)
      </text>
      <text x={346} y={104} textAnchor="middle" className="fill-ink text-[11px]">
        milk, bread, chai
      </text>

      <g className="text-ink-muted">
        <DrawnPath d={TO_SERVER_A.shaft} strokeWidth={1.6} />
        <DrawnPath d={TO_SERVER_A.head} strokeWidth={1.6} delay={0.9} duration={0.15} />
        <DrawnPath d={TO_SERVER_B.shaft} strokeWidth={1.6} delay={0.5} />
        <DrawnPath d={TO_SERVER_B.head} strokeWidth={1.6} delay={1.4} duration={0.15} />
      </g>
      <text x={244} y={52} className="fill-ink-muted font-hand text-[13px]">
        saved 10:02
      </text>
      <text x={244} y={156} className="fill-ink-muted font-hand text-[13px]">
        saved 10:03 (wins)
      </text>
      <text x={300} y={132} className="fill-danger font-hand text-[17px] font-bold">
        eggs: gone
      </text>
    </svg>
  );
}
