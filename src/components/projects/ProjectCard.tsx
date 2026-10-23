/*
 * ProjectCard.tsx
 * One project on the whiteboard: its screenshot as a taped print, then logo, title, blurb,
 * tech-stack stamps, handwritten notes and hand-drawn buttons. The board variant is tilted
 * a little; hover or keyboard focus straightens and lifts it and plays the demo muted over
 * the screenshot (the video element is created on the first such moment, never on page
 * load). Touch and reduced motion never autoplay; "watch demo" opens the video in a modal.
 * `featured` lays the card out as a full-width row (screenshot left, text right).
 */

"use client";

import { useReducedMotion } from "framer-motion";
import { Github, Globe, Play } from "lucide-react";
import Image from "next/image";
import { type FocusEvent, type PointerEvent, useRef, useState } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import Stamp from "@/components/hero/elements/Stamp";
import Tape from "@/components/hero/elements/Tape";
import TechIcon from "@/components/icons/TechIcon";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/types/project";
import DemoModal from "./DemoModal";

// Resting tilt per board index, all within -2..2deg (full class names so Tailwind can see them).
const TILTS = [
  "-rotate-[1.6deg]",
  "rotate-[1.2deg]",
  "-rotate-[0.8deg]",
  "rotate-[1.8deg]",
  "-rotate-[1.2deg]",
  "rotate-[0.9deg]",
  "-rotate-[1.9deg]",
] as const;

// Small arrow beside each note, pointing up at the screenshot.
const NOTE_ARROW = sketchArrow(8, 26, 14, 3, { seed: 91, curve: 0.3, headSize: 6 });

// Shared look of the hand-drawn buttons (the outline morphs on hover and focus).
const BUTTON =
  "hand-border hand-border-morph inline-flex min-h-11 items-center gap-2 border-2 border-hero-ink px-4 py-2 font-grotesk text-sm font-semibold hover:-translate-y-0.5 hover:-rotate-1 focus-visible:-translate-y-0.5 focus-visible:-rotate-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-pen active:translate-y-0 active:rotate-0 motion-reduce:transition-none";
const BUTTON_FILLED = "cursor-pointer bg-hero-pen text-hero-bg";
const BUTTON_OUTLINE = "text-hero-ink";

interface ProjectCardProps {
  project: ProjectItem;
  /** Position on the board; picks the tilt. */
  index: number;
  featured?: boolean;
}

// Renders one project card.
export default function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const { title, description, imgUrl, logoUrl, videoUrl, techStack, notes, siteLink, githubLink } =
    project;
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  // The video exists only after the first hover/focus; `playing` shows or hides it.
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const start = () => {
    if (reduceMotion || !videoUrl || modalOpen) return;
    setPlaying(true);
    const video = videoRef.current;
    if (video) void video.play().catch(() => undefined);
    else setLoaded(true); // autoPlay starts it on mount
  };

  const stop = () => {
    setPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse") start();
  };
  // Keyboard focus only: a tap on touch also focuses the control but must not autoplay.
  const onFocus = (e: FocusEvent) => {
    if (e.target.matches(":focus-visible")) start();
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) stop();
  };

  return (
    <article
      onPointerEnter={onPointerEnter}
      onPointerLeave={stop}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        "relative transition-[rotate,translate] duration-300 hover:-translate-y-1 focus-within:-translate-y-1 motion-reduce:transition-none",
        featured
          ? "md:grid md:grid-cols-[3fr_2fr] md:items-center md:gap-10"
          : cn("flex flex-col hover:rotate-0 focus-within:rotate-0", TILTS[index % TILTS.length]),
      )}
    >
      {/* Screenshot print, taped to the board. */}
      <div className="relative">
        <div
          className="bg-print-frame p-[0.195rem] sm:p-[0.29rem]"
          style={{ boxShadow: "var(--note-shadow)" }}
        >
          <div className="relative aspect-video overflow-hidden bg-hero-surface">
            {imgUrl && (
              <Image
                src={imgUrl}
                alt={`${title} screenshot`}
                fill
                sizes={
                  featured
                    ? "(min-width: 768px) 60vw, 100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                }
                className="object-cover object-top"
              />
            )}
            {loaded && videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                poster={imgUrl}
                preload="none"
                muted
                loop
                playsInline
                autoPlay
                aria-hidden
                tabIndex={-1}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-200 motion-reduce:transition-none",
                  playing ? "opacity-100" : "opacity-0",
                )}
              />
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 14%)" }}
            />
          </div>
        </div>
        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2" />
      </div>

      {/* Logo, title, blurb, stamps, notes, buttons. */}
      <div className={cn("flex flex-col gap-3", featured ? "pt-6 md:pt-0" : "pt-5")}>
        <div className="flex items-center gap-3">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-md object-contain"
            />
          )}
          <h3
            className={cn(
              "font-display font-medium tracking-[-0.01em] text-hero-ink",
              featured ? "text-3xl md:text-4xl" : "text-2xl",
            )}
          >
            {title}
          </h3>
        </div>
        <p
          className={cn(
            "font-grotesk text-sm leading-relaxed text-hero-muted",
            featured ? "md:text-base" : "line-clamp-2",
          )}
        >
          {description}
        </p>
        <ul className="flex flex-wrap gap-2">
          {techStack.map((tech, i) => (
            <Stamp
              key={tech}
              label={tech}
              index={i}
              icon={<TechIcon name={tech} className="h-3.5 w-3.5" />}
            />
          ))}
        </ul>
        {notes && (
          <ul className="flex flex-col gap-1">
            {notes.map((note) => (
              <li
                key={note}
                className="flex items-center gap-1.5 font-hand text-[1.4rem] font-semibold leading-tight text-hero-pen"
              >
                <svg aria-hidden viewBox="0 0 24 28" className="h-7 w-6 shrink-0 overflow-visible">
                  <DrawnPath d={NOTE_ARROW.shaft} duration={0.5} />
                  <DrawnPath d={NOTE_ARROW.head} delay={0.5} duration={0.2} />
                </svg>
                {note}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          {videoUrl && (
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                stop();
                setModalOpen(true);
              }}
              className={cn(BUTTON, BUTTON_FILLED)}
            >
              <Play aria-hidden className="h-4 w-4" strokeWidth={2.5} />
              watch demo<span className="sr-only"> of {title}</span>
            </button>
          )}
          {siteLink && (
            <a
              href={siteLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(BUTTON, BUTTON_OUTLINE)}
            >
              <Globe aria-hidden className="h-4 w-4" strokeWidth={2.5} />
              live site<span className="sr-only"> of {title} (opens in a new tab)</span>
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(BUTTON, BUTTON_OUTLINE)}
            >
              <Github aria-hidden className="h-4 w-4" strokeWidth={2.5} />
              code<span className="sr-only"> of {title} (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>

      {modalOpen && videoUrl && (
        <DemoModal videoUrl={videoUrl} title={title} onClose={() => setModalOpen(false)} />
      )}
    </article>
  );
}
