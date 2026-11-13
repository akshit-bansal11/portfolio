/*
 * NetworkShapes.tsx
 * Why data-centre networks changed shape. Left: a three-tier tree (one core, two
 * aggregation, four access switches). Right: a leaf-spine network (every leaf wired to
 * every spine). Pick where server A sends its traffic: the path lights up in both, with
 * packets riding it. In the tree, far-apart servers climb all the way to the one core;
 * in leaf-spine, any two servers on different leaves are the same 4 hops apart, over
 * either spine. Clean SVG with a viewBox; the server picker is plain HTML buttons.
 */

"use client";

import { Fragment, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./NetworkShapes.module.css";

interface Point {
  x: number;
  y: number;
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SERVER_X = LETTERS.map((_, i) => 12.5 + i * 25);
const SERVERS: Point[] = SERVER_X.map((x) => ({ x, y: 172 }));

// Tree: 1 core, 2 aggregation, 4 access switches.
const CORE: Point = { x: 100, y: 26 };
const AGG: Point[] = [
  { x: 50, y: 76 },
  { x: 150, y: 76 },
];
const ACCESS: Point[] = [25, 75, 125, 175].map((x) => ({ x, y: 126 }));

// Leaf-spine: 2 spines, 4 leaves.
const SPINES: Point[] = [
  { x: 62, y: 46 },
  { x: 138, y: 46 },
];
const LEAVES: Point[] = [25, 75, 125, 175].map((x) => ({ x, y: 126 }));

const d = (points: Point[]) => points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");

// Path from server A (0) to server `to` in the tree: up to the lowest shared switch.
function treePath(to: number): { points: Point[]; via: string } {
  const a = ACCESS[0];
  const s = SERVERS[to];
  if (to === 1) return { points: [SERVERS[0], a, s], via: "one access switch" };
  const acc = ACCESS[Math.floor(to / 2)];
  if (to < 4) return { points: [SERVERS[0], a, AGG[0], acc, s], via: "an aggregation switch" };
  return {
    points: [SERVERS[0], a, AGG[0], CORE, AGG[1], acc, s],
    via: "the one core switch",
  };
}

// Paths in leaf-spine: same leaf = 2 hops; otherwise one path per spine, 4 hops each.
function leafPaths(to: number): Point[][] {
  const s = SERVERS[to];
  if (to === 1) return [[SERVERS[0], LEAVES[0], s]];
  const leaf = LEAVES[Math.floor(to / 2)];
  return SPINES.map((spine) => [SERVERS[0], LEAVES[0], spine, leaf, s]);
}

// A faint cable; the lit path is drawn over it.
function Cable({ a, b }: { a: Point; b: Point }) {
  return (
    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={1} className="stroke-ink-muted/35" />
  );
}

function Switch({ p, label, hot }: { p: Point; label: string; hot: boolean }) {
  return (
    <g>
      {/* Opaque base so the lit path never shows through the label. */}
      <rect x={p.x - 20} y={p.y - 9} width={40} height={18} rx={5} className="fill-paper" />
      <rect
        x={p.x - 20}
        y={p.y - 9}
        width={40}
        height={18}
        rx={5}
        strokeWidth={1}
        className={cn(
          "transition-colors duration-300",
          hot ? "fill-(--tone-soft) stroke-(--tone)" : "fill-paper stroke-ink-muted/50",
        )}
      />
      <text
        x={p.x}
        y={p.y}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn("text-[8px] font-semibold", hot ? "fill-(--tone)" : "fill-ink-muted")}
      >
        {label}
      </text>
    </g>
  );
}

function Servers({ to, onPick }: { to: number; onPick: (i: number) => void }) {
  return (
    <g>
      {SERVERS.map((p, i) => {
        const hot = i === 0 || i === to;
        return (
          // Pointer shortcut only: the buttons under the diagram are the keyboard path.
          <g
            key={LETTERS[i]}
            onClick={() => i > 0 && onPick(i)}
            className={i > 0 ? "cursor-pointer" : undefined}
          >
            <circle cx={p.x} cy={p.y} r={11} className="fill-transparent" />
            <rect
              x={p.x - 6.5}
              y={p.y - 6.5}
              width={13}
              height={13}
              rx={3}
              strokeWidth={1}
              className={cn(
                "transition-colors duration-300",
                hot ? "fill-(--tone) stroke-(--tone)" : "fill-paper stroke-ink-muted/60",
              )}
            />
            <text
              x={p.x}
              y={p.y + 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn("font-mono text-[7.5px] font-bold", hot ? "fill-paper" : "fill-ink")}
            >
              {LETTERS[i]}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// The lit path: draws in, then packets ride it. `offset` staggers a second path.
function HotPath({ points, offset = 0 }: { points: Point[]; offset?: number }) {
  const path = d(points);
  return (
    <g>
      <path
        d={path}
        pathLength={1}
        fill="none"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("stroke-(--tone)", styles.draw)}
      />
      {[0, 1].map((k) => (
        <circle key={k} r={3.6} className={cn("fill-(--tone) stroke-paper", styles.packet)}>
          <animateMotion
            dur="2.4s"
            begin={`${offset + k * 1.2}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      ))}
    </g>
  );
}

function Panel({
  tone,
  title,
  sub,
  hops,
  detail,
  label,
  children,
}: {
  tone: "amber" | "green";
  title: string;
  sub: string;
  hops: number;
  detail: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section
      data-tone={tone}
      className="min-w-0 rounded-2xl border border-(--tone-line) bg-(image:--tone-fill) p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-bold text-(--tone)">{title}</p>
          <p className="text-sm text-ink-muted">{sub}</p>
        </div>
        <p
          key={`${hops}-${detail}`}
          className="tut-pop rounded-lg border border-(--tone-line) bg-paper px-2.5 py-1 text-right"
        >
          <span className="block font-mono text-lg leading-tight font-bold text-(--tone)">
            {hops} hops
          </span>
          <span className="block text-xs text-ink-muted">{detail}</span>
        </p>
      </div>
      <svg
        viewBox="0 0 200 186"
        role="img"
        aria-label={label}
        className="mx-auto mt-2 block w-full max-w-[26rem] select-none"
      >
        {children}
      </svg>
    </section>
  );
}

export default function NetworkShapes() {
  const [to, setTo] = useState(7);
  const tree = treePath(to);
  const leaf = leafPaths(to);
  const treeHops = tree.points.length - 1;
  const leafHops = leaf[0].length - 1;
  const inTree = (p: Point) => tree.points.includes(p);
  const inLeaf = (p: Point) => leaf.some((path) => path.includes(p));
  const usesCore = inTree(CORE);

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <Panel
          tone="amber"
          title="Three-tier tree"
          sub="built for north-south"
          hops={treeHops}
          detail={`via ${tree.via}`}
          label={`Three-tier tree network. Server A to server ${LETTERS[to]} takes ${treeHops} hops, through ${tree.via}.`}
        >
          {AGG.map((g) => (
            <Cable key={`c${g.x}`} a={CORE} b={g} />
          ))}
          {ACCESS.map((acc, i) => (
            <Cable key={`a${acc.x}`} a={AGG[Math.floor(i / 2)]} b={acc} />
          ))}
          {SERVERS.map((s, i) => (
            <Cable key={`s${s.x}`} a={ACCESS[Math.floor(i / 2)]} b={s} />
          ))}
          <HotPath key={`t${to}`} points={tree.points} />
          {usesCore && (
            <rect
              x={CORE.x - 20}
              y={CORE.y - 9}
              width={40}
              height={18}
              rx={5}
              strokeWidth={1.5}
              className={cn("fill-none stroke-(--tone)", styles.busy)}
            />
          )}
          <Switch p={CORE} label="core" hot={usesCore} />
          {AGG.map((g) => (
            <Switch key={`g${g.x}`} p={g} label="agg" hot={inTree(g)} />
          ))}
          {ACCESS.map((acc) => (
            <Switch key={`x${acc.x}`} p={acc} label="access" hot={inTree(acc)} />
          ))}
          <Servers to={to} onPick={setTo} />
        </Panel>

        <Panel
          tone="green"
          title="Leaf-spine"
          sub="built for east-west"
          hops={leafHops}
          detail={leaf.length > 1 ? `${leaf.length} equal paths` : "same leaf"}
          label={`Leaf-spine network. Server A to server ${LETTERS[to]} takes ${leafHops} hops${leaf.length > 1 ? ", over either of the two spines" : ""}.`}
        >
          {LEAVES.map((l) => (
            <Fragment key={`l${l.x}`}>
              {SPINES.map((sp) => (
                <Cable key={`${l.x}-${sp.x}`} a={l} b={sp} />
              ))}
            </Fragment>
          ))}
          {SERVERS.map((s, i) => (
            <Cable key={`s${s.x}`} a={LEAVES[Math.floor(i / 2)]} b={s} />
          ))}
          {leaf.map((path, k) => (
            <HotPath key={`l${to}-${path[2].x}`} points={path} offset={k * 0.6} />
          ))}
          {SPINES.map((sp) => (
            <Switch key={`sp${sp.x}`} p={sp} label="spine" hot={inLeaf(sp)} />
          ))}
          {LEAVES.map((l) => (
            <Switch key={`lf${l.x}`} p={l} label="leaf" hot={inLeaf(l)} />
          ))}
          <Servers to={to} onPick={setTo} />
        </Panel>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
          Send from A to
        </span>
        {LETTERS.slice(1).map((letter, idx) => {
          const i = idx + 1;
          return (
            <button
              key={letter}
              type="button"
              data-tone="violet"
              aria-pressed={to === i}
              aria-label={`Server ${letter}`}
              onClick={() => setTo(i)}
              className={cn(
                "min-h-10 min-w-10 rounded-lg border border-(--tone-line) font-mono text-sm font-bold transition-colors active:translate-y-px",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)",
                to === i ? "bg-(--tone) text-paper" : "text-(--tone) hover:bg-(--tone-soft)",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-3 text-sm text-ink">
        A → {LETTERS[to]}: <b>{treeHops} hops</b> in the tree (via {tree.via}),{" "}
        <b>{leafHops} hops</b> in leaf-spine
        {leaf.length > 1 ? ", and the load can split over both spines." : "."}
      </p>
    </div>
  );
}
