/*
 * page.tsx
 * The /resume route. Renders the one-page resume from the stored
 * resume (D1, falling back to the built-in copy). Static, revalidated hourly
 * and on every save; ResumeViewer adds the print button.
 */

import type { Metadata } from "next";
import ResumeSheet from "@/components/resume/ResumeSheet";
import ResumeViewer from "@/components/resume/ResumeViewer";
import { getResume } from "@/lib/resume/store";
import "./resume.css";

export const metadata: Metadata = {
  title: "Resume | Akshit Bansal",
  description:
    "Resume of Akshit Bansal, a full-stack software engineer: one-page resume, printable as PDF.",
  alternates: { canonical: "/resume" },
};

export const revalidate = 3600;

export default async function ResumePage() {
  const { header, one } = await getResume();
  return (
    <main className="resume-page">
      {/* One soft static glow behind the paper. */}
      <div aria-hidden className="resume-glow" />
      <div className="relative">
        <ResumeViewer>
          <ResumeSheet doc={one} header={header} />
        </ResumeViewer>
      </div>
    </main>
  );
}
