/*
 * PagedSheet.tsx
 * Lays a resume's blocks out on fixed A4 sheets. Blocks are measured in an
 * off-screen column with the same width and type as a sheet, then filled
 * greedily page by page (a block that does not fit moves to the next sheet).
 * Print uses the same sheets, so screen and PDF break in the same places.
 * Before measuring (SSR, no JS, hidden tab) everything sits on one auto-height
 * sheet so nothing is ever hidden. Narrow screens scale the true A4 layout
 * down via --resume-scale instead of reflowing it.
 */

"use client";

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

export type BlockKind = "header" | "section" | "entry" | "bullet" | "line";

export interface PagedBlock {
  key: string;
  kind: BlockKind;
  node: ReactNode;
}

interface PagedSheetProps {
  blocks: PagedBlock[];
  variant: "one" | "full";
  /** Sheets allowed before the content counts as overflowing (one-page: 1). */
  maxPages?: number;
  /** Called whenever the content starts or stops exceeding maxPages. */
  onOverflow?: (overflowing: boolean) => void;
}

interface Measured {
  height: number;
  gap: number;
}

// Greedy fill: block indices per page. A block's top gap is dropped at the top of a page.
function paginate(blocks: Measured[], available: number): number[][] {
  const pages: number[][] = [];
  let page: number[] = [];
  let used = 0;
  blocks.forEach(({ height, gap }, index) => {
    if (page.length && used + height > available) {
      pages.push(page);
      page = [];
      used = 0;
    }
    used += page.length ? height : height - gap;
    page.push(index);
  });
  if (page.length) pages.push(page);
  return pages;
}

const samePages = (a: number[][] | null, b: number[][]) => JSON.stringify(a) === JSON.stringify(b);

export default function PagedSheet({ blocks, variant, maxPages, onOverflow }: PagedSheetProps) {
  const limit = maxPages ?? (variant === "one" ? 1 : Number.POSITIVE_INFINITY);
  const rootRef = useRef<HTMLElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pages, setPages] = useState<number[][] | null>(null);

  // The measuring column is client-only, so the server HTML carries the content once.
  useLayoutEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const probe = probeRef.current;
    const column = columnRef.current;
    if (!mounted || !root || !probe || !column) return;

    const run = () => {
      const pageWidth = probe.offsetWidth;
      if (!pageWidth) return; // hidden tab: measure again once it is shown
      const scale = Math.min(1, (root.clientWidth - 32) / pageWidth);
      root.style.setProperty("--resume-scale", String(scale));
      const margin = Number.parseFloat(getComputedStyle(probe).paddingTop);
      // 1px of slack so print rounding never pushes a block onto an extra sheet.
      const available = probe.clientHeight - 2 * margin - 1;
      const measured = Array.from(column.children, (el) => ({
        height: el.getBoundingClientRect().height,
        gap: Number.parseFloat(getComputedStyle(el).paddingTop),
      }));
      const next = paginate(measured, available);
      setPages((prev) => (samePages(prev, next) ? prev : next));
    };

    let live = true;
    run();
    document.fonts.ready.then(() => {
      if (live) run();
    });
    const observer = new ResizeObserver(run);
    observer.observe(root);
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [mounted, blocks]);

  const overflowing = pages !== null && pages.length > limit;
  useEffect(() => onOverflow?.(overflowing), [overflowing, onOverflow]);

  const render = (indices: number[]) =>
    indices.map((i) => (
      <div key={blocks[i].key} className="resume-block" data-kind={blocks[i].kind}>
        {blocks[i].node}
      </div>
    ));

  return (
    <article
      ref={rootRef}
      className="resume-pages"
      data-variant={variant}
      data-overflow={overflowing ? "" : undefined}
    >
      {mounted && (
        <>
          <div ref={probeRef} aria-hidden className="resume-probe" />
          <div ref={columnRef} aria-hidden inert className="resume-measure">
            {render(blocks.map((_, i) => i))}
          </div>
        </>
      )}
      <div className="resume-sheets">
        {(pages ?? [blocks.map((_, i) => i)]).map((indices, n, all) => (
          <div key={indices[0]} className="resume-a4" data-flow={pages ? undefined : ""}>
            {render(indices)}
            {pages && variant === "full" && all.length > 1 && (
              <span aria-hidden className="resume-pageno">
                {n + 1} / {all.length}
              </span>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
