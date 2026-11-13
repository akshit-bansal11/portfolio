/*
 * CouplingCohesionDiagram.tsx
 * The same nine pieces of code in three modules, arranged two ways. "Tangled": every
 * module holds a bit of everything, so related code talks across every wall. "Tidy":
 * related code lives together and modules talk through one small door each. Switching
 * slides the pieces to their new homes; wires carry moving dashes. Hover a kind of code
 * to trace its wires, or click it to "change" it and see which modules must be edited.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { SegmentedControl } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

type Layout = "tangled" | "tidy";
type Kind = "user" | "payment" | "email";
type ModuleIndex = 0 | 1 | 2;

const KINDS: { id: Kind; label: string; tone: Tone }[] = [
  { id: "user", label: "User code", tone: "pink" },
  { id: "payment", label: "Payment code", tone: "blue" },
  { id: "email", label: "Email code", tone: "green" },
];

const TONE_OF: Record<Kind, Tone> = { user: "pink", payment: "blue", email: "green" };

const BOXES = [
  { x: 14, y: 14, w: 134, h: 96, label: "Module A" },
  { x: 172, y: 14, w: 134, h: 96, label: "Module B" },
  { x: 93, y: 144, w: 134, h: 96, label: "Module C" },
] as const;

// Three slots inside each module.
const SLOTS: [number, number][][] = BOXES.map((b) => [
  [b.x + 36, b.y + 44],
  [b.x + b.w - 36, b.y + 44],
  [b.x + b.w / 2, b.y + 74],
]);

interface Piece {
  id: string;
  kind: Kind;
}

const PIECES: Piece[] = (["user", "payment", "email"] as Kind[]).flatMap((kind) =>
  [1, 2, 3].map((n) => ({ id: `${kind}${n}`, kind })),
);

// Which module and slot each piece sits in, per layout.
const PLACE: Record<Layout, Record<string, [ModuleIndex, number]>> = {
  tangled: {
    user1: [0, 0],
    payment1: [0, 1],
    email1: [0, 2],
    payment2: [1, 0],
    email2: [1, 1],
    user2: [1, 2],
    email3: [2, 0],
    user3: [2, 1],
    payment3: [2, 2],
  },
  tidy: {
    user1: [0, 0],
    user2: [0, 1],
    user3: [0, 2],
    payment1: [1, 0],
    payment2: [1, 1],
    payment3: [1, 2],
    email1: [2, 0],
    email2: [2, 1],
    email3: [2, 2],
  },
};

// Every pair of same-kind pieces talks to each other.
const WIRES: [Piece, Piece][] = PIECES.flatMap((a, i) =>
  PIECES.slice(i + 1)
    .filter((b) => b.kind === a.kind)
    .map((b): [Piece, Piece] => [a, b]),
);

// The doors in the tidy layout: A and B each call C through one small interface.
const DOORS = [
  { from: [81, 110], to: [126, 144] },
  { from: [239, 110], to: [194, 144] },
] as const;

const LAYOUT_OPTIONS = [
  { value: "tangled" as const, label: "Tangled" },
  { value: "tidy" as const, label: "Tidy" },
];

function pos(layout: Layout, id: string): [number, number] {
  const [box, slot] = PLACE[layout][id];
  return SLOTS[box][slot];
}

function Shape({ kind }: { kind: Kind }) {
  if (kind === "user") return <circle r={8} />;
  if (kind === "email") return <rect x={-7.5} y={-7.5} width={15} height={15} rx={2.5} />;
  return <path d="M0 -9 L9 7 L-9 7 Z" strokeLinejoin="round" />;
}

export default function CouplingCohesionDiagram() {
  const [layout, setLayout] = useState<Layout>("tangled");
  const [hovered, setHovered] = useState<Kind | null>(null);
  const [changed, setChanged] = useState<Kind | null>(null);
  const reduced = useReducedMotion();
  const focus = hovered ?? changed;

  const crossing = WIRES.filter(
    ([a, b]) => PLACE[layout][a.id][0] !== PLACE[layout][b.id][0],
  ).length;

  const editModules = changed
    ? new Set(PIECES.filter((p) => p.kind === changed).map((p) => PLACE[layout][p.id][0]))
    : new Set<number>();

  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 120, damping: 18 };

  const status = changed
    ? layout === "tangled"
      ? `Changing ${changed} code means editing ${editModules.size} of 3 modules, and re-checking every wire that crosses a wall.`
      : `Changing ${changed} code means editing 1 module. The others only see its small door, which didn't move.`
    : layout === "tangled"
      ? "Related code is spread over all three modules, so every wire crosses a wall."
      : "Related code lives together. Modules talk only through two small doors.";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SegmentedControl
          label="Arrange the code"
          options={LAYOUT_OPTIONS}
          value={layout}
          onChange={setLayout}
        />
        <div
          data-tone={layout === "tangled" ? "red" : "green"}
          className="flex gap-4 rounded-xl border border-(--tone-line) bg-(--tone-soft) px-3 py-2 transition-colors"
        >
          <p className="text-xs leading-tight text-ink-muted">
            wires crossing a wall
            <span className="block font-mono text-xl font-bold text-(--tone)">{crossing}</span>
          </p>
          <p className="text-xs leading-tight text-ink-muted">
            doors between modules
            <span className="block font-mono text-xl font-bold text-(--tone)">
              {layout === "tidy" ? 2 : 0}
            </span>
          </p>
        </div>
      </div>

      <svg
        viewBox="0 0 320 254"
        role="img"
        aria-label={`Three modules, ${layout}. ${status}`}
        className="mx-auto w-full max-w-xl"
      >
        {/* Module walls */}
        {BOXES.map((box, i) => {
          const editing = editModules.has(i);
          return (
            <g key={box.label} data-tone={editing ? "red" : undefined}>
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx={14}
                strokeWidth={editing ? 2 : 1.2}
                className={cn(
                  "fill-paper transition-[stroke,stroke-width] duration-300",
                  editing ? "stroke-(--tone)" : "stroke-ink-muted/45",
                )}
              />
              {editing && (
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  rx={14}
                  fill="none"
                  strokeWidth={1.5}
                  className={cn("stroke-(--tone)", styles.ring)}
                />
              )}
              <text
                x={box.x + 12}
                y={box.y + 18}
                className="fill-ink-muted text-[11px] font-semibold tracking-wide"
              >
                {box.label}
              </text>
              {editing && (
                <text
                  x={box.x + box.w - 12}
                  y={box.y + 18}
                  textAnchor="end"
                  className="tut-pop fill-(--tone) font-mono text-[10px] font-bold"
                >
                  must edit
                </text>
              )}
            </g>
          );
        })}

        {/* Doors (tidy only) */}
        {layout === "tidy" && (
          <g data-tone="violet" className="tut-pop">
            {DOORS.map((door) => (
              <g key={door.from[0]}>
                <line
                  x1={door.from[0]}
                  y1={door.from[1]}
                  x2={door.to[0]}
                  y2={door.to[1]}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  className={cn("stroke-(--tone)", styles.flow)}
                />
                <rect
                  x={door.from[0] - 8}
                  y={door.from[1] - 4}
                  width={16}
                  height={8}
                  rx={2}
                  className="fill-(--tone)"
                />
                <rect
                  x={door.to[0] - 8}
                  y={door.to[1] - 4}
                  width={16}
                  height={8}
                  rx={2}
                  className="fill-(--tone)"
                />
              </g>
            ))}
          </g>
        )}

        {/* Wires between related pieces */}
        {WIRES.map(([a, b]) => {
          const [x1, y1] = pos(layout, a.id);
          const [x2, y2] = pos(layout, b.id);
          const crosses = PLACE[layout][a.id][0] !== PLACE[layout][b.id][0];
          const dim = focus !== null && focus !== a.kind;
          return (
            <motion.line
              key={`${a.id}-${b.id}`}
              data-tone={TONE_OF[a.kind]}
              initial={false}
              animate={{ x1, y1, x2, y2, opacity: dim ? 0.12 : crosses ? 0.85 : 0.55 }}
              transition={spring}
              strokeWidth={focus === a.kind ? 2.2 : 1.4}
              strokeLinecap="round"
              className={cn("stroke-(--tone)", styles.flow)}
            />
          );
        })}

        {/* Pieces */}
        {PIECES.map((piece) => {
          const [x, y] = pos(layout, piece.id);
          const dim = focus !== null && focus !== piece.kind;
          return (
            <motion.g
              key={piece.id}
              data-tone={TONE_OF[piece.kind]}
              initial={false}
              animate={{ x, y, opacity: dim ? 0.25 : 1 }}
              transition={spring}
              strokeWidth={1.5}
              className="fill-(--tone-soft) stroke-(--tone)"
            >
              <g className="fill-(--tone)" style={{ fillOpacity: 0.55 }}>
                <Shape kind={piece.kind} />
              </g>
            </motion.g>
          );
        })}
      </svg>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
          Change one kind of code:
        </span>
        {KINDS.map((kind) => (
          <button
            key={kind.id}
            type="button"
            data-tone={kind.tone}
            aria-pressed={changed === kind.id}
            onClick={() => setChanged(changed === kind.id ? null : kind.id)}
            onPointerEnter={() => setHovered(kind.id)}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setHovered(kind.id)}
            onBlur={() => setHovered(null)}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition active:translate-y-px",
              changed === kind.id
                ? "border-(--tone) bg-(--tone-soft) text-(--tone)"
                : "border-(--tone-line) text-ink hover:bg-(--tone-soft)",
            )}
          >
            <svg aria-hidden viewBox="-10 -10 20 20" className="h-4 w-4">
              <g strokeWidth={1.5} className="fill-(--tone) stroke-(--tone)" style={{ fillOpacity: 0.55 }}>
                <Shape kind={kind.id} />
              </g>
            </svg>
            {kind.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-sm leading-relaxed text-ink">
        {status}
      </p>
    </div>
  );
}
