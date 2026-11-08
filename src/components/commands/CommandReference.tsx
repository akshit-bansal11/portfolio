/*
 * CommandReference.tsx
 * Body of a tool page: a text filter, the category nav and one section per category with a
 * card per command (command + copy button, description, flags, example). The filter works
 * across all categories; categories with no match disappear.
 */

"use client";

import { useMemo, useState } from "react";
import CategoryNav from "@/components/commands/CategoryNav";
import CopyButton from "@/components/tutorials/CopyButton";
import type { CommandTool, ToolCommand } from "@/data/commands";

// Lower-cased text a command is matched against.
function haystack(command: ToolCommand): string {
  const flags = (command.flags ?? []).map((flag) =>
    typeof flag === "string" ? flag : `${flag.name} ${flag.description ?? ""}`,
  );
  return [command.command, command.description, ...flags].join(" ").toLowerCase();
}

export default function CommandReference({ tool }: { tool: CommandTool }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const categories = useMemo(
    () =>
      tool.categories
        .map((category, index) => ({
          id: `category-${index}`,
          title: category.title,
          commands: needle
            ? category.commands.filter((command) => haystack(command).includes(needle))
            : category.commands,
        }))
        .filter((category) => category.commands.length > 0),
    [tool, needle],
  );

  const navItems = useMemo(
    () => categories.map(({ id, title, commands }) => ({ id, title, count: commands.length })),
    [categories],
  );

  const matchCount = categories.reduce((sum, category) => sum + category.commands.length, 0);

  return (
    <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
      <div className="mb-6 lg:col-span-2">
        <label htmlFor="command-filter" className="mb-1.5 block text-sm font-medium text-ink">
          Filter commands
        </label>
        <input
          id="command-filter"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 w-full max-w-md rounded-md border border-rule bg-paper-raised px-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
        />
      </div>

      {categories.length > 0 && <CategoryNav categories={navItems} />}

      <div className="min-w-0 pt-6 lg:col-start-2 lg:pt-0">
        <p role="status" className="sr-only">
          {needle ? `${matchCount} commands match` : ""}
        </p>
        {categories.length === 0 ? (
          <div className="rounded-lg border border-rule bg-paper-raised p-6 text-ink">
            <p>No commands match &ldquo;{query.trim()}&rdquo;.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 min-h-11 cursor-pointer rounded-md border border-rule px-4 text-sm text-ink hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
            >
              Clear filter
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-title`}
              className="mb-12 scroll-mt-24"
            >
              <h2 id={`${category.id}-title`} className="mb-4 text-2xl font-semibold text-ink">
                {category.title}
              </h2>
              <ul className="flex flex-col gap-4">
                {category.commands.map((command, index) => (
                  <li
                    key={`${command.command}-${index}`}
                    className="rounded-lg border border-rule bg-paper-raised p-4 text-ink"
                  >
                    <div className="flex items-start justify-between gap-3 rounded-md bg-(--code-bg) pl-3 text-(--code-fg)">
                      <code className="min-w-0 flex-1 overflow-x-auto py-2.5 font-mono text-[0.85rem] whitespace-pre">
                        {command.command}
                      </code>
                      <CopyButton code={command.command} label={`Copy ${command.command}`} />
                    </div>
                    <p className="mt-3 text-ink-muted">{command.description}</p>
                    {command.flags && command.flags.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-1 text-sm">
                        {command.flags.map((flag) => {
                          const name = typeof flag === "string" ? flag : flag.name;
                          const text = typeof flag === "string" ? undefined : flag.description;
                          return (
                            <li key={name}>
                              <code className="font-mono text-pen-blue">{name}</code>
                              {text && <span className="text-ink-muted"> — {text}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {command.example && (
                      <div className="mt-3 flex items-start justify-between gap-3 rounded-md bg-(--code-bg) pl-3 text-(--code-fg)">
                        <pre className="min-w-0 flex-1 overflow-x-auto py-2.5 font-mono text-[0.85rem]">
                          <code>{command.example}</code>
                        </pre>
                        <CopyButton
                          code={command.example}
                          label={`Copy example for ${command.command}`}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
