/*
 * ContainerLifecycle.tsx
 * The life of one container as a state machine. Only the commands that are valid in the
 * current state are enabled, so the reader learns why `docker rm` refuses a running
 * container and what `run` really is. The printed copy is the full transition table.
 */

"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

type State = "image" | "created" | "running" | "paused" | "exited" | "removed";

const STATES: { id: State; label: string; tone: Tone }[] = [
  { id: "image", label: "Image only", tone: "blue" },
  { id: "created", label: "Created", tone: "cyan" },
  { id: "running", label: "Running", tone: "green" },
  { id: "paused", label: "Paused", tone: "amber" },
  { id: "exited", label: "Exited", tone: "pink" },
  { id: "removed", label: "Removed", tone: "red" },
];

interface Command {
  cmd: string;
  from: State[];
  to: State;
  says: string;
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
  },
  {
    cmd: "docker kill",
    from: ["running"],
    to: "exited",
    says: "SIGKILL straight away. No cleanup. Use when stop hangs.",
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

export default function ContainerLifecycle() {
  const [state, setState] = useState<State>("image");
  const [last, setLast] = useState<Command | null>(null);

  function run(command: Command) {
    setState(command.to);
    setLast(command);
  }

  return (
    <div className="my-8 rounded-2xl border border-rule bg-paper-raised p-4">
      <ol
        className="flex list-none flex-wrap items-center gap-2 p-0 print:hidden"
        aria-label="Container states"
      >
        {STATES.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              data-tone={s.tone}
              aria-current={state === s.id ? "step" : undefined}
              className={cn(
                "rounded-full border-2 px-3 py-1 text-sm font-semibold transition-all",
                state === s.id
                  ? "tut-glow scale-105 border-(--tone) bg-(--tone) text-paper"
                  : "border-(--tone) text-(--tone) opacity-60",
              )}
            >
              {s.label}
            </span>
            {i < STATES.length - 1 && (
              <span aria-hidden className="text-ink-muted">
                →
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        {COMMANDS.map((c) => {
          const ok = c.from.includes(state);
          return (
            <button
              key={c.cmd}
              type="button"
              disabled={!ok}
              onClick={() => run(c)}
              className="rounded-md border border-rule bg-(--code-bg) px-2.5 py-1 font-mono text-sm text-(--code-fg) transition hover:border-(--code-keyword) disabled:cursor-not-allowed disabled:opacity-35"
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
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm text-ink-muted hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>

      <p
        aria-live="polite"
        className="mt-4 rounded-lg bg-(--code-bg) p-3 font-mono text-sm text-(--code-fg) print:hidden"
      >
        {last ? (
          <>
            <span className="text-(--code-comment)">$ </span>
            {last.cmd} hits
            <br />
            <span className="text-(--code-string)"># {last.says}</span>
          </>
        ) : (
          <span className="text-(--code-comment)">
            # You have an image. Press a command that is allowed right now.
          </span>
        )}
      </p>

      <table className="hidden w-full text-sm print:table">
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
