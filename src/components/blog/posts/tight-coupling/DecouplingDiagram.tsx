/*
 * DecouplingDiagram.tsx
 * "How it works" diagram: three ways Checkout can talk to
 * Inventory, from tightest to loosest:
 *   1. reaching into its internals,
 *   2. calling a small interface,
 *   3. dropping a message in a queue.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchLine, sketchRect } from "@/lib/blog/sketch";

interface Step {
  title: string;
  note: string;
  description: string;
}

const STEPS: Step[] = [
  {
    title: "1 · Reach inside",
    note: "knows the table names!",
    description:
      "Checkout's arrow goes straight through Inventory's wall and touches its private database table.",
  },
  {
    title: "2 · Call an interface",
    note: "only knows reserve()",
    description:
      "Checkout's arrow stops at a small door on Inventory's wall labelled reserve. The internals stay hidden.",
  },
  {
    title: "3 · Leave a message",
    note: "doesn't even wait",
    description:
      "Checkout drops a message into a queue between them. Inventory picks it up whenever it is ready.",
  },
];

// Shared frame: Checkout on the left, Inventory (with visible guts) on the right.
function Frame({ index }: { index: number }) {
  const seed = index * 10 + 1;
  return (
    <>
      <path
        d={sketchRect(8, 34, 92, 46, { seed })}
        fill="none"
        strokeWidth={1.8}
        className="stroke-ink"
      />
      <text x={54} y={62} textAnchor="middle" className="fill-ink text-[13px] font-semibold">
        Checkout
      </text>
      <path
        d={sketchRect(282, 22, 110, 70, { seed: seed + 1 })}
        fill="none"
        strokeWidth={1.8}
        className="stroke-ink"
      />
      <text x={337} y={16} textAnchor="middle" className="fill-ink text-[13px] font-semibold">
        Inventory
      </text>
      {/* Internals: a little table and some gears-ish scribbles */}
      <path
        d={sketchRect(300, 40, 46, 34, { seed: seed + 2, bow: 1 })}
        fill="none"
        strokeWidth={1.2}
        className="stroke-ink-muted"
      />
      <path
        d={sketchLine(300, 52, 346, 52, { seed: seed + 3 })}
        fill="none"
        strokeWidth={1}
        className="stroke-ink-muted"
      />
      <path
        d={sketchLine(300, 63, 346, 63, { seed: seed + 4 })}
        fill="none"
        strokeWidth={1}
        className="stroke-ink-muted"
      />
      <circle cx={370} cy={58} r={8} fill="none" strokeWidth={1.2} className="stroke-ink-muted" />
    </>
  );
}

function StepSvg({ step, index }: { step: Step; index: number }) {
  const arrow =
    index === 0
      ? sketchArrow(102, 57, 318, 58, { seed: 71, curve: 0.04 })
      : index === 1
        ? sketchArrow(102, 57, 276, 57, { seed: 72, curve: 0.03 })
        : sketchArrow(102, 57, 160, 57, { seed: 73, curve: 0.02 });

  return (
    <svg
      viewBox="0 0 400 112"
      role="img"
      aria-label={`${step.title}. ${step.description}`}
      className="w-full"
    >
      <Frame index={index} />

      {index === 1 && (
        <g>
          <rect x={274} y={48} width={12} height={18} className="fill-ink" />
          <text x={262} y={44} textAnchor="end" className="fill-ink-muted font-mono text-[11px]">
            reserve()
          </text>
        </g>
      )}

      {index === 2 && (
        <g>
          <path
            d={sketchRect(168, 44, 76, 26, { seed: 81, bow: 1 })}
            fill="none"
            strokeWidth={1.6}
            className="stroke-pen-blue"
          />
          {[180, 198, 216].map((x) => (
            <rect key={x} x={x} y={50} width={12} height={14} rx={2} className="fill-pen-blue/60" />
          ))}
          <text x={206} y={86} textAnchor="middle" className="fill-pen-blue font-hand text-[15px]">
            queue
          </text>
          <path
            d={sketchArrow(246, 57, 278, 57, { seed: 82, curve: 0.02 }).shaft}
            fill="none"
            strokeWidth={1.6}
            strokeDasharray="4 3"
            className="stroke-pen-blue"
          />
          <path
            d={sketchArrow(246, 57, 278, 57, { seed: 82, curve: 0.02 }).head}
            fill="none"
            strokeWidth={1.6}
            className="stroke-pen-blue"
          />
        </g>
      )}

      <g className={index === 0 ? "text-danger" : "text-ink"}>
        <DrawnPath d={arrow.shaft} strokeWidth={2.2} duration={0.7} />
        <DrawnPath d={arrow.head} strokeWidth={2.2} delay={0.7} duration={0.2} />
      </g>

      <text
        x={index === 2 ? 120 : 140}
        y={index === 1 ? 84 : 100}
        className="fill-pen font-hand text-[17px]"
      >
        {step.note}
      </text>
    </svg>
  );
}

export default function DecouplingDiagram() {
  return (
    <div className="mx-auto max-w-xl space-y-3">
      {STEPS.map((step, index) => (
        <div
          key={step.title}
          className="rounded-xl border-2 border-dashed border-rule bg-paper-raised px-3 pt-2 pb-1"
        >
          <p className="text-sm font-semibold text-ink">{step.title}</p>
          <StepSvg step={step} index={index} />
        </div>
      ))}
    </div>
  );
}
