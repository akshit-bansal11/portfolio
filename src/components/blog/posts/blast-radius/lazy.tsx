/*
 * lazy.tsx
 * Lazily loaded entry points for the Blast Radius demos.
 */

"use client";

import dynamic from "next/dynamic";
import { DemoSkeleton } from "@/components/blog/DemoFrame";

export const BlastRadiusDemo = dynamic(() => import("./BlastRadiusDemo"), {
  ssr: false,
  loading: () => <DemoSkeleton height="lg" />,
});

export const StagedRolloutDemo = dynamic(() => import("./StagedRolloutDemo"), {
  ssr: false,
  loading: () => <DemoSkeleton height="md" />,
});
