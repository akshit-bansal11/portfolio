/*
 * GroceryListDemo.tsx
 * The CRDT post's main demo. Two phones share one grocery list
 * and each runs two sync engines side by side:
 *  - Yjs: a real Y.Doc per phone. Updates flow between the docs
 *    when both phones are online; on reconnect they exchange
 *    exactly what the other is missing (state vectors) and merge.
 *  - Naive last-write-wins: each phone keeps a snapshot plus a
 *    timestamp; on reconnect the newer snapshot replaces the
 *    older one wholesale.
 * Take both phones offline, edit both, reconnect, and compare. Styled with the tutorial
 * tones: a live link between the phones carries packets while both are online, each
 * reconnect flashes both phones, and new items pop in.
 */

"use client";

import { Check, RotateCcw, Trash2, Wifi, WifiOff } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import * as Y from "yjs";
import { DemoToggle } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";
import styles from "./motion.module.css";
import Pipe from "./Pipe";

type PhoneId = "a" | "b";

interface Item {
  id: string;
  text: string;
  done: boolean;
}

interface LwwState {
  items: Item[];
  /** Logical time of the last local edit. */
  updatedAt: number;
}

const PHONES: Record<PhoneId, { name: string }> = {
  a: { name: "Meera's phone" },
  b: { name: "Kabir's phone" },
};

const STARTING_ITEMS: Item[] = [
  { id: "seed-milk", text: "milk", done: false },
  { id: "seed-bread", text: "bread", done: false },
];

const other = (phone: PhoneId): PhoneId => (phone === "a" ? "b" : "a");

// Builds two Y.Docs that start from the same shared history.
function createDocs(): Record<PhoneId, Y.Doc> {
  const a = new Y.Doc();
  const b = new Y.Doc();
  const list = a.getArray<Y.Map<string | boolean>>("groceries");
  a.transact(() => {
    for (const item of STARTING_ITEMS) list.push([toYMap(item)]);
  });
  Y.applyUpdate(b, Y.encodeStateAsUpdate(a), "remote");
  return { a, b };
}

function toYMap(item: Item): Y.Map<string | boolean> {
  const map = new Y.Map<string | boolean>();
  map.set("id", item.id);
  map.set("text", item.text);
  map.set("done", item.done);
  return map;
}

// Reads a doc's list as plain items.
function readItems(doc: Y.Doc): Item[] {
  return doc
    .getArray<Y.Map<string | boolean>>("groceries")
    .toArray()
    .map((map) => ({
      id: String(map.get("id")),
      text: String(map.get("text")),
      done: map.get("done") === true,
    }));
}

function findIndex(doc: Y.Doc, id: string): number {
  return doc
    .getArray<Y.Map<string | boolean>>("groceries")
    .toArray()
    .findIndex((map) => map.get("id") === id);
}

// Sends `from` everything `to` hasn't seen yet (a diff based on `to`'s state vector).
function syncDocs(from: Y.Doc, to: Y.Doc) {
  Y.applyUpdate(to, Y.encodeStateAsUpdate(from, Y.encodeStateVector(to)), "remote");
}

const freshLww = (): Record<PhoneId, LwwState> => ({
  a: { items: STARTING_ITEMS, updatedAt: 0 },
  b: { items: STARTING_ITEMS, updatedAt: 0 },
});

