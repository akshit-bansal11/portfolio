/*
 * ResumeSheet.tsx
 * One resume document turned into layout blocks (header, each section's
 * heading glued to its first item, then every later item on its own) and
 * handed to PagedSheet, which sets them on A4 sheets. Server component; the
 * look (screen and print) lives in app/resume/resume.css.
 */

import type { ReactNode } from "react";
import {
  RESUME_HEADER,
  type ResumeDocument,
  type ResumeEntry,
  type ResumeSection,
} from "@/data/resume";
import PagedSheet, { type BlockKind, type PagedBlock } from "./PagedSheet";
import { RichLink, RichText } from "./RichText";

interface ResumeSheetProps {
  doc: ResumeDocument;
  variant: "one" | "full";
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
      {entry.bullets && (
        <ul>
          {entry.bullets.map((bullet) => (
            <li key={bullet}>
              <RichText text={bullet} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Each item of a section as its own block, in reading order.
function sectionItems(section: ResumeSection): { kind: BlockKind; node: ReactNode }[] {
  switch (section.kind) {
    case "text":
      return [
        {
          kind: "line",
          node: (
            <p>
              <RichText text={section.text} />
            </p>
          ),
        },
      ];
    case "entries":
      return section.entries.map((entry) => ({
        kind: "entry",
        node: <Entry entry={entry} />,
      }));
    case "list":
      return section.items.map((item) => ({
        kind: "bullet",
        node: (
          <ul>
            <li>
              <RichText text={item} />
            </li>
          </ul>
        ),
      }));
    case "pairs":
      return section.pairs.map(({ label, value }) => ({
        kind: "line",
        node: (
          <p>
            <strong>{label}:</strong> <RichText text={value} />
          </p>
        ),
      }));
  }
}

// Header first, then per section: heading + first item together, the rest alone.
function buildBlocks(doc: ResumeDocument): PagedBlock[] {
  const blocks: PagedBlock[] = [
    {
      key: "header",
      kind: "header",
      node: (
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
      ),
    },
  ];
  doc.sections.forEach((section, s) => {
    sectionItems(section).forEach((item, i) => {
      blocks.push({
        key: `${s}-${i}`,
        kind: i === 0 ? "section" : item.kind,
        node:
          i === 0 ? (
            <section>
              <h2>{section.heading}</h2>
              {item.node}
            </section>
          ) : (
            item.node
          ),
      });
    });
  });
  return blocks;
}

export default function ResumeSheet({ doc, variant }: ResumeSheetProps) {
  return <PagedSheet blocks={buildBlocks(doc)} variant={variant} />;
}
