/*
 * DecouplingDiagram.tsx
 * Three ways for Checkout to talk to Inventory, as a small simulator: reach into its
 * table, call its interface, or leave a message in a queue. A packet rides the link.
 * Two "what if" switches show the two kinds of coupling: renaming a column (change-time)
 * breaks only the first wiring; Inventory going down (run-time) breaks the first two,
 * while the queue just piles up messages and drains when Inventory is back. A scorecard
 * keeps all three side by side.
 */

"use client";

import { Check, Database, PackageOpen, ShoppingCart, X } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

type ModeId = "reach" | "interface" | "message";

const MODES: { id: ModeId; name: string; carry: string; knows: string }[] = [
  {
    id: "reach",
    name: "Reach inside",
    carry: "SELECT qty FROM inventory_stock",
    knows: "Checkout knows Inventory's table and column names.",
  },
  {
    id: "interface",
    name: "Call an interface",
    carry: "reserve(sku, quantity)",
    knows: "Checkout knows one function and two fields.",
  },
  {
    id: "message",
    name: "Leave a message",
    carry: "OrderPlaced",
    knows: "Checkout knows a message format, and doesn't wait.",
  },
];

// Does Checkout keep working when...
const SURVIVES: Record<ModeId, { rename: boolean; down: boolean }> = {
  reach: { rename: false, down: false },
  interface: { rename: true, down: false },
  message: { rename: true, down: true },
};

const MAX_BACKLOG = 6;

// A link with a packet on it: down on phones, across from `sm` up.
function Track({ label, tone, stuck }: { label: string; tone: Tone; stuck?: boolean }) {
  const dot = "absolute hidden h-2.5 w-2.5 rounded-full bg-(--tone) motion-safe:block";
  return (
    <div data-tone={tone} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col sm:gap-1">
      <div
        className={cn(
          "relative ml-6 h-10 w-[2px] shrink-0 rounded-full sm:hidden",
          stuck ? "bg-(--tone)/60" : "bg-(--tone-line)",
        )}
      >
        {!stuck && (
          <span
            aria-hidden
            className={cn(dot, "left-1/2 -translate-x-1/2 -translate-y-1/2", styles["ride-down"])}
            style={{ "--dur": "1.6s" } as CSSProperties}
          />
        )}
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="absolute -bottom-1.5 left-1/2 h-2 w-3 -translate-x-1/2 fill-(--tone)"
        >
          <path d="M0 0 L12 0 L6 8 Z" />
        </svg>
      </div>
      <p className="min-w-0 font-mono text-xs break-words text-(--tone) sm:text-center">{label}</p>
      <div
        className={cn(
          "relative hidden h-[2px] w-full rounded-full sm:block",
          stuck ? "bg-(--tone)/60" : "bg-(--tone-line)",
        )}
      >
        {!stuck && (
          <span
            aria-hidden
            className={cn(dot, "top-1/2 -translate-x-1/2 -translate-y-1/2", styles.ride)}
            style={{ "--dur": "1.6s" } as CSSProperties}
          />
        )}
        <svg
          aria-hidden
          viewBox="0 0 8 12"
          className="absolute top-1/2 -right-1 h-3 w-2 -translate-y-1/2 fill-(--tone)"
        >
          <path d="M0 0 L8 6 L0 12 Z" />
        </svg>
      </div>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      data-tone="red"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition active:translate-y-px",
        on
          ? "border-(--tone) bg-(--tone-soft) text-(--tone)"
          : "border-rule text-ink hover:border-ink-muted",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
          on ? "border-(--tone) bg-(--tone-soft)" : "border-rule bg-paper",
        )}
      >
        <span
          className={cn(
            "absolute h-3.5 w-3.5 rounded-full transition-transform",
            on ? "translate-x-4 bg-(--tone)" : "translate-x-0.5 bg-ink-muted",
          )}
        />
      </span>
      {children}
    </button>
  );
}

