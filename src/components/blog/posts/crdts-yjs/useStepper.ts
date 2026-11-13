/*
 * useStepper.ts
 * Shared playback for the post's step-through diagrams. The first render (server, print,
 * reduced motion) shows the last step, so the picture is complete without motion. When
 * motion is welcome and the diagram is on screen, it loops through the steps on its own;
 * Back / Next / Pause hand control to the reader and stop the loop.
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
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const playing = motion && inView && !paused;

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
    setPaused(true);
    setStep(Math.max(0, Math.min(last, next)));
  };

  const toggle = () => {
    if (paused && step >= last) setStep(0);
    setPaused(!paused);
  };

  return { ref, step, last, playing, motion, go, toggle };
}
