/*
 * validate.ts
 * Pure structural validation for stored and submitted resume content. Safe to
 * import from client code (RichText uses isSafeHref). Field errors are keyed by
 * path, e.g. "one.sections.2.entries.0.bullets.1".
 */

import type {
  ResumeContent,
  ResumeDocument,
  ResumeEntry,
  ResumeHeader,
  ResumeLink,
  ResumeSection,
} from "@/data/resume";
import { isRecord } from "@/lib/engagement/validate";

export const RESUME_MAX_BYTES = 64 * 1024;
export const STRING_MAX = 600;
export const SECTIONS_MAX = 20;
export const ITEMS_MAX = 30;
export const BULLETS_MAX = 12;
export const LINKS_MAX = 8;

const SAFE_PROTOCOLS = new Set(["https:", "http:", "mailto:", "tel:"]);
// Control, format (zero-width, bidi override) and line/paragraph separators.
const HIDDEN_CHARS = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u;

export type ResumeResult =
  | { ok: true; value: ResumeContent }
  | { ok: false; status: 400 | 422; fields: Record<string, string> };

// Only absolute http(s), mailto: and tel: URLs may become links.
export function isSafeHref(href: string): boolean {
  try {
    return SAFE_PROTOCOLS.has(new URL(href).protocol);
  } catch {
    return false;
  }
}

class Checker {
  fields: Record<string, string> = {};
  unknown = false;

  fail(path: string, message: string) {
    this.fields[path] ??= message;
  }

  // Object with exactly the allowed keys; any other key is an error (API-11).
  record(value: unknown, path: string, allowed: string[]): Record<string, unknown> | null {
    if (!isRecord(value) || Array.isArray(value)) {
      this.fail(path, "Expected an object.");
      return null;
    }
    for (const key of Object.keys(value)) {
      if (!allowed.includes(key)) {
        this.unknown = true;
        this.fail(`${path}.${key}`, "Unknown field.");
      }
    }
    return value;
  }

  string(value: unknown, path: string): string {
    if (typeof value !== "string") {
      this.fail(path, "Expected text.");
      return "";
    }
    const text = value.normalize("NFC").trim();
    if (text.length < 1) this.fail(path, "Can't be empty.");
    else if (text.length > STRING_MAX) this.fail(path, `Keep it under ${STRING_MAX} characters.`);
    else if (HIDDEN_CHARS.test(text)) this.fail(path, "Remove line breaks and hidden characters.");
    return text;
  }

  // Absent, null or blank means "not set".
  optionalString(value: unknown, path: string): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "string" && value.trim() === "") return undefined;
    return this.string(value, path);
  }

  array(value: unknown, path: string, min: number, max: number): unknown[] {
    if (!Array.isArray(value)) {
      this.fail(path, "Expected a list.");
      return [];
    }
    if (value.length < min || value.length > max) {
      this.fail(path, `Needs ${min}-${max} items.`);
      return [];
    }
    return value;
  }

  link(value: unknown, path: string): ResumeLink {
    const raw = this.record(value, path, ["label", "href"]);
    const label = this.string(raw?.label, `${path}.label`);
    const href = this.string(raw?.href, `${path}.href`);
    if (href && !isSafeHref(href))
      this.fail(`${path}.href`, "Use an https:, http:, mailto: or tel: link.");
    return { label, href };
  }

  header(value: unknown, path: string): ResumeHeader {
    const raw = this.record(value, path, ["name", "title", "location", "links"]);
    return {
      name: this.string(raw?.name, `${path}.name`),
      title: this.string(raw?.title, `${path}.title`),
      location: this.string(raw?.location, `${path}.location`),
      links: this.array(raw?.links, `${path}.links`, 0, LINKS_MAX).map((link, i) =>
        this.link(link, `${path}.links.${i}`),
      ),
    };
  }

  entry(value: unknown, path: string): ResumeEntry {
    const raw = this.record(value, path, [
      "title",
      "link",
      "dates",
      "subtitle",
      "location",
      "intro",
      "bullets",
    ]);
    const entry: ResumeEntry = { title: this.string(raw?.title, `${path}.title`) };
    if (raw?.link !== undefined && raw.link !== null) {
      entry.link = this.link(raw.link, `${path}.link`);
    }
    for (const key of ["dates", "subtitle", "location", "intro"] as const) {
      const text = this.optionalString(raw?.[key], `${path}.${key}`);
      if (text !== undefined) entry[key] = text;
    }
    if (raw?.bullets !== undefined) {
      entry.bullets = this.array(raw.bullets, `${path}.bullets`, 0, BULLETS_MAX).map((bullet, i) =>
        this.string(bullet, `${path}.bullets.${i}`),
      );
    }
    return entry;
  }

  // Closed union on kind: an unknown kind is rejected (BE-19).
  section(value: unknown, path: string): ResumeSection | null {
    const kind = isRecord(value) ? value.kind : undefined;
    const items = (key: string) => {
      const raw = this.record(value, path, ["kind", "heading", key]);
      return {
        heading: this.string(raw?.heading, `${path}.heading`),
        list: this.array(raw?.[key], `${path}.${key}`, 1, ITEMS_MAX),
      };
    };
    switch (kind) {
      case "text": {
        const raw = this.record(value, path, ["kind", "heading", "text"]);
        return {
          kind: "text",
          heading: this.string(raw?.heading, `${path}.heading`),
          text: this.string(raw?.text, `${path}.text`),
        };
      }
      case "entries": {
        const { heading, list } = items("entries");
        const entries = list.map((entry, i) => this.entry(entry, `${path}.entries.${i}`));
        return { kind: "entries", heading, entries };
      }
      case "list": {
        const { heading, list } = items("items");
        return {
          kind: "list",
          heading,
          items: list.map((item, i) => this.string(item, `${path}.items.${i}`)),
        };
      }
      case "pairs": {
        const { heading, list } = items("pairs");
        const pairs = list.map((pair, i) => {
          const at = `${path}.pairs.${i}`;
          const raw = this.record(pair, at, ["label", "value"]);
          return {
            label: this.string(raw?.label, `${at}.label`),
            value: this.string(raw?.value, `${at}.value`),
          };
        });
        return { kind: "pairs", heading, pairs };
      }
      default:
        this.fail(`${path}.kind`, "Unknown section kind.");
        return null;
    }
  }

  document(value: unknown, path: string): ResumeDocument {
    const raw = this.record(value, path, ["sections"]);
    const sections = this.array(raw?.sections, `${path}.sections`, 1, SECTIONS_MAX)
      .map((section, i) => this.section(section, `${path}.sections.${i}`))
      .filter((section): section is ResumeSection => section !== null);
    return { sections };
  }
}

// Returns typed content, or field errors: 400 when a field is not on the
// allowlist, 422 when the shape is known but a value breaks a rule.
export function validateResume(input: unknown): ResumeResult {
  const check = new Checker();
  const raw = check.record(input, "content", ["header", "one", "full"]);
  const value: ResumeContent = {
    header: check.header(raw?.header, "header"),
    one: check.document(raw?.one, "one"),
    full: check.document(raw?.full, "full"),
  };
  if (Object.keys(check.fields).length > 0) {
    return { ok: false, status: check.unknown ? 400 : 422, fields: check.fields };
  }
  return { ok: true, value };
}
