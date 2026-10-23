/*
 * WhiteboardDoodles.tsx
 * Hand-drawn doodles scattered around the edges of the hero, as if left on a
 * whiteboard. Every shape is built from the sketch.ts helpers so they share one
 * stroke language. Each one draws itself once after the welcome intro; on desktop
 * the groups drift upward at three parallax depths as the hero scrolls, and a
 * doodle wiggles on hover. Colours come from the --doodle-* tokens, so both
 * themes show the same drawing.
 */

"use client";

import { MotionConfig, type MotionValue, motion, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { useAnimation } from "@/context/AnimationContext";
import { sketchArrow, sketchCross, sketchEllipse, sketchLine, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

type Point = readonly [number, number];

// A connected run of wobbly strokes through the points.
const poly = (points: Point[], seed: number) =>
  points
    .slice(1)
    .map(([x, y], i) =>
      sketchLine(points[i][0], points[i][1], x, y, { seed: seed + i, jitter: 0.6, bow: 1.5 }),
    )
    .join(" ");

// Five-pointed star as one pentagram stroke (every second vertex).
const STAR_VERTICES: Point[] = Array.from({ length: 5 }, (_, k) => {
  const angle = (-90 + k * 72) * (Math.PI / 180);
  return [50 + 40 * Math.cos(angle), 54 + 40 * Math.sin(angle)] as const;
});
const STAR = poly(
  [0, 2, 4, 1, 3, 0].map((k) => STAR_VERTICES[k]),
  31,
);

// Dashed line between two shapes, drawn as short separate strokes.
const DASHES = Array.from({ length: 5 }, (_, i) =>
  sketchLine(31 + i * 9, 50, 36 + i * 9, 50, { seed: 61 + i, jitter: 0.4, bow: 0.5 }),
).join(" ");

const ARROW = sketchArrow(10, 80, 88, 24, { seed: 47, curve: 0.35, headSize: 12 });

// Parallax depth: how far (px) a group drifts up over the first 40% of the hero scroll.
const DEPTH_DISTANCE = { 1: 60, 2: 140, 3: 240 } as const;
type Depth = keyof typeof DEPTH_DISTANCE;

interface Doodle {
  id: string;
  /** Position, size and tilt classes. */
  className: string;
  color: "text-doodle-1" | "text-doodle-2" | "text-doodle-3";
  depth: Depth;
  paths: string[];
}

const DOODLES: Doodle[] = [
  {
    id: "note",
    className: "left-[3%] top-[16%] w-[clamp(56px,8vw,128px)] -rotate-6",
    color: "text-doodle-3",
    depth: 1,
    paths: [
      sketchRect(12, 10, 70, 72, { seed: 3 }),
      [
        sketchLine(24, 32, 68, 31, { seed: 4 }),
        sketchLine(24, 48, 62, 49, { seed: 5 }),
        sketchLine(24, 64, 50, 64, { seed: 6 }),
      ].join(" "),
    ],
  },
  {
    id: "circle",
    className: "right-[6%] top-[12%] w-[clamp(44px,5vw,84px)]",
    color: "text-doodle-1",
    depth: 2,
    paths: [sketchEllipse(50, 50, 36, 34, { seed: 8 })],
  },
  {
    id: "triangle",
    className: "left-[10%] bottom-[12%] w-[clamp(44px,5.5vw,90px)] rotate-6",
    color: "text-doodle-2",
    depth: 3,
    paths: [
      poly(
        [
          [50, 12],
          [90, 86],
          [10, 86],
          [50, 12],
        ],
        11,
      ),
    ],
  },
  {
    id: "star",
    className: "right-[12%] bottom-[16%] w-[clamp(44px,5vw,84px)] rotate-12",
    color: "text-doodle-3",
    depth: 1,
    paths: [STAR],
  },
  {
    id: "squiggle",
    className: "left-[30%] top-[6%] w-[clamp(52px,6vw,100px)]",
    color: "text-doodle-1",
    depth: 2,
    paths: [
      poly(
        [
          [8, 50],
          [22, 30],
          [36, 70],
          [50, 30],
          [64, 70],
          [78, 30],
          [92, 50],
        ],
        17,
      ),
    ],
  },
  {
    id: "braces",
    className: "right-[28%] top-[5%] w-[clamp(44px,5vw,84px)] -rotate-3",
    color: "text-doodle-2",
    depth: 3,
    paths: [
      `${poly(
        [
          [40, 10],
          [30, 18],
          [30, 42],
          [20, 50],
          [30, 58],
          [30, 82],
          [40, 90],
        ],
        23,
      )} ${poly(
        [
          [60, 10],
          [70, 18],
          [70, 42],
          [80, 50],
          [70, 58],
          [70, 82],
          [60, 90],
        ],
        29,
      )}`,
    ],
  },
  {
    id: "brackets",
    className: "left-[4%] top-[52%] w-[clamp(48px,5.5vw,92px)] max-sm:hidden -rotate-3",
    color: "text-doodle-1",
    depth: 2,
    paths: [
      [
        poly(
          [
            [30, 25],
            [10, 50],
            [30, 75],
          ],
          37,
        ),
        poly(
          [
            [56, 20],
            [44, 80],
          ],
          39,
        ),
        poly(
          [
            [70, 25],
            [90, 50],
            [70, 75],
          ],
          41,
        ),
      ].join(" "),
    ],
  },
  {
    id: "bulb",
    className: "right-[4%] top-[46%] w-[clamp(48px,5.5vw,92px)] max-sm:hidden rotate-6",
    color: "text-doodle-3",
    depth: 1,
    paths: [
      sketchEllipse(50, 38, 24, 26, { seed: 43 }),
      [
        poly(
          [
            [38, 70],
            [62, 70],
          ],
          53,
        ),
        poly(
          [
            [41, 79],
            [59, 79],
          ],
          55,
        ),
        poly(
          [
            [45, 88],
            [55, 88],
          ],
          57,
        ),
      ].join(" "),
    ],
  },
  {
    id: "arrow",
    className: "left-[36%] bottom-[6%] w-[clamp(52px,6vw,100px)]",
    color: "text-doodle-2",
    depth: 3,
    paths: [ARROW.shaft, ARROW.head],
  },
  {
    id: "cross",
    className: "right-[34%] bottom-[8%] w-[clamp(36px,4vw,64px)]",
    color: "text-doodle-1",
    depth: 2,
    paths: [sketchCross(50, 50, 60, 59)],
  },
  {
    id: "connector",
    className: "left-[14%] top-[7%] w-[clamp(64px,10vw,160px)] max-sm:hidden",
    color: "text-doodle-3",
    depth: 3,
    paths: [
      sketchEllipse(16, 50, 12, 12, { seed: 67 }),
      DASHES,
      sketchRect(78, 38, 20, 24, { seed: 71 }),
    ],
  },
];

const DEPTHS: Depth[] = [1, 2, 3];

// Seconds between one doodle starting to draw and the next.
const DRAW_STAGGER = 0.12;

// One drifting group: moves up and fades as the hero scrolls on.
function ParallaxLayer({
  progress,
  depth,
  children,
}: {
  progress: MotionValue<number>;
  depth: Depth;
  children: ReactNode;
}) {
  const y = useTransform(progress, [0, 0.4], [0, -DEPTH_DISTANCE[depth]]);
  const opacity = useTransform(progress, [0.1, 0.35], [1, 0]);
  return (
    <motion.div style={{ y, opacity }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

interface WhiteboardDoodlesProps {
  /** Hero scroll progress; omit for a static layer (mobile stack). */
  progress?: MotionValue<number>;
}

// Renders the doodle layer.
export default function WhiteboardDoodles({ progress }: WhiteboardDoodlesProps) {
  const { isWelcomeComplete } = useAnimation();
  // Wait for the welcome intro so the strokes draw where they can be seen.
  if (!isWelcomeComplete) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {DEPTHS.map((depth) => {
          const content = DOODLES.map((doodle, index) =>
            doodle.depth === depth ? (
              <motion.svg
                key={doodle.id}
                viewBox="0 0 100 100"
                className={cn(
                  "absolute aspect-square overflow-visible lg:pointer-events-auto",
                  doodle.className,
                  doodle.color,
                )}
                whileHover={{ rotate: [0, -8, 6, -3, 0] }}
                transition={{ duration: 0.5 }}
              >
                {doodle.paths.map((d, order) => (
                  <DrawnPath
                    key={d}
                    d={d}
                    delay={0.15 + index * DRAW_STAGGER + order * 0.05}
                    duration={0.9}
                  />
                ))}
              </motion.svg>
            ) : null,
          );
          return progress ? (
            <ParallaxLayer key={depth} progress={progress} depth={depth}>
              {content}
            </ParallaxLayer>
          ) : (
            <div key={depth} className="absolute inset-0">
              {content}
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}
