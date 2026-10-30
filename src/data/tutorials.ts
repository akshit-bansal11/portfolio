/*
 * tutorials.ts
 * Registry of published tutorials. Each slug must have a
 * matching MDX file at src/content/tutorials/<slug>.mdx.
 * Order matters: a tutorial's position is its number in the list.
 */

import type { BlogPostMeta } from "@/types/blog";

export const tutorials: BlogPostMeta[] = [
  {
    slug: "docker-kubernetes-vms",
    title: "VMs, Docker and Kubernetes: The Whole Stack, Hands-On",
    description:
      "Build the whole stack on your own machine: what a virtual machine really is, how a container differs, and how Kubernetes keeps many containers running. Every step has a checkpoint, and every common error has a fix.",
    publishedAt: "2026-10-30",
    tags: ["docker", "kubernetes", "devops"],
    headerNote: "build it on your own machine",
  },
];
