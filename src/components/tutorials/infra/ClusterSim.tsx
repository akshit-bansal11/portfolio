/*
 * ClusterSim.tsx
 * A toy three-node cluster you can break: change the wanted replica count, delete a pod, take
 * a node down or bring it back. A reconcile loop (one fix per tick) notices the gap between
 * wanted and actual and repairs it, and says what it did in an aria-live log. The fixes play
 * out on screen: a deleted pod turns Terminating, pods on a dead node go Unknown and shake,
 * and the scheduler sends each new pod down a wire into the node it picked. Hovering a pod
 * dims the others and outlines its node. The first render is fixed, with no randomness, so
 * server and client markup match; the PDF prints that healthy starting state.
 */

"use client";

import { Check, Cpu, Minus, Plus, RefreshCw, Server, X } from "lucide-react";
import { type CSSProperties, useEffect, useReducer } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import { BUTTON, FRAME, motion } from "./ui";

const MAX_PODS = 6;
const TICK_MS = 800;
const LOG_LINES = 6;

interface ClusterNode {
  id: string;
  up: boolean;
}

interface Pod {
  id: string;
  /** The node it runs on; null means Pending (no node chosen yet). */
  node: string | null;
  /** Deleted or scaled away, still shutting down. */
  terminating?: boolean;
}

interface Line {
  n: number;
  text: string;
}

interface State {
  nodes: ClusterNode[];
  pods: Pod[];
  wanted: number;
  nextPod: number;
  log: Line[];
  /** Bumps on every log line: keys for one-shot animations. */
  seq: number;
  /** The node the scheduler just placed a pod on, for the packet down its wire. */
  placed: { node: string; n: number } | null;
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
  log: [{ n: 0, text: "Cluster ready: 3 pods wanted, 3 running." }],
  seq: 0,
  placed: null,
};

// Who speaks in the log, by the line's first word.
const ACTORS: { prefix: string; label: string; tone: Tone }[] = [
  { prefix: "You", label: "you", tone: "violet" },
  { prefix: "Controller:", label: "controller", tone: "amber" },
  { prefix: "Scheduler:", label: "scheduler", tone: "blue" },
  { prefix: "Kubelet:", label: "kubelet", tone: "cyan" },
];

// Appends a line to the log, keeping only the newest few.
function say(state: State, text: string): Pick<State, "log" | "seq"> {
  const seq = state.seq + 1;
  return { log: [...state.log, { n: seq, text }].slice(-LOG_LINES), seq };
}

// The state with one pod removed.
function without(state: State, id: string): State {
  return { ...state, pods: state.pods.filter((pod) => pod.id !== id) };
}

// True when the pod sits on a node that is down.
function isLost(state: State, pod: Pod): boolean {
  return state.nodes.some((node) => node.id === pod.node && !node.up);
}

// Pods that still count towards the wanted number.
function active(state: State): Pod[] {
  return state.pods.filter((pod) => !pod.terminating);
}

// Picks the up node with the fewest live pods (first one on a tie), or null if all are down.
function leastLoaded(state: State): string | null {
  const counts = state.nodes
    .filter((node) => node.up)
    .map((node) => ({
      id: node.id,
      count: active(state).filter((pod) => pod.node === node.id).length,
    }));
  counts.sort((a, b) => a.count - b.count);

  return counts[0]?.id ?? null;
}

// The pod to remove when there are too many: a Pending one first, else from the busiest node.
function pickExtra(state: State): Pod {
  const pods = active(state);
  const pending = pods.find((pod) => pod.node === null);
  if (pending) return pending;
  const load = (pod: Pod) => pods.filter((other) => other.node === pod.node).length;

  return [...pods].sort((a, b) => load(b) - load(a))[0];
}

// True when the cluster still has work to do to match the wanted state.
function needsWork(state: State): boolean {
  const lost = state.pods.some((pod) => isLost(state, pod));
  const leaving = state.pods.some((pod) => pod.terminating);
  const placeable = state.pods.some((pod) => pod.node === null) && leastLoaded(state) !== null;

  return lost || leaving || placeable || active(state).length !== state.wanted;
}

