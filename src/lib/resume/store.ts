/*
 * store.ts
 * Server-only resume storage in D1 (table resume_revisions, db/d1/0002_resume.sql).
 * Every save appends a revision; the newest row is the live resume. Reads fail
 * open to DEFAULT_RESUME: this is public content, so an outage shows the
 * built-in resume instead of an error page.
 */

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { DEFAULT_RESUME, type ResumeContent } from "@/data/resume";
import { d1Query } from "@/lib/engagement/d1";
import { isRecord } from "@/lib/engagement/validate";
import { validateResume } from "./validate";

const RESUME_TAG = "resume";

// D1 credentials only; the blog's IP salt is not needed here.
export function isResumeStoreConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      process.env.CLOUDFLARE_D1_DATABASE_ID &&
      process.env.CLOUDFLARE_D1_API_TOKEN,
  );
}

// Cached so /resume stays static between saves; a save expires the tag. Errors
// are thrown (and so never cached) and handled in getResume.
const latestBody = unstable_cache(
  async (): Promise<string | null> => {
    const rows = await d1Query("SELECT body FROM resume_revisions ORDER BY id DESC LIMIT 1");
    const row = rows[0];
    return isRecord(row) && typeof row.body === "string" ? row.body : null;
  },
  ["resume-latest"],
  { tags: [RESUME_TAG], revalidate: 3600 },
);

export async function getResume(): Promise<ResumeContent> {
  if (!isResumeStoreConfigured()) return DEFAULT_RESUME;
  try {
    const body = await latestBody();
    if (body === null) return DEFAULT_RESUME;
    const result = validateResume(JSON.parse(body));
    if (result.ok) return result.value;
    console.error("stored resume failed validation", Object.keys(result.fields));
  } catch (error) {
    console.error("resume read failed", error);
  }
  return DEFAULT_RESUME;
}

export type EditSource = "stored" | "default" | "error";

// Strict read for the editor: unlike getResume it never papers over a failure,
// because the editor's Save would overwrite the live resume with the fallback.
// "default" = configured, no revision yet; "error" = D1 failed or the body is invalid.
export async function loadResumeForEdit(): Promise<{ content: ResumeContent; source: EditSource }> {
  if (!isResumeStoreConfigured()) return { content: DEFAULT_RESUME, source: "error" };
  try {
    const rows = await d1Query("SELECT body FROM resume_revisions ORDER BY id DESC LIMIT 1");
    if (rows.length === 0) return { content: DEFAULT_RESUME, source: "default" };
    const row = rows[0];
    if (isRecord(row) && typeof row.body === "string") {
      const result = validateResume(JSON.parse(row.body));
      if (result.ok) return { content: result.value, source: "stored" };
      console.error("stored resume failed validation", Object.keys(result.fields));
    }
  } catch (error) {
    console.error("resume edit load failed", error);
  }
  return { content: DEFAULT_RESUME, source: "error" };
}

// Inserts a revision and refreshes /resume. Returns the save time (ms).
export async function saveResume(content: ResumeContent): Promise<number> {
  const savedAt = Date.now();
  await d1Query("INSERT INTO resume_revisions (body, created_at) VALUES (?, ?)", [
    JSON.stringify(content),
    savedAt,
  ]);
  revalidateTag(RESUME_TAG, { expire: 0 });
  revalidatePath("/resume");
  return savedAt;
}
