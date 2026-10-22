/*
 * lazy.tsx
 * Lazily loaded entry point for the Rate Limiting demo.
 */

"use client";

import dynamic from "next/dynamic";
import { DemoSkeleton } from "@/components/blog/DemoFrame";

export const RateLimiterDemo = dynamic(() => import("./RateLimiterDemo"), {
  ssr: false,
  loading: () => <DemoSkeleton height="lg" />,
});
