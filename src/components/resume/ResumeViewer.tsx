/*
 * ResumeViewer.tsx
 * Toolbar and tab switch for the /resume page. Both documents are rendered
 * on the server and passed in; this only toggles which panel is visible
 * (ARIA tabs, arrow keys, #full in the URL) and prints the visible one.
 */

"use client";

import { type KeyboardEvent, type ReactNode, useSyncExternalStore } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

type Tab = "one" | "full";

const TABS: { id: Tab; label: string }[] = [
  { id: "one", label: "One page" },
  { id: "full", label: "Full CV" },
];

// Hand-drawn arrow pointing at the print button.
const NOTE_ARROW = sketchArrow(4, 20, 56, 26, { seed: 7, curve: 0.25, headSize: 8 });

interface ResumeViewerProps {
  onePage: ReactNode;
  full: ReactNode;
}

// The URL hash is the source of truth: /resume#full opens the full CV.
const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readTab = (): Tab => (window.location.hash === "#full" ? "full" : "one");
const serverTab = (): Tab => "one";

export default function ResumeViewer({ onePage, full }: ResumeViewerProps) {
  const tab = useSyncExternalStore(subscribe, readTab, serverTab);

  // replaceState keeps the switch out of history; it fires no hashchange, so announce it.
  const select = (next: Tab) => {
    window.history.replaceState(null, "", next === "full" ? "#full" : window.location.pathname);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  // Arrow keys / Home / End move between tabs and focus the new one.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.findIndex(({ id }) => id === tab);
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    select(TABS[next].id);
    document.getElementById(`resume-tab-${TABS[next].id}`)?.focus();
  };

  return (
    <>
      <div className="resume-toolbar mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 sm:px-0 print:hidden">
        <div
          role="tablist"
          aria-label="Resume version"
          className="flex gap-1 rounded-full border border-hero-ink/15 bg-hero-surface/80 p-1"
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`resume-tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`resume-panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => select(id)}
              onKeyDown={onKeyDown}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-pen",
                tab === id ? "bg-hero-ink text-hero-bg" : "text-hero-muted hover:text-hero-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex -rotate-3 items-center gap-1 font-hand text-xl leading-none text-hero-pen"
          >
            pick one, print it
            <svg viewBox="0 0 64 40" className="h-7 w-12 overflow-visible">
              <DrawnPath d={NOTE_ARROW.shaft} delay={0.3} duration={0.6} />
              <DrawnPath d={NOTE_ARROW.head} delay={0.9} duration={0.25} />
            </svg>
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer rounded-full border border-hero-ink/40 bg-hero-surface/60 px-5 py-2 text-sm font-medium text-hero-ink/90 transition-colors hover:border-hero-pen/50 hover:text-hero-pen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-pen"
          >
            Download PDF
          </button>
        </div>
      </div>
      <div
        role="tabpanel"
        id="resume-panel-one"
        aria-labelledby="resume-tab-one"
        hidden={tab !== "one"}
      >
        {onePage}
      </div>
      <div
        role="tabpanel"
        id="resume-panel-full"
        aria-labelledby="resume-tab-full"
        hidden={tab !== "full"}
      >
        {full}
      </div>
    </>
  );
}
