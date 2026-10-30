/*
 * ClusterSim.tsx
 * A toy three-node cluster you can break: change the wanted replica count, delete a pod, take
 * a node down or bring it back. A reconcile loop (one fix per tick) notices the gap between
 * wanted and actual and repairs it, and says what it did in an aria-live log. The first render
 * is fixed, with no randomness, so server and client markup match.
 */

"use client";

import { Minus, Plus, Server, X } from "lucide-react";
import { useEffect, useReducer } from "react";
import { cn } from "@/lib/utils";

const MAX_PODS = 6;
const TICK_MS = 700;
const LOG_LINES = 6;

const BUTTON = cn(
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border-2 border-pen text-ink",
  "hover:bg-pen hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
);

interface ClusterNode {
  id: string;
  up: boolean;
}

interface Pod {
  id: string;
  /** The node it runs on; null means Pending (no node chosen yet). */
  node: string | null;
}

interface State {
  nodes: ClusterNode[];
  pods: Pod[];
  wanted: number;
  nextPod: number;
  log: string[];
}

type Action =
  | { type: "wanted"; value: number }
  | { type: "killPod"; id: string }
  | { type: "toggleNode"; id: string }
  | { type: "tick" };

const INITIAL: State = {
  nodes: [
    { id: "node-1", up: true },
    { id: "node-2", up: true },
    { id: "node-3", up: true },
  ],
  pods: [
    { id: "web-1", node: "node-1" },
    { id: "web-2", node: "node-2" },
    { id: "web-3", node: "node-3" },
  ],
  wanted: 3,
  nextPod: 4,
  log: ["Cluster ready: 3 pods wanted, 3 running."],
};

// Appends a line to the log, keeping only the newest few.
function say(state: State, line: string): string[] {
  return [...state.log, line].slice(-LOG_LINES);
}

// The state with one pod removed.
function without(state: State, id: string): State {
  return { ...state, pods: state.pods.filter((pod) => pod.id !== id) };
}

// True when the pod sits on a node that is down.
function isLost(state: State, pod: Pod): boolean {
  return state.nodes.some((node) => node.id === pod.node && !node.up);
}

// Picks the up node with the fewest live pods (first one on a tie), or null if all are down.
function leastLoaded(state: State): string | null {
  const counts = state.nodes
    .filter((node) => node.up)
    .map((node) => ({
      id: node.id,
      count: state.pods.filter((pod) => pod.node === node.id).length,
    }));
  counts.sort((a, b) => a.count - b.count);

  return counts[0]?.id ?? null;
}

// The pod to remove when there are too many: a Pending one first, else from the busiest node.
function pickExtra(state: State): Pod {
  const pending = state.pods.find((pod) => pod.node === null);
  if (pending) return pending;
  const load = (pod: Pod) => state.pods.filter((other) => other.node === pod.node).length;

  return [...state.pods].sort((a, b) => load(b) - load(a))[0];
}

// True when the cluster still has work to do to match the wanted state.
function needsWork(state: State): boolean {
  const live = state.pods.filter((pod) => !isLost(state, pod));
  const placeable = state.pods.some((pod) => pod.node === null) && leastLoaded(state) !== null;

  return live.length !== state.wanted || live.length !== state.pods.length || placeable;
}

// One step of the reconcile loop: fix exactly one difference between wanted and actual.
function tick(state: State): State {
  const lost = state.pods.find((pod) => isLost(state, pod));
  if (lost) {
    const line = `Controller: ${lost.id} was on ${lost.node}, which is down. Removing it.`;
    return { ...without(state, lost.id), log: say(state, line) };
  }

  if (state.pods.length < state.wanted) {
    const node = leastLoaded(state);
    const id = `web-${state.nextPod}`;
    const line = node
      ? `Scheduler: ${id} placed on ${node}.`
      : `Scheduler: no node is up, so ${id} stays Pending.`;
    return {
      ...state,
      pods: [...state.pods, { id, node }],
      nextPod: state.nextPod + 1,
      log: say(state, `Controller: only ${state.pods.length} of ${state.wanted} pods. ${line}`),
    };
  }

  if (state.pods.length > state.wanted) {
    const extra = pickExtra(state);
    const line = `Controller: too many pods (${state.pods.length}). Removing ${extra.id}.`;
    return { ...without(state, extra.id), log: say(state, line) };
  }

  const waiting = state.pods.find((pod) => pod.node === null);
  const node = leastLoaded(state);
  if (waiting && node) {
    const pods = state.pods.map((pod) => (pod.id === waiting.id ? { ...pod, node } : pod));
    return { ...state, pods, log: say(state, `Scheduler: ${waiting.id} placed on ${node}.`) };
  }

  return state;
}

