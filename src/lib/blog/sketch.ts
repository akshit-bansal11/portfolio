/*
 * sketch.ts
 * Tiny, dependency-free "hand-drawn" SVG path generator.
 * Produces slightly wobbly lines, boxes, ellipses and arrows
 * from a numeric seed, so the same input always yields the
 * same path on the server and the client (no hydration drift).
 */

// Shape options shared by every generator.
export interface SketchOptions {
  /** Same seed => same wobble. Change it to get a different "hand". */
  seed?: number;
  /** Max random offset (in SVG units) applied to endpoints. */
  jitter?: number;
  /** Max sideways bow (in SVG units) of a straight line. */
  bow?: number;
}

// Deterministic PRNG (mulberry32) returning floats in [0, 1).
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rounds to one decimal so markup stays compact and stable.
const r = (n: number) => Math.round(n * 10) / 10;

// Random value in [-amount, amount].
const spread = (rand: () => number, amount: number) => (rand() - 0.5) * 2 * amount;

// One wobbly stroke from (x1, y1) to (x2, y2) as a quadratic curve.
function strokeBetween(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rand: () => number,
  jitter: number,
  bow: number,
): string {
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / length;
  const ny = (x2 - x1) / length;
  const offset = spread(rand, bow) * Math.min(1, length / 80);
  const mx = (x1 + x2) / 2 + nx * offset;
  const my = (y1 + y2) / 2 + ny * offset;

  return `M${r(x1 + spread(rand, jitter))} ${r(y1 + spread(rand, jitter))} Q${r(mx)} ${r(my)} ${r(
    x2 + spread(rand, jitter),
  )} ${r(y2 + spread(rand, jitter))}`;
}

// A single hand-drawn line.
export function sketchLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  { seed = 1, jitter = 0.8, bow = 2 }: SketchOptions = {},
): string {
  return strokeBetween(x1, y1, x2, y2, createRandom(seed), jitter, bow);
}

// A hand-drawn rectangle: four strokes that overshoot their corners a little.
export function sketchRect(
  x: number,
  y: number,
  width: number,
  height: number,
  { seed = 1, jitter = 1, bow = 2 }: SketchOptions = {},
): string {
  const rand = createRandom(seed);
  const o = 2.5;
  return [
    strokeBetween(x - o, y, x + width + o, y, rand, jitter, bow),
    strokeBetween(x + width, y - o, x + width, y + height + o, rand, jitter, bow),
    strokeBetween(x + width + o, y + height, x - o, y + height, rand, jitter, bow),
    strokeBetween(x, y + height + o, x, y - o, rand, jitter, bow),
  ].join(" ");
}

// A hand-drawn ellipse that starts and ends slightly apart, like a real pen loop.
export function sketchEllipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  { seed = 1, jitter = 0.06 }: SketchOptions = {},
): string {
  const rand = createRandom(seed);
  const start = rand() * Math.PI * 2;
  const sweep = Math.PI * 2 + 0.45;
  const steps = 14;

  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const angle = start + (sweep * i) / steps;
    const wobble = 1 + spread(rand, jitter);
    return [cx + Math.cos(angle) * rx * wobble, cy + Math.sin(angle) * ry * wobble] as const;
  });

  return catmullRom(points);
}

// Smooth path through points (Catmull-Rom converted to cubic Béziers).
function catmullRom(points: ReadonlyArray<readonly [number, number]>): string {
  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  let d = `M${r(points[0][0])} ${r(points[0][1])}`;

  for (let i = 0; i < points.length - 1; i++) {
    const [p0x, p0y] = at(i - 1);
    const [p1x, p1y] = at(i);
    const [p2x, p2y] = at(i + 1);
    const [p3x, p3y] = at(i + 2);
    d += ` C${r(p1x + (p2x - p0x) / 6)} ${r(p1y + (p2y - p0y) / 6)} ${r(p2x - (p3x - p1x) / 6)} ${r(
      p2y - (p3y - p1y) / 6,
    )} ${r(p2x)} ${r(p2y)}`;
  }

  return d;
}

// Paths for a hand-drawn arrow: a curved shaft plus a two-stroke head.
export interface SketchArrow {
  shaft: string;
  head: string;
}

export function sketchArrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  {
    seed = 1,
    curve = 0.18,
    headSize = 8,
  }: SketchOptions & { curve?: number; headSize?: number } = {},
): SketchArrow {
  const rand = createRandom(seed);
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / length;
  const ny = (x2 - x1) / length;
  const bend = curve * length * (0.85 + rand() * 0.3);
  const cx = (x1 + x2) / 2 + nx * bend;
  const cy = (y1 + y2) / 2 + ny * bend;

  // Arrowhead follows the curve's tangent at the tip (control point -> tip).
  const angle = Math.atan2(y2 - cy, x2 - cx);
  const spreadAngle = 0.5 + spread(rand, 0.06);
  const left = [
    x2 - headSize * Math.cos(angle - spreadAngle),
    y2 - headSize * Math.sin(angle - spreadAngle),
  ];
  const right = [
    x2 - headSize * Math.cos(angle + spreadAngle),
    y2 - headSize * Math.sin(angle + spreadAngle),
  ];

  return {
    shaft: `M${r(x1)} ${r(y1)} Q${r(cx)} ${r(cy)} ${r(x2)} ${r(y2)}`,
    head: `M${r(left[0])} ${r(left[1])} L${r(x2)} ${r(y2)} L${r(right[0])} ${r(right[1])}`,
  };
}

// A loose zig-zag "scribble" used to cross something out.
export function sketchCross(cx: number, cy: number, size: number, seed = 1): string {
  const rand = createRandom(seed);
  const h = size / 2;
  return [
    strokeBetween(cx - h, cy - h, cx + h, cy + h, rand, 1, 2),
    strokeBetween(cx + h, cy - h, cx - h, cy + h, rand, 1, 2),
  ].join(" ");
}

// Moves the end of a line from a box's centre to its edge (so arrows touch borders).
export function clipToBox(
  fromX: number,
  fromY: number,
  boxX: number,
  boxY: number,
  halfWidth: number,
  halfHeight: number,
  padding = 4,
): [number, number] {
  const dx = fromX - boxX;
  const dy = fromY - boxY;
  if (dx === 0 && dy === 0) return [boxX, boxY];
  const scale =
    1 / Math.max(Math.abs(dx) / (halfWidth + padding), Math.abs(dy) / (halfHeight + padding));
  return [boxX + dx * scale, boxY + dy * scale];
}
