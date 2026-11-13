/*
 * LimiterGate.tsx
 * "What it is" scene: requests stream in from the left, the rate limiter at the door
 * lets a steady share through to the server (they turn green) and turns the extras away
 * with a 429 (they turn red and drop). Positions are percentages, so it scales with the
 * column. Hovering pauses the stream; hovering a box lifts it. With reduced motion a still
 * frame of the same scene is shown. Server-rendered, CSS-only motion.
 */

import { Ban, ServerCog, ShieldCheck } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./LimiterGate.module.css";

const LANE = "40%";

// Ten requests per loop: half get in, half are turned away.
const STREAM: ("pass" | "reject")[] = [
  "pass",
  "reject",
  "pass",
  "pass",
  "reject",
  "pass",
  "reject",
  "reject",
  "pass",
  "reject",
];

// A still frame for reduced motion: some waiting, one inside, one turned away.
const STILL: { left: string; top: string; tone: Tone }[] = [
  { left: "8%", top: LANE, tone: "blue" },
  { left: "18%", top: LANE, tone: "blue" },
  { left: "28%", top: LANE, tone: "blue" },
  { left: "66%", top: LANE, tone: "green" },
  { left: "50%", top: "70%", tone: "red" },
];

function Box({
  tone,
  icon,
  title,
  note,
  className,
}: {
  tone: Tone;
  icon: ReactNode;
  title: string;
  note: string;
  className?: string;
}) {
  return (
    <div
      data-tone={tone}
      className={cn(
        "dg-node relative z-10 flex items-center gap-2 rounded-xl border border-(--tone-line) bg-paper px-2.5 py-2 sm:gap-3 sm:px-3",
        className,
      )}
    >
      <span className="dg-icon hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone) min-[480px]:flex [&_svg]:h-[18px] [&_svg]:w-[18px]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.8rem] leading-tight font-semibold whitespace-nowrap text-ink sm:text-base">
          {title}
        </span>
        <span className="block font-mono text-[0.7rem] leading-snug text-ink-muted sm:text-xs">
          {note}
        </span>
      </span>
    </div>
  );
}

export default function LimiterGate() {
  return (
    <div
      role="img"
      aria-label="Requests stream towards a rate limiter at the door. It lets a steady number through to your server, which stays healthy, and turns the extras away with 429 Too Many Requests and a Retry-After header."
      className={cn(styles.scene, "relative mx-auto h-60 w-full max-w-3xl sm:h-64")}
      style={{ "--lane": LANE } as CSSProperties}
    >
      {/* Lane labels. */}
      <p
        data-tone="blue"
        className="absolute top-[18%] left-0 text-xs font-semibold tracking-[0.08em] text-(--tone) uppercase"
      >
        requests
      </p>
      <p
        data-tone="green"
        className="absolute top-[18%] right-0 w-[27%] text-center font-mono text-xs font-semibold text-(--tone)"
      >
        200 OK
      </p>

      {/* Wires: in, through, and the reject path. */}
      <span
        aria-hidden
        data-tone="blue"
        className="absolute left-0 h-[2px] w-1/2 -translate-y-1/2 rounded-full bg-(--tone-line)"
        style={{ top: LANE }}
      />
      <span
        aria-hidden
        data-tone="green"
        className="absolute left-1/2 h-[2px] w-[40%] -translate-y-1/2 rounded-full bg-(--tone-line)"
        style={{ top: LANE }}
      />
      <span
        aria-hidden
        data-tone="red"
        className="absolute left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-(--tone-line)"
        style={{ top: LANE, height: "40%" }}
      />

      {/* Moving requests (or a still frame without motion). */}
      {STREAM.map((out, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed, positional stream.
          key={i}
          aria-hidden
          data-out={out}
          data-tone={out === "pass" ? "green" : "red"}
          className={styles.dot}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
      {STILL.map((dot) => (
        <span
          key={dot.left + dot.top}
          aria-hidden
          data-tone={dot.tone}
          className={styles.still}
          style={{ left: dot.left, top: dot.top }}
        />
      ))}

      {/* The gate. The wrapper centres it; the box itself lifts on hover and nods. */}
      <div
        className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ top: LANE }}
      >
        <Box
          tone="violet"
          icon={<ShieldCheck />}
          title="Rate limiter"
          note="2 / second"
          className={styles.gate}
        />
      </div>

      <div className="absolute right-0 z-10 w-[27%] -translate-y-1/2" style={{ top: LANE }}>
        <Box tone="green" icon={<ServerCog />} title="Server" note="stays healthy" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
        <div
          data-tone="red"
          className="dg-node flex max-w-full items-center gap-2 rounded-xl border border-(--tone-line) bg-paper px-3 py-1.5"
        >
          <Ban className="h-4 w-4 shrink-0 text-(--tone)" aria-hidden />
          <span className="font-mono text-[0.7rem] leading-snug text-ink sm:text-xs">
            <span className="font-semibold text-(--tone)">429 Too Many Requests</span>
            <span className="text-ink-muted"> · Retry-After: 2</span>
          </span>
        </div>
      </div>
    </div>
  );
}
