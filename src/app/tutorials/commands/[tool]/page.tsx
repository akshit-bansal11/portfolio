/*
 * page.tsx
 * /tutorials/commands/[tool] — one tool's command reference. Statically generated for every
 * tool in src/data/commands.ts; the interactive part lives in CommandReference.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/blog/ThemeToggle";
import CommandReference from "@/components/commands/CommandReference";
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

  return {
    title: `${tool.name} commands`,
    description: `${tool.description}. ${countCommands(tool)} ${tool.name} commands with descriptions and copy buttons.`,
    alternates: { canonical: `/tutorials/commands/${tool.slug}` },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: slug } = await params;
  const tool = getCommandTool(slug);
  if (!tool) notFound();

  return (
    <main className="mx-auto max-w-[78rem] px-4 pt-24 pb-28 sm:px-6 md:pt-28">
      <div className="mb-6 flex flex-wrap items-start justify-end gap-3">
        <ThemeToggle />
      </div>
      <header className="mb-8 flex flex-wrap items-center gap-4">
        <Image unoptimized src={tool.logo} alt="" width={56} height={56} className="h-14 w-14" />
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
