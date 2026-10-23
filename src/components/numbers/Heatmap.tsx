/*
 * Heatmap.tsx
 * The contribution calendar as a grid of small rounded squares (one column per week) coloured
 * with the --heat-0..4 theme tokens, with Caveat month labels and a less/more legend.
 * Every day reveals its count and date: a hover/tap tooltip (one element for the whole grid)
 * and a keyboard mode (one tab stop, arrow keys, Home/End, polite live announcement).
 */

"use client";

import { type KeyboardEvent, useId, useMemo, useRef, useState } from "react";
import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEVELS = [0, 1, 2, 3, 4] as const;
const CELL = "h-3 w-3 rounded-[3px]";
// Cell size cap (px) plus the 3px gap; phones keep a 13px minimum and scroll.
const MAX_STEP = 16;
const MIN_STEP = 13;
// Half the tooltip width, used to keep it inside the visible card.
const TIP_HALF = 112;

// Tiny drawn chevron that points the tooltip at its cell.
const ARROW = `${sketchLine(1, 1, 6, 6, { seed: 3, jitter: 0.3, bow: 0.3 })} ${sketchLine(6, 6, 11, 1, { seed: 4, jitter: 0.3, bow: 0.3 })}`;

interface Day {
  date: string;
  row: number;
  col: number;
}

// Local calendar date as YYYY-MM-DD (matches the dates GitHub returns).
function isoDay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Every day from Jan 1 of the year up to today (or Dec 31), grouped into Sunday-first weeks.
function buildWeeks(year: number): Day[][] {
  const weeks: Day[][] = [];
  const today = new Date();
  const cursor = new Date(year, 0, 1);
  let week: Day[] = [];
  while (cursor.getFullYear() === year && cursor <= today) {
    week.push({ date: isoDay(cursor), row: cursor.getDay(), col: weeks.length });
    if (cursor.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}

// Heat level 0..4 for a count, relative to the busiest day.
function level(count: number, max: number): number {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

// "4 contributions · Thu, 3 Oct 2026".
function describe(day: Day, count: number): string {
  const [y, m, d] = day.date.split("-").map(Number);
  const what = count === 0 ? "No contributions" : `${count} contribution${count === 1 ? "" : "s"}`;
  return `${what} · ${WEEKDAYS[day.row]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

interface Tip {
  index: number;
  x: number;
  y: number;
  below: boolean;
  arrowX: number;
}

interface HeatmapProps {
  /** ISO date -> contribution count. */
  data: Record<string, number>;
  year: number;
  total: number;
}

// Renders the grid.
export default function Heatmap({ data, year, total }: HeatmapProps) {
  const uid = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const weeks = useMemo(() => buildWeeks(year), [year]);
  const days = useMemo(() => weeks.flat(), [weeks]);
  const max = useMemo(() => Math.max(1, ...Object.values(data)), [data]);
  const months = useMemo(() => {
    const out: { label: string; col: number }[] = [];
    weeks.forEach((week, col) => {
      const label = MONTHS[Number(week[0].date.slice(5, 7)) - 1];
      if (out.length === 0 || label !== out[out.length - 1].label) out.push({ label, col });
    });
    return out;
  }, [weeks]);

  const [active, setActive] = useState(days.length - 1);
  const [tip, setTip] = useState<Tip | null>(null);
  const [announce, setAnnounce] = useState("");

  const countAt = (i: number) => data[days[i].date] ?? 0;

  // Place the tooltip over cell i, clamped to the visible part of the scrolling card.
  function show(i: number, spoken: boolean) {
    const box = boxRef.current;
    const cell = document.getElementById(`${uid}-${i}`);
    if (!box || !cell) return;
    const scroller = box.parentElement ?? box;
    const b = box.getBoundingClientRect();
    const c = cell.getBoundingClientRect();
    const s = scroller.getBoundingClientRect();
    const cx = c.left - b.left + c.width / 2;
    const lo = Math.min(s.left - b.left + TIP_HALF, cx);
    const hi = Math.max(s.right - b.left - TIP_HALF, cx);
    const x = Math.min(Math.max(cx, lo), hi);
    const top = c.top - b.top;
    setTip({ index: i, x, y: top, below: top < 44, arrowX: cx - x });
    if (spoken) setAnnounce(describe(days[i], countAt(i)));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = days.length - 1;
    const moves: Record<string, number> = {
      ArrowLeft: active - 7,
      ArrowRight: active + 7,
      ArrowUp: active - 1,
      ArrowDown: active + 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = Math.min(Math.max(moves[e.key], 0), last);
    setActive(next);
    document
      .getElementById(`${uid}-${next}`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    show(next, true);
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        ref={boxRef}
        role="listbox"
        tabIndex={0}
        aria-label={`Contribution calendar for ${year}, ${total.toLocaleString("en-US")} contributions. Arrow keys move between days.`}
        aria-activedescendant={`${uid}-${active}`}
        onKeyDown={onKeyDown}
        onFocus={() => show(active, true)}
        onBlur={() => setTip(null)}
        onMouseLeave={() => setTip(null)}
        className="relative grid w-full gap-[3px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-pen"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
          minWidth: `${weeks.length * MIN_STEP}px`,
          maxWidth: `${weeks.length * MAX_STEP}px`,
        }}
      >
        {months.map((m) => (
          <span
            key={`${m.label}-${m.col}`}
            aria-hidden
            className="mb-1 whitespace-nowrap font-hand text-lg font-bold leading-none text-hero-muted"
            style={{ gridRow: 1, gridColumn: m.col + 1 }}
          >
            {m.label}
          </span>
        ))}
        {days.map((day, i) => (
          <div
            key={day.date}
            id={`${uid}-${i}`}
            role="option"
            aria-selected={i === active}
            aria-label={describe(day, countAt(i))}
            onMouseEnter={() => show(i, false)}
            onClick={() => {
              setActive(i);
              show(i, false);
            }}
            className={cn(
              "aspect-square rounded-[3px]",
              tip?.index === i && "outline-[1.5px] outline-hero-ink",
            )}
            style={{
              gridRow: day.row + 2,
              gridColumn: day.col + 1,
              backgroundColor: `var(--heat-${level(countAt(i), max)})`,
            }}
          />
        ))}
        {tip && (
          <div
            aria-hidden
            className="pointer-events-none absolute z-10 w-max rounded-md border border-page-ink/20 bg-page-bg px-2 py-1 font-grotesk text-xs text-page-ink"
            style={{
              left: tip.x,
              top: tip.below ? tip.y + 16 : tip.y - 6,
              transform: tip.below ? "translateX(-50%)" : "translate(-50%, -100%)",
              boxShadow: "var(--note-shadow)",
            }}
          >
            {describe(days[tip.index], countAt(tip.index))}
            <svg
              viewBox="0 0 12 7"
              className={cn(
                "absolute h-[7px] w-3 -translate-x-1/2 text-page-ink/60",
                tip.below ? "-top-[7px] rotate-180" : "-bottom-[7px]",
              )}
              style={{ left: `calc(50% + ${tip.arrowX}px)` }}
            >
              <path
                d={ARROW}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.25}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
      <div
        aria-hidden
        className="flex items-center gap-1 font-hand text-lg font-bold text-hero-muted"
      >
        less
        {LEVELS.map((l) => (
          <span key={l} className={CELL} style={{ backgroundColor: `var(--heat-${l})` }} />
        ))}
        more
      </div>
    </div>
  );
}
