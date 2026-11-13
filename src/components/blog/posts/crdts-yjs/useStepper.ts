/*
 * useStepper.ts
 * Shared playback for the post's step-through diagrams. The first render (server, print,
 * reduced motion) shows the last step, so the picture is complete without motion. When
 * motion is welcome and the diagram is on screen, it loops through the steps on its own.
 * Play and Pause always win over that: Play runs the loop even off screen; Pause, Back and
 * Next stop it until Play is pressed again.
 */

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// True when the reader has not asked for reduced motion. False on the server.
export function useMotionOk() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

export function useStepper<T extends HTMLElement = HTMLDivElement>(count: number, ms = 1900) {
  const ref = useRef<T>(null);
  const motion = useMotionOk();
  const last = count - 1;
  const [step, setStep] = useState(last);
  // "auto": loop while on screen. "play" / "pause": the reader chose.
  const [mode, setMode] = useState<"auto" | "play" | "pause">("auto");
  const [inView, setInView] = useState(false);

  // "On screen" = any part of it inside the middle band of the viewport, so a diagram taller
  // than the screen (common on phones) still counts.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "-25% 0px -25% 0px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const playing = motion && (mode === "play" || (mode === "auto" && inView));

  // Loop: hold the last step a little longer, then start again.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current >= last ? 0 : current + 1)),
      step >= last ? ms * 1.8 : ms,
    );
    return () => window.clearTimeout(timer);
  }, [playing, step, last, ms]);

  const go = (next: number) => {
    setMode("pause");
    setStep(Math.max(0, Math.min(last, next)));
  };

  // Decide from what is on screen right now, not from a stored flag.
  const toggle = () => {
    if (playing) {
      setMode("pause");
      return;
    }
    if (step >= last) setStep(0);
    setMode("play");
  };

  return { ref, step, last, playing, motion, go, toggle };
}
