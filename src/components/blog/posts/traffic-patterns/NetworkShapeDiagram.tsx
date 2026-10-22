/*
 * NetworkShapeDiagram.tsx
 * History diagram: the classic three-tier "tree" network
 * (built for traffic going up and out) next to a leaf-spine
 * network (built for servers talking to each other), with the
 * path between two servers highlighted in each.
 */

import { sketchLine, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

function Box({ x, y, label, hot, seed }: Point & { label: string; hot?: boolean; seed: number }) {
  return (
    <g>
      <rect
        x={x - 22}
        y={y - 11}
        width={44}
        height={22}
        rx={4}
        className={hot ? "fill-pen/20" : "fill-paper-raised"}
      />
      <path
        d={sketchRect(x - 22, y - 11, 44, 22, { seed, bow: 1 })}
        fill="none"
        strokeWidth={1.4}
        className={hot ? "stroke-pen" : "stroke-ink"}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ink text-[9px] font-semibold"
      >
        {label}
      </text>
    </g>
  );
}

function Wire({ a, b, hot, seed }: { a: Point; b: Point; hot?: boolean; seed: number }) {
  return (
    <path
      d={sketchLine(a.x, a.y, b.x, b.y, { seed, bow: 1.5 })}
      fill="none"
      strokeWidth={hot ? 2.6 : 1.1}
      className={cn(hot ? "stroke-pen" : "stroke-ink-muted/70")}
    />
  );
}

// Three-tier tree: 1 core, 2 aggregation, 4 access switches, 8 servers.
function Tree() {
  const core = { x: 100, y: 30 };
  const agg = [
    { x: 50, y: 80 },
    { x: 150, y: 80 },
  ];
  const access = [25, 75, 125, 175].map((x) => ({ x, y: 130 }));
  const servers = [12, 38, 62, 88, 112, 138, 162, 188].map((x) => ({ x, y: 176 }));
  // Path from server 0 to server 7 climbs all the way to the core and back down.
  const hot = (a: Point, b: Point) =>
    [servers[0], access[0], agg[0], core, agg[1], access[3], servers[7]].includes(a) &&
    [servers[0], access[0], agg[0], core, agg[1], access[3], servers[7]].includes(b);

  return (
    <g>
      {agg.map((node, i) => (
        <Wire key={`c${i}`} a={core} b={node} hot={hot(core, node)} seed={i + 1} />
      ))}
      {access.map((node, i) => (
        <Wire
          key={`a${i}`}
          a={agg[Math.floor(i / 2)]}
          b={node}
          hot={hot(agg[Math.floor(i / 2)], node)}
          seed={i + 5}
        />
      ))}
      {servers.map((node, i) => (
        <Wire
          key={`s${i}`}
          a={access[Math.floor(i / 2)]}
          b={node}
          hot={hot(access[Math.floor(i / 2)], node)}
          seed={i + 9}
        />
      ))}
      <Box {...core} label="core" hot seed={1} />
      {agg.map((node, i) => (
        <Box key={`ag${i}`} {...node} label="agg" hot seed={i + 2} />
      ))}
      {access.map((node, i) => (
        <Box key={`ac${i}`} {...node} label="access" hot={i === 0 || i === 3} seed={i + 4} />
      ))}
      {servers.map((node, i) => (
        <circle
          key={`sv${i}`}
          cx={node.x}
          cy={node.y}
          r={6}
          className={i === 0 || i === 7 ? "fill-pen" : "fill-ink-muted"}
        />
      ))}
      <text x={100} y={204} textAnchor="middle" className="fill-pen font-hand text-[15px]">
        6 hops, through one core
      </text>
    </g>
  );
}

// Leaf-spine: 2 spines, 4 leaves, every leaf wired to every spine.
function LeafSpine() {
  const spines = [
    { x: 260, y: 50 },
    { x: 340, y: 50 },
  ];
  const leaves = [225, 275, 325, 375].map((x) => ({ x, y: 130 }));
  const servers = [212, 238, 262, 288, 312, 338, 362, 388].map((x) => ({ x, y: 176 }));

  return (
    <g>
      {leaves.flatMap((leaf, i) =>
        spines.map((spine, j) => (
          <Wire
            key={`l${i}s${j}`}
            a={leaf}
            b={spine}
            hot={j === 0 && (i === 0 || i === 3)}
            seed={i * 2 + j + 20}
          />
        )),
      )}
      {servers.map((node, i) => (
        <Wire
          key={`sv${i}`}
          a={leaves[Math.floor(i / 2)]}
          b={node}
          hot={i === 0 || i === 7}
          seed={i + 30}
        />
      ))}
      {spines.map((node, i) => (
        <Box key={`sp${i}`} {...node} label="spine" hot={i === 0} seed={i + 40} />
      ))}
      {leaves.map((node, i) => (
        <Box key={`lf${i}`} {...node} label="leaf" hot={i === 0 || i === 3} seed={i + 44} />
      ))}
      {servers.map((node, i) => (
        <circle
          key={`c${i}`}
          cx={node.x}
          cy={node.y}
          r={6}
          className={i === 0 || i === 7 ? "fill-pen" : "fill-ink-muted"}
        />
      ))}
      <text x={300} y={204} textAnchor="middle" className="fill-pen font-hand text-[15px]">
        any server: 4 hops, many paths
      </text>
    </g>
  );
}

export default function NetworkShapeDiagram() {
  return (
    <svg
      viewBox="0 0 400 214"
      role="img"
      aria-label="Left: a three-tier tree network. Two servers at opposite ends must route up through access, aggregation and a single core switch, then back down. Right: a leaf-spine network where every leaf switch connects to every spine switch, so any two servers are the same short distance apart with many possible paths."
      className="w-full"
    >
      <text x={100} y={12} textAnchor="middle" className="fill-ink text-[11px] font-bold">
        three-tier tree (built for north-south)
      </text>
      <text x={300} y={12} textAnchor="middle" className="fill-ink text-[11px] font-bold">
        leaf-spine (built for east-west)
      </text>
      <Tree />
      <LeafSpine />
    </svg>
  );
}
