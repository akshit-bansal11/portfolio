/*
 * PagedSheet.tsx
 * Lays a resume's blocks out on fixed A4 sheets. Blocks are measured in an
 * off-screen column with the same width and type as a sheet, then filled
 * greedily page by page (a block that does not fit moves to the next sheet).
 * Print uses the same sheets, so screen and PDF break in the same places.
 * Before measuring (SSR, no JS, hidden tab) everything sits on one auto-height
 * sheet so nothing is ever hidden. Narrow screens scale the true A4 layout
 * down via --resume-scale instead of reflowing it. The resume is one sheet:
 * its type shrinks via --fit until it fits, and spare room goes to spacing
 * via --air (0 = tight, 1 = most open) rather than to bigger type.
 */

"use client";

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

export type BlockKind = "header" | "section" | "entry" | "bullet" | "line";

export interface PagedBlock {
  key: string;
  kind: BlockKind;
  node: ReactNode;
}

interface PagedSheetProps {
  blocks: PagedBlock[];
  /** Editor view: marks the sheets so edit-only controls can be styled (and hidden in print). */
  editing?: boolean;
  /** Called whenever the content starts or stops exceeding one sheet. */
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

// The type shrinks (--fit) until every block fits; below FIT_MIN it overflows.
const FIT_MIN = 0.5;
const SEARCH_STEPS = 10;

// "Are we on the client?" without a setState-in-effect: false on the server, true after hydration.
const subscribeNever = () => () => {};
const onClient = () => true;
const onServer = () => false;

export default function PagedSheet({ blocks, editing, onOverflow }: PagedSheetProps) {
  const rootRef = useRef<HTMLElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  // The measuring column is client-only, so the server HTML carries the content once.
  const mounted = useSyncExternalStore(subscribeNever, onClient, onServer);
  const [pages, setPages] = useState<number[][] | null>(null);

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
      const layout = () =>
        paginate(
          Array.from(column.children, (el) => ({
            height: el.getBoundingClientRect().height,
            gap: Number.parseFloat(getComputedStyle(el).paddingTop),
          })),
          available,
        );
      const fits = () => layout().length === 1;
      const set = (name: string, value: number) => root.style.setProperty(name, String(value));
      // Binary search for the largest value of a CSS variable that keeps one sheet.
      const largest = (name: string, min: number, max: number) => {
        let lo = min;
        let hi = max;
        for (let step = 0; step < SEARCH_STEPS; step++) {
          const mid = (lo + hi) / 2;
          set(name, mid);
          if (fits()) lo = mid;
          else hi = mid;
        }
        set(name, lo);
      };

      // Too long: shrink the type. Room to spare: spread the spacing, never grow the type.
      set("--fit", 1);
      set("--air", 0);
      if (!fits()) largest("--fit", FIT_MIN, 1);
      else largest("--air", 0, 1);
      const next = layout();
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

  const overflowing = pages !== null && pages.length > 1;
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
      data-editing={editing ? "" : undefined}
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
        {(pages ?? [blocks.map((_, i) => i)]).map((indices, n) => (
          <div key={n} className="resume-a4" data-flow={pages ? undefined : ""}>
            {render(indices)}
          </div>
        ))}
      </div>
    </article>
  );
}
