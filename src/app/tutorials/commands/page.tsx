/*
 * page.tsx
 * /tutorials/commands — index of the command references, one card per tool.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { commandTools, countCommands, totalCommandCount } from "@/data/commands";

const DESCRIPTION = `Searchable cheat sheets for ${commandTools.length} command-line tools, ${totalCommandCount} commands in all, each with a copy button.`;

export const metadata: Metadata = {
  title: "Command reference",
  description: DESCRIPTION,
  alternates: { canonical: "/tutorials/commands" },
};

export default function CommandsIndexPage() {
  return (
    <main className="mx-auto max-w-[78rem] px-4 pt-24 pb-28 sm:px-6 md:pt-28">
      <h1 className="text-4xl font-semibold text-ink">Command reference</h1>
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
                  <Image unoptimized src={tool.logo} alt="" width={40} height={40} className="h-10 w-10" />
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
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
