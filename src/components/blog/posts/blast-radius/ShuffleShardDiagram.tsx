/*
 * ShuffleShardDiagram.tsx
 * Plain sharding vs shuffle sharding, side by side: 8 workers, 8 customers, 2 workers
 * each. Requests flow from every customer to its two workers. Pick the "poison"
 * customer: its requests crash both of its workers. With plain shards its shard-mate
 * loses both workers too; with shuffle shards no two customers share the same pair, so
 * everybody else keeps at least one healthy worker.
 */

"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

const CUSTOMERS = ["X", "A", "B", "C", "D", "E", "F", "G"] as const;
type Customer = (typeof CUSTOMERS)[number];
type Pair = [number, number];

// Plain: 4 fixed shards of 2 workers, two customers per shard.
const PLAIN: Pair[] = [
  [0, 1],
  [0, 1],
  [2, 3],
  [2, 3],
  [4, 5],
  [4, 5],
  [6, 7],
  [6, 7],
];

// Shuffle: every customer gets its own pair; no pair is used twice.
const SHUFFLE: Pair[] = [
  [0, 4],
  [0, 2],
  [1, 4],
  [2, 5],
  [3, 6],
  [1, 7],
  [5, 7],
  [3, 4],
];

const WORKERS = 8;
const at = (index: number) => 32 + index * 48;
const WORKER_Y = 34;
const CUSTOMER_Y = 128;

type Fate = "poison" | "down" | "degraded" | "fine";
const FATE_TONE: Record<Fate, Tone> = {
  poison: "red",
  down: "red",
  degraded: "amber",
  fine: "green",
};

function Panel({ title, pairs, poison }: { title: string; pairs: Pair[]; poison: number }) {
  const dead = new Set(pairs[poison]);
  const fates: Fate[] = pairs.map((pair, i) => {
    if (i === poison) return "poison";
    const lost = pair.filter((w) => dead.has(w)).length;
    return lost === 2 ? "down" : lost === 1 ? "degraded" : "fine";
  });
  const down = CUSTOMERS.filter((_, i) => fates[i] === "down");
  const degraded = fates.filter((f) => f === "degraded").length;
  const summary =
    down.length > 0
      ? `Customer ${down.join(", ")} lost both workers and is down too.`
      : `Nobody else is down. ${degraded} customer${degraded === 1 ? "" : "s"} lost one worker and carry on with the other.`;

  return (
    <figure
      data-tone={down.length > 0 ? "red" : "green"}
      className="min-w-0 rounded-xl border border-rule bg-paper p-3"
    >
      <figcaption className="mb-1 text-sm font-semibold text-ink">{title}</figcaption>
      <svg
        viewBox="0 0 400 164"
        role="img"
        aria-label={`${title}. Customer ${CUSTOMERS[poison]} crashes workers ${[...dead].map((w) => w + 1).join(" and ")}. ${summary}`}
        className="w-full"
      >
        {/* Requests flowing from each customer to its workers */}
        {pairs.map((pair, i) =>
          pair.map((w) => {
            const isPoison = i === poison;
            const toDead = dead.has(w);
            const tone: Tone | undefined = isPoison ? "red" : toDead ? "amber" : undefined;
            return (
              <line
                key={`${CUSTOMERS[i]}-${w}`}
                data-tone={tone}
                x1={at(i)}
                y1={CUSTOMER_Y - 14}
                x2={at(w)}
                y2={WORKER_Y + 13}
                strokeWidth={isPoison ? 2.2 : 1.3}
                className={cn(
                  styles.ease,
                  tone ? "stroke-(--tone)" : "stroke-ink-muted",
                  !toDead || isPoison ? styles.flow : "opacity-50",
                )}
                strokeDasharray={toDead && !isPoison ? "2 4" : undefined}
              />
            );
          }),
        )}

        {Array.from({ length: WORKERS }, (_, w) => {
          const crashed = dead.has(w);
          return (
            <g
              key={`${poison}-${w}`}
              data-tone={crashed ? "red" : "blue"}
              className={cn(crashed && styles.shake)}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={at(w) - 20}
                y={WORKER_Y - 13}
                width={40}
                height={26}
                rx={6}
                strokeWidth={1.4}
                className={cn(
                  styles.ease,
                  crashed
                    ? "fill-(--tone-line) stroke-(--tone)"
                    : "fill-(--tone-soft) stroke-(--tone-line)",
                )}
              />
              <text
                x={at(w)}
                y={WORKER_Y + 5}
                textAnchor="middle"
                className="fill-ink font-mono text-[14px] font-semibold"
              >
                W{w + 1}
              </text>
            </g>
          );
        })}

        {pairs.map((_, i) => {
          const fate = fates[i];
          return (
            <g key={CUSTOMERS[i]} data-tone={FATE_TONE[fate]}>
              <circle
                cx={at(i)}
                cy={CUSTOMER_Y}
                r={15}
                strokeWidth={1.5}
                className={cn(
                  styles.ease,
                  fate === "poison"
                    ? "fill-(--tone) stroke-(--tone)"
                    : "fill-(--tone-soft) stroke-(--tone)",
                )}
              />
              <text
                x={at(i)}
                y={CUSTOMER_Y + 5.5}
                textAnchor="middle"
                className={cn(
                  "text-[15px] font-bold",
                  fate === "poison" ? "fill-paper" : "fill-ink",
                )}
              >
                {CUSTOMERS[i]}
              </text>
              {(fate === "down" || fate === "poison") && (
                <text
                  x={at(i)}
                  y={CUSTOMER_Y + 31}
                  textAnchor="middle"
                  className="fill-(--tone) text-[13px] font-semibold"
                >
                  {fate === "poison" ? "poison" : "down"}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p
        aria-live="polite"
        className={cn(
          styles.ease,
          "mt-1 rounded-lg border border-(--tone-line) bg-(--tone-soft) px-3 py-2 text-sm text-ink",
        )}
      >
        {summary}
      </p>
    </figure>
  );
}

const OPTIONS = CUSTOMERS.map((c) => ({ value: c, label: c }));

export default function ShuffleShardDiagram() {
  const [poison, setPoison] = useState<Customer>("X");
  const index = CUSTOMERS.indexOf(poison);

  return (
    <div className="space-y-4">
      <SegmentedControl
        label="Who sends the poison requests?"
        options={OPTIONS}
        value={poison}
        onChange={setPoison}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Plain sharding: fixed groups of 2 workers" pairs={PLAIN} poison={index} />
        <Panel
          title="Shuffle sharding: each customer its own pair"
          pairs={SHUFFLE}
          poison={index}
        />
      </div>
    </div>
  );
}
