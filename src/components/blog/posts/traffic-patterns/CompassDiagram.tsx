/*
 * CompassDiagram.tsx
 * "What it is" diagram: the internet drawn at the top, a data
 * centre below. Traffic crossing the wall runs north-south;
 * traffic between services inside runs east-west.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchLine, sketchRect } from "@/lib/blog/sketch";

const SERVICES = [
  { label: "Web", x: 70 },
  { label: "Orders", x: 200 },
  { label: "Payments", x: 330 },
];

const NS_DOWN = sketchArrow(186, 52, 186, 118, { seed: 2, curve: 0.04, headSize: 8 });
const NS_UP = sketchArrow(214, 118, 214, 52, { seed: 3, curve: 0.04, headSize: 8 });
const EW_1 = sketchArrow(112, 156, 156, 156, { seed: 4, curve: 0.05, headSize: 7 });
const EW_2 = sketchArrow(244, 156, 286, 156, { seed: 5, curve: 0.05, headSize: 7 });
const EW_3 = sketchArrow(290, 178, 112, 178, { seed: 6, curve: -0.12, headSize: 7 });

export default function CompassDiagram() {
  return (
    <svg
      viewBox="0 0 400 240"
      role="img"
      aria-label="The internet sits at the top, the data centre below. Arrows crossing between them, up and down, are north-south traffic. Arrows between services inside the data centre, left and right, are east-west traffic."
      className="w-full"
    >
      <path
        d={sketchRect(120, 8, 160, 34, { seed: 1 })}
        fill="none"
        strokeWidth={1.8}
        className="stroke-ink"
      />
      <text
        x={200}
        y={26}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[13px] font-semibold"
      >
        the internet (users)
      </text>

      <path
        d={sketchLine(10, 92, 390, 92, { seed: 7 })}
        fill="none"
        strokeWidth={1.5}
        strokeDasharray="6 4"
        className="stroke-ink-muted"
      />
      <text x={12} y={86} className="fill-ink-muted font-hand text-[14px]">
        the wall (your edge)
      </text>

      {SERVICES.map((service, index) => (
        <g key={service.label}>
          <path
            d={sketchRect(service.x - 42, 138, 84, 34, { seed: index + 11 })}
            fill="none"
            strokeWidth={1.8}
            className="stroke-ink"
          />
          <text
            x={service.x}
            y={155}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink text-[13px] font-semibold"
          >
            {service.label}
          </text>
        </g>
      ))}

      <g className="text-pen">
        <DrawnPath d={NS_DOWN.shaft} strokeWidth={2.4} />
        <DrawnPath d={NS_DOWN.head} strokeWidth={2.4} delay={0.9} duration={0.2} />
        <DrawnPath d={NS_UP.shaft} strokeWidth={2.4} delay={0.3} />
        <DrawnPath d={NS_UP.head} strokeWidth={2.4} delay={1.2} duration={0.2} />
        <text x={226} y={78} className="fill-pen font-hand text-[18px]">
          north-south
        </text>
      </g>
      <g className="text-pen-blue">
        <DrawnPath d={EW_1.shaft} strokeWidth={2.2} delay={1.4} duration={0.4} />
        <DrawnPath d={EW_1.head} strokeWidth={2.2} delay={1.8} duration={0.15} />
        <DrawnPath d={EW_2.shaft} strokeWidth={2.2} delay={1.6} duration={0.4} />
        <DrawnPath d={EW_2.head} strokeWidth={2.2} delay={2} duration={0.15} />
        <DrawnPath d={EW_3.shaft} strokeWidth={2.2} delay={1.8} duration={0.6} />
        <DrawnPath d={EW_3.head} strokeWidth={2.2} delay={2.4} duration={0.15} />
        <text x={200} y={222} textAnchor="middle" className="fill-pen-blue font-hand text-[18px]">
          east-west (service to service)
        </text>
      </g>
    </svg>
  );
}
