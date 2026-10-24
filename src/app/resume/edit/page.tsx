/*
 * page.tsx
 * The /resume/edit route: the on-site resume editor. Admin only (the key form
 * and every write are enforced by the API), never indexed, never linked from
 * public pages. Always rendered fresh from the stored resume.
 */

import type { Metadata } from "next";
import ResumeEditor from "@/components/resume/ResumeEditor";
import { loadResumeForEdit } from "@/lib/resume/store";
import "../resume.css";

export const metadata: Metadata = {
  title: "Edit resume | Akshit Bansal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResumeEditPage() {
  const { content, source } = await loadResumeForEdit();
  return (
    <main className="resume-page">
      <div aria-hidden className="resume-glow" />
      <div className="relative">
        <ResumeEditor initial={content} source={source} />
      </div>
    </main>
  );
}
