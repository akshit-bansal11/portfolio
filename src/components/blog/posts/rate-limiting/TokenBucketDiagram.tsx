/*
 * TokenBucketDiagram.tsx
 * The token bucket as a water tank: a tap refills tokens at a
 * steady rate, the tank holds at most `capacity`, overflow is
 * wasted, and every request must take one token to get in.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchLine } from "@/lib/blog/sketch";

const TOKENS = [
  { x: 168, y: 150 },
  { x: 192, y: 150 },
  { x: 216, y: 150 },
  { x: 180, y: 128 },
  { x: 204, y: 128 },
];

const TAKE = sketchArrow(244, 140, 320, 140, { seed: 3, curve: -0.15, headSize: 8 });
const OVERFLOW = sketchArrow(146, 74, 104, 112, { seed: 4, curve: 0.3, headSize: 7 });

export default function TokenBucketDiagram() {
  return (
    <svg
      viewBox="0 0 400 190"
      role="img"
      aria-label="A tap drips tokens into a tank at a steady rate, for example two per second. The tank holds at most five tokens; extra tokens spill over and are lost. Each request takes one token from the tank. With no tokens left, requests are rejected."
      className="w-full"
    >
      {/* Tap */}
      <path
        d="M150 20 H200 V36"
        fill="none"
        strokeWidth={6}
        strokeLinecap="round"
        className="stroke-ink-muted"
      />
      <circle cx={200} cy={52} r={5} className="fill-pen" />
      <circle cx={200} cy={72} r={5} className="fill-pen opacity-60" />
      <text x={212} y={30} className="fill-pen font-hand text-[16px]">
        refills 2 tokens/second
      </text>

      {/* Tank */}
      <path
        d={`${sketchLine(150, 86, 152, 168, { seed: 1 })} ${sketchLine(152, 168, 236, 168, { seed: 2 })} ${sketchLine(236, 168, 234, 86, { seed: 3 })}`}
        fill="none"
        strokeWidth={2.2}
        className="stroke-ink"
      />
      <text x={192} y={184} textAnchor="middle" className="fill-ink text-[11px] font-semibold">
        capacity: 5 tokens (the burst)
      </text>
      {TOKENS.map((token) => (
        <circle
          key={`${token.x}-${token.y}`}
          cx={token.x}
          cy={token.y}
          r={9}
          className="fill-pen"
        />
      ))}

      <g className="text-ink-muted">
        <DrawnPath d={OVERFLOW.shaft} strokeWidth={1.6} delay={0.4} />
        <DrawnPath d={OVERFLOW.head} strokeWidth={1.6} delay={1.3} duration={0.15} />
        <text x={16} y={128} className="fill-ink-muted font-hand text-[15px]">
          full? extra tokens
        </text>
        <text x={16} y={144} className="fill-ink-muted font-hand text-[15px]">
          spill away
        </text>
      </g>
      <g className="text-ok">
        <DrawnPath d={TAKE.shaft} strokeWidth={2.2} delay={0.8} />
        <DrawnPath d={TAKE.head} strokeWidth={2.2} delay={1.7} duration={0.15} />
        <text x={330} y={136} className="fill-ok font-hand text-[15px]">
          1 request
        </text>
        <text x={330} y={152} className="fill-ok font-hand text-[15px]">
          = 1 token
        </text>
      </g>
    </svg>
  );
}
