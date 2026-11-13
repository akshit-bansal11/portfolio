/*
 * DemoFrame.tsx
 * Reusable shell for interactive demos, in the tutorial
 * widget style: a raised panel with a green "Interactive"
 * badge, a title, a handwritten "try it" hint, the demo
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
      className={cn("relative my-10 rounded-2xl border border-rule bg-paper-raised", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-rule px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            data-tone="green"
            className="inline-flex items-center gap-1.5 rounded-full bg-(--tone) px-2.5 py-0.5 text-xs font-bold tracking-wide text-paper uppercase"
          >
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-paper motion-safe:animate-pulse"
            />
            Interactive
          </span>
          <span className="font-semibold text-ink sm:text-lg">{title}</span>
        </div>
        {hint && (
          <span data-tone="term" className="text-sm font-medium text-(--tone)">
            {hint}
          </span>
        )}
      </div>
      <div className="p-3 sm:p-5">{children}</div>
      {caption && (
        <figcaption className="border-t border-rule px-4 py-3 text-sm leading-relaxed text-ink-muted sm:px-5">
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
      <span className="text-sm font-medium text-ink-muted motion-safe:animate-pulse">
        loading the demo…
      </span>
    </div>
  );
}
