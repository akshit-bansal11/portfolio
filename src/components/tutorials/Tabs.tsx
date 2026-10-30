/*
 * Tabs.tsx
 * WAI-ARIA tabs (automatic activation, roving tabindex, arrow/Home/End keys) for
 * per-OS instructions. Tabs with the same `group` share one selection through a
 * module-level store, so choosing macOS once switches every OS tab on the page.
 * All panels stay in the DOM (inactive ones are `hidden`); print shows every panel.
 */

"use client";

import {
  Children,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useId,
  useRef,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

// Selected label per group, shared by every Tabs on the page.
const selections = new Map<string, string>();
const listeners = new Set<() => void>();

// Subscribes to selection changes.
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

// Records a selection and notifies every Tabs.
function select(group: string, label: string) {
  selections.set(group, label);
  for (const listener of listeners) listener();
}

interface TabProps {
  label: string;
  children: ReactNode;
}

// One panel; Tabs reads its label and renders its children.
export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

interface TabsProps {
  /** Tabs with the same group share their selection. Omit for a standalone set. */
  group?: string;
  children: ReactNode;
}

export default function Tabs({ group, children }: TabsProps) {
  const id = useId();
  const key = group ?? id;
  const tabs = Children.toArray(children).filter((child): child is ReactElement<TabProps> =>
    isValidElement(child),
  );
  const labels = tabs.map((tab) => tab.props.label);
  const stored = useSyncExternalStore(
    subscribe,
    () => selections.get(key),
    () => undefined,
  );
  const selected = stored && labels.includes(stored) ? stored : labels[0];
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Moves the selection with the arrow keys, Home and End.
  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = labels.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(key, labels[next]);
    buttons.current[next]?.focus();
  }

  return (
    <div className="my-7">
      <div
        role="tablist"
        aria-label="Choose your system"
        className="tut-tablist flex gap-1 overflow-x-auto border-b border-rule"
      >
        {labels.map((label, index) => {
          const active = label === selected;
          return (
            <button
              key={label}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={active}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(key, label)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "-mb-px min-h-11 shrink-0 cursor-pointer border-b-2 px-4 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pen",
                active
                  ? "border-pen text-ink"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.props.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          data-label={tab.props.label}
          hidden={tab.props.label !== selected}
          tabIndex={0}
          className="tut-tabpanel pt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
        >
          {tab.props.children}
        </div>
      ))}
    </div>
  );
}
