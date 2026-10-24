/*
 * EditKit.tsx
 * The two pieces the resume editor hands to ResumeSheet: Field (text shown as
 * it prints, a textarea with the raw **bold** / [label](url) markup while
 * focused) and Controls (move / add / remove, shown on hover or focus, never
 * printed). Client-only; only the editor route imports this file.
 */

"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { EditAction, EditKit } from "./ResumeSheet";
import { RichText } from "./RichText";

const ICONS = { up: ArrowUp, down: ArrowDown, add: Plus, remove: Trash2 };

function Field({
  value,
  label,
  rich,
  onChange,
}: {
  value: string;
  label: string;
  rich?: boolean;
  onChange: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);

  // Move focus into the textarea when editing starts.
  useEffect(() => {
    if (editing) area.current?.focus();
  }, [editing]);

  // Grow the textarea with its text (a direct style write, no state).
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [editing, value]);

  // Values are single lines: Enter commits instead of adding a newline.
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.currentTarget.blur();
  };

  if (editing) {
    return (
      <textarea
        ref={area}
        rows={1}
        value={value}
        aria-label={`${label}${rich ? " (supports **bold** and [label](url))" : ""}`}
        className="resume-field-input"
        onChange={(event) => onChange(event.target.value.replace(/[\r\n]+/g, " "))}
        onKeyDown={onKeyDown}
        onBlur={() => setEditing(false)}
      />
    );
  }
  return (
    <button
      type="button"
      aria-label={`Edit ${label}: ${value || "empty"}`}
      className="resume-field-btn"
      onClick={() => setEditing(true)}
    >
      {rich ? <RichText text={value} links={false} /> : value}
    </button>
  );
}

function Controls({ actions }: { actions: EditAction[] }) {
  return (
    <span className="resume-edit">
      {actions.map(({ kind, label, onClick }) => {
        const Icon = ICONS[kind];
        return (
          <button
            key={label}
            type="button"
            aria-label={label}
            title={label}
            data-kind={kind}
            onClick={onClick}
          >
            <Icon aria-hidden size={16} />
          </button>
        );
      })}
    </span>
  );
}

export const EDIT_KIT: EditKit = { Field, Controls };
