/*
 * RichText.tsx
 * Renders resume inline text: **bold** becomes <strong>, [label](url)
 * becomes a real link. External links open in a new tab.
 */

import type { ReactNode } from "react";

// Splits on **bold** and [label](url), keeping the delimiters as parts.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

// Anchor that opens http(s) targets in a new tab and leaves mailto: in place.
export function RichLink({ href, children }: { href: string; children: ReactNode }) {
  const isExternal = href.startsWith("http");
  return (
    <a href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

// Renders one string with its bold and link markup.
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part) => {
        const link = LINK.exec(part);
        if (link) {
          return (
            <RichLink key={part} href={link[2]}>
              {link[1]}
            </RichLink>
          );
        }
        if (part.startsWith("**")) return <strong key={part}>{part.slice(2, -2)}</strong>;
        return part;
      })}
    </>
  );
}
