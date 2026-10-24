/*
 * ResumeSheet.tsx
 * One resume document turned into layout blocks (header, each section's
 * heading glued to its first item, then every later item on its own) and
 * handed to PagedSheet, which sets them on A4 sheets. Server component for
 * the public page; the look (screen and print) lives in app/resume/resume.css.
 * The editor passes `edit` (its field and control components plus change
 * callbacks) so the same blocks render editable. This file never imports the
 * editor, so /resume ships none of it.
 */

import type { ComponentType, ReactNode } from "react";
import type { ResumeDocument, ResumeEntry, ResumeHeader, ResumeSection } from "@/data/resume";
import PagedSheet, { type BlockKind, type PagedBlock } from "./PagedSheet";
import { RichLink, RichText } from "./RichText";

export interface EditAction {
  kind: "up" | "down" | "add" | "remove";
  /** Full accessible name, e.g. "Move Experience, entry 2 up". */
  label: string;
  onClick: () => void;
}

/** Components the editor supplies; ResumeSheet only places them. */
export interface EditKit {
  Field: ComponentType<{
    value: string;
    label: string;
    rich?: boolean;
    onChange: (value: string) => void;
  }>;
  Controls: ComponentType<{ actions: EditAction[] }>;
}

export interface SheetEdit {
  kit: EditKit;
  onDoc: (doc: ResumeDocument) => void;
  onHeader: (header: ResumeHeader) => void;
}

interface ResumeSheetProps {
  doc: ResumeDocument;
  header: ResumeHeader;
  variant: "one" | "full";
  edit?: SheetEdit;
  onOverflow?: (overflowing: boolean) => void;
}

// A text value: plain, rich (bold/links) or, when editing, an in-place field.
function Txt({
  kit,
  value,
  label,
  rich,
  onChange,
}: {
  kit?: EditKit;
  value: string;
  label: string;
  rich?: boolean;
  onChange?: (value: string) => void;
}) {
  if (kit && onChange) {
    return <kit.Field value={value} label={label} rich={rich} onChange={onChange} />;
  }
  return rich ? <RichText text={value} /> : <>{value}</>;
}

// Move / add-after / remove actions for item `i` of a list. `min` items must remain.
function listActions<T>(
  items: T[],
  i: number,
  noun: string,
  name: string,
  change: (next: T[]) => void,
  fresh: T,
  min = 1,
): EditAction[] {
  const at = `${name}, ${noun} ${i + 1}`;
  const swap = (j: number) => {
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  };
  const actions: EditAction[] = [];
  if (i > 0) actions.push({ kind: "up", label: `Move ${at} up`, onClick: () => swap(i - 1) });
  if (i < items.length - 1) {
    actions.push({ kind: "down", label: `Move ${at} down`, onClick: () => swap(i + 1) });
  }
  actions.push({
    kind: "add",
    label: `Add a ${noun} after ${at}`,
    onClick: () => change([...items.slice(0, i + 1), fresh, ...items.slice(i + 1)]),
  });
  if (items.length > min) {
    actions.push({
      kind: "remove",
      label: `Remove ${at} (Discard changes brings it back)`,
      onClick: () => change(items.filter((_, k) => k !== i)),
    });
  }
  return actions;
}

interface EntryEdit {
  kit: EditKit;
  name: string;
  actions: EditAction[];
  onChange: (entry: ResumeEntry) => void;
}