// Applies one user action or one loop tick.
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "wanted": {
      const wanted = Math.min(MAX_PODS, Math.max(1, action.value));
      if (wanted === state.wanted) return state;
      return { ...state, wanted, log: say(state, `You changed replicas to ${wanted}.`) };
    }
    case "killPod":
      return { ...without(state, action.id), log: say(state, `You deleted ${action.id}.`) };
    case "toggleNode": {
      const nodes = state.nodes.map((node) =>
        node.id === action.id ? { ...node, up: !node.up } : node,
      );
      const up = nodes.find((node) => node.id === action.id)?.up;
      const line = up
        ? `You restored ${action.id}. It can take pods again.`
        : `You took ${action.id} down. Its pods are unreachable.`;
      return { ...state, nodes, log: say(state, line) };
    }
    case "tick":
      return tick(state);
  }
}

export default function ClusterSim() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const running = state.pods.filter((pod) => pod.node !== null && !isLost(state, pod)).length;
  const busy = needsWork(state);

  // While wanted and actual differ, run the next fix after a short pause (none if the reader
  // prefers reduced motion). The timer is cleared whenever the state changes or on unmount.
  useEffect(() => {
    if (!busy) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => dispatch({ type: "tick" }), calm ? 0 : TICK_MS);

    return () => window.clearTimeout(timer);
  }, [busy, state]);

  return (
    <div className="my-8 rounded-xl border-2 border-ink p-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div role="group" aria-label="Wanted replicas" className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Fewer replicas"
            disabled={state.wanted <= 1}
            onClick={() => dispatch({ type: "wanted", value: state.wanted - 1 })}
            className={BUTTON}
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <p className="min-w-24 text-center font-semibold text-ink">
            Wanted: <output>{state.wanted}</output>
          </p>
          <button
            type="button"
            aria-label="More replicas"
            disabled={state.wanted >= MAX_PODS}
            onClick={() => dispatch({ type: "wanted", value: state.wanted + 1 })}
            className={BUTTON}
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <p className="font-semibold text-ink">
          Running: {running} {busy ? "(fixing...)" : "(matches)"}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {state.nodes.map((node) => (
          <div
            key={node.id}
            data-tone={node.up ? "green" : "red"}
            className="rounded-lg border-2 border-(--tone) bg-(--tone-soft) p-3"
          >
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Server className="h-4 w-4 shrink-0 text-(--tone)" aria-hidden />
              {node.id}
              <span className="text-sm font-semibold text-(--tone)">{node.up ? "up" : "down"}</span>
            </p>
            <ul className="my-2 flex min-h-24 list-none flex-col gap-1.5 p-0">
              {state.pods
                .filter((pod) => pod.node === node.id)
                .map((pod) => (
                  <li
                    key={pod.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-rule bg-paper pl-2 font-mono text-sm text-ink"
                  >
                    {pod.id}
                    <button
                      type="button"
                      aria-label={`Delete pod ${pod.id}`}
                      onClick={() => dispatch({ type: "killPod", id: pod.id })}
                      className={cn(BUTTON, "border-0")}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))}
            </ul>
            <button
              type="button"
              onClick={() => dispatch({ type: "toggleNode", id: node.id })}
              className={cn(BUTTON, "w-full px-3 text-sm font-medium")}
            >
              {node.up ? "Take node down" : "Restore node"}
            </button>
          </div>
        ))}
      </div>

      {state.pods.some((pod) => pod.node === null) && (
        <p className="mt-3 rounded-md border border-rule p-2 font-mono text-sm text-ink">
          Pending (no node yet):{" "}
          {state.pods
            .filter((pod) => pod.node === null)
            .map((pod) => pod.id)
            .join(", ")}
        </p>
      )}

      <ul
        role="log"
        aria-live="polite"
        aria-label="What the cluster is doing"
        className="mt-4 list-none space-y-1 rounded-lg bg-(--code-bg) p-3 font-mono text-sm text-(--code-fg)"
      >
        {state.log.map((line, index) => (
          <li key={`${index}-${line}`}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
