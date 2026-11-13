/*
 * Figure.tsx
 * Wrapper for static diagrams: puts the drawing on the same ruled
 * notebook paper as the tutorial diagrams and adds a handwritten
 * caption underneath.
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
      <div className="tut-paper rounded-md border border-rule p-4 pl-6 sm:p-8 sm:pl-14">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
      {caption && (
        <figcaption className="mx-auto mt-2 max-w-4xl text-center font-hand text-xl leading-snug text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
