/*
 * lazy.tsx
 * Lazily loaded entry points for the Tight Coupling demos.
 * next/dynamic with ssr: false keeps the demos' JavaScript out
 * of the initial page load; a skeleton holds their space.
 */

"use client";

import dynamic from "next/dynamic";
import { DemoSkeleton } from "@/components/blog/DemoFrame";

export const ChristmasLightsDemo = dynamic(() => import("./ChristmasLightsDemo"), {
  ssr: false,
  loading: () => <DemoSkeleton height="sm" />,
});

export const DependencyGraphDemo = dynamic(() => import("./DependencyGraphDemo"), {
  ssr: false,
  loading: () => <DemoSkeleton height="lg" />,
});
