/*
 * dependencyGraph.ts
 * Data and rules behind the "break a module" demo.
 * Describes a small online store wired two ways (tightly
 * coupled vs loosely coupled through interfaces and an event
 * bus) and computes how a failure or a change ripples out.
 * Pure functions, no React.
 */

export type ModuleId =
  | "ui"
  | "cart"
  | "checkout"
  | "payments"
  | "inventory"
  | "shipping"
  | "email"
  | "analytics"
  | "bus";

export type Architecture = "tight" | "loose";
export type Action = "break" | "change";

/**
 * healthy   – unaffected
 * broken    – the module the reader clicked (failure)
 * changed   – the module the reader clicked (change)
 * down      – fails because something it can't live without failed
 * degraded  – still up, running a fallback ("payments are slow, try later")
 * waiting   – the bus is holding messages for a module that is down
 * idle      – fine, but receiving no new work
 * edit      – must be edited because of someone else's change
 * retest    – not edited, but must be re-tested and redeployed
 */
export type NodeState =
  | "healthy"
  | "broken"
  | "changed"
  | "down"
  | "degraded"
  | "waiting"
  | "idle"
  | "edit"
  | "retest";

export interface ModuleDef {
  label: string;
  /** Box size in SVG units. */
  width: number;
  height: number;
}

/** `from` depends on `to`. "call" = synchronous request, "event" = message via the bus. */
export interface Edge {
  from: ModuleId;
  to: ModuleId;
  kind: "call" | "event";
}

export interface ImpactEntry {
  state: NodeState;
  /** Hops from the clicked module; drives the cascade animation delay. */
  depth: number;
}

export interface Impact {
  states: Partial<Record<ModuleId, ImpactEntry>>;
  /** Handwritten one-liner explaining the result. */
  note: string;
}

export const MODULES: Record<ModuleId, ModuleDef> = {
  ui: { label: "Web UI", width: 84, height: 36 },
  cart: { label: "Cart", width: 80, height: 36 },
  checkout: { label: "Checkout", width: 88, height: 36 },
  payments: { label: "Payments", width: 88, height: 36 },
  inventory: { label: "Inventory", width: 88, height: 36 },
  shipping: { label: "Shipping", width: 84, height: 36 },
  email: { label: "Email", width: 76, height: 36 },
  analytics: { label: "Analytics", width: 88, height: 36 },
  bus: { label: "Event bus", width: 150, height: 34 },
};

export const VIEWBOX = { width: 380, height: 330 };

// Where each box sits in each architecture (centre points).
export const LAYOUTS: Record<Architecture, Partial<Record<ModuleId, { x: number; y: number }>>> = {
  tight: {
    ui: { x: 190, y: 32 },
    cart: { x: 62, y: 104 },
    checkout: { x: 190, y: 124 },
    inventory: { x: 318, y: 104 },
    payments: { x: 62, y: 214 },
    analytics: { x: 190, y: 226 },
    shipping: { x: 318, y: 214 },
    email: { x: 190, y: 302 },
  },
  loose: {
    ui: { x: 190, y: 32 },
    cart: { x: 62, y: 110 },
    checkout: { x: 190, y: 110 },
    payments: { x: 318, y: 110 },
    bus: { x: 190, y: 190 },
    inventory: { x: 50, y: 266 },
    shipping: { x: 142, y: 296 },
    email: { x: 238, y: 296 },
    analytics: { x: 330, y: 266 },
  },
};

// Tightly coupled store: everything calls everything, synchronously, and analytics
// reads checkout's tables directly. No timeouts, no fallbacks.
const TIGHT_EDGES: Edge[] = [
  { from: "ui", to: "cart", kind: "call" },
  { from: "ui", to: "checkout", kind: "call" },
  { from: "ui", to: "inventory", kind: "call" },
  { from: "cart", to: "inventory", kind: "call" },
  { from: "checkout", to: "cart", kind: "call" },
  { from: "checkout", to: "payments", kind: "call" },
  { from: "checkout", to: "inventory", kind: "call" },
  { from: "checkout", to: "shipping", kind: "call" },
  { from: "checkout", to: "email", kind: "call" },
  { from: "payments", to: "analytics", kind: "call" },
  { from: "inventory", to: "analytics", kind: "call" },
  { from: "shipping", to: "inventory", kind: "call" },
  { from: "shipping", to: "email", kind: "call" },
  { from: "analytics", to: "checkout", kind: "call" },
];

// Loosely coupled store: a few synchronous calls behind interfaces (with fallbacks),
// and everything that doesn't need an answer right now goes through the event bus.
const LOOSE_EDGES: Edge[] = [
  { from: "ui", to: "cart", kind: "call" },
  { from: "ui", to: "checkout", kind: "call" },
  { from: "checkout", to: "cart", kind: "call" },
  { from: "checkout", to: "payments", kind: "call" },
  { from: "checkout", to: "bus", kind: "event" },
  { from: "payments", to: "bus", kind: "event" },
  { from: "inventory", to: "bus", kind: "event" },
  { from: "bus", to: "inventory", kind: "event" },
  { from: "bus", to: "shipping", kind: "event" },
  { from: "bus", to: "email", kind: "event" },
  { from: "bus", to: "analytics", kind: "event" },
];

