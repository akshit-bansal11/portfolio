/*
 * BlastRadiusDemo.tsx
 * Main Blast Radius demo. 48 customers are split across N
 * cells (N = 1 is a plain monolith). Drag the failure token
 * onto a cell, or focus a cell and press Enter, and watch the
 * red radius spread through every customer that cell serves.
 * A switch makes all cells share one database, to show how a
 * single shared dependency quietly undoes the isolation.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type KeyboardEvent, type PointerEvent, useId, useRef, useState } from "react";
import { DemoButton, DemoSlider, DemoToggle } from "@/components/blog/DemoControls";
import { sketchLine, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

const CUSTOMERS = 48;
const WIDTH = 360;
const PAD = 10;
const GAP = 10;
const DOT_GAP = 13;
const TOP = 70;
const TRAY = { x: 318, y: 30 };

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

// Jagged "explosion" star used as the failure token.
const BLAST_SHAPE = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const radius = i % 2 === 0 ? 17 : 8;
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

  const { cells, height } = layoutCells(cellCount);
  const dbY = height - 30;

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

  let note = "Drag the red blast onto the system, or just tap a box.";
  if (failure) {
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
        className="w-full touch-manipulation select-none"
      >
        <defs>
          {cells.map((cell) => (
            <clipPath key={cell.index} id={`${clipPrefix}-clip-${cell.index}`}>
              <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={8} />
            </clipPath>
          ))}
        </defs>

        {/* Router feeding every cell */}
        <rect
          x={WIDTH / 2 - 44}
          y={14}
          width={88}
          height={28}
          rx={14}
          className="fill-paper-raised stroke-ink"
          strokeWidth={1.6}
        />
        <text
          x={WIDTH / 2}
          y={28}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-ink text-[12px] font-semibold"
        >
          router
        </text>
        {cells.map((cell) => (
          <path
            key={`wire-${cell.index}`}
            d={sketchLine(WIDTH / 2, 42, cell.x + cell.w / 2, cell.y, {
              seed: cell.index + 3,
              bow: 2,
            })}
            fill="none"
            strokeWidth={1}
            className="stroke-ink-muted/60"
          />
        ))}

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
              className="group cursor-pointer outline-none"
            >
              <rect
                x={cell.x}
                y={cell.y}
                width={cell.w}
                height={cell.h}
                rx={8}
                className={cn("transition-colors", isHovered ? "fill-pen/15" : "fill-paper-raised")}
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
                      className="fill-danger/20"
                      initial={{ r: prefersReducedMotion ? 400 : 0 }}
                      animate={{ r: 400 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.9,
                        delay: prefersReducedMotion || failure.cell === cell.index ? 0 : 0.5,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </AnimatePresence>
              </g>
              <path
                d={sketchRect(cell.x, cell.y, cell.w, cell.h, { seed: cell.index + 21, bow: 1.4 })}
                fill="none"
                strokeWidth={hit ? 2.4 : 1.6}
                className={cn("transition-colors", hit ? "stroke-danger" : "stroke-ink")}
              />
              <rect
                x={cell.x - 4}
                y={cell.y - 4}
                width={cell.w + 8}
                height={cell.h + 8}
                rx={10}
                fill="none"
                strokeWidth={2}
                strokeDasharray="3 3"
                className="stroke-pen opacity-0 group-focus-visible:opacity-100"
              />
              <text
                x={cell.x + 8}
                y={cell.y + 15}
                className={cn("font-hand text-[15px]", hit ? "fill-danger" : "fill-ink-muted")}
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
                    className={cn(
                      "transition-colors duration-500",
                      hit ? "fill-danger" : "fill-ok",
                    )}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Optional shared database */}
        {sharedDatabase && (
          <g>
            {cells.map((cell) => (
              <path
                key={`db-${cell.index}`}
                d={sketchLine(cell.x + cell.w / 2, cell.y + cell.h, WIDTH / 2, dbY - 12, {
                  seed: cell.index + 40,
                })}
                fill="none"
                strokeWidth={1}
                strokeDasharray="3 3"
                className={failure ? "stroke-danger" : "stroke-ink-muted"}
              />
            ))}
            <rect
              x={WIDTH / 2 - 60}
              y={dbY - 12}
              width={120}
              height={26}
              rx={6}
              strokeWidth={2}
              className={failure ? "fill-danger/20 stroke-danger" : "fill-paper-raised stroke-ink"}
            />
            <text
              x={WIDTH / 2}
              y={dbY + 1}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-ink text-[12px] font-semibold"
            >
              shared database
            </text>
          </g>
        )}

        {/* Failure token (drag source) */}
        {!failure && (
          <g
            role="presentation"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDrag(null)}
            transform={`translate(${token.x} ${token.y})`}
            className="cursor-grab touch-none active:cursor-grabbing"
          >
            <circle r={24} fill="transparent" />
            <polygon points={BLAST_SHAPE} strokeWidth={1.6} className="fill-danger stroke-ink" />
            {!drag && (
              <text x={-30} y={4} textAnchor="end" className="fill-pen font-hand text-[16px]">
                drag me
              </text>
            )}
          </g>
        )}
      </svg>

      <div className="rounded-xl border-2 border-dashed border-rule px-4 py-3">
        <p aria-live="polite" className="font-hand text-[1.4rem] leading-snug text-pen">
          {note}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Blast radius:{" "}
          {failure
            ? `${hitCustomers} of ${CUSTOMERS} customers (${percent}%)`
            : "nothing broken yet"}
          {!failure &&
            !isMonolith &&
            ` · worst case with ${cellCount} cells: about ${Math.round(100 / cellCount)}%`}
        </p>
      </div>
    </div>
  );
}