// One step of the reconcile loop: fix exactly one difference between wanted and actual.
function tick(state: State): State {
  const lost = state.pods.find((pod) => isLost(state, pod));
  if (lost) {
    const line = `Controller: ${lost.id} was on ${lost.node}, which is down. Removing it.`;
    return { ...without(state, lost.id), ...say(state, line) };
  }

  const count = active(state).length;
  if (count < state.wanted) {
    const node = leastLoaded(state);
    const id = `web-${state.nextPod}`;
    const line = node
      ? `Scheduler: ${id} placed on ${node}.`
      : `Scheduler: no node is up, so ${id} stays Pending.`;
    const next = say(state, `Controller: only ${count} of ${state.wanted} pods. ${line}`);
    return {
      ...state,
      ...next,
      pods: [...state.pods, { id, node }],
      nextPod: state.nextPod + 1,
      placed: node ? { node, n: next.seq } : state.placed,
    };
  }

  const leaving = state.pods.find((pod) => pod.terminating);
  if (leaving) {
    const line = `Kubelet: ${leaving.id} shut down cleanly and is gone.`;
    return { ...without(state, leaving.id), ...say(state, line) };
  }

  if (count > state.wanted) {
    const extra = pickExtra(state);
    const pods = state.pods.map((pod) =>
      pod.id === extra.id ? { ...pod, terminating: true } : pod,
    );
    const line = `Controller: too many pods (${count}). Stopping ${extra.id}.`;
    return { ...state, pods, ...say(state, line) };
  }

  const waiting = state.pods.find((pod) => pod.node === null);
  const node = leastLoaded(state);
  if (waiting && node) {
    const pods = state.pods.map((pod) => (pod.id === waiting.id ? { ...pod, node } : pod));
    const next = say(state, `Scheduler: ${waiting.id} placed on ${node}.`);
    return { ...state, pods, ...next, placed: { node, n: next.seq } };
  }

  return state;
}

// Applies one user action or one loop tick.
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "wanted": {
      const wanted = Math.min(MAX_PODS, Math.max(1, action.value));
      if (wanted === state.wanted) return state;
      return { ...state, wanted, ...say(state, `You changed replicas to ${wanted}.`) };
    }
    case "killPod": {
      const pods = state.pods.map((pod) =>
        pod.id === action.id ? { ...pod, terminating: true } : pod,
      );
      return { ...state, pods, ...say(state, `You deleted ${action.id}. It is Terminating.`) };
    }
    case "toggleNode": {
      const nodes = state.nodes.map((node) =>
        node.id === action.id ? { ...node, up: !node.up } : node,
      );
      const up = nodes.find((node) => node.id === action.id)?.up;
      const line = up
        ? `You restored ${action.id}. It can take pods again.`
        : `You took ${action.id} down. Its pods are unreachable.`;
      return { ...state, nodes, ...say(state, line) };
    }
    case "tick":
      return tick(state);
  }
}

