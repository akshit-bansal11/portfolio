/*
 * DemoFrame.tsx
 * Reusable shell for interactive demos: a notebook-style
 * frame with a title, a handwritten "try it" hint, the demo
 * itself, and an optional caption. DemoSkeleton is the
 * placeholder next/dynamic shows while a demo's JS loads.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DemoFrameProps {
  title: string;
  /** Handwritten nudge in the corner, e.g. "tap a box!". */
  hint?: string;
  /** Short explanation under the demo. */
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DemoFrame({ title, hint, caption, children, className }: DemoFrameProps) {
  return (
    <figure
      aria-label={title}
      className={cn(
        "relative my-12 rounded-2xl border-2 border-ink bg-paper-raised",
        "shadow-[5px_5px_0_0_var(--blog-ink)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-2 border-dashed border-rule px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full bg-ok motion-safe:animate-pulse"
          />
          <span className="text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
            Interactive
          </span>
          <span className="text-sm font-semibold text-ink sm:text-base">{title}</span>
        </div>
        {hint && <span className="font-hand text-xl text-pen">{hint}</span>}
      </div>
      <div className="p-3 sm:p-5">{children}</div>
      {caption && (
        <figcaption className="border-t-2 border-dashed border-rule px-4 py-3 text-sm leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface DemoSkeletonProps {
  /** Rough height of the demo so the page doesn't jump when it loads. */
  height?: "sm" | "md" | "lg";
}

const SKELETON_HEIGHT = { sm: "h-56", md: "h-80", lg: "h-[30rem]" } as const;

// Loading placeholder for lazily imported demos.
export function DemoSkeleton({ height = "md" }: DemoSkeletonProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex w-full items-center justify-center rounded-xl border-2 border-dashed border-rule",
        SKELETON_HEIGHT[height],
      )}
    >
      <span className="font-hand text-2xl text-ink-muted motion-safe:animate-pulse">
        sharpening pencils…
      </span>
    </div>
  );
}
