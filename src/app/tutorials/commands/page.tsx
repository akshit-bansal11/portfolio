/*
 * page.tsx
 * /tutorials/commands — index of the command references, one card per tool.
 */

import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/blog/ThemeToggle";
import ToolLogo from "@/components/commands/ToolLogo";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { commandTools, countCommands, totalCommandCount } from "@/data/commands";

const TITLE = "Command reference";
const PAGE_URL = "/tutorials/commands";
const DESCRIPTION = `Searchable cheat sheets for ${commandTools.length} command-line tools, ${totalCommandCount} commands in all, each with a copy button.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: PAGE_URL },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function CommandsIndexPage() {
  return (
    <main className="mx-auto max-w-[78rem] px-4 pt-24 pb-28 sm:px-6 md:pt-28">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/#tutorials"
          className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden
          />
          All tutorials
        </Link>
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-semibold text-ink">{TITLE}</h1>
      <p className="mt-3 mb-10 max-w-2xl text-ink-muted">{DESCRIPTION}</p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {commandTools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tutorials/commands/${tool.slug}`}
              className="block h-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
            >
              <Card className="h-full border-rule bg-paper-raised text-ink transition-colors hover:border-pen dark:border-rule dark:bg-paper-raised dark:text-ink">
                <CardHeader>
                  <ToolLogo logo={tool.logo} size={48} />
                  <h2 className="text-xl leading-none font-semibold tracking-tight">
                    {tool.name}
                  </h2>
                  <CardDescription className="text-ink-muted dark:text-ink-muted">
                    {tool.description}
                  </CardDescription>
                  <p className="text-sm text-ink-muted">{countCommands(tool)} commands</p>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
