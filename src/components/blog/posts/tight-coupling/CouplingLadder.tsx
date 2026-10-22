/*
 * CouplingLadder.tsx
 * The classic "types of coupling" ranking from structured
 * design, drawn as a ladder from tightest (top) to loosest
 * (bottom), each rung with plain English, an everyday
 * comparison and a tiny code example.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

interface Rung {
  name: string;
  plain: string;
  everyday: string;
  code: string;
}

const RUNGS: Rung[] = [
  {
    name: "Content coupling",
    plain: "One module reaches inside another and reads or changes its private parts.",
    everyday: "a flatmate rummaging through your bag",
    code: "order._items.push(freeGift)",
  },
  {
    name: "Common coupling",
    plain: "Several modules read and write the same global data.",
    everyday: "one office whiteboard that everyone erases",
    code: "globalConfig.taxRate = 0.18",
  },
  {
    name: "External coupling",
    plain: "Modules share a format, protocol or device that someone outside imposed.",
    everyday: "every gadget forced onto the same odd plug",
    code: 'parseVendorCsv(file) // column 7 = "price"',
  },
  {
    name: "Control coupling",
    plain: "One module passes a flag that tells another what to do inside.",
    everyday: "a back-seat driver",
    code: "render(page, true, false, LEGACY)",
  },
  {
    name: "Stamp coupling",
    plain: "Passing a whole data structure when only a piece is needed.",
    everyday: "handing over your wallet to show your ID",
    code: "sendReceipt(user) // only needs email",
  },
  {
    name: "Data coupling",
    plain: "Passing only the simple values that are actually needed.",
    everyday: "just showing the ID card",
    code: "sendReceipt(email, orderId)",
  },
  {
    name: "Message coupling",
    plain: "Modules only exchange messages; no shared state, no direct calls.",
    everyday: "a note pinned on the noticeboard",
    code: 'bus.publish({ type: "OrderPlaced", orderId })',
  },
];

const SIDE_ARROW = sketchArrow(14, 8, 18, 392, { seed: 17, curve: 0.04, headSize: 10 });

export default function CouplingLadder({ className }: { className?: string }) {
  return (
    <div className={cn("relative pl-10 sm:pl-14", className)}>
      {/* Tighter -> looser arrow down the left side */}
      <svg
        aria-hidden
        viewBox="0 0 30 400"
        preserveAspectRatio="none"
        className="absolute top-2 bottom-2 left-0 h-[calc(100%-1rem)] w-6 text-pen sm:w-8"
      >
        <DrawnPath d={SIDE_ARROW.shaft} strokeWidth={2.5} duration={1.4} />
        <DrawnPath d={SIDE_ARROW.head} strokeWidth={2.5} delay={1.4} duration={0.25} />
      </svg>
      <p className="mb-3 font-hand text-xl text-danger">tighter (avoid)</p>

      <ol className="space-y-3">
        {RUNGS.map((rung, index) => (
          <li
            key={rung.name}
            className={cn(
              "rounded-xl border-2 bg-paper-raised p-4",
              index < 3 ? "border-danger/50" : index < 5 ? "border-warn/60" : "border-ok/60",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="font-bold text-ink">
                <span aria-hidden className="mr-2 font-hand text-lg text-ink-muted">
                  {index + 1}.
                </span>
                {rung.name}
              </p>
              <p className="font-hand text-lg leading-tight text-pen">≈ {rung.everyday}</p>
            </div>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink">{rung.plain}</p>
            <code className="mt-2 block overflow-x-auto rounded-md border border-rule bg-paper px-2 py-1 font-mono text-[0.8rem] text-ink">
              {rung.code}
            </code>
          </li>
        ))}
      </ol>

      <p className="mt-3 font-hand text-xl text-ok">looser (aim here)</p>
    </div>
  );
}
