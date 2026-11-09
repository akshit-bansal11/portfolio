/*
 * commands.test.ts
 * Run with `npm test`. Guards the command-reference data: tool count, unique slugs,
 * no empty entries, and the total number of commands carried over from cmd-ref.
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { commandTools, totalCommandCount } from "./commands.ts";

test("has 11 tools with unique slugs", () => {
  assert.equal(commandTools.length, 11);
  assert.equal(new Set(commandTools.map((tool) => tool.slug)).size, 11);
});

test("every category and command is non-empty", () => {
  for (const tool of commandTools) {
    assert.ok(tool.categories.length > 0, tool.slug);
    for (const category of tool.categories) {
      const where = `${tool.slug}/${category.title}`;
      assert.ok(category.title.trim() && category.commands.length > 0, where);
      for (const command of category.commands) {
        const text = `${tool.slug}: ${command.command}`;
        assert.ok(command.command.trim() && command.description.trim(), text);
      }
    }
  }
});

test("has 3255 commands in total", () => {
  assert.equal(totalCommandCount, 3255);
});
