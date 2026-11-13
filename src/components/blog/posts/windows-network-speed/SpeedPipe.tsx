/*
 * SpeedPipe.tsx
 * Your download as one pipe from the server to your PC, drawn as a stack of hops. Each
 * hop's width is how much it can carry; packets fall through all of them in a stream
 * as wide as the narrowest hop, so every wider hop shows the space it can't use. Pick
 * the link (2.4 GHz, 5 GHz or a cable), how far you sit, the Wi-Fi Bandwidth setting
 * and one connection vs split downloads, and watch the bottleneck move. Widths are
 * illustrative: only their order matters. The printed copy shows the current state.
 */

"use client";

import { Cable, Download, Globe, Laptop, Router, Wifi } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { SegmentedControl } from "@/components/blog/DemoControls";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./SpeedPipe.module.css";

type LinkKind = "wifi24" | "wifi5" | "cable";
type Seat = "near" | "far";
type Width = "auto" | "narrow";
type Mode = "single" | "parallel";

interface Hop {
  id: "server" | "plan" | "router" | "link" | "adapter";
  name: string;
  place: string;
  tone: Tone;
  icon: ReactNode;
  /** What this hop can carry, on the same made-up scale as the others. */
  cap: number;
  /** Side-by-side connections (the server hop only). */
  lanes: number;
  note: string;
  /** What to do when this hop is the narrowest. */
  fix: string;
}

// Illustrative capacities. The plan is 100; the widest pipe is drawn at MAX.
const MAX = 130;
const PLAN = 100;

function linkHop(kind: LinkKind, seat: Seat, width: Width): Hop {
  if (kind === "cable") {
    return {
      id: "link",
      name: "Ethernet cable",
      place: "router → PC",
      tone: "green",
      icon: <Cable />,
      cap: 125,
      lanes: 1,
      note: "A Cat 5e or Cat 6 cable carries gigabit speeds. No air, no walls.",
      fix: "",
    };
  }
  if (kind === "wifi24") {
    return {
      id: "link",
      name: "Wi-Fi, 2.4 GHz",
      place: "router → PC, through the air",
      tone: "cyan",
      icon: <Wifi />,
      cap: seat === "near" ? 50 : 42,
      lanes: 1,
      note:
        seat === "near"
          ? "Slower and more crowded, even right next to the router."
          : "Reaches further, so it fades less with distance. Still slow.",
      fix: "2.4 GHz is slower and more crowded. Switch to 5 GHz, or plug in a cable.",
    };
  }
  const narrow = width === "narrow";
  const cap = seat === "near" ? (narrow ? 45 : 92) : narrow ? 20 : 35;
  return {
    id: "link",
    name: "Wi-Fi, 5 GHz",
    place: "router → PC, through the air",
    tone: "cyan",
    icon: <Wifi />,
    cap,
    lanes: 1,
    note: narrow
      ? "'20MHz Only' blocks the wider 40/80 MHz channels."
      : seat === "near"
        ? "Much faster at close range."
        : "Walls and distance eat into it fast.",
    fix: narrow
      ? "'20MHz Only' squeezed your 5 GHz link. Set Bandwidth back to Auto."
      : seat === "near"
        ? "Nearly there. A cable is still the biggest upgrade."
        : "5 GHz fades with distance. Sit closer to the router, or use a cable.",
  };
}

