/*
 * WindowBoundaryDiagram.tsx
 * The fixed-window flaw: with "5 per minute", a client can send
 * 5 requests at the very end of one minute and 5 more at the
 * very start of the next, so 10 get through in a few seconds.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchEllipse, sketchLine } from "@/lib/blog/sketch";

const LATE = [150, 158, 166, 174, 182];
const EARLY = [214, 222, 230, 238, 246];

export default function WindowBoundaryDiagram() {
  return (
    <svg
      viewBox="0 0 400 150"
      role="img"
      aria-label="Two one-minute windows side by side, each with a limit of 5. Five requests arrive at the very end of the first minute and five at the very start of the second. Each window sees only 5, so all 10 are allowed within a few seconds."
      className="w-full"
    >
      <path
        d={sketchLine(20, 90, 380, 90, { seed: 1 })}
        fill="none"
        strokeWidth={1.8}
        className="stroke-ink"
      />
      <path
        d={sketchLine(200, 40, 200, 110, { seed: 2 })}
        fill="none"
        strokeWidth={1.6}
        strokeDasharray="5 4"
        className="stroke-ink-muted"
      />
      <text x={110} y={118} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
        minute 1 · limit 5
      </text>
      <text x={290} y={118} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
        minute 2 · limit 5
      </text>
      <text x={200} y={34} textAnchor="middle" className="fill-ink-muted font-hand text-[14px]">
        counter resets here
      </text>

      {[...LATE, ...EARLY].map((x) => (
        <circle key={x} cx={x} cy={78} r={5} className="fill-ok" />
      ))}

      <g className="text-danger">
        <DrawnPath d={sketchEllipse(198, 78, 60, 18, { seed: 5 })} strokeWidth={2} delay={0.3} />
      </g>
      <text x={200} y={144} textAnchor="middle" className="fill-danger font-hand text-[17px]">
        10 requests in ~4 seconds, all allowed
      </text>
    </svg>
  );
}
