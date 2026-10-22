/*
 * Figure.tsx
 * Wrapper for static diagrams: centres the drawing and adds
 * a caption underneath.
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
      {children}
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-prose text-center text-sm leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
