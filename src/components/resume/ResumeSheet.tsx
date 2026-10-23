/*
 * ResumeSheet.tsx
 * One resume document typeset as a paper sheet: name, contact row, then
 * every section kind (text, entries, list, pairs). Server component; the
 * look (screen and print) lives in app/resume/resume.css.
 */

import {
  RESUME_HEADER,
  type ResumeDocument,
  type ResumeEntry,
  type ResumeSection,
} from "@/data/resume";
import { RichLink, RichText } from "./RichText";

interface ResumeSheetProps {
  doc: ResumeDocument;
  variant: "one" | "full";
}

// Bulleted list of rich-text lines.
function Bullets({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}

// Title/dates row, italic subtitle/location row, intro and bullets.
function Entry({ entry }: { entry: ResumeEntry }) {
  return (
    <div className="resume-entry">
      <div className="resume-row">
        <h3>
          {entry.title}
          {entry.link && (
            <>
              {" | "}
              <RichLink href={entry.link.href}>{entry.link.label}</RichLink>
            </>
          )}
        </h3>
        {entry.dates && <span className="resume-dates">{entry.dates}</span>}
      </div>
      {(entry.subtitle || entry.location) && (
        <div className="resume-row resume-sub">
          <span>{entry.subtitle}</span>
          {entry.location && <span>{entry.location}</span>}
        </div>
      )}
      {entry.intro && (
        <p>
          <RichText text={entry.intro} />
        </p>
      )}
      {entry.bullets && <Bullets items={entry.bullets} />}
    </div>
  );
}

// Body of one section, by kind.
function SectionBody({ section }: { section: ResumeSection }) {
  switch (section.kind) {
    case "text":
      return (
        <p>
          <RichText text={section.text} />
        </p>
      );
    case "entries":
      return section.entries.map((entry) => <Entry key={entry.title} entry={entry} />);
    case "list":
      return <Bullets items={section.items} />;
    case "pairs":
      return section.pairs.map(({ label, value }) => (
        <p key={label}>
          <strong>{label}:</strong> <RichText text={value} />
        </p>
      ));
  }
}

// The full sheet: header block plus all sections.
export default function ResumeSheet({ doc, variant }: ResumeSheetProps) {
  return (
    <article className="resume-sheet" data-variant={variant}>
      <header>
        <h1>{RESUME_HEADER.name}</h1>
        <p className="resume-tagline">
          {RESUME_HEADER.title} · {RESUME_HEADER.location}
        </p>
        <ul className="resume-links">
          {RESUME_HEADER.links.map((link) => (
            <li key={link.href}>
              <RichLink href={link.href}>{link.label}</RichLink>
            </li>
          ))}
        </ul>
      </header>
      {doc.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <SectionBody section={section} />
        </section>
      ))}
    </article>
  );
}
