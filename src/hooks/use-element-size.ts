/*
 * use-element-size.ts
 * Tracks an element's rendered width and height with a
 * ResizeObserver. Returns a ref to attach and the latest
 * size (0 x 0 until the first measurement).
 */

import { useEffect, useRef, useState } from "react";

// Measured box size in CSS pixels.
export interface ElementSize {
  width: number;
  height: number;
}

// Hook returning [ref, size] for any HTML element.
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // The observer fires once on observe(), so no synchronous measure is needed.
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((previous) =>
        previous.width === width && previous.height === height ? previous : { width, height },
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
