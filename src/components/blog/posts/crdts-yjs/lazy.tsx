/*
 * lazy.tsx
 * Lazily loaded entry point for the CRDT demo. Keeps Yjs out of
 * the initial page bundle.
 */

"use client";

import dynamic from "next/dynamic";
import { DemoSkeleton } from "@/components/blog/DemoFrame";

export const GroceryListDemo = dynamic(() => import("./GroceryListDemo"), {
  ssr: false,
  loading: () => <DemoSkeleton height="lg" />,
});
