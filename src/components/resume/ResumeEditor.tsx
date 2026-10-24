/*
 * ResumeEditor.tsx
 * The /resume/edit screen. Checks the admin session, shows the key form when
 * signed out, and when signed in shows the same tabs and A4 sheets as /resume
 * with every text editable in place. Edits live in a draft; Save writes a new
 * revision, Discard restores the last saved copy (with Undo), and leaving the
 * page with unsaved edits asks first. Nothing here is printed except the sheets.
 */

"use client";

import { type FormEvent, useEffect, useState } from "react";
import type { ResumeContent } from "@/data/resume";
import { getSession, saveResume, signIn, signOut } from "@/lib/api/resume";
import type { EditSource } from "@/lib/resume/store";
import { cn } from "@/lib/utils";
import { EDIT_KIT, OpenFieldContext } from "./EditKit";
import ResumeSheet, { type SheetEdit } from "./ResumeSheet";
import ResumeViewer from "./ResumeViewer";

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; savedAt: number }
  | { status: "failed"; error: string; fields: Record<string, string> };

const DIRTY_HINT =
  " · Removing something only changes this draft until you save; Discard changes restores everything.";

const BUTTON =
  "cursor-pointer rounded-full border border-hero-ink/40 bg-hero-surface/60 px-5 py-2 text-sm font-medium text-hero-ink/90 transition-colors hover:border-hero-pen/50 hover:text-hero-pen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-pen disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-hero-ink/40 disabled:hover:text-hero-ink/90";
const PRIMARY = cn(BUTTON, "border-hero-ink bg-hero-ink text-hero-bg hover:text-hero-bg");

