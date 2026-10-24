/*
 * WelcomeAnimation.tsx
 * Whiteboard intro shown once per browser session: the AB logo writes itself with a hidden pen
 * (the original filled path revealed through a stroke mask), then the name and a handwritten
 * tagline appear. The whole board lifts away like a sheet pulled off, then marks the welcome
 * step done in AnimationContext. Click, tap or any key skips straight to the lift.
 * Skipped entirely on /resume, with WELCOME_ANIMATION_DISABLED, or under reduced motion.
 */

"use client";

import { usePathname } from "next/navigation";
import type { AnimationEvent } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { useAnimation } from "@/context/AnimationContext";
import { sketchArrow, sketchCross, sketchLine } from "@/lib/blog/sketch";

// Public props for the animation.
interface WelcomeAnimationProps {
  disabled?: boolean;
}

const SEEN_KEY = "welcome-seen";
// Time on screen before the board lifts by itself (ms).
const AUTO_EXIT_MS = 2600;

// The original logo (public/favicon.svg), unchanged and shown as is.
const LOGO_PATH =
  "M103.707.275c-.293 0-.587-.001-.917.035-2.46.074-5.542 1.91-6.46 4.185-6.055 15.158-21.616 68.519-23.635 77.254-15.157 4.037-36.516 13.616-50.168 25.69-4.771 4.22-10.753 14.533-6.973 19.01 4 4.735 12.148 7.928 18.46 6.827 3.45-.587 7.267-6.166 5.359-9.028-1.689-2.57-5.542-3.67-9.212-4.478-1.395-.33-1.616-1.284-.478-2.165C43.262 107.11 51.593 103.11 68.07 96.76c-4.954 15.083-10.166 31.304-14.386 46.608-11.854 0-42.719-2.496-50.903 5.909C.837 151.258-.08 154.01.03 156.726c.55 16.698 53.95 72.484 67.969 85.586 2.312 2.128 4.476 3.523 7.595 4.037 1.432-.44 3.488-.735 3.818-2.314 5.91-25.983 7.963-63.931 12.44-89.474 6.496-.514 13.764-1.248 20.223-1.285a518 518 0 0 1-5.982 32.738c-1.432 7.707-5.357 25.578-7.266 36.588-.587 3.523 1.945 6.643 5.542 6.826.44 0 .88.038 1.284.038 2.973.146 5.835-2.386 6.385-5.322a3243 3243 0 0 1 8.002-41.911c13.248-1.065 28.258-1.798 39.231 7.12 8.735 7.12 7.047 18.167 0 25.8a36.7 36.7 0 0 1-6.568 5.651c-9.718 6.163-12.951 10.295-9.575 14.112 1.542 1.761 5.19 6.817 15.042-3.102 20.7-14.13 35.598-43.636-3.78-59.894 24.588-11.01 53.838-24.112 64.922-50.61 8.88-21.212-9.247-41.873-28.441-48.185-27.562-9.065-60.924-3.56-89.22.146 1.322-21.213 3.745-37.508 6.204-58.354.294-2.459.733-6.422 1.027-8.844.404-3.267-1.944-5.836-5.247-5.726zM150.28 82.19l-.037.035c28.7-.44 72.519 4.074 51.93 42.5-10.423 19.413-56.858 38.769-79.098 43.43.74-2.588.964-5.48 1.527-8.117l.816-5.868-.086-.599.173-.025 3.54-.514 6.418-.93c5.87-.897 13.312-2.084 18.926-2.972 3.046-.477 5.542-3.487 5.542-6.57 0-3.377-3.008-6.165-6.715-6.055-7.854.22-16.736.844-23.893 1.175 1.212-6.13 3.598-20.188 4.736-26.427.66-3.78-1.871-7.12-5.688-7.156h-.293c-3.633-.037-7.01 2.972-7.706 6.532-1.358 6.9-4.628 22.976-5.839 28.628-7.12 1.1-12.697 1.064-19.854 1.1 2.532-16.771 2.825-35.966 5.835-52.444 11.854-3.413 21.03-3.962 33.25-4.99 4.037-.256 9.874-.623 16.516-.733m-66.437 9.953c.34.028.615.432.633 1.202v.038c.257 9.982-4.44 43.01-5.651 47.672-1.982 1.504-6.129 1.175-8.808 1.212-1.32-1.395 8.99-38.608 12.808-49.068.275-.734.679-1.083 1.018-1.056M70.64 156.03c2.349 0 4.734.036 6.826 0a3202 3202 0 0 1-8.11 67.895c-9.91-9.432-19.011-19.56-28.223-29.653-9.799-10.68-19.157-22.314-26.9-34.645-.881-1.358-.22-2.569 1.395-2.606a559 559 0 0 1 33.286-.11l-4.745 17.538c-1.395 4 .917 7.486 5.137 7.486h1.761c2.79-.037 5.837-2.312 6.791-4.954l6.03-20.84c2.055-.073 4.403-.111 6.752-.111";

