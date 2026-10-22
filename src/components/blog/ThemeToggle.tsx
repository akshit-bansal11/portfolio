/*
 * ThemeToggle.tsx
 * Small button that cycles the blog theme:
 * system -> light -> dark -> system.
 */

"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { type BlogThemePreference, useBlogTheme } from "@/components/blog/BlogThemeRoot";
import { cn } from "@/lib/utils";

// Next preference in the cycle, plus the icon and label for each state.
const CYCLE: Record<BlogThemePreference, BlogThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

const LABELS: Record<BlogThemePreference, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { preference, setPreference } = useBlogTheme();
  const Icon = ICONS[preference];
  const next = CYCLE[preference];

  return (
    <button
      type="button"
      onClick={() => setPreference(next)}
      aria-label={`${LABELS[preference]}. Switch to ${LABELS[next].toLowerCase()}.`}
      title={LABELS[preference]}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-rule px-3 text-sm text-ink-muted",
        "transition-colors hover:border-ink hover:text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">{LABELS[preference].replace(" theme", "")}</span>
    </button>
  );
}
