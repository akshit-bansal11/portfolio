/*
 * highlight.test.ts
 * Run with `npm test` (Node's built-in runner). Checks that tokenizing never changes the
 * text, for every supported language, and that one token comes out as expected.
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { highlight } from "./highlight.ts";

const SAMPLES: Record<string, string[]> = {
  bash: [
    "# list",
    'docker run -d --name web -p 8080:80 "nginx:$TAG"',
    "if true; then echo $HOME; fi",
  ],
  dockerfile: ["FROM node:22 AS build", "ENV PORT=3000 # port", "RUN npm ci --omit=dev"],
  yaml: ["# c", "services:", "  web:", "    image: nginx:1.27", "      - 80:80", "    tty: true"],
  json: ["{", '  "name": "app",', '  "n": -1.5e3,', '  "ok": true,', '  "x": [null]', "}"],
  javascript: ["const a = 'x'; // note", "await fetch(`/api`, { retries: 3 });"],
  text: ["anything at all: $ # \" ' é", ""],
};

test("joining the tokens of each line reproduces the input", () => {
  for (const [lang, lines] of Object.entries(SAMPLES)) {
    const out = highlight(lines.join("\n"), lang);
    assert.equal(out.length, lines.length, lang);
    out.forEach((tokens, i) => {
      assert.equal(tokens.map((token) => token.text).join(""), lines[i], `${lang} line ${i}`);
    });
  }
});

test("a dockerfile instruction is a keyword and a yaml key is a key", () => {
  assert.deepEqual(highlight("FROM node", "dockerfile")[0][0], { text: "FROM", kind: "keyword" });
  assert.deepEqual(highlight("image: x", "yaml")[0][0], { text: "image", kind: "key" });
});