// Deterministic hand-drawn doodles around the logo.
const STAR = sketchCross(20, 20, 26, 3);
const SQUIGGLE = "M3 18 Q11 4 19 18 T35 18 T51 18";
const ARROW = sketchArrow(6, 8, 46, 36, { seed: 9, curve: 0.25, headSize: 9 });
const UNDERLINE = sketchLine(3, 8, 150, 6, { seed: 4 });

// Decided once per page load: the first call wins, so a mid-show re-render can't flip it.
let decision: boolean | null = null;

function decide(skipped: boolean): boolean {
  if (decision === null) {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked: still shows once per page load via `decision`.
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ?welcome in the URL always plays it (for reviewing the intro).
    const forced = new URLSearchParams(window.location.search).has("welcome");
    decision = !skipped && (forced || (!reduced && !seen));
  }
  return decision;
}

const noopSubscribe = () => () => {};

// Renders the welcome board (or marks welcome complete right away when it is skipped).
const WelcomeAnimation = ({ disabled = false }: WelcomeAnimationProps) => {
  const { setWelcomeComplete } = useAnimation();
  const pathname = usePathname();
  const isSkipped = disabled || pathname === "/resume";
  const [isExiting, setIsExiting] = useState(false);
  const [isGone, setIsGone] = useState(false);

  // False on the server, the real decision on the client.
  const shouldPlay = useSyncExternalStore(
    noopSubscribe,
    () => decide(isSkipped),
    () => false,
  );
  const isVisible = shouldPlay && !isGone;

  // Nothing to show: let the rest of the page start.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!decide(isSkipped)) setWelcomeComplete(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [isSkipped, setWelcomeComplete]);

  // While the board is up: remember it, lock scroll, lift on timer, click or key.
  useEffect(() => {
    if (!isVisible) return;
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage blocked: once per page load is enough.
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const skip = () => setIsExiting(true);
    const timer = window.setTimeout(skip, AUTO_EXIT_MS);
    window.addEventListener("click", skip);
    window.addEventListener("keydown", skip);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      window.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Unmount and release the page once the lift animation ends.
  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    setIsGone(true);
    setWelcomeComplete(true);
  };

  return (
    <div
      aria-hidden
      onAnimationEnd={handleAnimationEnd}
      className={`welcome-board fixed inset-0 z-[10002] flex flex-col items-center justify-center overflow-hidden ${
        isExiting ? "welcome-lift pointer-events-none" : ""
      }`}
    >
      <div className="relative">
        <svg
          viewBox="0 0 221.75 246.86"
          className="h-[min(34vh,220px)] w-auto overflow-visible text-hero-ink"
        >
          <path d={LOGO_PATH} fill="currentColor" className="welcome-logo" />
        </svg>

        <svg
          viewBox="0 0 40 40"
          className="absolute right-full bottom-[78%] mr-3 h-10 w-10 overflow-visible text-doodle-3"
        >
          <DrawnPath d={STAR} delay={0.4} duration={0.5} strokeWidth={2.5} />
        </svg>
        <svg
          viewBox="0 0 54 24"
          className="absolute top-[58%] left-full ml-4 h-8 w-[4.25rem] overflow-visible text-doodle-1"
        >
          <DrawnPath d={SQUIGGLE} delay={0.6} duration={0.6} strokeWidth={2.5} />
        </svg>
        <svg
          viewBox="0 0 54 44"
          className="absolute top-[4%] left-full ml-3 h-10 w-12 overflow-visible text-doodle-2"
        >
          <DrawnPath d={ARROW.shaft} delay={0.9} duration={0.4} strokeWidth={2.5} />
          <DrawnPath d={ARROW.head} delay={1.25} duration={0.2} strokeWidth={2.5} />
        </svg>
      </div>

      <h1
        className="welcome-rise mt-8 font-display text-3xl font-medium tracking-normal text-hero-ink md:text-4xl"
        style={{ animationDelay: "0.7s" }}
      >
        Akshit Bansal
      </h1>
      <p
        className="welcome-rise relative mt-1 font-hand text-3xl font-bold text-hero-pen"
        style={{ animationDelay: "1s" }}
      >
        always building
        <svg
          viewBox="0 0 156 14"
          className="absolute top-full left-1/2 h-3.5 w-[9.75rem] -translate-x-1/2 overflow-visible"
        >
          <DrawnPath d={UNDERLINE} delay={1.3} duration={0.5} strokeWidth={2.5} />
        </svg>
      </p>

      <p className="welcome-hint fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] font-grotesk text-xs text-hero-muted">
        click or press any key to skip
      </p>
    </div>
  );
};

export default WelcomeAnimation;
