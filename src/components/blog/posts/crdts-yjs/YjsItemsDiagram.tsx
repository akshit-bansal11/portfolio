/*
 * YjsItemsDiagram.tsx
 * How Yjs stores a sequence: every character (or list item)
 * is an "item" with a unique ID (client, clock) and a pointer
 * to the item it was typed after. Deleted items stay as
 * tombstones so late-arriving edits still know where to go.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

interface YItem {
  char: string;
  id: string;
  deleted?: boolean;
  fromB?: boolean;
}

const ITEMS: YItem[] = [
  { char: "c", id: "A:0" },
  { char: "h", id: "A:1" },
  { char: "a", id: "A:2" },
  { char: "y", id: "B:0", deleted: true, fromB: true },
  { char: "i", id: "A:3" },
];

const NOTE_ARROW = sketchArrow(250, 150, 226, 104, { seed: 4, curve: 0.2, headSize: 7 });

export default function YjsItemsDiagram() {
  return (
    <svg
      viewBox="0 0 400 190"
      role="img"
      aria-label="The word chai stored as a chain of items. Each item holds one character and an ID made of the client that typed it and a counter: A:0 for c, A:1 for h, A:2 for a, A:3 for i. An item y typed by client B with ID B:0 sits between a and i but is marked deleted. It stays in the chain as a tombstone."
      className="w-full"
    >
      {ITEMS.map((item, index) => {
        const x = 16 + index * 76;
        return (
          <g key={item.id}>
            <path
              d={sketchRect(x, 40, 58, 58, { seed: index + 1 })}
              fill="none"
              strokeWidth={1.8}
              strokeDasharray={item.deleted ? "5 4" : undefined}
              className={
                item.deleted ? "stroke-ink-muted" : item.fromB ? "stroke-pen-blue" : "stroke-ink"
              }
            />
            <text
              x={x + 29}
              y={66}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn(
                "text-[24px] font-bold",
                item.deleted ? "fill-ink-muted line-through" : "fill-ink",
              )}
            >
              {item.char}
            </text>
            <text
              x={x + 29}
              y={90}
              textAnchor="middle"
              className={cn(
                "font-mono text-[10px]",
                item.fromB ? "fill-pen-blue" : "fill-ink-muted",
              )}
            >
              {item.id}
            </text>
            {index > 0 && (
              <path
                d={`M${x - 16} 69 L${x - 4} 69 M${x - 9} 64 L${x - 4} 69 L${x - 9} 74`}
                fill="none"
                strokeWidth={1.6}
                className="stroke-ink-muted"
              />
            )}
          </g>
        );
      })}

      <text x={16} y={26} className="fill-ink-muted font-hand text-[15px]">
        each item: a character + who typed it + their counter
      </text>
      <g className="text-pen">
        <DrawnPath d={NOTE_ARROW.shaft} strokeWidth={1.8} />
        <DrawnPath d={NOTE_ARROW.head} strokeWidth={1.8} delay={0.9} duration={0.15} />
      </g>
      <text x={150} y={166} className="fill-pen font-hand text-[16px]">
        deleted, but kept as a "tombstone",
      </text>
      <text x={150} y={182} className="fill-pen font-hand text-[16px]">
        so late edits still find their place
      </text>
    </svg>
  );
}
