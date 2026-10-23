/*
 * CertificateCard.tsx
 * One certification as a paper certificate taped to the board: a landscape page card with
 * a small hand-drawn rosette, the issuer, the title and a hand-drawn outline
 * "view credential" link. Straightens and lifts on hover and focus.
 */

import Tape from "@/components/hero/elements/Tape";
import { sketchEllipse, sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { CertificationItem } from "@/types/attainments";

// Resting tilt per card, within -2..2deg (full class names so Tailwind can see them).
const TILTS = [
  "-rotate-[1.6deg]",
  "rotate-[1deg]",
  "-rotate-[0.6deg]",
  "rotate-[1.8deg]",
  "-rotate-[1.2deg]",
  "rotate-[0.5deg]",
] as const;

// Seal colour per card.
const SEAL_COLOURS = ["text-doodle-1", "text-doodle-2", "text-doodle-3"] as const;

// Rosette: two rings and two ribbon tails.
const SEAL_PATHS = [
  sketchEllipse(20, 18, 14, 14, { seed: 11, jitter: 0.5 }),
  sketchEllipse(20, 18, 8, 8, { seed: 12, jitter: 0.4 }),
  `${sketchLine(13, 30, 9, 46, { seed: 13, jitter: 0.4, bow: 1 })} ${sketchLine(9, 46, 15, 42, {
    seed: 14,
    jitter: 0.3,
    bow: 0.5,
  })}`,
  `${sketchLine(27, 30, 31, 46, { seed: 15, jitter: 0.4, bow: 1 })} ${sketchLine(31, 46, 25, 42, {
    seed: 16,
    jitter: 0.3,
    bow: 0.5,
  })}`,
];

interface CertificateCardProps {
  item: CertificationItem;
  index: number;
}

// Renders the certificate.
export default function CertificateCard({ item, index }: CertificateCardProps) {
  const issuer = item.providers.map((p) => p.name).join(" & ");

  return (
    <div
      className={cn(
        "relative h-full text-page-ink transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 focus-within:-translate-y-1 focus-within:rotate-0 motion-reduce:transition-none",
        TILTS[index % TILTS.length],
      )}
    >
      <div
        className="flex h-full items-start gap-4 border border-page-border bg-page-bg p-5 pt-6"
        style={{ boxShadow: "var(--note-shadow)" }}
      >
        <svg
          aria-hidden
          viewBox="0 0 40 48"
          className={cn(
            "h-14 w-12 shrink-0 overflow-visible",
            SEAL_COLOURS[index % SEAL_COLOURS.length],
          )}
        >
          {SEAL_PATHS.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <p className="font-grotesk text-xs font-semibold uppercase tracking-[0.06em] text-page-muted">
            {issuer}
          </p>
          <h3 className="font-display text-xl font-medium leading-tight tracking-[-0.01em]">
            {item.name}
          </h3>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hand-border hand-border-morph mt-3 inline-flex min-h-11 items-center border-2 border-page-ink px-4 py-2 font-grotesk text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-ink"
          >
            view credential
            <span className="sr-only"> for {item.name} (opens in a new tab)</span>
          </a>
        </div>
      </div>
      <Tape className="absolute -top-3 -left-3 -rotate-[35deg]" />
      <Tape className="absolute -top-3 -right-3 rotate-[35deg]" />
    </div>
  );
}
