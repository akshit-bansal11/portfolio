/*
 * ContainerLifecycle.tsx
 * The life of one container as a state machine. The states sit on a small map; a frame
 * slides to the current state and the path each command took is drawn in. Only commands
 * that are valid in the current state are enabled, so the reader learns why `docker rm`
 * refuses a running container and what `run` really is. Hovering or focusing a command
 * previews where it would go. The printed copy is the map plus the full transition table.
 */

"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { type CSSProperties, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import { BUTTON, FRAME, motion } from "./ui";

type State = "image" | "created" | "running" | "paused" | "exited" | "removed";

interface Place {
  /** Centre on the wide map (percent). */
  x: number;
  y: number;
  /** Centre on the narrow (phone) map (percent). */
  mx: number;
  my: number;
}

const STATES: { id: State; label: string; note: string; tone: Tone; at: Place }[] = [
  {
    id: "image",
    label: "Image",
    note: "read-only layers",
    tone: "blue",
    at: { x: 10, y: 30, mx: 28, my: 10 },
  },
  {
    id: "created",
    label: "Created",
    note: "writable layer, no process",
    tone: "cyan",
    at: { x: 30, y: 30, mx: 28, my: 30 },
  },
  {
    id: "running",
    label: "Running",
    note: "main process alive",
    tone: "green",
    at: { x: 50, y: 30, mx: 28, my: 50 },
  },
  {
    id: "paused",
    label: "Paused",
    note: "processes frozen",
    tone: "amber",
    at: { x: 50, y: 79, mx: 76, my: 50 },
  },
  {
    id: "exited",
    label: "Exited",
    note: "process ended, files kept",
    tone: "pink",
    at: { x: 70, y: 30, mx: 28, my: 70 },
  },
  {
    id: "removed",
    label: "Removed",
    note: "writable layer deleted",
    tone: "red",
    at: { x: 90, y: 30, mx: 28, my: 90 },
  },
];

const BY_ID = Object.fromEntries(STATES.map((s) => [s.id, s])) as Record<
  State,
  (typeof STATES)[number]
>;

interface Command {
  cmd: string;
  from: State[];
  to: State;
  says: string;
  /** What the Exited box says after this command. */
  exit?: string;
}

const COMMANDS: Command[] = [
  {
    cmd: "docker create",
    from: ["image"],
    to: "created",
    says: "Makes the container (its writable layer and settings) but starts nothing.",
  },
  {
    cmd: "docker run",
    from: ["image"],
    to: "running",
    says: "create + start in one go. This is what you type 95% of the time.",
  },
  {
    cmd: "docker start",
    from: ["created", "exited"],
    to: "running",
    says: "Starts the main process again. Files written in the writable layer are still there.",
  },
  {
    cmd: "docker pause",
    from: ["running"],
    to: "paused",
    says: "Freezes every process with the cgroup freezer. Memory stays allocated.",
  },
  {
    cmd: "docker unpause",
    from: ["paused"],
    to: "running",
    says: "Thaws the processes exactly where they were.",
  },
  {
    cmd: "docker stop",
    from: ["running"],
    to: "exited",
    says: "Sends SIGTERM, waits 10 s, then SIGKILL. Apps should catch SIGTERM and shut down cleanly.",
    exit: "SIGTERM, then exit",
  },
  {
    cmd: "docker kill",
    from: ["running"],
    to: "exited",
    says: "SIGKILL straight away. No cleanup. Use when stop hangs.",
    exit: "SIGKILL, exit code 137",
  },
  {
    cmd: "docker restart",
    from: ["running", "exited"],
    to: "running",
    says: "stop + start. Same container, same writable layer.",
  },
  {
    cmd: "docker rm",
    from: ["created", "exited"],
    to: "removed",
    says: "Deletes the container and its writable layer. Volumes survive.",
  },
  {
    cmd: "docker rm -f",
    from: ["running", "paused"],
    to: "removed",
    says: "Kills and removes in one step. The writable layer is gone for good.",
  },
];