function SignInForm({ onSignedIn }: { onSignedIn: (csrf: string) => void }) {
  const [key, setKey] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await signIn(key);
    setPending(false);
    if (result.status === "ok") onSignedIn(result.csrf);
    else setError(result.error);
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex max-w-sm flex-col gap-3 px-4 text-hero-ink print:hidden"
    >
      <h1 className="text-xl font-semibold">Edit resume</h1>
      <label htmlFor="resume-admin-key" className="text-sm text-hero-muted">
        Admin key
      </label>
      <input
        id="resume-admin-key"
        type="password"
        autoComplete="current-password"
        required
        value={key}
        onChange={(event) => setKey(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "resume-admin-error" : undefined}
        className="min-h-11 rounded-lg border border-hero-ink/30 bg-hero-surface/60 px-3 text-hero-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-pen"
      />
      {error && (
        <p id="resume-admin-error" role="alert" className="text-sm text-hero-pen">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className={cn(PRIMARY, "min-h-11")}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function statusText(save: SaveState, dirty: boolean): string {
  if (save.status === "saving") return "Saving…";
  if (save.status === "failed") return save.error;
  if (dirty) return "Unsaved changes";
  if (save.status === "saved") return `Saved at ${new Date(save.savedAt).toLocaleTimeString()}`;
  return "No changes";
}

export default function ResumeEditor({
  initial,
  source,
}: {
  initial: ResumeContent;
  source: EditSource;
}) {
  const canSave = source !== "error";
  const [openField, setOpenField] = useState<string | null>(null);
  // undefined = checking the session, null = signed out, string = CSRF token.
  const [csrf, setCsrf] = useState<string | null | undefined>(undefined);
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [discarded, setDiscarded] = useState<ResumeContent | null>(null);
  const [save, setSave] = useState<SaveState>({ status: "idle" });
  const [overflow, setOverflow] = useState(false);
  const [notice, setNotice] = useState("");

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    let live = true;
    getSession().then((result) => {
      if (!live) return;
      setCsrf(result.status === "ok" && result.admin ? result.csrf : null);
      if (result.status === "error") setNotice("Couldn't check your session. Sign in to continue.");
    });
    return () => {
      live = false;
    };
  }, []);

  // Browsers show their own text; preventDefault is what triggers the prompt.
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);

  const update = (next: ResumeContent) => {
    setDraft(next);
    setDiscarded(null);
  };

  const onSave = async () => {
    if (!csrf) return;
    const sent = draft;
    setSave({ status: "saving" });
    const result = await saveResume(csrf, sent);
    if (result.status === "ok") {
      setSaved(sent);
      setSave({ status: "saved", savedAt: result.savedAt });
      return;
    }
    if (result.status === "signed-out") {
      setCsrf(null);
      setNotice("Your session ended. Sign in again; your edits are kept.");
    }
    setSave({
      status: "failed",
      error: result.error,
      fields: result.status === "invalid" ? result.fields : {},
    });
  };

  const onDiscard = () => {
    setDiscarded(draft);
    setDraft(saved);
    setSave({ status: "idle" });
  };

  const onUndoDiscard = () => {
    if (discarded) setDraft(discarded);
    setDiscarded(null);
  };

  const onSignOut = async () => {
    if (!csrf) return;
    const result = await signOut(csrf);
    if (result.status === "ok") setCsrf(null);
    else setSave({ status: "failed", error: result.error, fields: {} });
  };

  if (csrf === undefined) {
    return (
      <p role="status" className="px-4 text-center text-hero-muted">
        Checking your session…
      </p>
    );
  }
  if (csrf === null) {
    return (
      <>
        {notice && (
          <p role="status" className="mx-auto mb-4 max-w-sm px-4 text-sm text-hero-muted">
            {notice}
          </p>
        )}
        <SignInForm
          onSignedIn={(token) => {
            setCsrf(token);
            setNotice("");
          }}
        />
      </>
    );
  }

  const edit = (key: "one" | "full"): SheetEdit => ({
    kit: EDIT_KIT,
    onDoc: (doc) => update({ ...draft, [key]: doc }),
    onHeader: (header) => update({ ...draft, header }),
  });
  const fieldErrors = save.status === "failed" ? Object.entries(save.fields) : [];

  return (
    <OpenFieldContext.Provider value={{ open: openField, setOpen: setOpenField }}>
      <div className="mx-auto mb-5 flex max-w-[210mm] flex-col gap-3 px-4 text-hero-ink sm:px-0 print:hidden">
        {!canSave && (
          <p role="alert" className="text-sm text-hero-pen">
            Couldn&apos;t load the saved resume, so saving is off to protect it. Reload to try
            again.
          </p>
        )}
        {source === "default" && (
          <p className="text-sm text-hero-muted">
            No saved version yet. This is the built-in copy; your first save becomes the live
            resume.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={PRIMARY}
            disabled={!canSave || !dirty || save.status === "saving"}
            onClick={onSave}
          >
            {save.status === "saving" ? "Saving…" : "Save"}
          </button>
          <button type="button" className={BUTTON} disabled={!dirty} onClick={onDiscard}>
            Discard changes
          </button>
          {discarded && (
            <button type="button" className={BUTTON} onClick={onUndoDiscard}>
              Undo discard
            </button>
          )}
          <button
            type="button"
            className={cn(BUTTON, "ml-auto")}
            disabled={dirty || save.status === "saving"}
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
        <p role={save.status === "failed" ? "alert" : "status"} className="text-sm text-hero-muted">
          {statusText(save, dirty)}
          {dirty && DIRTY_HINT}
        </p>
        {fieldErrors.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-hero-pen">
            {fieldErrors.map(([path, message]) => (
              <li key={path}>
                {path}: {message}
              </li>
            ))}
          </ul>
        )}
        {overflow && (
          <p role="status" className="text-sm text-hero-pen">
            The one-page version runs past one sheet. Trim it before printing.
          </p>
        )}
        <p className="text-sm text-hero-muted">
          Select any text to edit it. Use <code>**bold**</code> and <code>[label](url)</code> inside
          a line. Sign out is available once there are no unsaved changes.
        </p>
      </div>
      <ResumeViewer
        onePage={
          <ResumeSheet
            doc={draft.one}
            header={draft.header}
            variant="one"
            edit={edit("one")}
            onOverflow={setOverflow}
          />
        }
        full={
          <ResumeSheet doc={draft.full} header={draft.header} variant="full" edit={edit("full")} />
        }
      />
    </OpenFieldContext.Provider>
  );
}
