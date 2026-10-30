/*
 * CopyButton.tsx
 * "Copy" button for a code window. Copies the raw code (never the line numbers) and
 * announces the result through a polite live region.
 */

"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

const LABELS: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Copy failed",
};

export default function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Writes to the clipboard, then resets the label after two seconds.
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch (error) {
      console.warn("Could not copy the code", error);
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 text-xs text-(--code-fg) transition-colors hover:bg-(--code-bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
    >
      {state === "copied" ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Copy className="h-4 w-4" aria-hidden />
      )}
      <span aria-hidden>{LABELS[state]}</span>
      <span className="sr-only">Copy code</span>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "idle" ? "" : LABELS[state]}
      </span>
    </button>
  );
}
