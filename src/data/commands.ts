/*
 * commands.ts
 * Command-reference data: one JSON file per tool in src/content/commands, imported
 * statically (no fs). Order matches the tool list of the original cmd-ref project.
 */

import bash from "../content/commands/bash.json" with { type: "json" };
import biomejs from "../content/commands/biomejs.json" with { type: "json" };
import cmd from "../content/commands/cmd.json" with { type: "json" };
import git from "../content/commands/git.json" with { type: "json" };
import github from "../content/commands/github.json" with { type: "json" };
import npm from "../content/commands/npm.json" with { type: "json" };
import pnpm from "../content/commands/pnpm.json" with { type: "json" };
import powershell from "../content/commands/powershell.json" with { type: "json" };
import prettier from "../content/commands/prettier.json" with { type: "json" };
import vitest from "../content/commands/vitest.json" with { type: "json" };
import ytDlp from "../content/commands/yt-dlp.json" with { type: "json" };

export interface ToolCommand {
  command: string;
  description: string;
  flags?: string[] | { name: string; description?: string }[];
  example?: string;
}

export interface CommandCategory {
  title: string;
  commands: ToolCommand[];
}

export interface CommandTool {
  name: string;
  slug: string;
  logo: string;
  accent: string;
  description: string;
  categories: CommandCategory[];
}

export const commandTools: CommandTool[] = [
  bash,
  biomejs,
  cmd,
  git,
  github,
  npm,
  pnpm,
  powershell,
  prettier,
  vitest,
  ytDlp,
];

// Finds one tool by its URL slug.
export function getCommandTool(slug: string): CommandTool | undefined {
  return commandTools.find((tool) => tool.slug === slug);
}

// Number of commands in one tool.
export function countCommands(tool: CommandTool): number {
  return tool.categories.reduce((sum, category) => sum + category.commands.length, 0);
}

export const totalCommandCount = commandTools.reduce((sum, tool) => sum + countCommands(tool), 0);
