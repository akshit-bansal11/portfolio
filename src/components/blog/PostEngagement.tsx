/*
 * PostEngagement.tsx
 * Like button and comments for a blog post, drawn in the notebook style.
 * Renders nothing until the API answers, and nothing at all when the
 * feature is not configured (503).
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type FormEvent, useEffect, useId, useState } from "react";
import {
  type EngagementComment,
  getEngagement,
  postComment,
  toggleLike,
} from "@/lib/api/blogEngagement";
import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

const BODY_MAX = 2000;
const NAME_MAX = 60;
const EMAIL_MAX = 254;

const HEART_PATH =
  "M12 20.4C6.2 16 3 12.7 3.1 9.2A4.6 4.6 0 0 1 12 7.6a4.6 4.6 0 0 1 8.9 1.5c.1 3.6-3.2 6.9-8.9 11.3z";

// Short strokes radiating from the heart when it is liked.
const BURST_PATHS = [
  sketchLine(12, 3.5, 12, 0.5, { seed: 2 }),
  sketchLine(3.5, 5.5, 1.2, 3.4, { seed: 4 }),
  sketchLine(20.5, 5.5, 22.8, 3.4, { seed: 6 }),
  sketchLine(1.5, 11, -0.9, 11.4, { seed: 8 }),
  sketchLine(22.5, 11, 24.9, 11.4, { seed: 10 }),
];

const FIELD =
  "min-h-11 w-full rounded-xl border-2 border-ink bg-paper-raised px-3 py-2 text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen disabled:opacity-50";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

function relativeTime(createdAt: number, now: number): string {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = createdAt - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return formatter.format(Math.round(diff / ms), unit);
  }
  return "just now";
}

interface StatusMessage {
  kind: "ok" | "error";
  text: string;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-pen">
      {message}
    </p>
  );
}

function LikeButton({
  likes,
  liked,
  burst,
  onToggle,
}: {
  likes: number;
  liked: boolean;
  burst: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={liked}
      aria-label="Like this post"
      className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-pen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
    >
      <motion.svg
        aria-hidden
        viewBox="-2 -2 28 26"
        width={32}
        height={30}
        className="overflow-visible"
        animate={{ scale: liked && !reduced ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.35 }}
      >
        <path
          d={HEART_PATH}
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {burst && !reduced
          ? BURST_PATHS.map((d) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                transition={{ duration: 0.6 }}
              />
            ))
          : null}
      </motion.svg>
      <span className="font-hand text-2xl text-ink">{likes}</span>
    </button>
  );
}

function CommentCard({ comment, now }: { comment: EngagementComment; now: number }) {
  return (
    <li className="rounded-xl border border-rule border-l-4 border-l-pen bg-paper-raised p-4">
      <p className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-hand text-xl text-pen">{comment.name ?? "Anonymous"}</span>
        <time
          dateTime={new Date(comment.createdAt).toISOString()}
          className="text-sm text-ink-muted"
        >
          {relativeTime(comment.createdAt, now)}
        </time>
      </p>
      <p className="mt-1 whitespace-pre-line break-words text-ink">{comment.body}</p>
    </li>
  );
}

export default function PostEngagement({ slug }: { slug: string }) {
  const uid = useId();
  const [now] = useState(() => Date.now());
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [comments, setComments] = useState<EngagementComment[]>([]);

  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  useEffect(() => {
    let cancelled = false;
    getEngagement(slug).then((result) => {
      if (cancelled) return;
      if (result.status === "unavailable") setUnavailable(true);
      if (result.status === "ok") {
        setLikes(result.data.likes);
        setLiked(result.data.liked);
        setComments(result.data.comments);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!ready || unavailable) return null;

  async function handleLike() {
    const previous = { likes, liked };
    const next = !liked;
    setLiked(next);
    setLikes(Math.max(0, likes + (next ? 1 : -1)));
    setBurst(next);
    const result = await toggleLike(slug);
    if (result.status === "ok") {
      setLikes(result.likes);
      setLiked(result.liked);
    } else {
      setLikes(previous.likes);
      setLiked(previous.liked);
      setBurst(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setStatus(null);
    const result = await postComment(slug, { anonymous, name, email, body, website });
    setPending(false);

    if (result.status === "ok") {
      // A filled honeypot is answered with an empty comment; show nothing for it.
      if (result.comment.body !== "") setComments((current) => [...current, result.comment]);
      setName("");
      setEmail("");
      setBody("");
      setWebsite("");
      setStatus({ kind: "ok", text: "Thanks, your comment is up." });
      return;
    }
    if (result.status === "invalid") setErrors(result.fields);
    setStatus({ kind: "error", text: result.error });
  }

  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    body: `${uid}-body`,
    emailNote: `${uid}-email-note`,
    count: `${uid}-count`,
  };

  return (
    <section aria-labelledby={`${uid}-heading`} className="mx-auto mt-16 max-w-[42.5rem]">
      <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-rule pb-3">
        <h2 id={`${uid}-heading`} className="font-hand text-4xl text-ink">
          what do you think?
        </h2>
        <LikeButton likes={likes} liked={liked} burst={burst} onToggle={handleLike} />
      </div>

      {comments.length === 0 ? (
        <p className="mt-6 font-hand text-2xl text-ink-muted">no comments yet. be the first?</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} now={now} />
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <label className="flex min-h-11 items-center gap-3 text-ink">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(event) => setAnonymous(event.target.checked)}
            className="size-5 accent-pen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
          />
          Comment anonymously
        </label>

        <div
          aria-hidden={anonymous}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none",
            anonymous ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
          )}
        >
          <div className="overflow-hidden">
            <div className="grid gap-4 p-1 sm:grid-cols-2">
              <div>
                <label htmlFor={ids.name} className="mb-1 block text-ink">
                  Name
                </label>
                <input
                  id={ids.name}
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={NAME_MAX}
                  autoComplete="name"
                  disabled={anonymous}
                  required={!anonymous}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${ids.name}-error` : undefined}
                  className={FIELD}
                />
                <FieldError id={`${ids.name}-error`} message={errors.name} />
              </div>
              <div>
                <label htmlFor={ids.email} className="mb-1 block text-ink">
                  Email
                </label>
                <input
                  id={ids.email}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={EMAIL_MAX}
                  autoComplete="email"
                  disabled={anonymous}
                  required={!anonymous}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? `${ids.email}-error ${ids.emailNote}` : ids.emailNote
                  }
                  className={FIELD}
                />
                <p id={ids.emailNote} className="mt-1 text-sm text-ink-muted">
                  never shown publicly
                </p>
                <FieldError id={`${ids.email}-error`} message={errors.email} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor={ids.body} className="mb-1 block text-ink">
            Comment
          </label>
          <textarea
            id={ids.body}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={BODY_MAX}
            rows={5}
            required
            aria-invalid={Boolean(errors.body)}
            aria-describedby={errors.body ? `${ids.body}-error ${ids.count}` : ids.count}
            className={cn(FIELD, "resize-y")}
          />
          <p id={ids.count} className="mt-1 text-right text-sm text-ink-muted">
            {body.length}/{BODY_MAX}
          </p>
          <FieldError id={`${ids.body}-error`} message={errors.body} />
        </div>

        {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input
            id={`${uid}-website`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 rounded-full border-2 border-ink bg-paper-raised px-6 font-hand text-2xl text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {pending ? "posting..." : "post comment"}
          </button>
          <p
            role="status"
            aria-live="polite"
            className={cn("text-sm", status?.kind === "error" ? "text-pen" : "text-ink-muted")}
          >
            {status?.text}
          </p>
        </div>
      </form>
    </section>
  );
}
