/*
 * highlight.ts
 * Tiny regex syntax tokenizer for tutorial code blocks. Pure and import-free so it
 * runs under plain Node for its test. It works line by line, so a string or comment
 * that spans lines is only coloured on the line where it starts.
 * Invariant: the token text of a line joins back to the exact input line.
 */

export type TokenKind = "plain" | "keyword" | "string" | "comment" | "number" | "key" | "var";

export interface Token {
  text: string;
  kind: TokenKind;
}

type Rule = readonly [RegExp, TokenKind];

const STRING = /"(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?/y;
const NUMBER = /\b\d+(?:\.\d+)?\b/y;
const FLAG = /--?[A-Za-z][\w-]*/y;
const SHELL_VAR = /\$\{[^}]*\}?|\$[A-Za-z_]\w*|\$[0-9?#@*!$]/y;
const JS_WORDS =
  /\b(?:const|let|var|function|return|if|else|for|while|import|from|export|default|new|await|async|class|throw|try|catch|true|false|null|undefined)\b/y;

// Ordered rules per language: the first one that matches at the cursor wins.
const RULES: Record<string, Rule[]> = {
  bash: [
    [/#.*/y, "comment"],
    [STRING, "string"],
    [SHELL_VAR, "var"],
    [
      /\b(?:if|then|else|elif|fi|for|do|done|while|case|esac|in|function|export|sudo)\b/y,
      "keyword",
    ],
    [FLAG, "key"],
    [NUMBER, "number"],
  ],
  dockerfile: [
    [/#.*/y, "comment"],
    [
      /\b(?:FROM|RUN|CMD|LABEL|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL|AS)\b/y,
      "keyword",
    ],
    [STRING, "string"],
    [SHELL_VAR, "var"],
    [FLAG, "key"],
    [NUMBER, "number"],
  ],
  yaml: [
    [/#.*/y, "comment"],
    [/[\w./-]+(?=\s*:(?:\s|$))/y, "key"],
    [STRING, "string"],
    [/\b(?:true|false|null|yes|no)\b/y, "keyword"],
    [NUMBER, "number"],
  ],
  json: [
    [/"(?:\\.|[^"\\])*"(?=\s*:)/y, "key"],
    [STRING, "string"],
    [/\b(?:true|false|null)\b/y, "keyword"],
    [/-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y, "number"],
  ],
  javascript: [
    [/\/\/.*/y, "comment"],
    [/"(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?|`[^`]*`?/y, "string"],
    [JS_WORDS, "keyword"],
    [NUMBER, "number"],
  ],
  text: [],
};

const ALIASES: Record<string, string> = {
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  docker: "dockerfile",
  yml: "yaml",
  js: "javascript",
  jsx: "javascript",
  ts: "javascript",
  tsx: "javascript",
};

// Tokenizes one line with the given rules, merging adjacent plain characters.
function tokenizeLine(line: string, rules: Rule[]): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  while (pos < line.length) {
    let text = "";
    let kind: TokenKind = "plain";
    for (const [pattern, ruleKind] of rules) {
      pattern.lastIndex = pos;
      const match = pattern.exec(line);
      if (match && match[0].length > 0) {
        text = match[0];
        kind = ruleKind;
        break;
      }
    }
    if (text === "") text = line[pos];

    const last = tokens[tokens.length - 1];
    if (kind === "plain" && last?.kind === "plain") last.text += text;
    else tokens.push({ text, kind });
    pos += text.length;
  }

  return tokens;
}

// Splits code into lines of coloured tokens; unknown languages come back as plain text.
export function highlight(code: string, lang: string): Token[][] {
  const key = lang.toLowerCase();
  const rules = RULES[ALIASES[key] ?? key] ?? [];

  return code.split("\n").map((line) => tokenizeLine(line, rules));
}
