/*
 * validate.ts
 * Pure, dependency-free validation for the comment endpoint.
 * No test runner is configured in this repo, so these stay pure and easy to test later.
 */

export const NAME_MAX = 60;
export const EMAIL_MAX = 254;
export const BODY_MIN = 2;
export const BODY_MAX = 2000;

export interface CommentInput {
  anonymous: boolean;
  name: string | null;
  email: string | null;
  body: string;
}

export type CommentResult =
  | { ok: true; honeypot: false; value: CommentInput }
  | { ok: true; honeypot: true }
  | { ok: false; fields: Record<string, string> };

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// NFC-normalises, strips control and format characters, then trims. Single-line
// text also has its whitespace runs collapsed; multiline text keeps "\n" (\r\n becomes \n).
export function cleanText(value: string, multiline = false): string {
  const text = value.normalize("NFC").replace(/\r\n?/g, "\n");
  const spaced = multiline ? text : text.replace(/\s+/g, " ");
  return spaced
    .replace(/[\p{Cc}\p{Cf}]/gu, (ch) => (multiline && ch === "\n" ? ch : ""))
    .trim();
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function validateComment(input: unknown): CommentResult {
  if (!isRecord(input)) return { ok: false, fields: { body: "Write a comment first." } };
  if (asString(input.website).trim() !== "") return { ok: true, honeypot: true };

  const fields: Record<string, string> = {};
  const anonymous = input.anonymous === true;
  const body = cleanText(asString(input.body), true);
  if (body.length < BODY_MIN || body.length > BODY_MAX) {
    fields.body = `Comment must be ${BODY_MIN}-${BODY_MAX} characters.`;
  }

  let name: string | null = null;
  let email: string | null = null;
  if (!anonymous) {
    name = cleanText(asString(input.name));
    email = cleanText(asString(input.email));
    if (name.length < 1 || name.length > NAME_MAX) {
      fields.name = `Name must be 1-${NAME_MAX} characters.`;
    }
    if (email.length > EMAIL_MAX || !EMAIL_SHAPE.test(email)) {
      fields.email = "Enter a valid email address.";
    }
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, honeypot: false, value: { anonymous, name, email, body } };
}
