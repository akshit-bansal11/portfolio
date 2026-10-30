/*
 * diagram.tsx
 * Small SVG building blocks shared by the server-rendered diagrams: a tone-coloured sketch
 * box with a title and optional note, a marching-ants arrow and a muted label. Colours come
 * only from tones and blog tokens, so both themes work.
 */

import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { sketchArrow, sketchRect } from "@/lib/blog/sketch";

interface BoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  tone: Tone;
  title: string;
  note?: string;
  seed?: number;
}

// A filled, hand-outlined box; the title (and note) are centred inside.
export function Box({ x, y, width, height, tone, title, note, seed = 1 }: BoxProps) {
  const cx = x + width / 2;
  const cy = y + height / 2;

  return (
    <g data-tone={tone}>
      <rect x={x} y={y} width={width} height={height} rx={6} className="fill-(--tone-soft)" />
      <path
        d={sketchRect(x, y, width, height, { seed })}
        fill="none"
        strokeWidth={2}
        className="stroke-(--tone)"
      />
      <text
        x={cx}
        y={note ? cy - 9 : cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[14px] font-semibold"
      >
        {title}
      </text>
      {note && (
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-ink-muted text-[14px]"
        >
          {note}
        </text>
      )}
    </g>
  );
}

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  seed?: number;
  curve?: number;
}

// A hand-drawn arrow whose shaft marches in the arrow's direction (CSS only).
export function Arrow({ x1, y1, x2, y2, seed = 1, curve = 0.08 }: ArrowProps) {
  const path = sketchArrow(x1, y1, x2, y2, { seed, curve, headSize: 8 });

  return (
    <g
      className="text-ink-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path.shaft} className="tut-flow" strokeDasharray="5 5" />
      <path d={path.head} />
    </g>
  );
}

interface LabelProps {
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  children: ReactNode;
}

// Muted caption text at a point.
export function Label({ x, y, anchor = "middle", children }: LabelProps) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="fill-ink-muted text-[14px]">
      {children}
    </text>
  );
}
