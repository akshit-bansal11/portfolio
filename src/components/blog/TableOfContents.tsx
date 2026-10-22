/*
 * TableOfContents.tsx
 * Sticky "on this page" list for wide screens, and a
 * collapsible version for phones. Highlights the section
 * currently being read with a hand-drawn arrow that slides
 * between entries.
 */

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/types/blog";

interface TableOfContentsProps {
  headings: TocHeading[];
  /** "sidebar": sticky list for wide screens. "inline": collapsible block for phones. */
  variant: "sidebar" | "inline";
  className?: string;
}

// A heading counts as "current" once its top passes this line (px from viewport top).
const ACTIVE_LINE = 140;

// Tracks which heading the reader is currently in.
function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= ACTIVE_LINE) current = id;
      }
      // At the very bottom, the last section is active even if its heading never reached the line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActiveId(atBottom ? ids[ids.length - 1] : current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return activeId;
}

// Shared list markup for both variants.
function TocList({
  headings,
  activeId,
  layoutGroup,
}: {
  headings: TocHeading[];
  activeId: string | null;
  layoutGroup: string;
}) {
  return (
    <ol className="space-y-1">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        return (
          <li key={heading.id} className={cn("relative", heading.level === 3 && "pl-4")}>
            {isActive && (
              <motion.span
                layoutId={`toc-arrow-${layoutGroup}`}
                aria-hidden
                className="absolute top-0.5 -left-6 font-hand text-xl leading-none text-pen"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              >
                →
              </motion.span>
            )}
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block rounded py-1 text-sm leading-snug transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
                isActive ? "font-semibold text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

// Sidebar: sticky list. Inline: collapsible <details> at the top of the article.
export default function TableOfContents({ headings, variant, className }: TableOfContentsProps) {
  const [ids] = useState(() => headings.map((heading) => heading.id));
  const activeId = useActiveHeading(ids);

  if (headings.length === 0) return null;

  if (variant === "sidebar") {
    return (
      <nav
        aria-label="Table of contents"
        className={cn("sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pl-6", className)}
      >
        <p className="mb-3 font-hand text-2xl text-pen">on this page</p>
        <TocList headings={headings} activeId={activeId} layoutGroup={variant} />
      </nav>
    );
  }

  return (
    <details
      className={cn(
        "group mb-8 rounded-xl border-2 border-dashed border-rule px-4 py-3",
        className,
      )}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-hand text-2xl text-pen [&::-webkit-details-marker]:hidden">
        on this page
        <span
          aria-hidden
          className="text-base text-ink-muted transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <nav aria-label="Table of contents" className="mt-3 pl-6">
        <TocList headings={headings} activeId={activeId} layoutGroup={variant} />
      </nav>
    </details>
  );
}
