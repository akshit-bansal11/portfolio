/*
 * CircuitBreakerDiagram.tsx
 * The circuit breaker pattern as three states with the
 * transitions between them: closed (calls flow), open (fail
 * fast), half-open (let one test call through).
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchEllipse } from "@/lib/blog/sketch";

const STATES = [
  { id: "closed", x: 70, y: 70, title: "Closed", sub: "calls go through", tone: "ok" },
  { id: "open", x: 330, y: 70, title: "Open", sub: "fail fast, no calls", tone: "danger" },
  { id: "half", x: 200, y: 196, title: "Half-open", sub: "try one call", tone: "warn" },
] as const;

const TONE_CLASS = { ok: "stroke-ok", danger: "stroke-danger", warn: "stroke-warn" } as const;

const TRANSITIONS = [
  {
    arrow: sketchArrow(122, 56, 278, 56, { seed: 1, curve: -0.12 }),
    label: "too many failures",
    x: 200,
    y: 26,
  },
  {
    arrow: sketchArrow(318, 108, 252, 176, { seed: 2, curve: -0.15 }),
    label: "after a cool-down",
    x: 396,
    y: 150,
  },
  {
    arrow: sketchArrow(148, 176, 82, 108, { seed: 3, curve: -0.15 }),
    label: "test call worked",
    x: 4,
    y: 160,
  },
  {
    arrow: sketchArrow(246, 182, 300, 108, { seed: 4, curve: -0.25 }),
    label: "test call failed",
    x: 250,
    y: 236,
  },
];

export default function CircuitBreakerDiagram() {
  return (
    <svg
      viewBox="0 0 400 250"
      role="img"
      aria-label="Circuit breaker states. Closed: calls go through. Too many failures move it to Open, where calls fail fast. After a cool-down it becomes Half-open and lets one test call through. If that works it closes again; if it fails it opens again."
      className="w-full"
    >
      {STATES.map((state, index) => (
        <g key={state.id}>
          <path
            d={sketchEllipse(state.x, state.y, 62, 34, { seed: index + 5, jitter: 0.03 })}
            fill="none"
            strokeWidth={2.2}
            className={TONE_CLASS[state.tone]}
          />
          <text
            x={state.x}
            y={state.y - 3}
            textAnchor="middle"
            className="fill-ink text-[14px] font-bold"
          >
            {state.title}
          </text>
          <text
            x={state.x}
            y={state.y + 14}
            textAnchor="middle"
            className="fill-ink-muted text-[11px]"
          >
            {state.sub}
          </text>
        </g>
      ))}
      {TRANSITIONS.map((transition, index) => (
        <g key={transition.label} className="text-pen">
          <DrawnPath d={transition.arrow.shaft} delay={index * 0.5} duration={0.5} />
          <DrawnPath d={transition.arrow.head} delay={index * 0.5 + 0.5} duration={0.15} />
          <text
            x={transition.x}
            y={transition.y}
            textAnchor={transition.x > 300 ? "end" : "start"}
            className="fill-pen font-hand text-[16px]"
          >
            {transition.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
