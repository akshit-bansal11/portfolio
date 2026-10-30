/*
 * CodeWindow.tsx
 * Replaces <pre> in tutorials with an IDE-style window: a title bar (three dots, file name
 * or language, copy button), a line-number gutter and syntax colours from highlight.ts.
 * A first line like `# file: Dockerfile` or `// file: app.js` names the file and is not shown.
 * Only the code region scrolls sideways; in print it wraps instead.
 */

import { type ComponentPropsWithoutRef, isValidElement, type ReactNode } from "react";
import CopyButton from "@/components/tutorials/CopyButton";
import { nodeToText } from "@/lib/blog/slugify";
import { highlight, type TokenKind } from "@/lib/tutorials/highlight";

// Tailwind classes per token kind (full names so Tailwind can see them); plain has none.
const KIND_CLASS: Record<TokenKind, string> = {
  plain: "",
  keyword: "text-(--code-keyword)",
  string: "text-(--code-string)",
  comment: "text-(--code-comment) italic",
  number: "text-(--code-number)",
  key: "text-(--code-key)",
  var: "text-(--code-var)",
};

const FILE_LINE = /^(?:#|\/\/) file: (.+)$/;

interface CodeChildProps {
  className?: string;
  children?: ReactNode;
}

// Pulls the language and the plain code text out of the <code> element MDX puts inside <pre>.
function readCode(children: ReactNode): { lang: string; code: string } {
  const child = isValidElement<CodeChildProps>(children) ? children : null;
  const lang = /language-(\S+)/.exec(child?.props.className ?? "")?.[1] ?? "text";
  const code = nodeToText(child ? child.props.children : children).replace(/\n$/, "");

  return { lang, code };
}

export default function CodeWindow({ children }: ComponentPropsWithoutRef<"pre">) {
  const { lang, code: raw } = readCode(children);
  const [first, ...rest] = raw.split("\n");
  const fileName = FILE_LINE.exec(first)?.[1];
  const code = fileName ? rest.join("\n") : raw;
  const title = fileName ?? lang;

  return (
    <div className="tut-code my-7 overflow-hidden rounded-xl border border-rule bg-(--code-bg) text-(--code-fg)">
      <div className="flex items-center gap-3 bg-(--code-bar) pl-3">
        <span aria-hidden className="flex shrink-0 gap-1.5">
          <span className="h-3 w-3 rounded-full bg-(--tut-red)" />
          <span className="h-3 w-3 rounded-full bg-(--tut-amber)" />
          <span className="h-3 w-3 rounded-full bg-(--tut-green)" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs">{title}</span>
        {fileName && <span className="shrink-0 text-xs text-(--code-gutter)">{lang}</span>}
        <CopyButton code={code} />
      </div>
      <div
        role="region"
        aria-label={`Code: ${title}`}
        tabIndex={0}
        className="overflow-x-auto py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pen"
      >
        <pre className="m-0 min-w-max font-mono text-[0.85rem] leading-6">
          <code>
            {highlight(code, lang).map((tokens, index) => (
              <span key={index} className="flex">
                <span
                  aria-hidden
                  className="w-12 shrink-0 pr-4 text-right text-(--code-gutter) select-none"
                >
                  {index + 1}
                </span>
                <span className="tut-line min-w-0 flex-1 pr-4 whitespace-pre">
                  {tokens.map((token, i) => (
                    <span key={i} className={KIND_CLASS[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
