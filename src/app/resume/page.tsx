/*
 * page.tsx
 * The /resume route. Renders both resume documents (one page and full CV)
 * from the stored resume (D1, falling back to the built-in copy). Static,
 * revalidated hourly and on every save; ResumeViewer switches and prints.
 */

import type { Metadata } from "next";
import ResumeSheet from "@/components/resume/ResumeSheet";
import ResumeViewer from "@/components/resume/ResumeViewer";
import { getResume } from "@/lib/resume/store";
import "./resume.css";

export const metadata: Metadata = {
  title: "Resume | Akshit Bansal",
  description:
    "Resume of Akshit Bansal, a full-stack software engineer: one-page summary and full CV, printable as PDF.",
  alternates: { canonical: "/resume" },
};

export const revalidate = 3600;

export default async function ResumePage() {
  const { header, one, full } = await getResume();
  return (
    <main className="resume-page">
      {/* One soft static glow behind the paper. */}
      <div aria-hidden className="resume-glow" />
      <div className="relative">
        <ResumeViewer
          onePage={<ResumeSheet doc={one} header={header} variant="one" />}
          full={<ResumeSheet doc={full} header={header} variant="full" />}
        />
      </div>
    </main>
  );
}
