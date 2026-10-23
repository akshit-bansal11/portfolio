/*
 * ThemeToggle.tsx
 * Light/dark switch for the hero. The <html data-theme> attribute (set
 * before paint by the inline script in the root layout) is the source of
 * truth; this button flips it and stores the choice under the blog's key.
 */

"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils";

// In-tab subscribers; the attribute changes only through this component.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function readIsLight() {
  return document.documentElement.dataset.theme === "light";
}

// Applies and persists the choice, then notifies subscribers.
function setTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable: the choice still applies for this page view.
  }
  for (const listener of listeners) listener();
}

// Shared by both icons: rotate and scale in or out, instantly under reduced motion.
const ICON_CLASS =
  "absolute h-[18px] w-[18px] transition-all duration-300 motion-reduce:transition-none";

export default function ThemeToggle() {
  const isLight = useSyncExternalStore(subscribe, readIsLight, () => false);

  return (
    <button
      type="button"
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-hero-muted transition-colors duration-200 hover:text-hero-ink focus-visible:outline-2 focus-visible:outline-hero-pen"
    >
      {/* The icon shows the theme you would switch to. */}
      <Sun
        aria-hidden
        strokeWidth={1.5}
        className={cn(ICON_CLASS, isLight ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0")}
      />
      <Moon
        aria-hidden
        strokeWidth={1.5}
        className={cn(ICON_CLASS, isLight ? "scale-100 rotate-0" : "scale-0 -rotate-90 opacity-0")}
      />
    </button>
  );
}