function buildHops(kind: LinkKind, seat: Seat, width: Width, mode: Mode): Hop[] {
  const split = mode === "parallel";
  return [
    {
      id: "server",
      name: "Download server",
      place: "on the internet",
      tone: "violet",
      icon: <Download />,
      cap: split ? 112 : 38,
      lanes: split ? 4 : 1,
      note: split
        ? "Four connections at once, each held back, added together."
        : "Many servers limit how fast one connection can go.",
      fix: "The server holds back each connection. Split the download into chunks.",
    },
    {
      id: "plan",
      name: "Your ISP plan",
      place: "the ceiling",
      tone: "amber",
      icon: <Globe />,
      cap: PLAN,
      lanes: 1,
      note: "The speed you pay for. No Windows setting goes past it.",
      fix: "You're using your whole plan. Only a faster plan goes faster from here.",
    },
    {
      id: "router",
      name: "Router",
      place: "at home",
      tone: "blue",
      icon: <Router />,
      cap: 115,
      lanes: 1,
      note: "Restart it now and then, and keep its firmware updated.",
      fix: "",
    },
    linkHop(kind, seat, width),
    {
      id: "adapter",
      name: "Your PC's adapter",
      place: "inside your PC",
      tone: "pink",
      icon: <Laptop />,
      cap: 120,
      lanes: 1,
      note: "Its settings steady the link and cut lag spikes. They don't widen it.",
      fix: "",
    },
  ];
}

const pct = (cap: number) => `${(cap / MAX) * 100}%`;