export default function DecouplingDiagram() {
  const [mode, setMode] = useState<ModeId>("reach");
  const [renamed, setRenamed] = useState(false);
  const [down, setDown] = useState(false);
  const [backlog, setBacklog] = useState(0);
  const current = MODES.find((m) => m.id === mode) ?? MODES[0];
  const queue = mode === "message";

  // While Inventory is down, messages pile up in the queue; when it's back, they drain.
  useEffect(() => {
    if (!queue) return;
    const timer = window.setInterval(
      () => setBacklog((n) => (down ? Math.min(MAX_BACKLOG, n + 1) : Math.max(0, n - 1))),
      down ? 1100 : 450,
    );
    return () => window.clearInterval(timer);
  }, [queue, down]);

  const brokenByRename = renamed && !SURVIVES[mode].rename;
  const brokenByDown = down && !SURVIVES[mode].down;
  const checkoutBroken = brokenByRename || brokenByDown;
  const linkTone: Tone = checkoutBroken ? "red" : queue ? "blue" : "violet";

  let status = current.knows;
  if (brokenByRename)
    status =
      "Inventory renamed qty to quantity. Checkout's query now fails: a change inside one module broke another.";
  else if (brokenByDown)
    status =
      mode === "reach"
        ? "Inventory's database is down, so Checkout's query hangs and the order fails."
        : "The interface hides the table, but Checkout still waits for an answer that never comes. The order fails.";
  else if (down && queue)
    status = `Inventory is down. Checkout still confirms orders; ${backlog} message${backlog === 1 ? "" : "s"} wait in the queue for Inventory to come back.`;
  else if (renamed)
    status = "Inventory renamed a column behind its interface. Checkout never noticed.";

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label="How Checkout talks to Inventory"
        className="grid gap-2 sm:grid-cols-3"
      >
        {MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            data-tone={i === 0 ? "red" : i === 1 ? "amber" : "green"}
            onClick={() => {
              setMode(m.id);
              setBacklog(0);
            }}
            className={cn(
              "flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition active:translate-y-px",
              mode === m.id
                ? "border-(--tone) bg-(--tone-soft) text-(--tone)"
                : "border-(--tone-line) text-ink hover:bg-(--tone-soft)",
            )}
          >
            <span className="font-mono text-xs">{i + 1}</span>
            {m.name}
          </button>
        ))}
      </div>

      {/* The scene */}
      <div className="dg-canvas flex flex-col items-stretch gap-1 rounded-xl border border-rule p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-5">
        <div
          data-tone={checkoutBroken ? "red" : "violet"}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-xl border border-(--tone-line) bg-paper px-3 py-2.5 transition-colors sm:w-36 sm:flex-col sm:text-center",
            checkoutBroken && "tut-shake border-(--tone)",
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone)">
            {checkoutBroken ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <ShoppingCart className="h-5 w-5" aria-hidden />
            )}
          </span>
          <span>
            <span className="block font-semibold text-ink">Checkout</span>
            <span className="block text-xs text-(--tone)">
              {checkoutBroken ? "order failed" : "order confirmed"}
            </span>
          </span>
        </div>

        <Track
          label={brokenByRename ? "column qty not found" : current.carry}
          tone={linkTone}
          stuck={checkoutBroken}
        />

        {queue && (
          <>
            <div
              data-tone="blue"
              className="flex shrink-0 items-center gap-2 rounded-xl border border-(--tone-line) bg-(--tone-soft) px-3 py-2 sm:flex-col"
            >
              <span className="text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
                queue
              </span>
              <span className="flex h-5 min-w-[5.5rem] items-end gap-1" aria-hidden>
                {Array.from({ length: backlog }, (_, n) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: identical, positional blocks.
                    key={n}
                    className={cn("h-full w-3 rounded-sm bg-(--tone) opacity-60", styles.drop)}
                  />
                ))}
              </span>
              <span className="font-mono text-xs text-ink-muted">{backlog} waiting</span>
            </div>
            <Track label={down ? "paused" : "read when ready"} tone="blue" stuck={down} />
          </>
        )}

        <div
          data-tone={down ? "red" : "green"}
          className={cn(
            "shrink-0 rounded-xl border border-(--tone-line) bg-paper p-2.5 transition-colors sm:w-60",
            down && "border-dashed opacity-70",
          )}
        >
          <p className="flex items-center gap-2 font-semibold text-ink">
            <PackageOpen className="h-4 w-4 text-(--tone)" aria-hidden />
            Inventory
            <span className="ml-auto font-mono text-xs text-(--tone)">{down ? "down" : "up"}</span>
          </p>
          <p
            data-tone={mode === "reach" ? "red" : "violet"}
            className={cn(
              "mt-2 rounded-md border px-2 py-1 font-mono text-xs transition-colors",
              mode === "reach"
                ? "border-dashed border-rule text-ink-muted"
                : "border-(--tone) bg-(--tone-soft) text-ink",
            )}
          >
            reserve() <span className="text-ink-muted">· public</span>
          </p>
          <div
            data-tone={mode === "reach" ? "red" : "term"}
            className={cn(
              "mt-1.5 rounded-md border px-2 py-1 transition-colors",
              mode === "reach" ? "border-(--tone) bg-(--tone-soft)" : "border-rule",
            )}
          >
            <p className="flex items-center gap-1 font-mono text-[0.7rem] text-ink-muted">
              <Database className="h-3 w-3" aria-hidden /> inventory_stock
              <span className="ml-auto">private</span>
            </p>
            <p className="mt-0.5 grid grid-cols-3 gap-1 font-mono text-[0.7rem] text-ink">
              <span>sku</span>
              <span
                key={renamed ? "new" : "old"}
                className={cn(renamed && "tut-pop text-(--tone)")}
              >
                {renamed ? "quantity" : "qty"}
              </span>
              <span>warehouse</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Toggle on={renamed} onClick={() => setRenamed(!renamed)}>
          Rename a column
        </Toggle>
        <Toggle on={down} onClick={() => setDown(!down)}>
          Inventory goes down
        </Toggle>
      </div>

      <p aria-live="polite" className="min-h-12 leading-snug text-ink">
        {status}
      </p>

      {/* Scorecard */}
      <div className="overflow-x-auto rounded-xl border border-rule">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-paper-raised text-ink-muted">
              <th className="p-2.5 font-semibold">Wiring</th>
              <th className="p-2.5 font-semibold">Survives a rename</th>
              <th className="p-2.5 font-semibold">Survives Inventory down</th>
            </tr>
          </thead>
          <tbody>
            {MODES.map((m) => (
              <tr
                key={m.id}
                className={cn(
                  "border-t border-rule transition-colors",
                  mode === m.id ? "bg-paper-raised" : "opacity-70",
                )}
              >
                <th scope="row" className="p-2.5 font-semibold text-ink">
                  {m.name}
                </th>
                {(["rename", "down"] as const).map((k) => {
                  const ok = SURVIVES[m.id][k];
                  return (
                    <td key={k} data-tone={ok ? "green" : "red"} className="p-2.5 text-(--tone)">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        {ok ? (
                          <Check className="h-4 w-4" aria-hidden />
                        ) : (
                          <X className="h-4 w-4" aria-hidden />
                        )}
                        {ok ? "yes" : "no"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
