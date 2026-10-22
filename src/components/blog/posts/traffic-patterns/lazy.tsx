/*
 * lazy.tsx
 * Lazily loaded entry point for the Traffic Patterns demo.
 */

"use client";

import dynamic from "next/dynamic";
import { DemoSkeleton } from "@/components/blog/DemoFrame";

export const TrafficFlowDemo = dynamic(() => import("./TrafficFlowDemo"), {
  ssr: false,
  loading: () => <DemoSkeleton height="lg" />,
});