// One hop's slice of the pipe, with the used stream and its packets inside.
function PipeCell({
  hop,
  stream,
  isNeck,
  wobble,
}: {
  hop: Hop;
  stream: number;
  isNeck: boolean;
  wobble: boolean;
}) {
  const dots = Math.max(3, Math.round(stream / 7));
  const dur = Math.min(3.2, Math.max(1.2, (1.3 * PLAN) / stream));
  const laneGap = 4; // between lanes, on the same scale as `cap`
  const total = hop.cap + (hop.lanes - 1) * laneGap;

  return (
    <div className="relative w-24 shrink-0 self-stretch sm:w-56 lg:w-72">
      {/* The pipe walls: one lane, or several side by side. */}
      <div
        className={cn("absolute inset-y-0 left-1/2 flex -translate-x-1/2", styles.ease)}
        style={{ width: pct(total), columnGap: `${(laneGap / total) * 100}%` }}
      >
        {Array.from({ length: hop.lanes }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: lanes are identical and positional.
            key={i}
            className={cn(
              "h-full flex-1 border-x-[1.5px] bg-(--tone-soft)",
              isNeck ? "border-(--tone)" : "border-(--tone-line) group-hover:border-(--tone)",
              styles.ease,
            )}
          />
        ))}
      </div>
      {/* The part actually used: the same width in every hop. */}
      <div
        className={cn("absolute inset-y-0 left-1/2 -translate-x-1/2 overflow-hidden", styles.ease)}
        style={{ width: pct(stream) }}
      >
        <span className="absolute inset-0 bg-[color-mix(in_srgb,var(--tone)_16%,transparent)]" />
        {Array.from({ length: dots }, (_, j) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: packets are identical and positional.
            key={j}
            className={cn(styles.dot, wobble && styles.wobble)}
            style={
              {
                left: `${18 + ((j * 0.618) % 1) * 64}%`,
                "--y": `${((j / dots) * 100).toFixed(1)}%`,
                "--dur": `${dur.toFixed(2)}s`,
                "--delay": `${(-(j / dots) * dur).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function SpeedPipe() {
  const [kind, setKind] = useState<LinkKind>("wifi5");
  const [seat, setSeat] = useState<Seat>("far");
  const [width, setWidth] = useState<Width>("auto");
  const [mode, setMode] = useState<Mode>("single");

  const hops = buildHops(kind, seat, width, mode);
  const neck = hops.reduce((low, hop) => (hop.cap < low.cap ? hop : low));
  const stream = neck.cap;
  const share = Math.min(stream, PLAN) / PLAN;
  const whole = neck.id === "plan";
  const status = `Bottleneck: ${neck.name}. ${neck.fix}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <SegmentedControl
          label="Router to PC"
          value={kind}
          onChange={setKind}
          options={[
            { value: "wifi24", label: "2.4 GHz" },
            { value: "wifi5", label: "5 GHz" },
            { value: "cable", label: "Cable" },
          ]}
        />
        <SegmentedControl
          label="Download"
          value={mode}
          onChange={setMode}
          options={[
            { value: "single", label: "One connection" },
            { value: "parallel", label: "Split into chunks" },
          ]}
        />
        {kind !== "cable" && (
          <SegmentedControl
            label="Where you sit"
            value={seat}
            onChange={setSeat}
            options={[
              { value: "near", label: "Near the router" },
              { value: "far", label: "Rooms away" },
            ]}
          />
        )}
        {kind === "wifi5" && (
          <SegmentedControl
            label="Wi-Fi Bandwidth setting"
            value={width}
            onChange={setWidth}
            options={[
              { value: "auto", label: "Auto" },
              { value: "narrow", label: "20MHz Only" },
            ]}
          />
        )}
      </div>

      <div
        role="img"
        aria-label={`A pipe from the download server to your PC. ${hops
          .map((hop) => `${hop.name}: ${hop.cap < PLAN ? "narrower" : "wider"} than your plan`)
          .join("; ")}. ${status}`}
        className="dg-canvas rounded-2xl border border-rule p-3 sm:p-5"
      >
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-ink-muted sm:gap-x-5">
          <span className="w-24 text-center tracking-[0.12em] uppercase sm:w-56 lg:w-72">
            Data flows ↓
          </span>
          <span data-tone="violet" className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-3 w-5 rounded-sm bg-[color-mix(in_srgb,var(--tone)_27%,transparent)]"
            />
            Used
          </span>
          <span data-tone="violet" className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-3 w-5 rounded-sm border-x-[1.5px] border-(--tone-line) bg-(--tone-soft)"
            />
            Width it can't use
          </span>
        </div>
        <ol className="m-0 list-none p-0">
          {hops.map((hop) => {
            const isNeck = hop.id === neck.id;
            const tone = isNeck ? "red" : hop.tone;
            return (
              <li key={hop.id} data-tone={tone} className="group flex items-stretch gap-2 sm:gap-3">
                <PipeCell
                  hop={hop}
                  stream={stream}
                  isNeck={isNeck}
                  wobble={hop.id === "link" && kind !== "cable"}
                />
                <div
                  className={cn(
                    "dg-node my-1 flex min-h-[4.5rem] min-w-0 flex-1 items-start gap-2.5 rounded-xl border bg-paper px-2.5 py-2.5 sm:gap-3 sm:px-3",
                    isNeck ? "dg-pulse border-(--tone)" : "border-(--tone-line)",
                  )}
                >
                  <span className="dg-icon mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone) [&_svg]:h-[18px] [&_svg]:w-[18px]">
                    {hop.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-semibold leading-snug text-ink">{hop.name}</span>
                      {isNeck && (
                        <span
                          key={`${hop.id}-${hop.cap}`}
                          className={cn(
                            "rounded-full bg-(--tone) px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-paper uppercase",
                            styles.pop,
                          )}
                        >
                          Bottleneck
                        </span>
                      )}
                    </span>
                    <span className="hidden text-xs text-ink-muted sm:block">{hop.place}</span>
                    <span className="mt-1 block text-sm leading-snug text-ink">{hop.note}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div data-tone={whole ? "green" : "red"} className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
            Your download vs your plan
          </span>
          <span className="text-sm font-semibold text-(--tone)">
            {whole ? "All of your plan" : "Part of your plan"}
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full border border-rule bg-paper">
          <span
            className={cn("absolute inset-y-0 left-0 rounded-full bg-(--tone-line)", styles.ease)}
            style={{ width: `${share * 100}%` }}
          />
        </div>
        <p aria-live="polite" className="m-0 text-sm leading-relaxed text-ink">
          <span className="font-semibold text-(--tone)">Bottleneck: {neck.name}.</span> {neck.fix}
        </p>
      </div>
    </div>
  );
}