// One pod chip. Running pods can be deleted; the others show what is happening to them.
function PodChip({ pod, lost, onDelete }: { pod: Pod; lost: boolean; onDelete: () => void }) {
  const status = lost ? "Unknown" : pod.terminating ? "Terminating" : "Running";
  const tone: Tone = lost ? "red" : pod.terminating ? "amber" : "green";

  return (
    <li
      data-pod
      data-tone={tone}
      className={cn(
        motion["drop-in"],
        "dg-node flex min-h-11 items-center gap-2 rounded-lg border border-(--tone-line) bg-paper py-0.5 pr-0.5 pl-2.5",
        lost && "tut-shake",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 shrink-0 rounded-full bg-(--tone)",
          !lost && !pod.terminating && "tut-ping",
          pod.terminating && motion.breathe,
        )}
      />
      <span className="min-w-0 flex-1 leading-tight">
        <span
          className={cn(
            "block font-mono text-sm text-ink",
            (lost || pod.terminating) && "line-through decoration-(--tone)",
          )}
        >
          {pod.id}
        </span>
        <span className="block text-[0.7rem] font-semibold tracking-wide text-(--tone) uppercase">
          {status}
        </span>
      </span>
      {!lost && !pod.terminating && (
        <button
          type="button"
          aria-label={`Delete pod ${pod.id}`}
          onClick={onDelete}
          data-tone="red"
          className={cn(BUTTON, "min-w-10 border-transparent bg-transparent px-0 print:hidden")}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </li>
  );
}

export default function ClusterSim() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const running = state.pods.filter(
    (pod) => pod.node !== null && !pod.terminating && !isLost(state, pod),
  ).length;
  const pending = state.pods.filter((pod) => pod.node === null);
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
    <div data-widget="cluster-sim" data-tone="k8s" className={FRAME}>
      <div className="dg-canvas rounded-xl border border-rule p-3">
        {/* Control plane: what you asked for, what is true, and whether the loop is working. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-(--tone-line) bg-paper p-3 [background-image:var(--tone-fill)]">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper text-(--tone)">
              <Cpu className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-tight">
              Control plane
              <span
                data-tone={busy ? "amber" : "green"}
                className="flex items-center gap-1 text-xs font-semibold text-(--tone)"
              >
                {busy ? (
                  <RefreshCw className={cn("h-3 w-3", motion.spin)} aria-hidden />
                ) : (
                  <Check className="h-3 w-3" aria-hidden />
                )}
                {busy ? "reconciling…" : "in sync"}
              </span>
            </span>
          </p>

          <div role="group" aria-label="Wanted replicas" className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Fewer replicas"
              disabled={state.wanted <= 1}
              onClick={() => dispatch({ type: "wanted", value: state.wanted - 1 })}
              className={cn(BUTTON, "min-w-10 px-0 print:hidden")}
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <p className="min-w-20 text-center text-sm text-ink-muted">
              wanted{" "}
              <output className="block font-mono text-lg leading-none font-bold text-ink">
                {state.wanted}
              </output>
            </p>
            <button
              type="button"
              aria-label="More replicas"
              disabled={state.wanted >= MAX_PODS}
              onClick={() => dispatch({ type: "wanted", value: state.wanted + 1 })}
              className={cn(BUTTON, "min-w-10 px-0 print:hidden")}
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {/* One slot per wanted pod: filled when a pod runs in it. */}
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <span>running</span>
            <span aria-hidden className="flex gap-1">
              {Array.from({ length: Math.max(state.wanted, running) }, (_, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: slots are positional.
                  key={i}
                  data-tone={i < running && i < state.wanted ? "green" : "amber"}
                  className={cn(
                    "h-3 w-3 rounded-full border border-(--tone) transition-colors duration-300",
                    i < running ? "bg-(--tone)" : "border-dashed bg-transparent",
                  )}
                />
              ))}
            </span>
            <span className="font-mono font-bold text-ink">
              {running}/{state.wanted}
            </span>
          </div>
        </div>

        {pending.length > 0 && (
          <ul
            data-tone="amber"
            aria-label="Pending pods"
            className="mt-3 flex list-none flex-wrap items-center gap-2 rounded-lg border border-dashed border-(--tone-line) p-2 text-sm"
          >
            <li className="font-semibold text-(--tone)">Pending, no node fits:</li>
            {pending.map((pod) => (
              <li
                key={pod.id}
                className={cn(
                  motion["drop-in"],
                  "rounded-md border border-dashed border-(--tone) px-2 py-0.5 font-mono text-ink",
                )}
              >
                <span className={motion.breathe}>{pod.id}</span>
              </li>
            ))}
          </ul>
        )}

        {/* The nodes. A wire from the control plane carries each newly scheduled pod down. */}
        <div className="mt-3 grid gap-3 sm:mt-0 sm:grid-cols-3">
          {state.nodes.map((node) => {
            const pods = state.pods.filter((pod) => pod.node === node.id);
            const hit = state.placed?.node === node.id ? state.placed.n : null;
            return (
              <div key={node.id} data-tone={node.up ? "green" : "red"} className="flex flex-col">
                <span
                  aria-hidden
                  className="relative mx-auto hidden h-7 w-[2px] bg-(--tone-line) sm:block"
                >
                  {hit !== null && (
                    <span
                      key={hit}
                      data-tone="k8s"
                      className={cn(
                        motion["drop-packet"],
                        "absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--tone) opacity-0 shadow-[0_0_0_3px_var(--tone-soft)]",
                      )}
                    />
                  )}
                </span>
                <section
                  aria-label={`${node.id}, ${node.up ? "ready" : "down"}`}
                  className={cn(
                    "relative flex flex-1 flex-col rounded-xl border bg-paper p-3 transition-[border-color,background-color,opacity] duration-300",
                    "has-[[data-pod]:hover]:border-(--tone) has-[[data-pod]:hover]:shadow-[0_10px_24px_-16px_var(--tone)]",
                    node.up
                      ? "border-(--tone-line)"
                      : "border-dashed border-(--tone) bg-(--tone-soft)",
                  )}
                >
                  {hit !== null && (
                    <span
                      key={hit}
                      aria-hidden
                      data-tone="k8s"
                      className={cn(
                        motion["ping-once"],
                        "pointer-events-none absolute inset-0 rounded-xl",
                      )}
                      style={{ "--delay": "0.45s" } as CSSProperties}
                    />
                  )}
                  <p className="flex items-center gap-2 font-semibold text-ink">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone)">
                      <Server className="h-4 w-4" aria-hidden />
                    </span>
                    {node.id}
                    <span className="ml-auto rounded-full border border-(--tone-line) px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-(--tone) uppercase">
                      {node.up ? "Ready" : "NotReady"}
                    </span>
                  </p>
                  <ul className="my-3 flex min-h-12 list-none sm:min-h-24 flex-col gap-1.5 p-0">
                    {pods.map((pod) => (
                      <PodChip
                        key={pod.id}
                        pod={pod}
                        lost={!node.up}
                        onDelete={() => dispatch({ type: "killPod", id: pod.id })}
                      />
                    ))}
                    {pods.length === 0 && (
                      <li className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-rule text-sm text-ink-muted">
                        {node.up ? "no pods" : "unreachable"}
                      </li>
                    )}
                  </ul>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "toggleNode", id: node.id })}
                    data-tone={node.up ? "red" : "green"}
                    className={cn(BUTTON, "mt-auto w-full print:hidden")}
                  >
                    {node.up ? "Take node down" : "Restore node"}
                  </button>
                </section>
              </div>
            );
          })}
        </div>
      </div>

      <ul
        role="log"
        aria-live="polite"
        aria-label="What the cluster is doing"
        className="mt-3 list-none space-y-1 rounded-xl border border-rule bg-paper p-3 font-mono text-[0.8rem] leading-snug text-ink sm:text-sm"
      >
        {state.log.map((line, index) => {
          const actor = ACTORS.find((a) => line.text.startsWith(a.prefix));
          const newest = index === state.log.length - 1;
          return (
            <li
              key={line.n}
              data-tone={actor?.tone ?? "green"}
              className={cn(
                "flex items-start gap-2 transition-opacity",
                newest ? motion["slide-in"] : "opacity-70",
              )}
            >
              <span className="mt-0.5 w-[5.5rem] shrink-0 rounded border border-(--tone-line) bg-(--tone-soft) px-1 text-center text-[0.68rem] font-bold tracking-wide text-(--tone) uppercase">
                {actor?.label ?? "cluster"}
              </span>
              <span className="min-w-0">
                {actor ? line.text.slice(actor.prefix.length).trim() : line.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
