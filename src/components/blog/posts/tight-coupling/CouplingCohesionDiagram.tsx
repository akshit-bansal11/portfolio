/*
 * CouplingCohesionDiagram.tsx
 * "What it is" diagram: the same nine pieces of code arranged
 * badly (related things scattered, wires everywhere) and well
 * (related things together, one small door between boxes).
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchEllipse, sketchLine, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

type Shape = "circle" | "triangle" | "square";

interface Item {
  shape: Shape;
  x: number;
  y: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

// Shape -> colour. Each shape is one "kind of responsibility" (user, payment, email).
const SHAPE_CLASS: Record<Shape, string> = {
  circle: "fill-pen",
  triangle: "fill-pen-blue",
  square: "fill-ok",
};

const BOXES: Box[] = [
  { x: 18, y: 26, w: 116, h: 86, label: "module A" },
  { x: 166, y: 26, w: 116, h: 86, label: "module B" },
  { x: 92, y: 146, w: 116, h: 86, label: "module C" },
];

// Same nine items, scattered across modules (tangled) or grouped by kind (tidy).
const TANGLED: Item[] = [
  { shape: "circle", x: 48, y: 56 },
  { shape: "triangle", x: 104, y: 56 },
  { shape: "square", x: 76, y: 90 },
  { shape: "triangle", x: 196, y: 56 },
  { shape: "square", x: 252, y: 56 },
  { shape: "circle", x: 224, y: 90 },
  { shape: "square", x: 122, y: 176 },
  { shape: "circle", x: 178, y: 176 },
  { shape: "triangle", x: 150, y: 210 },
];

const TIDY: Item[] = [
  { shape: "circle", x: 48, y: 56 },
  { shape: "circle", x: 104, y: 56 },
  { shape: "circle", x: 76, y: 90 },
  { shape: "triangle", x: 196, y: 56 },
  { shape: "triangle", x: 252, y: 56 },
  { shape: "triangle", x: 224, y: 90 },
  { shape: "square", x: 122, y: 176 },
  { shape: "square", x: 178, y: 176 },
  { shape: "square", x: 150, y: 210 },
];

// Draws one item.
function ItemShape({ item }: { item: Item }) {
  const { x, y, shape } = item;
  if (shape === "circle") return <circle cx={x} cy={y} r={7} className={SHAPE_CLASS.circle} />;
  if (shape === "square")
    return <rect x={x - 6.5} y={y - 6.5} width={13} height={13} className={SHAPE_CLASS.square} />;
  return (
    <path
      d={`M${x} ${y - 8} L${x + 8} ${y + 6} L${x - 8} ${y + 6}Z`}
      className={SHAPE_CLASS.triangle}
    />
  );
}

// Every pair of same-shaped items is "related" and talks to each other.
function relatedPairs(items: Item[]): [Item, Item][] {
  const pairs: [Item, Item][] = [];
  items.forEach((a, i) => {
    items.slice(i + 1).forEach((b) => {
      if (a.shape === b.shape) pairs.push([a, b]);
    });
  });
  return pairs;
}

function Panel({ variant }: { variant: "tangled" | "tidy" }) {
  const items = variant === "tangled" ? TANGLED : TIDY;
  const pairs = relatedPairs(items);
  const title =
    variant === "tangled" ? "Low cohesion, high coupling" : "High cohesion, low coupling";
  const description =
    variant === "tangled"
      ? "Three modules. Related pieces of code are scattered across all three, so wires cross every module boundary."
      : "Three modules. Related pieces sit together inside one module, and modules talk only through one small door.";

  return (
    <svg
      viewBox="0 0 300 300"
      role="img"
      aria-label={`${title}. ${description}`}
      className="w-full"
    >
      {BOXES.map((box, index) => (
        <g key={box.label}>
          <path
            d={sketchRect(box.x, box.y, box.w, box.h, {
              seed: index + (variant === "tidy" ? 10 : 1),
            })}
            fill="none"
            strokeWidth={1.8}
            strokeLinecap="round"
            className="stroke-ink"
          />
          {/* Module C's label sits beside it so annotations above it stay readable. */}
          <text
            x={index === 2 ? box.x + box.w + 8 : box.x + 6}
            y={index === 2 ? box.y + 16 : box.y - 7}
            className="fill-ink-muted font-hand text-[15px]"
          >
            {box.label}
          </text>
        </g>
      ))}

      {/* Wires between related items */}
      {pairs.map(([a, b], index) => (
        <path
          key={`${a.x}-${a.y}-${b.x}-${b.y}`}
          d={sketchLine(a.x, a.y, b.x, b.y, {
            seed: index + 40,
            bow: variant === "tangled" ? 10 : 3,
          })}
          fill="none"
          strokeWidth={1.3}
          className={cn(variant === "tangled" ? "stroke-danger/70" : "stroke-ink-muted")}
        />
      ))}

      {variant === "tidy" && (
        <g>
          {/* Ports (the "doors") and the two calls through them */}
          <rect x={86} y={108} width={10} height={8} className="fill-ink" />
          <rect x={204} y={108} width={10} height={8} className="fill-ink" />
          <path
            d={sketchLine(91, 116, 128, 146, { seed: 61 })}
            fill="none"
            strokeWidth={1.8}
            className="stroke-ink"
          />
          <path
            d={sketchLine(209, 116, 172, 146, { seed: 62 })}
            fill="none"
            strokeWidth={1.8}
            className="stroke-ink"
          />
        </g>
      )}

      {items.map((item) => (
        <ItemShape key={`${item.shape}-${item.x}-${item.y}`} item={item} />
      ))}

      {/* Handwritten annotations */}
      {variant === "tangled" ? (
        <g className="text-pen">
          <DrawnPath
            d={sketchEllipse(150, 128, 70, 22, { seed: 7 })}
            strokeWidth={1.8}
            delay={0.3}
          />
          <text x={150} y={268} textAnchor="middle" className="fill-pen font-hand text-[19px]">
            change one thing → touch every box
          </text>
          <DrawnPath
            d={sketchArrow(150, 252, 150, 154, { seed: 8, curve: 0.15 }).shaft}
            delay={1.1}
            duration={0.5}
          />
          <DrawnPath
            d={sketchArrow(150, 252, 150, 154, { seed: 8, curve: 0.15 }).head}
            delay={1.6}
            duration={0.2}
          />
        </g>
      ) : (
        <g className="text-pen">
          <DrawnPath
            d={sketchEllipse(91, 112, 14, 10, { seed: 9 })}
            strokeWidth={1.8}
            delay={0.3}
          />
          <text x={22} y={272} className="fill-pen font-hand text-[19px]">
            small doors = interfaces
          </text>
          <DrawnPath
            d={sketchArrow(60, 254, 84, 124, { seed: 12, curve: 0.2 }).shaft}
            delay={0.9}
            duration={0.5}
          />
          <DrawnPath
            d={sketchArrow(60, 254, 84, 124, { seed: 12, curve: 0.2 }).head}
            delay={1.4}
            duration={0.2}
          />
        </g>
      )}
    </svg>
  );
}

export default function CouplingCohesionDiagram() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {(["tangled", "tidy"] as const).map((variant) => (
        <div
          key={variant}
          className="rounded-xl border-2 border-dashed border-rule bg-paper-raised p-3"
        >
          <p
            className={cn(
              "text-center font-hand text-2xl",
              variant === "tangled" ? "text-danger" : "text-ok",
            )}
          >
            {variant === "tangled" ? "tangled" : "tidy"}
          </p>
          <Panel variant={variant} />
          <p className="text-center text-sm text-ink-muted">
            {variant === "tangled" ? "Low cohesion, high coupling" : "High cohesion, low coupling"}
          </p>
        </div>
      ))}
      <ul
        aria-label="Legend"
        className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-ink-muted sm:col-span-2"
      >
        <li className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-pen" /> user code
        </li>
        <li className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-0 w-0 border-x-[7px] border-b-[12px] border-x-transparent border-b-pen-blue"
          />{" "}
          payment code
        </li>
        <li className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-3 w-3 bg-ok" /> email code
        </li>
      </ul>
    </div>
  );
}
