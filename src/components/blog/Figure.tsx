/*
 * Figure.tsx
 * Wrapper for post diagrams: puts the drawing on the same dot-grid
 * canvas as the tutorial diagrams and adds a caption underneath.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FigureProps {
  children: ReactNode;
  caption?: ReactNode;
  className?: string;
}

export default function Figure({ children, caption, className }: FigureProps) {
  return (
    <figure className={cn("my-10", className)}>
      <div className="dg-canvas rounded-2xl border border-rule p-4 sm:p-7">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