// Title/dates row, italic subtitle/location row, intro and bullets.
function Entry({ entry, edit }: { entry: ResumeEntry; edit?: EntryEdit }) {
  const kit = edit?.kit;
  const set = (patch: Partial<ResumeEntry>) => edit?.onChange({ ...entry, ...patch });
  const name = edit?.name ?? "";
  const bullets = entry.bullets ?? [];
  return (
    <div className="resume-entry">
      <div className="resume-row">
        <h3>
          <Txt
            kit={kit}
            value={entry.title}
            label={`${name}, title`}
            onChange={(title) => set({ title })}
          />
          {entry.link && (
            <>
              {" | "}
              <RichLink href={entry.link.href}>{entry.link.label}</RichLink>
            </>
          )}
        </h3>
        {entry.dates !== undefined && (
          <span className="resume-dates">
            <Txt
              kit={kit}
              value={entry.dates}
              label={`${name}, dates`}
              onChange={(dates) => set({ dates })}
            />
          </span>
        )}
      </div>
      {(entry.subtitle || entry.location) && (
        <div className="resume-row resume-sub">
          <span>
            {entry.subtitle !== undefined && (
              <Txt
                kit={kit}
                value={entry.subtitle}
                label={`${name}, subtitle`}
                onChange={(subtitle) => set({ subtitle })}
              />
            )}
          </span>
          {entry.location !== undefined && (
            <span>
              <Txt
                kit={kit}
                value={entry.location}
                label={`${name}, location`}
                onChange={(location) => set({ location })}
              />
            </span>
          )}
        </div>
      )}
      {entry.intro !== undefined && (
        <p>
          <Txt
            kit={kit}
            value={entry.intro}
            label={`${name}, intro`}
            rich
            onChange={(intro) => set({ intro })}
          />
        </p>
      )}
      {bullets.length > 0 && (
        <ul>
          {bullets.map((bullet, b) => {
            const slot = `bullet-${b}`;
            return (
              <li key={slot}>
                <Txt
                  kit={kit}
                  value={bullet}
                  label={`${name}, bullet ${b + 1}`}
                  rich
                  onChange={(text) => set({ bullets: bullets.map((x, k) => (k === b ? text : x)) })}
                />
                {edit && (
                  <edit.kit.Controls
                    actions={listActions(
                      bullets,
                      b,
                      "bullet",
                      name,
                      (next) => set({ bullets: next.length ? next : undefined }),
                      "New bullet",
                      0,
                    )}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
      {edit && (
        <edit.kit.Controls
          actions={[
            ...edit.actions,
            {
              kind: "add",
              label: `Add a bullet to ${name}`,
              onClick: () => set({ bullets: [...bullets, "New bullet"] }),
            },
          ]}
        />
      )}
    </div>
  );
}

// Each item of a section as its own block, in reading order.
function sectionItems(
  section: ResumeSection,
  edit?: { kit: EditKit; onSection: (section: ResumeSection) => void },
): { kind: BlockKind; node: ReactNode }[] {
  const kit = edit?.kit;
  const name = section.heading;
  switch (section.kind) {
    case "text":
      return [
        {
          kind: "line",
          node: (
            <p>
              <Txt
                kit={kit}
                value={section.text}
                label={`${name}, text`}
                rich
                onChange={edit && ((text) => edit.onSection({ ...section, text }))}
              />
            </p>
          ),
        },
      ];
    case "entries":
      return section.entries.map((entry, i) => {
        const change = (entries: ResumeEntry[]) => edit?.onSection({ ...section, entries });
        return {
          kind: "entry",
          node: (
            <Entry
              entry={entry}
              edit={
                edit && {
                  kit: edit.kit,
                  name: `${name}, ${entry.title}`,
                  actions: listActions(
                    section.entries,
                    i,
                    "entry",
                    name,
                    change,
                    { title: "New entry" },
                  ),
                  onChange: (next) => change(section.entries.map((x, k) => (k === i ? next : x))),
                }
              }
            />
          ),
        };
      });
    case "list":
      return section.items.map((item, i) => ({
        kind: "bullet",
        node: (
          <ul>
            <li>
              <Txt
                kit={kit}
                value={item}
                label={`${name}, item ${i + 1}`}
                rich
                onChange={
                  edit &&
                  ((text) =>
                    edit.onSection({
                      ...section,
                      items: section.items.map((x, k) => (k === i ? text : x)),
                    }))
                }
              />
              {edit && (
                <edit.kit.Controls
                  actions={listActions(
                    section.items,
                    i,
                    "item",
                    name,
                    (items) => edit.onSection({ ...section, items }),
                    "New item",
                  )}
                />
              )}
            </li>
          </ul>
        ),
      }));
    case "pairs":
      return section.pairs.map((pair, i) => {
        const setPair = (patch: Partial<typeof pair>) =>
          edit?.onSection({
            ...section,
            pairs: section.pairs.map((x, k) => (k === i ? { ...x, ...patch } : x)),
          });
        return {
          kind: "line",
          node: (
            <p>
              <strong>
                <Txt
                  kit={kit}
                  value={pair.label}
                  label={`${name}, row ${i + 1} label`}
                  onChange={edit && ((label) => setPair({ label }))}
                />
                :
              </strong>{" "}
              <Txt
                kit={kit}
                value={pair.value}
                label={`${name}, row ${i + 1} text`}
                rich
                onChange={edit && ((value) => setPair({ value }))}
              />
              {edit && (
                <edit.kit.Controls
                  actions={listActions(
                    section.pairs,
                    i,
                    "row",
                    name,
                    (pairs) => edit.onSection({ ...section, pairs }),
                    { label: "Label", value: "Value" },
                  )}
                />
              )}
            </p>
          ),
        };
      });
  }
}

// Header first, then per section: heading + first item together, the rest alone.
function buildBlocks(doc: ResumeDocument, header: ResumeHeader, edit?: SheetEdit): PagedBlock[] {
  const kit = edit?.kit;
  const field = (key: "name" | "title" | "location") =>
    edit && ((value: string) => edit.onHeader({ ...header, [key]: value }));
  const blocks: PagedBlock[] = [
    {
      key: "header",
      kind: "header",
      node: (
        <header>
          <h1>
            <Txt kit={kit} value={header.name} label="Header, name" onChange={field("name")} />
          </h1>
          <p className="resume-tagline">
            <Txt
              kit={kit}
              value={header.title}
              label="Header, job title"
              onChange={field("title")}
            />
            {" · "}
            <Txt
              kit={kit}
              value={header.location}
              label="Header, location"
              onChange={field("location")}
            />
          </p>
          <ul className="resume-links">
            {header.links.map((link) => (
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
    const sectionEdit = edit && {
      kit: edit.kit,
      onSection: (next: ResumeSection) =>
        edit.onDoc({ sections: doc.sections.map((x, k) => (k === s ? next : x)) }),
    };
    sectionItems(section, sectionEdit).forEach((item, i) => {
      blocks.push({
        key: `${s}-${i}`,
        kind: i === 0 ? "section" : item.kind,
        node:
          i === 0 ? (
            <section>
              <h2>
                <Txt
                  kit={kit}
                  value={section.heading}
                  label={`Section ${s + 1} heading`}
                  onChange={
                    sectionEdit && ((heading) => sectionEdit.onSection({ ...section, heading }))
                  }
                />
              </h2>
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

export default function ResumeSheet({ doc, header, variant, edit, onOverflow }: ResumeSheetProps) {
  return (
    <PagedSheet
      blocks={buildBlocks(doc, header, edit)}
      variant={variant}
      editing={edit !== undefined}
      onOverflow={onOverflow}
    />
  );
}
