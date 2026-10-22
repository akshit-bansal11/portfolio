/*
 * DemoControls.tsx
 * Small, accessible controls shared by every interactive demo:
 *  - SegmentedControl: a radio group (arrow keys move the choice).
 *  - DemoButton: a chunky notebook-style button.
 *  - DemoSlider: a labelled range input with its current value.
 *  - DemoToggle: a labelled on/off switch.
 * All have 44px+ touch targets for phones.
 */

"use client";

import { type ButtonHTMLAttributes, type KeyboardEvent, useId, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  /** Visible label for the group. */
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const labelId = useId();
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Roving focus: arrows move and select, like native radio buttons.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const nextIndex = (index + step + options.length) % options.length;
    onChange(options[nextIndex].value);
    buttonsRef.current[nextIndex]?.focus();
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span
        id={labelId}
        className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase"
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="inline-flex w-full rounded-xl border-2 border-ink bg-paper p-1 sm:w-auto"
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              ref={(element) => {
                buttonsRef.current[index] = element;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold transition-colors sm:flex-none",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
                isSelected ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface DemoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
}

export function DemoButton({
  variant = "outline",
  className,
  type = "button",
  ...props
}: DemoButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-ink px-4 text-sm font-semibold transition-transform",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
        "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
        variant === "solid" ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-raised",
        className,
      )}
      {...props}
    />
  );
}

interface DemoSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Text shown next to the label, e.g. "4 cells". Also used as aria-valuetext. */
  valueText: string;
  className?: string;
}

export function DemoSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  valueText,
  className,
}: DemoSliderProps) {
  const id = useId();
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
          {label}
        </span>
        <span className="font-hand text-xl leading-none text-pen">{valueText}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full cursor-pointer touch-manipulation accent-[var(--blog-pen)]"
      />
    </div>
  );
}

interface DemoToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function DemoToggle({ label, checked, onChange, className }: DemoToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex min-h-11 items-center gap-3 rounded-xl px-1 text-left text-sm font-semibold text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-ink transition-colors",
          checked ? "bg-pen" : "bg-paper",
        )}
      >
        <span
          className={cn(
            "absolute h-4 w-4 rounded-full bg-ink transition-transform",
            checked ? "translate-x-[1.35rem]" : "translate-x-0.5",
          )}
        />
      </span>
      {label}
    </button>
  );
}
