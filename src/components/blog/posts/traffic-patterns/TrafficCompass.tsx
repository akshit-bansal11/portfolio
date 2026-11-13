/*
 * TrafficCompass.tsx
 * "What it is" diagram: the internet on top, your edge as a dashed wall, and six
 * services inside. Packets cross the wall up and down (north-south) and run sideways
 * between services (east-west), so the reader sees two links across the edge against
 * seven inside. The buttons focus one direction and dim the other. Built in HTML on the
 * kit's wires, so it reflows on phones; motion is CSS only and off under reduced motion.
 */

"use client";

import {
  CreditCard,
  Database,
  Globe,
  Laptop,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Wallet,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Wire } from "@/components/tutorials/Diagram";
import { cn } from "@/lib/utils";

type Focus = "both" | "ns" | "ew";

const FOCUS: { id: Focus; label: string; tone: "amber" | "blue" | "violet" }[] = [
  { id: "ns", label: "North-south", tone: "amber" },
  { id: "ew", label: "East-west", tone: "blue" },
  { id: "both", label: "Both", tone: "violet" },
];

const NOTES: Record<Focus, string> = {
  both: "One click: 2 links cross the edge, 7 links stay inside.",
  ns: "North-south: traffic crossing your edge, between the internet and your system.",
  ew: "East-west: services calling each other inside. Most of the lines are this.",
};

const OUTSIDE = [
  { label: "Phones", icon: <Smartphone /> },
  { label: "Browsers", icon: <Laptop /> },
  { label: "Partner APIs", icon: <Globe /> },
  { label: "Payment networks", icon: <CreditCard /> },
];

// The six services, in grid order (row 1, then row 2).
const SERVICES = [
  { label: "Web", icon: <Globe /> },
  { label: "Orders", icon: <ShoppingCart /> },
  { label: "Payments", icon: <Wallet /> },
  { label: "Search", icon: <Search /> },
  { label: "Inventory", icon: <Package /> },
  { label: "Payments DB", icon: <Database /> },
];

function Service({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div
      data-tone="blue"
      className="dg-node flex min-w-0 flex-col items-center gap-1 rounded-xl border border-(--tone-line) bg-paper px-1.5 py-2 text-center sm:flex-row sm:gap-2 sm:px-3 sm:text-left"
    >
      <span className="dg-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone) [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 text-xs leading-tight font-semibold text-ink sm:text-sm">
        {label}
      </span>
    </div>
  );
}

// A vertical north-south link with packets going both ways and a side label.
function Crossing({ label, dim }: { label: string; dim: boolean }) {
  return (
    <div
      data-tone="amber"
      className={cn(
        "dg-link flex items-center justify-center gap-3 transition-opacity duration-300",
        dim && "opacity-25",
      )}
    >
      <Wire axis="y" back className="h-12" />
      <span className="text-xs font-semibold tracking-wide text-(--tone) uppercase">{label}</span>
    </div>
  );
}

export default function TrafficCompass() {
  const [focus, setFocus] = useState<Focus>("both");
  const dimNs = focus === "ew";
  const dimEw = focus === "ns";

  // East-west wire, horizontal or vertical, dimmed when north-south is in focus.
  const ew = (axis: "x" | "y") => (
    <span
      data-tone="blue"
      className={cn(
        "dg-link flex items-center justify-center transition-opacity duration-300",
        dimEw && "opacity-25",
      )}
    >
      <Wire axis={axis} back className={axis === "x" ? "w-full" : "h-7"} />
    </span>
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
          Show
        </span>
        {FOCUS.map((f) => (
          <button
            key={f.id}
            type="button"
            data-tone={f.tone}
            aria-pressed={focus === f.id}
            onClick={() => setFocus(f.id)}
            className={cn(
              "min-h-10 rounded-lg border border-(--tone-line) px-3 text-sm font-semibold transition-colors active:translate-y-px",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)",
              focus === f.id ? "bg-(--tone) text-paper" : "text-(--tone) hover:bg-(--tone-soft)",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        role="img"
        aria-label="The internet sits at the top: phones, browsers, partner APIs and payment networks. A dashed wall marks your edge. Two links cross it, up and down, through the load balancer and gateway: that is north-south traffic. Inside, six services are joined by seven links running sideways and between rows: that is east-west traffic."
      >
        <section
          data-tone="amber"
          className={cn(
            "rounded-2xl border border-(--tone-line) bg-(image:--tone-fill) p-3 transition-opacity duration-300",
            dimNs && "opacity-40",
          )}
        >
          <p className="mb-2 text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
            North: the internet
          </p>
          <ul className="grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4">
            {OUTSIDE.map((o) => (
              <li
                key={o.label}
                className="dg-node flex items-center gap-2 rounded-lg border border-(--tone-line) bg-paper px-2 py-1.5 text-xs font-medium text-ink sm:text-sm [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-(--tone)"
              >
                {o.icon}
                {o.label}
              </li>
            ))}
          </ul>
        </section>

        <Crossing label="north-south" dim={dimNs} />

        {/* The edge: a dashed wall with the front door in it. */}
        <div className="relative flex items-center gap-3">
          <span aria-hidden className="h-0 flex-1 border-t-2 border-dashed border-ink-muted/50" />
          <div
            data-tone="amber"
            className={cn(
              "dg-node flex items-center gap-2 rounded-xl border border-(--tone) bg-paper px-3 py-2 transition-opacity duration-300",
              dimNs && "opacity-40",
            )}
          >
            <ShieldCheck className="h-5 w-5 shrink-0 text-(--tone)" aria-hidden />
            <span className="text-sm leading-tight">
              <span className="block font-semibold text-ink">Load balancer + gateway</span>
              <span className="block text-xs text-ink-muted">your edge (the wall)</span>
            </span>
          </div>
          <span aria-hidden className="h-0 flex-1 border-t-2 border-dashed border-ink-muted/50" />
        </div>

        <Crossing label="north-south" dim={dimNs} />

        <section
          data-tone="blue"
          className="rounded-2xl border border-dashed border-(--tone-line) bg-(--tone-soft) p-2.5 sm:p-4"
        >
          <p className="mb-3 text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
            Inside your data centre
          </p>
          <div
            className={cn(
              "grid grid-cols-[1fr_1rem_1fr_1rem_1fr] items-center sm:grid-cols-[1fr_2.5rem_1fr_2.5rem_1fr]",
              "transition-opacity duration-300",
              dimEw && "[&_.dg-node]:opacity-50",
            )}
          >
            <Service {...SERVICES[0]} />
            {ew("x")}
            <Service {...SERVICES[1]} />
            {ew("x")}
            <Service {...SERVICES[2]} />
            {ew("y")}
            <span />
            {ew("y")}
            <span />
            {ew("y")}
            <Service {...SERVICES[3]} />
            {ew("x")}
            <Service {...SERVICES[4]} />
            {ew("x")}
            <Service {...SERVICES[5]} />
          </div>
          <p
            className={cn(
              "mt-3 text-right text-xs font-semibold tracking-wide text-(--tone) uppercase transition-opacity duration-300",
              dimEw && "opacity-25",
            )}
          >
            east-west
          </p>
        </section>
      </div>

      <p aria-live="polite" className="mt-4 text-center text-sm font-medium text-ink">
        {NOTES[focus]}
      </p>
    </div>
  );
}
