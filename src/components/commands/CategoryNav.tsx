/*
 * CategoryNav.tsx
 * Anchor list of a tool's categories. Highlights the category whose section is nearest the
 * top of the viewport (IntersectionObserver) with aria-current. Sticky column on wide
 * screens, a horizontal scroll list below.
 */

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavCategory {
  id: string;
  title: string;
  count: number;
}

export default function CategoryNav({ categories }: { categories: NavCategory[] }) {
  const [active, setActive] = useState<string | undefined>(undefined);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // First visible section in page order wins.
        setActive(categories.find((category) => visible.has(category.id))?.id);
      },
      { rootMargin: "-96px 0px -60% 0px" },
    );
    for (const category of categories) {
      const element = document.getElementById(category.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav
      aria-label="Categories"
      className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto"
    >
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        {categories.map((category) => {
          const current = category.id === active;
          return (
            <li key={category.id} className="shrink-0">
              <a
                href={`#${category.id}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-3 rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
                  current
                    ? "border-pen bg-paper-raised font-medium text-ink"
                    : "border-rule text-ink-muted hover:text-ink lg:border-transparent",
                )}
              >
                <span>{category.title}</span>
                <span className="text-xs tabular-nums">{category.count}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
