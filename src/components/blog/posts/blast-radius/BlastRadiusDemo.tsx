/*
 * BlastRadiusDemo.tsx
 * Main Blast Radius demo. 48 customers are split across N cells (N = 1 is a plain
 * monolith). Requests flow from the router into every healthy cell. Drag the failure
 * token onto a cell, or tap / focus a cell and press Enter, and a shockwave spreads
 * through every customer that cell serves, dot by dot. A switch makes all cells share
 * one database, to show how a single shared dependency quietly undoes the isolation.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useId,
  useRef,
  useState,
} from "react";
import { DemoButton, DemoSlider, DemoToggle } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

const CUSTOMERS = 48;
const WIDTH = 360;
const PAD = 10;
const GAP = 10;
const DOT_GAP = 13;
const TOP = 70;
const TRAY = { x: 322, y: 30 };

interface CellBox {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  customers: number[];
}

// Lays out N cells in a grid and assigns customers round-robin.
function layoutCells(count: number): { cells: CellBox[]; height: number } {
  const cols = count === 1 ? 1 : count <= 4 ? 2 : count <= 9 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  const w = (WIDTH - PAD * 2 - GAP * (cols - 1)) / cols;
  const perCell = Math.ceil(CUSTOMERS / count);
  const dotCols = Math.max(1, Math.floor((w - 14) / DOT_GAP));
  const h = Math.ceil(perCell / dotCols) * DOT_GAP + 30;

  const cells: CellBox[] = Array.from({ length: count }, (_, index) => ({
    index,
    x: PAD + (index % cols) * (w + GAP),
    y: TOP + Math.floor(index / cols) * (h + GAP),
    w,
    h,
    customers: Array.from({ length: CUSTOMERS }, (_, c) => c).filter((c) => c % count === index),
  }));

  return { cells, height: TOP + rows * (h + GAP) + 54 };
}

// Position of the k-th customer dot inside its cell.
function dotPosition(cell: CellBox, k: number) {
  const dotCols = Math.max(1, Math.floor((cell.w - 14) / DOT_GAP));
  return {
    x: cell.x + 13 + (k % dotCols) * DOT_GAP,
    y: cell.y + 30 + Math.floor(k / dotCols) * DOT_GAP,
  };
}

// Eight-point star used as the failure token.
const BLAST_SHAPE = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const radius = i % 2 === 0 ? 16 : 8;
  return `${(Math.cos(angle) * radius).toFixed(1)},${(Math.sin(angle) * radius).toFixed(1)}`;
}).join(" ");

interface Failure {
  cell: number;
  x: number;
  y: number;
}

export default function BlastRadiusDemo() {
  const [cellCount, setCellCount] = useState(1);
  const [sharedDatabase, setSharedDatabase] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const clipPrefix = useId();

  const layout = layoutCells(cellCount);
  const { cells } = layout;
  // Room for the shared database only when it is switched on.
  const height = sharedDatabase ? layout.height : layout.height - 44;
  const dbY = layout.height - 30;
  const routerY = 42;

  // Which cells are hit: just the one, or all of them through the shared database.
  const isCellHit = (index: number) =>
    failure !== null && (sharedDatabase || failure.cell === index);
  const hitCustomers = cells
    .filter((cell) => isCellHit(cell.index))
    .reduce((sum, cell) => sum + cell.customers.length, 0);
  const percent = Math.round((hitCustomers / CUSTOMERS) * 100);

  // Converts a pointer position to SVG coordinates.
  const toSvgPoint = (event: PointerEvent<SVGElement>) => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  };

  const cellAt = (x: number, y: number) =>
    cells.find(
      (cell) => x >= cell.x && x <= cell.x + cell.w && y >= cell.y && y <= cell.y + cell.h,
    );

  const dropOn = (cell: CellBox, x = cell.x + cell.w / 2, y = cell.y + cell.h / 2) =>
    setFailure({ cell: cell.index, x, y });

  const onPointerDown = (event: PointerEvent<SVGGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toSvgPoint(event);
    if (point) setDrag(point);
  };
  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    if (!drag) return;
    const point = toSvgPoint(event);
    if (point) setDrag(point);
  };
  const onPointerUp = (event: PointerEvent<SVGGElement>) => {
    const point = toSvgPoint(event);
    setDrag(null);
    if (!point) return;
    const cell = cellAt(point.x, point.y);
    if (cell) dropOn(cell, point.x, point.y);
  };

  const onCellKeyDown = (event: KeyboardEvent<SVGGElement>, cell: CellBox) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dropOn(cell);
    }
  };

  const changeCells = (next: number) => {
    setCellCount(next);
    setFailure(null);
  };

  const hovered = drag ? cellAt(drag.x, drag.y) : undefined;
  const token = drag ?? TRAY;
  const isMonolith = cellCount === 1;

  // How long after the drop a dot turns red: the wave reaches near dots first.
  const dotDelay = (cell: CellBox, x: number, y: number) => {
    if (!failure || prefersReducedMotion) return 0;
    const own = failure.cell === cell.index;
    const ox = own ? failure.x : cell.x + cell.w / 2;
    const oy = own ? failure.y : cell.y + cell.h;
    return (own ? 0 : 0.5) + Math.hypot(x - ox, y - oy) / 260;
  };

  let note = "Drag the red blast onto the system, or just tap a box.";
  let tone = "violet";
  if (failure) {
    tone = sharedDatabase || isMonolith ? "red" : "amber";
    if (sharedDatabase && !isMonolith) {
      note =
        "Every cell talks to the same database, so one failure reached everyone. Cells only help if they share nothing important.";
    } else if (isMonolith) {
      note = "One system, one failure, every customer down. That's a 100% blast radius.";
    } else {
      note = `Only cell ${failure.cell + 1} went down. The other ${cellCount - 1} kept serving their customers.`;
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <DemoSlider
          label="Cells"
          min={1}
          max={12}
          value={cellCount}
          onChange={changeCells}
          valueText={isMonolith ? "1 (a monolith)" : `${cellCount} cells`}
        />
        <DemoButton onClick={() => setFailure(null)} disabled={!failure}>
          Repair
        </DemoButton>
      </div>
      <DemoToggle
        label="All cells share one database"
        checked={sharedDatabase}
        onChange={(checked) => {
          setSharedDatabase(checked);
          setFailure(null);
        }}
      />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="group"
        aria-label={`${cellCount === 1 ? "A monolith" : `${cellCount} cells`} serving ${CUSTOMERS} customers. ${
          failure ? `${hitCustomers} customers affected.` : "No failures."
        }`}
        className="mx-auto block w-full max-w-xl touch-manipulation select-none"
      >
        <defs>
          {cells.map((cell) => (
            <clipPath key={cell.index} id={`${clipPrefix}-clip-${cell.index}`}>
              <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={10} />
            </clipPath>
          ))}
        </defs>

        {/* Router feeding every cell, with requests flowing down each wire */}
        {cells.map((cell) => {
          const hit = isCellHit(cell.index);
          const path = `M${WIDTH / 2} ${routerY} L${cell.x + cell.w / 2} ${cell.y}`;
          return (
            <g key={`wire-${cell.index}`} data-tone={hit ? "red" : "violet"}>
              <path
                d={path}
                fill="none"
                strokeWidth={1.2}
                strokeDasharray={hit ? "3 4" : undefined}
                className={cn(styles.ease, hit ? "stroke-(--tone-line)" : "stroke-rule")}
              />
              {!hit && !prefersReducedMotion && (
                <circle r={2.6} className="fill-(--tone)">
                  <animateMotion
                    dur="1.6s"
                    repeatCount="indefinite"
                    path={path}
                    begin={`${-(cell.index * 0.37) % 1.6}s`}
                  />
                </circle>
              )}
            </g>
          );
        })}
        <g data-tone="violet">
          <rect
            x={WIDTH / 2 - 44}
            y={14}
            width={88}
            height={28}
            rx={14}
            strokeWidth={1.2}
            className="fill-paper stroke-(--tone-line)"
          />
          <rect
            x={WIDTH / 2 - 44}
            y={14}
            width={88}
            height={28}
            rx={14}
            className="fill-(--tone-soft)"
          />
          <text
            x={WIDTH / 2}
            y={28}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-(--tone) text-[12px] font-semibold"
          >
            router
          </text>
        </g>

        {/* Wires to the shared database run under the cells */}
        {sharedDatabase && (
          <g data-tone={failure ? "red" : "amber"}>
            {cells.map((cell) => (
              <path
                key={`db-${cell.index}`}
                d={`M${cell.x + cell.w / 2} ${cell.y + cell.h} L${WIDTH / 2} ${dbY - 12}`}
                fill="none"
                strokeWidth={1.2}
                className={cn(
                  styles.ease,
                  "stroke-(--tone-line)",
                  !prefersReducedMotion && styles.flow,
                )}
              />
            ))}
          </g>
        )}

        {/* Cells */}
        {cells.map((cell) => {
          const hit = isCellHit(cell.index);
          const isHovered = hovered?.index === cell.index;
          return (
            <g
              key={cell.index}
              role="button"
              tabIndex={0}
              aria-label={`${isMonolith ? "The monolith" : `Cell ${cell.index + 1}`}, ${cell.customers.length} customers, ${
                hit ? "down" : "healthy"
              }. Activate to drop the failure here.`}
              onKeyDown={(event) => onCellKeyDown(event, cell)}
              onClick={() => dropOn(cell)}
              data-tone={hit ? "red" : isHovered ? "violet" : "green"}
              className="group cursor-pointer outline-none"
            >
              <rect
                x={cell.x}
                y={cell.y}
                width={cell.w}
                height={cell.h}
                rx={10}
                strokeWidth={hit ? 1.6 : 1.2}
                className={cn(
                  styles.ease,
                  "fill-paper",
                  hit ? "stroke-(--tone)" : isHovered ? "stroke-(--tone)" : "stroke-rule",
                )}
              />
              <rect
                x={cell.x}
                y={cell.y}
                width={cell.w}
                height={cell.h}
                rx={10}
                className={cn(
                  styles.ease,
                  hit || isHovered
                    ? "fill-(--tone-soft)"
                    : "fill-transparent group-hover:fill-(--tone-soft)",
                )}
              />
              <g clipPath={`url(#${clipPrefix}-clip-${cell.index})`}>
                <AnimatePresence>
                  {hit && failure && (
                    <motion.circle
                      key={`${failure.cell}-${failure.x}-${failure.y}-${sharedDatabase}`}
                      cx={
                        sharedDatabase && failure.cell !== cell.index
                          ? cell.x + cell.w / 2
                          : failure.x
                      }
                      cy={
                        sharedDatabase && failure.cell !== cell.index ? cell.y + cell.h : failure.y
                      }
                      className="fill-(--tone-soft) stroke-(--tone-line)"
                      strokeWidth={1}
                      initial={{ r: prefersReducedMotion ? 400 : 0, opacity: 1 }}
                      animate={{ r: 400, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 1.1,
                        delay: prefersReducedMotion || failure.cell === cell.index ? 0 : 0.5,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </AnimatePresence>
              </g>
              <rect
                x={cell.x - 4}
                y={cell.y - 4}
                width={cell.w + 8}
                height={cell.h + 8}
                rx={12}
                fill="none"
                strokeWidth={1.6}
                strokeDasharray="4 3"
                data-tone="violet"
                className="stroke-(--tone) opacity-0 group-focus-visible:opacity-100"
              />
              <text
                x={cell.x + 9}
                y={cell.y + 16}
                className={cn(
                  styles.ease,
                  "text-[13px] font-semibold",
                  hit ? "fill-(--tone)" : "fill-ink-muted",
                )}
              >
                {isMonolith ? "monolith" : `cell ${cell.index + 1}`}
                {hit ? " · down" : ""}
              </text>
              {cell.customers.map((customer, k) => {
                const { x, y } = dotPosition(cell, k);
                return (
                  <circle
                    key={customer}
                    cx={x}
                    cy={y}
                    r={4}
                    className={cn(styles.ease, "fill-(--tone)")}
                    style={{ "--delay": `${dotDelay(cell, x, y).toFixed(2)}s` } as CSSProperties}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Optional shared database */}
        {sharedDatabase && (
          <g data-tone={failure ? "red" : "amber"}>
            <rect
              x={WIDTH / 2 - 60}
              y={dbY - 12}
              width={120}
              height={26}
              rx={8}
              className="fill-paper"
            />
            <rect
              key={failure ? "db-hit" : "db-ok"}
              x={WIDTH / 2 - 60}
              y={dbY - 12}
              width={120}
              height={26}
              rx={8}
              strokeWidth={1.4}
              className={cn(
                styles.ease,
                "fill-(--tone-soft) stroke-(--tone)",
                failure && styles.pop,
              )}
            />
            <text
              x={WIDTH / 2}
              y={dbY + 1}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-(--tone) text-[12px] font-semibold"
            >
              shared database
            </text>
          </g>
        )}

        {/* Failure token (drag source) */}
        {!failure && (
          <g
            role="presentation"
            data-tone="red"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDrag(null)}
            transform={`translate(${token.x} ${token.y})`}
            className="cursor-grab touch-none active:cursor-grabbing"
          >
            <circle r={24} fill="transparent" />
            {!drag && !prefersReducedMotion && (
              <circle r={10} className={cn("fill-(--tone-line)", styles["bug-pulse"])} />
            )}
            <polygon points={BLAST_SHAPE} className="fill-(--tone)" />
            {!drag && (
              <text
                x={-26}
                y={4}
                textAnchor="end"
                className="fill-ink-muted text-[13px] font-semibold"
              >
                drag me
              </text>
            )}
          </g>
        )}
      </svg>

      <div
        data-tone={tone}
        className={cn(
          styles.ease,
          "rounded-xl border border-(--tone-line) bg-(--tone-soft) px-4 py-3",
        )}
      >
        <p aria-live="polite" className="leading-snug font-semibold text-ink">
          {note}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Blast radius:{" "}
          <span className="font-mono">
            {failure
              ? `${hitCustomers} of ${CUSTOMERS} customers (${percent}%)`
              : "nothing broken yet"}
          </span>
          {!failure &&
            !isMonolith &&
            ` · worst case with ${cellCount} cells: about ${Math.round(100 / cellCount)}%`}
        </p>
      </div>
    </div>
  );
}
