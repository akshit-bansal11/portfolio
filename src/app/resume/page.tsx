/*
 * page.tsx
 * The /resume route. Statically renders both resume documents (one page and
 * full CV) on the server; ResumeViewer switches between them and prints.
 */

import type { Metadata } from "next";
import ResumeSheet from "@/components/resume/ResumeSheet";
import ResumeViewer from "@/components/resume/ResumeViewer";
import { RESUME_FULL, RESUME_ONE_PAGE } from "@/data/resume";
import "./resume.css";

export const metadata: Metadata = {
  title: "Resume | Akshit Bansal",
  description:
    "Resume of Akshit Bansal, a full-stack software engineer: one-page summary and full CV, printable as PDF.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main className="resume-page">
      {/* One soft static glow behind the paper. */}
      <div aria-hidden className="resume-glow" />
      <div className="relative">
        <ResumeViewer
          onePage={<ResumeSheet doc={RESUME_ONE_PAGE} variant="one" />}
          full={<ResumeSheet doc={RESUME_FULL} variant="full" />}
        />
      </div>
    </main>
  );
}
