/*
 * page.tsx
 * /tutorials/commands/[tool] — one tool's command reference. Statically generated for every
 * tool in src/data/commands.ts; the interactive part lives in CommandReference.
 */

import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/blog/ThemeToggle";
import CommandReference from "@/components/commands/CommandReference";
import ToolLogo from "@/components/commands/ToolLogo";
import { Badge } from "@/components/ui/badge";
import { commandTools, countCommands, getCommandTool } from "@/data/commands";

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return commandTools.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getCommandTool(slug);
  if (!tool) return {};

  const title = `${tool.name} commands`;
  const description = `${tool.description}. ${countCommands(tool)} ${tool.name} commands, with descriptions and copy buttons.`;
  const url = `/tutorials/commands/${tool.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: slug } = await params;
  const tool = getCommandTool(slug);
  if (!tool) notFound();

  return (
    <main className="mx-auto max-w-[78rem] px-4 pt-24 pb-28 sm:px-6 md:pt-28">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/tutorials/commands"
          className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden
          />
          All commands
        </Link>
        <ThemeToggle />
      </div>
      <header className="mb-8 flex flex-wrap items-center gap-4">
        <ToolLogo logo={tool.logo} size={64} />
        <div className="min-w-0">
          <h1 className="text-4xl font-semibold text-ink">{tool.name} commands</h1>
          <p className="mt-1 text-ink-muted">{tool.description}</p>
        </div>
        <Badge variant="outline" className="border-rule text-ink dark:border-rule dark:text-ink">
          {countCommands(tool)} commands
        </Badge>
      </header>
      <CommandReference tool={tool} />
    </main>
  );
}
