/*
 * DownloadPdf.tsx
 * "Dark PDF" / "Light PDF" buttons. Each one forces that blog theme on <html>, opens the
 * print dialog (the user picks "Save as PDF") and restores the theme afterwards. Every
 * <details> in the article is opened for printing, whether the print comes from these
 * buttons or from Ctrl+P, and closed again afterwards.
 */

"use client";

import { Download } from "lucide-react";
import { useEffect, useRef } from "react";

type Mode = "dark" | "light";

const MODES: { mode: Mode; label: string }[] = [
  { mode: "dark", label: "Dark PDF" },
  { mode: "light", label: "Light PDF" },
];

// Prints the page with the given theme forced, then puts the old theme back.
function printAs(mode: Mode) {
  const root = document.documentElement;
  const previous = root.dataset.blogTheme;
  root.dataset.blogTheme = mode;
  window.addEventListener(
    "afterprint",
    () => {
      if (previous === undefined) delete root.dataset.blogTheme;
      else root.dataset.blogTheme = previous;
    },
    { once: true },
  );
  window.print();
}

export default function DownloadPdf() {
  const opened = useRef<HTMLDetailsElement[]>([]);

  useEffect(() => {
    // Opens the closed entries so their content prints; remembers which ones it opened.
    const beforePrint = () => {
      opened.current = Array.from(
        document.querySelectorAll<HTMLDetailsElement>("[data-blog-article] details:not([open])"),
      );
      for (const entry of opened.current) entry.open = true;
    };
    const afterPrint = () => {
      for (const entry of opened.current) entry.open = false;
      opened.current = [];
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  return (
    <div className="flex flex-col items-end gap-1 print:hidden">
      <div className="flex gap-2">
        {MODES.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => printAs(mode)}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-rule px-4 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
          >
            <Download className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-muted">
        Opens your print dialog. Choose &quot;Save as PDF&quot;.
      </p>
    </div>
  );
}