// Where a state sits, as CSS variables the map's classes read.
function placeVars(at: Place): CSSProperties {
  return {
    "--x": `${at.x}%`,
    "--y": `${at.y}%`,
    "--mx": `${at.mx}%`,
    "--my": `${at.my}%`,
  } as CSSProperties;
}

const PLACED =
  "absolute top-(--my) left-(--mx) h-16 w-[44%] sm:h-14 -translate-x-1/2 -translate-y-1/2 sm:top-(--y) sm:left-(--x) sm:w-[17%]";

// The fixed tracks between states, for one map layout.
function Tracks({ wide, from, to, n }: { wide: boolean; from?: State; to?: State; n: number }) {
  const xy = (id: State) => {
    const at = BY_ID[id].at;
    return wide ? [at.x, at.y] : [at.mx, at.my];
  };
  const line = (a: State, b: State) => {
    const [x1, y1] = xy(a);
    const [x2, y2] = xy(b);
    return `M${x1} ${y1} L${x2} ${y2}`;
  };
  const run = wide ? "M10 16 Q30 -4 50 16" : "M6 10 Q-6 30 6 50";

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn(
        "absolute inset-0 h-full w-full overflow-visible",
        wide ? "hidden sm:block" : "sm:hidden",
      )}
    >
      <g className="fill-none stroke-(--tone-line)" strokeWidth="1.5">
        <path d={line("image", "removed")} vectorEffect="non-scaling-stroke" />
        <path d={line("running", "paused")} vectorEffect="non-scaling-stroke" />
        <path d={run} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
      </g>
      {from && to && from !== to && (
        <path
          key={`${n}-${wide}`}
          data-tone={BY_ID[to].tone}
          d={line(from, to)}
          pathLength={1}
          className={cn(motion.draw, "fill-none stroke-(--tone)")}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

export default function ContainerLifecycle() {
  const [state, setState] = useState<State>("image");
  const [last, setLast] = useState<{ command: Command; from: State; n: number } | null>(null);
  const [preview, setPreview] = useState<Command | null>(null);
  const current = BY_ID[state];
  const target = preview && preview.from.includes(state) ? BY_ID[preview.to] : null;

  function run(command: Command) {
    setLast({ command, from: state, n: (last?.n ?? 0) + 1 });
    setState(command.to);
    setPreview(null);
  }

  function noteFor(id: State, fallback: string) {
    if (id === "exited" && last?.command.exit && state === "exited") return last.command.exit;
    return fallback;
  }

  return (
    <div data-widget="container-lifecycle" data-tone="docker" className={FRAME}>
      {/* The state map. Lines are the usual moves; the dashed arc is `run` skipping Created. */}
      <div
        role="img"
        aria-label={`Container state map. Current state: ${current.label}.`}
        className="dg-canvas relative h-[26rem] rounded-xl border border-rule sm:h-56"
      >
        <div data-tone="docker" className="absolute inset-3 sm:inset-x-4 sm:inset-y-5">
          <Tracks wide from={last?.from} to={last ? state : undefined} n={last?.n ?? 0} />
          <Tracks wide={false} from={last?.from} to={last ? state : undefined} n={last?.n ?? 0} />
          <span className="absolute top-[-0.6rem] left-[30%] hidden -translate-x-1/2 rounded bg-paper-raised px-1.5 font-mono text-[0.7rem] text-ink-muted sm:block">
            run = create + start
          </span>

          {STATES.map((s) => (
            <div
              key={s.id}
              data-tone={s.tone}
              style={placeVars(s.at)}
              className={cn(
                PLACED,
                "flex flex-col justify-center rounded-xl border border-(--tone-line) bg-paper px-2.5 leading-tight",
              )}
            >
              <span className="flex items-center gap-1.5 text-sm font-bold text-(--tone)">
                <span
                  aria-hidden
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full bg-(--tone)",
                    s.id === "running" && state === "running" && "tut-ping",
                    s.id !== state && "opacity-40",
                  )}
                />
                {s.label}
              </span>
              <span className="line-clamp-2 text-[0.72rem] text-ink-muted sm:truncate">
                {noteFor(s.id, s.note)}
              </span>
            </div>
          ))}

          {/* Preview of where the hovered command goes. */}
          {target && target.id !== state && (
            <span
              aria-hidden
              data-tone={target.tone}
              style={placeVars(target.at)}
              className={cn(
                PLACED,
                "pointer-events-none rounded-xl border-[1.5px] border-dashed border-(--tone) bg-(--tone-soft)",
              )}
            />
          )}

          {/* The current-state frame; it slides from state to state. */}
          <span
            aria-hidden
            data-tone={current.tone}
            style={placeVars(current.at)}
            className={cn(
              PLACED,
              "pointer-events-none rounded-xl border-[1.5px] border-(--tone) bg-(--tone-soft) shadow-[0_10px_24px_-14px_var(--tone)]",
              "motion-safe:transition-[left,top,border-color,background-color] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.5,0,0.2,1)]",
            )}
          >
            <span
              key={last?.n ?? 0}
              className={cn(
                "absolute -top-2.5 -right-2 rounded-full border border-(--tone) bg-paper px-1.5 text-[0.65rem] font-bold tracking-wide text-(--tone) uppercase",
                last && "tut-pop",
              )}
              style={{ "--delay": "0.55s" } as CSSProperties}
            >
              now
            </span>
          </span>
        </div>
      </div>

      <div
        role="group"
        aria-label="Docker commands"
        className="mt-4 flex flex-wrap gap-2 print:hidden"
      >
        {COMMANDS.map((c) => {
          const ok = c.from.includes(state);
          return (
            <button
              key={c.cmd}
              type="button"
              disabled={!ok}
              data-tone={BY_ID[c.to].tone}
              onClick={() => run(c)}
              onMouseEnter={() => setPreview(c)}
              onMouseLeave={() => setPreview((p) => (p === c ? null : p))}
              onFocus={() => setPreview(c)}
              onBlur={() => setPreview((p) => (p === c ? null : p))}
              className={cn(BUTTON, "font-mono", ok && "border-(--tone-line)")}
            >
              {c.cmd}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setState("image");
            setLast(null);
          }}
          className={cn(BUTTON, "border-transparent bg-transparent text-ink-muted")}
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>

      <div
        aria-live="polite"
        className="mt-3 min-h-20 rounded-xl border border-rule bg-paper p-3 text-sm print:hidden"
      >
        {last ? (
          <div key={last.n} className={motion["slide-in"]}>
            <p className="flex flex-wrap items-center gap-2 font-mono text-ink">
              <span className="text-ink-muted">$</span>
              {last.command.cmd}
              <ArrowRight className="h-4 w-4 text-ink-muted" aria-hidden />
              <span
                data-tone={current.tone}
                className="rounded-full border border-(--tone-line) bg-(--tone-soft) px-2 font-sans text-xs font-bold text-(--tone)"
              >
                {current.label}
              </span>
            </p>
            <p className="mt-1.5 text-ink-muted">{last.command.says}</p>
          </div>
        ) : (
          <p className="text-ink-muted">
            You have an image. Press a command that is allowed right now; hover one to see where it
            leads.
          </p>
        )}
      </div>

      <table className="mt-4 hidden w-full text-sm print:table">
        <thead>
          <tr>
            <th className="text-left">Command</th>
            <th className="text-left">From</th>
            <th className="text-left">To</th>
            <th className="text-left">What it does</th>
          </tr>
        </thead>
        <tbody>
          {COMMANDS.map((c) => (
            <tr key={c.cmd}>
              <td className="font-mono">{c.cmd}</td>
              <td>{c.from.join(", ")}</td>
              <td>{c.to}</td>
              <td>{c.says}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
