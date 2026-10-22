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
 * Take both phones offline, edit both, reconnect, and compare.
 */

"use client";

import { Check, Trash2, Wifi, WifiOff } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import * as Y from "yjs";
import { DemoButton, DemoToggle } from "@/components/blog/DemoControls";
import { cn } from "@/lib/utils";

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
  const [docs, setDocs] = useState(createDocs);
  const [, setVersion] = useState(0);
  const [online, setOnline] = useState<Record<PhoneId, boolean>>({ a: true, b: true });
  const [lww, setLww] = useState(freshLww);
  const [pending, setPending] = useState<Record<PhoneId, number>>({ a: 0, b: 0 });
  const [drafts, setDrafts] = useState<Record<PhoneId, string>>({ a: "", b: "" });
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
    }
  };

  const reset = () => {
    setDocs(createDocs());
    setLww(freshLww());
    setOnline({ a: true, b: true });
    setPending({ a: 0, b: 0 });
    setDrafts({ a: "", b: "" });
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {(["a", "b"] as const).map((phone) => (
          <section
            key={phone}
            aria-label={PHONES[phone].name}
            className={cn(
              "rounded-[1.4rem] border-2 border-ink bg-paper p-3 transition-opacity",
              !online[phone] && "border-dashed",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-ink">{PHONES[phone].name}</h4>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                  online[phone] ? "bg-ok/20 text-ink" : "bg-danger/15 text-ink",
                )}
              >
                {online[phone] ? (
                  <Wifi className="h-3 w-3" aria-hidden />
                ) : (
                  <WifiOff className="h-3 w-3" aria-hidden />
                )}
                {online[phone] ? "online" : "offline"}
              </span>
            </div>
            <DemoToggle
              label="Connected"
              checked={online[phone]}
              onChange={(value) => setPhoneOnline(phone, value)}
            />
            {pending[phone] > 0 && (
              <p className="font-hand text-lg text-warn">
                {pending[phone]} change{pending[phone] === 1 ? "" : "s"} waiting to sync
              </p>
            )}

            <form onSubmit={(event) => addItem(phone, event)} className="mt-2 flex gap-2">
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
                className="min-h-11 min-w-0 flex-1 rounded-xl border-2 border-ink bg-paper-raised px-3 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
              />
              <DemoButton type="submit" variant="solid">
                Add
              </DemoButton>
            </form>

            <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
              With Yjs (CRDT)
            </p>
            <ul className="mt-1 space-y-1">
              {yItems[phone].map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg bg-paper-raised px-2"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.done}
                    onClick={() => toggleItem(phone, item.id)}
                    className="flex min-h-10 flex-1 items-center gap-2 text-left text-sm text-ink focus-visible:outline-2 focus-visible:outline-pen"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-ink",
                        item.done && "bg-ok",
                      )}
                    >
                      {item.done && <Check className="h-3.5 w-3.5 text-paper" />}
                    </span>
                    <span className={cn(item.done && "text-ink-muted line-through")}>
                      {item.text}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(phone, item.id)}
                    aria-label={`Remove ${item.text}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-pen"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
              {yItems[phone].length === 0 && <li className="text-sm text-ink-muted">empty list</li>}
            </ul>
            <p className="mt-1 text-xs text-ink-muted">Yjs document: {docBytes[phone]} bytes</p>

            <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
              With last-write-wins
            </p>
            <ul
              aria-label={`Last-write-wins list on ${PHONES[phone].name}`}
              className="mt-1 flex flex-wrap gap-1.5"
            >
              {lww[phone].items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "rounded-full border border-rule px-2.5 py-0.5 text-sm text-ink",
                    item.done && "text-ink-muted line-through",
                  )}
                >
                  {item.text}
                </li>
              ))}
              {lww[phone].items.length === 0 && (
                <li className="text-sm text-ink-muted">empty list</li>
              )}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-rule px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className={cn(
            "font-hand text-[1.4rem] leading-snug",
            lost.length + zombies.length > 0 ? "text-danger" : "text-pen",
          )}
        >
          {note}
        </p>
        <DemoButton onClick={reset} className="shrink-0">
          Reset
        </DemoButton>
      </div>
    </div>
  );
}
