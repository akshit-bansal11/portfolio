/*
 * Callout.tsx
 * Boxed aside with a tone, an icon and a label (so it never relies on colour alone):
 * `tip`, `warn`, `real-world` (a real-life example), `note`, `insight` (the "aha" behind
 * an idea) or `important` (a rule worth remembering).
 */

import {
  BookOpen,
  Globe,
  Lightbulb,
  type LucideIcon,
  Sparkles,
  Star,
  TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";

type Kind = "tip" | "warn" | "real-world" | "note" | "insight" | "important";

const KINDS: Record<Kind, { tone: Tone; label: string; Icon: LucideIcon }> = {
  tip: { tone: "cyan", label: "Tip", Icon: Lightbulb },
  warn: { tone: "amber", label: "Watch out", Icon: TriangleAlert },
  "real-world": { tone: "violet", label: "Real-world example", Icon: Globe },
  note: { tone: "blue", label: "Note", Icon: BookOpen },
  insight: { tone: "green", label: "Insight", Icon: Sparkles },
  important: { tone: "pink", label: "Remember this", Icon: Star },
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
      className="tut-glow my-7 max-w-[88ch] rounded-xl border border-l-[6px] border-(--tone) bg-(image:--tone-fill) p-4"
    >
      <p className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-(--tone) px-2.5 py-0.5 text-xs font-bold tracking-wide text-paper uppercase">
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {title ?? label}
        </span>
      </p>
      <div className="mt-2 text-ink [&>p]:my-2 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}
