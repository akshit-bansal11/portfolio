/*
 * BlogThemeRoot.tsx
 * Root wrapper for every /blog page. Owns the reader's
 * colour-theme preference (system / light / dark), mirrors
 * it onto <html data-blog-theme> so portalled UI picks it up,
 * and tells Framer Motion to honour prefers-reduced-motion.
 */

"use client";

import { MotionConfig } from "framer-motion";
import { createContext, type ReactNode, useContext, useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export type BlogThemePreference = "system" | "light" | "dark";

// localStorage key for the persisted preference.
const STORAGE_KEY = "blog-theme";

// In-tab subscribers (the storage event only fires in *other* tabs).
const listeners = new Set<() => void>();

// Subscribes to preference changes from this tab and from other tabs.
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

// Reads the stored preference; storage can throw in private mode, so default to system.
function readPreference(): BlogThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

// Persists the preference and notifies subscribers.
function writePreference(preference: BlogThemePreference) {
  try {
    if (preference === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Storage unavailable: the choice still applies for this page view.
  }
  for (const listener of listeners) listener();
}

interface BlogThemeContextValue {
  preference: BlogThemePreference;
  setPreference: (preference: BlogThemePreference) => void;
}

const BlogThemeContext = createContext<BlogThemeContextValue | null>(null);

interface BlogThemeRootProps {
  children: ReactNode;
  className?: string;
}

// Provider + themed wrapper div.
export function BlogThemeRoot({ children, className }: BlogThemeRootProps) {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);

  // Mirror the choice onto <html> so CSS tokens apply to portals too; clean up on leave.
  useEffect(() => {
    const root = document.documentElement;
    if (preference === "system") delete root.dataset.blogTheme;
    else root.dataset.blogTheme = preference;
    return () => {
      delete root.dataset.blogTheme;
    };
  }, [preference]);

  return (
    <BlogThemeContext.Provider value={{ preference, setPreference: writePreference }}>
      <MotionConfig reducedMotion="user">
        <div className={cn("blog-theme min-h-screen", className)}>{children}</div>
      </MotionConfig>
    </BlogThemeContext.Provider>
  );
}

// Consumer hook with a missing-provider safety check.
export function useBlogTheme() {
  const context = useContext(BlogThemeContext);
  if (!context) throw new Error("useBlogTheme must be used within a BlogThemeRoot");
  return context;
}