export default function GroceryListDemo() {
  // The Y.Docs are mutable objects that change under React. Opt out of React Compiler
  // memoisation so reads like the document size are never served from a stale cache.
  "use no memo";
  const [docs, setDocs] = useState(createDocs);
  const [, setVersion] = useState(0);
  const [online, setOnline] = useState<Record<PhoneId, boolean>>({ a: true, b: true });
  const [lww, setLww] = useState(freshLww);
  const [pending, setPending] = useState<Record<PhoneId, number>>({ a: 0, b: 0 });
  const [drafts, setDrafts] = useState<Record<PhoneId, string>>({ a: "", b: "" });
  const [syncs, setSyncs] = useState(0);
  const clockRef = useRef(1);
  const idRef = useRef(0);
  const inputPrefix = useId();
  const bothOnline = online.a && online.b;

  // Re-render on any doc change; forward local Yjs updates live while both phones are online.
  useEffect(() => {
    const listeners = (["a", "b"] as const).map((phone) => {
      const listener = (update: Uint8Array, origin: unknown) => {
        if (origin !== "remote" && bothOnline) Y.applyUpdate(docs[other(phone)], update, "remote");
        setVersion((version) => version + 1);
      };
      docs[phone].on("update", listener);
      return () => docs[phone].off("update", listener);
    });
    return () => listeners.forEach((off) => off());
  }, [docs, bothOnline]);

  // Applies a local edit to both engines on one phone.
  const edit = (
    phone: PhoneId,
    applyYjs: (doc: Y.Doc) => void,
    applyLww: (items: Item[]) => Item[],
  ) => {
    applyYjs(docs[phone]);
    const updatedAt = clockRef.current++;
    setLww((previous) => {
      const next = { ...previous, [phone]: { items: applyLww(previous[phone].items), updatedAt } };
      // Online: push the whole snapshot to the other phone right away.
      if (bothOnline) next[other(phone)] = next[phone];
      return next;
    });
    if (!bothOnline) setPending((previous) => ({ ...previous, [phone]: previous[phone] + 1 }));
  };

  const addItem = (phone: PhoneId, event: FormEvent) => {
    event.preventDefault();
    const text = drafts[phone].trim();
    if (!text) return;
    const item: Item = { id: `${phone}-${idRef.current++}`, text, done: false };
    edit(
      phone,
      (doc) => doc.getArray<Y.Map<string | boolean>>("groceries").push([toYMap(item)]),
      (items) => [...items, item],
    );
    setDrafts((previous) => ({ ...previous, [phone]: "" }));
  };

  const toggleItem = (phone: PhoneId, id: string) =>
    edit(
      phone,
      (doc) => {
        const index = findIndex(doc, id);
        if (index === -1) return;
        const map = doc.getArray<Y.Map<string | boolean>>("groceries").get(index);
        map.set("done", map.get("done") !== true);
      },
      (items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );

  const removeItem = (phone: PhoneId, id: string) =>
    edit(
      phone,
      (doc) => {
        const index = findIndex(doc, id);
        if (index !== -1) doc.getArray("groceries").delete(index, 1);
      },
      (items) => items.filter((item) => item.id !== id),
    );

  // Reconnecting: Yjs exchanges missing updates both ways; LWW keeps only the newest snapshot.
  const setPhoneOnline = (phone: PhoneId, value: boolean) => {
    const next = { ...online, [phone]: value };
    setOnline(next);
    if (next.a && next.b) {
      syncDocs(docs.a, docs.b);
      syncDocs(docs.b, docs.a);
      setLww((previous) => {
        const winner = previous.a.updatedAt >= previous.b.updatedAt ? previous.a : previous.b;
        return { a: winner, b: winner };
      });
      setPending({ a: 0, b: 0 });
      setSyncs((count) => count + 1);
    }
  };

  const reset = () => {
    setDocs(createDocs());
    setLww(freshLww());
    setOnline({ a: true, b: true });
    setPending({ a: 0, b: 0 });
    setDrafts({ a: "", b: "" });
    setSyncs(0);
  };

  const yItems = { a: readItems(docs.a), b: readItems(docs.b) };
  const docBytes = {
    a: Y.encodeStateAsUpdate(docs.a).length,
    b: Y.encodeStateAsUpdate(docs.b).length,
  };

  // After a sync, anything Yjs kept but LWW dropped was lost by LWW, and anything
  // LWW still shows that Yjs deleted came back from the dead.
  const lost = bothOnline
    ? yItems.a
        .filter((item) => !lww.a.items.some((kept) => kept.id === item.id))
        .map((item) => item.text)
    : [];
  const zombies = bothOnline
    ? lww.a.items
        .filter((item) => !yItems.a.some((kept) => kept.id === item.id))
        .map((item) => item.text)
    : [];

  let note = "Take both phones offline, add different things on each, then bring them back online.";
  if (!bothOnline)
    note =
      "Offline edits are saved locally. Nothing is lost yet… reconnect and see who keeps what.";
  if (bothOnline && (lost.length > 0 || zombies.length > 0)) {
    note = [
      "Yjs merged both phones' edits.",
      lost.length > 0
        ? `Last-write-wins kept only the newest phone's list and lost: ${lost.join(", ")}.`
        : "",
      zombies.length > 0 ? `It also brought back deleted items: ${zombies.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
  } else if (bothOnline && (lww.a.updatedAt > 0 || lww.b.updatedAt > 0)) {
    note = "In sync. Both engines agree… for now.";
  }

  const hurt = lost.length + zombies.length > 0;

  const phoneCard = (phone: PhoneId) => (
    <section
      key={phone}
      data-tone={phone === "a" ? "violet" : "blue"}
      aria-label={PHONES[phone].name}
      className={cn(
        "relative min-w-0 flex-1 rounded-2xl border bg-paper p-3 transition-[border-color,opacity] duration-300",
        online[phone] ? "border-(--tone-line)" : "border-dashed border-ink-muted/60",
      )}
    >
      {syncs > 0 && (
        <span
          key={syncs}
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 rounded-2xl", styles["flash-out"])}
        />
      )}
      <div className="relative flex items-center justify-between gap-2">
        <h4 className="font-semibold text-(--tone)">{PHONES[phone].name}</h4>
        <span
          data-tone={online[phone] ? "green" : "amber"}
          className="inline-flex items-center gap-1 rounded-full bg-(--tone-soft) px-2 py-0.5 text-xs font-semibold text-(--tone)"
        >
          {online[phone] ? (
            <Wifi className="h-3 w-3" aria-hidden />
          ) : (
            <WifiOff className="h-3 w-3" aria-hidden />
          )}
          {online[phone] ? "online" : "offline"}
        </span>
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-x-3">
        <DemoToggle
          label="Connected"
          checked={online[phone]}
          onChange={(value) => setPhoneOnline(phone, value)}
        />
        {pending[phone] > 0 && (
          <span
            data-tone="amber"
            className="tut-pop inline-flex items-center gap-1.5 rounded-full bg-(--tone-soft) px-2.5 py-0.5 text-xs font-semibold text-(--tone)"
          >
            <span aria-hidden className="tut-ping h-1.5 w-1.5 rounded-full bg-(--tone)" />
            {pending[phone]} change{pending[phone] === 1 ? "" : "s"} waiting
          </span>
        )}
      </div>

      <form onSubmit={(event) => addItem(phone, event)} className="relative mt-2 flex gap-2">
        <label htmlFor={`${inputPrefix}-${phone}`} className="sr-only">
          Add an item on {PHONES[phone].name}
        </label>
        <input
          id={`${inputPrefix}-${phone}`}
          value={drafts[phone]}
          onChange={(event) =>
            setDrafts((previous) => ({ ...previous, [phone]: event.target.value }))
          }
          placeholder="add an item…"
          maxLength={24}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-rule bg-paper-raised px-3 text-sm text-ink transition-colors placeholder:text-ink-muted focus-visible:border-(--tone) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone)"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-xl border border-(--tone-line) bg-(--tone-soft) px-4 text-sm font-semibold text-(--tone) transition-[translate,border-color] hover:border-(--tone) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone) active:translate-y-px"
        >
          Add
        </button>
      </form>

      <p className="relative mt-3 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
        With Yjs (CRDT)
      </p>
      <ul className="relative mt-1 space-y-1">
        {yItems[phone].map((item) => (
          <li
            key={item.id}
            className="tut-pop flex items-center gap-2 rounded-lg border border-rule bg-paper-raised px-2 transition-colors hover:border-(--tone-line)"
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={item.done}
              onClick={() => toggleItem(phone, item.id)}
              className="flex min-h-10 flex-1 items-center gap-2 text-left text-sm text-ink focus-visible:outline-2 focus-visible:outline-(--tone)"
            >
              <span
                aria-hidden
                data-tone="green"
                className={cn(
                  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-(--tone-line) transition-colors",
                  item.done && "bg-(--tone)",
                )}
              >
                {item.done && <Check className="tut-pop h-3.5 w-3.5 text-paper" />}
              </span>
              <span className={cn("transition-colors", item.done && "text-ink-muted line-through")}>
                {item.text}
              </span>
            </button>
            <button
              type="button"
              data-tone="red"
              onClick={() => removeItem(phone, item.id)}
              aria-label={`Remove ${item.text}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-(--tone-soft) hover:text-(--tone) focus-visible:outline-2 focus-visible:outline-(--tone)"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
        {yItems[phone].length === 0 && <li className="text-sm text-ink-muted">empty list</li>}
      </ul>
      <p className="relative mt-1 font-mono text-xs text-ink-muted">
        Yjs document: {docBytes[phone]} bytes
      </p>

      <p className="relative mt-3 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
        With last-write-wins
      </p>
      <ul
        aria-label={`Last-write-wins list on ${PHONES[phone].name}`}
        className="relative mt-1 flex flex-wrap gap-1.5"
      >
        {lww[phone].items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "tut-pop rounded-full border border-rule px-2.5 py-0.5 text-sm text-ink",
              item.done && "text-ink-muted line-through",
            )}
          >
            {item.text}
          </li>
        ))}
        {lww[phone].items.length === 0 && <li className="text-sm text-ink-muted">empty list</li>}
      </ul>
    </section>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-stretch md:flex-row md:items-start">
        {phoneCard("a")}
        <div className="md:self-center">
          <Pipe
            active={bothOnline}
            tone={bothOnline ? "green" : "amber"}
            label={bothOnline ? "live updates" : "no link"}
          />
        </div>
        {phoneCard("b")}
      </div>

      <div
        data-tone={hurt ? "red" : "green"}
        className="flex flex-col gap-3 rounded-xl border border-(--tone-line) bg-(image:--tone-fill) px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <p aria-live="polite" className="leading-snug font-medium text-ink">
          {note}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 self-start rounded-lg border border-rule bg-paper px-3 text-sm font-medium text-ink transition-[translate,border-color] hover:border-(--tone-line) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone) active:translate-y-px sm:self-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </button>
      </div>
    </div>
  );
}
