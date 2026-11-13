/*
 * useInView.ts
 * True while the element is on screen. The demos only run their loops while someone can
 * see them, so an off-screen simulation costs nothing.
 */

"use client";

import { type RefObject, useEffect, useState } from "react";

export function useInView<T extends Element>(ref: RefObject<T | null>) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "80px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
