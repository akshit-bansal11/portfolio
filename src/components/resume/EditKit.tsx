/*
 * EditKit.tsx
 * The two pieces the resume editor hands to ResumeSheet: Field (text shown as
 * it prints, a textarea with the raw **bold** / [label](url) markup while
 * focused) and Controls (move / add / remove, shown on hover or focus, never
 * printed). Client-only; only the editor route imports this file.
 */

"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  createContext,
  type KeyboardEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import type { EditAction, EditKit } from "./ResumeSheet";
import { RichText } from "./RichText";

const ICONS = { up: ArrowUp, down: ArrowDown, add: Plus, remove: Trash2 };

// Which field is open lives in the editor, so it survives a block moving to another sheet.
export const OpenFieldContext = createContext<{
  open: string | null;
  setOpen: (label: string | null) => void;
}>({ open: null, setOpen: () => {} });

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
  const { open, setOpen } = useContext(OpenFieldContext);
  const editing = open === label;
  const area = useRef<HTMLTextAreaElement>(null);

  // Move focus into the textarea when editing starts.
  useEffect(() => {
    const el = area.current;
    // The off-screen measuring copy is inert and must not take focus.
    if (editing && el && !el.closest("[inert]")) el.focus();
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
        onBlur={(event) => {
          // A textarea removed by repagination is not the user leaving the field.
          if (event.currentTarget.isConnected) setOpen(null);
        }}
      />
    );
  }
  return (
    <button
      type="button"
      aria-label={`Edit ${label}: ${value || "empty"}`}
      className="resume-field-btn"
      onClick={() => setOpen(label)}
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
