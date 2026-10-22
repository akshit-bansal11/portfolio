/*
 * ShuffleShardDiagram.tsx
 * Plain sharding vs shuffle sharding with 8 workers and 8
 * customers, each customer using 2 workers. One customer (X)
 * sends "poison" requests that crash whichever workers serve
 * it. With plain shards, X's shard-mate goes down with it; with
 * shuffle shards, everyone else still has a healthy worker.
 */

import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

interface Assignment {
  customer: string;
  workers: [number, number];
}

const WORKERS = 8;

// Plain: 4 fixed shards of 2 workers; customers paired onto shards.
const PLAIN: Assignment[] = [
  { customer: "X", workers: [0, 1] },
  { customer: "A", workers: [0, 1] },
  { customer: "B", workers: [2, 3] },
  { customer: "C", workers: [2, 3] },
  { customer: "D", workers: [4, 5] },
  { customer: "E", workers: [4, 5] },
  { customer: "F", workers: [6, 7] },
  { customer: "G", workers: [6, 7] },
];

// Shuffle: every customer gets its own pair; no pair is reused.
const SHUFFLE: Assignment[] = [
  { customer: "X", workers: [0, 4] },
  { customer: "A", workers: [0, 2] },
  { customer: "B", workers: [1, 4] },
  { customer: "C", workers: [2, 5] },
  { customer: "D", workers: [3, 6] },
  { customer: "E", workers: [1, 7] },
  { customer: "F", workers: [5, 7] },
  { customer: "G", workers: [3, 4] },
];

const workerX = (index: number) => 34 + index * 47;
const customerX = (index: number) => 34 + index * 47;

function Panel({ title, assignments }: { title: string; assignments: Assignment[] }) {
  const poisoned = new Set(assignments[0].workers);
  const isDown = (assignment: Assignment) =>
    assignment.workers.every((worker) => poisoned.has(worker));
  const casualties = assignments
    .slice(1)
    .filter(isDown)
    .map((assignment) => assignment.customer);

  return (
    <figure className="rounded-xl border-2 border-dashed border-rule bg-paper-raised p-3">
      <figcaption className="mb-1 text-sm font-semibold text-ink">{title}</figcaption>
      <svg
        viewBox="0 0 400 150"
        role="img"
        aria-label={`${title}. Customer X crashes workers ${[...poisoned].map((w) => w + 1).join(" and ")}. ${
          casualties.length > 0
            ? `Customer ${casualties.join(", ")} loses every worker too.`
            : "Every other customer still has a healthy worker."
        }`}
        className="w-full"
      >
        {assignments.map((assignment, index) =>
          assignment.workers.map((worker) => (
            <path
              key={`${assignment.customer}-${worker}`}
              d={sketchLine(customerX(index), 104, workerX(worker), 42, {
                seed: index * 10 + worker,
                bow: 2,
              })}
              fill="none"
              strokeWidth={index === 0 ? 2 : 1.2}
              className={index === 0 ? "stroke-danger" : "stroke-ink-muted/70"}
            />
          )),
        )}

        {Array.from({ length: WORKERS }, (_, worker) => (
          <g key={worker}>
            <rect
              x={workerX(worker) - 16}
              y={14}
              width={32}
              height={26}
              rx={4}
              strokeWidth={1.6}
              className={
                poisoned.has(worker) ? "fill-danger/25 stroke-danger" : "fill-paper stroke-ink"
              }
            />
            <text
              x={workerX(worker)}
              y={31}
              textAnchor="middle"
              className="fill-ink text-[11px] font-semibold"
            >
              W{worker + 1}
            </text>
          </g>
        ))}

        {assignments.map((assignment, index) => {
          const down = index === 0 || isDown(assignment);
          return (
            <g key={assignment.customer}>
              <circle
                cx={customerX(index)}
                cy={116}
                r={13}
                strokeWidth={1.6}
                className={cn(
                  index === 0
                    ? "fill-danger stroke-danger"
                    : down
                      ? "fill-danger/25 stroke-danger"
                      : "fill-ok/25 stroke-ok",
                )}
              />
              <text
                x={customerX(index)}
                y={120}
                textAnchor="middle"
                className={cn("text-[12px] font-bold", index === 0 ? "fill-paper" : "fill-ink")}
              >
                {assignment.customer}
              </text>
            </g>
          );
        })}

        <text x={6} y={146} className="fill-pen font-hand text-[15px]">
          {casualties.length > 0
            ? `X took ${casualties.join(", ")} down with it (shared both workers)`
            : "X hurts its own workers, but nobody else loses both"}
        </text>
      </svg>
    </figure>
  );
}

export default function ShuffleShardDiagram() {
  return (
    <div className="space-y-4">
      <Panel title="Plain sharding: fixed groups of 2 workers" assignments={PLAIN} />
      <Panel
        title="Shuffle sharding: every customer gets its own random pair"
        assignments={SHUFFLE}
      />
    </div>
  );
}