export const EDGES: Record<Architecture, Edge[]> = { tight: TIGHT_EDGES, loose: LOOSE_EDGES };

// Modules that exist in a given architecture.
export function modulesFor(architecture: Architecture): ModuleId[] {
  return Object.keys(LAYOUTS[architecture]).filter((id): id is ModuleId => id in MODULES);
}

// Everyone that calls `target` directly.
function callersOf(edges: Edge[], target: ModuleId): ModuleId[] {
  return edges
    .filter((edge) => edge.kind === "call" && edge.to === target)
    .map((edge) => edge.from);
}

// Breadth-first walk up the "who depends on me" tree. Returns hop counts.
function dependentsByDepth(edges: Edge[], start: ModuleId): Map<ModuleId, number> {
  const depths = new Map<ModuleId, number>([[start, 0]]);
  const queue: ModuleId[] = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    const depth = depths.get(current) ?? 0;
    for (const caller of callersOf(edges, current)) {
      if (!depths.has(caller)) {
        depths.set(caller, depth + 1);
        queue.push(caller);
      }
    }
  }

  return depths;
}

// Joins labels as "A, B and C".
function listLabels(ids: ModuleId[]): string {
  const labels = ids.map((id) => MODULES[id].label);
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

// The heart of the demo: what happens to every module when `target` breaks or changes.
export function computeImpact(
  architecture: Architecture,
  action: Action,
  target: ModuleId,
): Impact {
  const edges = EDGES[architecture];
  const label = MODULES[target].label;
  const states: Impact["states"] = {};

  if (architecture === "tight") {
    const depths = dependentsByDepth(edges, target);
    const others = [...depths.keys()].filter((id) => id !== target);

    if (action === "break") {
      states[target] = { state: "broken", depth: 0 };
      for (const id of others) states[id] = { state: "down", depth: depths.get(id) ?? 1 };

      if (others.length === 0) {
        return {
          states,
          note: `Nothing calls ${label}, so only it fails. Leaves are safe. It's the hubs that hurt.`,
        };
      }
      const total = modulesFor("tight").length;
      const prefix =
        target === "analytics" || target === "email"
          ? `${label} is the least important box here… and it just took down checkout. `
          : "";
      return {
        states,
        note: `${prefix}${others.length + 1} of ${total} modules down. Every arrow means "I can't work without you".`,
      };
    }

    states[target] = { state: "changed", depth: 0 };
    let editCount = 0;
    for (const id of others) {
      const depth = depths.get(id) ?? 1;
      states[id] = { state: depth === 1 ? "edit" : "retest", depth };
      if (depth === 1) editCount += 1;
    }
    if (others.length === 0) {
      return { states, note: `Nobody reaches into ${label}, so the change stays put.` };
    }
    return {
      states,
      note: `Changing ${label}'s insides means editing ${editCount} module${
        editCount === 1 ? "" : "s"
      } that reach into it, then re-testing ${others.length - editCount} more.`,
    };
  }

  // Loose architecture.
  if (action === "change") {
    states[target] = { state: "changed", depth: 0 };
    return {
      states,
      note:
        target === "bus"
          ? "Swapping the bus's internals is invisible as long as the message format stays the same."
          : `Same change, but ${label}'s interface didn't move. Nobody else had to know.`,
    };
  }

  states[target] = { state: "broken", depth: 0 };

  if (target === "bus") {
    for (const edge of edges) {
      if (edge.kind !== "event") continue;
      if (edge.to === "bus") states[edge.from] = { state: "degraded", depth: 1 };
      else if (!states[edge.to]) states[edge.to] = { state: "idle", depth: 1 };
    }
    return {
      states,
      note: "Publishers buffer their events and retry; consumers go quiet. The bus is now the box that must never fall over.",
    };
  }

  const callers = callersOf(edges, target);
  for (const caller of callers) states[caller] = { state: "degraded", depth: 1 };

  const consumesEvents = edges.some((edge) => edge.kind === "event" && edge.to === target);
  if (consumesEvents) states.bus = { state: "waiting", depth: 1 };

  if (callers.length > 0) {
    return {
      states,
      note: `${label} is down, but ${listLabels(callers)} ${
        callers.length === 1 ? "falls" : "fall"
      } back instead of falling over. People can still browse.`,
    };
  }
  if (consumesEvents) {
    return {
      states,
      note: `${label} is down. Its messages wait in the queue, and it catches up when it's back.`,
    };
  }
  return { states, note: `${label} is down and nothing else notices.` };
}

// Whether an edge should be drawn as "carrying the failure".
export function isEdgeHot(edge: Edge, impact: Impact | null): boolean {
  if (!impact) return false;
  const fromState = impact.states[edge.from]?.state;
  const toState = impact.states[edge.to]?.state;
  if (!fromState || !toState) return false;
  const toFailed =
    toState === "broken" || toState === "down" || toState === "changed" || toState === "edit";
  return toFailed && fromState !== "idle" && fromState !== "waiting";
}
