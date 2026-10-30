/*
 * Callout.tsx
 * Boxed aside with a tone, an icon and a label (so it never relies on colour alone):
 * `tip`, `warn`, or `real-world` (a real-life example of the idea).
 */

import { Globe, Lightbulb, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";

type Kind = "tip" | "warn" | "real-world";

const KINDS: Record<Kind, { tone: Tone; label: string; Icon: typeof Lightbulb }> = {
  tip: { tone: "cyan", label: "Tip", Icon: Lightbulb },
  warn: { tone: "amber", label: "Watch out", Icon: TriangleAlert },
  "real-world": { tone: "violet", label: "Real-world example", Icon: Globe },
};

interface CalloutProps {
  kind?: Kind;
  /** Overrides the default label. */
  title?: string;
  children: ReactNode;
}

export default function Callout({ kind = "tip", title, children }: CalloutProps) {
  const { tone, label, Icon } = KINDS[kind];

  return (
    <aside
      data-tone={tone}
      className="my-7 rounded-xl border-l-4 border-(--tone) bg-(--tone-soft) p-4"
    >
      <p className="flex items-center gap-2 font-semibold text-(--tone)">
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        {title ?? label}
      </p>
      <div className="mt-1 text-ink [&>p]:my-2 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}
