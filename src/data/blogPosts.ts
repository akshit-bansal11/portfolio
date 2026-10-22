/*
 * blogPosts.ts
 * Registry of published blog posts. Each slug must have a
 * matching MDX file at src/content/blog/<slug>.mdx.
 * Order matters: a post's position is its part number in the series.
 */

import type { BlogPostMeta } from "@/types/blog";

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "tight-coupling",
    title: "Tight Coupling: Why One Dead Bulb Darkens the Whole Tree",
    description:
      "What coupling and cohesion really mean, where the ideas came from, how interfaces, events and queues loosen things up, and how to avoid the over-abstraction trap. With real case files from Amazon, Segment, Shopify, Uber and Zerodha.",
    publishedAt: "2026-10-22",
    tags: ["architecture", "modularity", "microservices"],
    headerNote: "grab a chai, and click everything",
  },
  {
    slug: "blast-radius",
    title: "Blast Radius: Why Ships Have Bulkheads and Clouds Have Cells",
    description:
      "Failures are guaranteed; how far they spread is a design choice. Bulkheads, circuit breakers, cell-based architecture, shuffle sharding and staged rollouts, with case files from AWS, CrowdStrike, Facebook, Slack, Netflix and Razorpay.",
    publishedAt: "2026-10-22",
    tags: ["reliability", "resilience", "architecture"],
    headerNote: "fail small, fail on purpose",
  },
  {
    slug: "traffic-patterns",
    title: "North-South, East-West: How Traffic Really Moves Through Your System",
    description:
      "Why most traffic never leaves the data centre, how load balancers, API gateways, sidecars and service meshes handle each direction, and why zero trust between services became the norm. With case files from Lyft, Netflix, Google, Target and Razorpay.",
    publishedAt: "2026-10-22",
    tags: ["networking", "service-mesh", "security"],
    headerNote: "follow the packets",
  },
  {
    slug: "rate-limiting",
    title: "Rate Limiting: The Bouncer, the Turnstile and the Leaky Bucket",
    description:
      "Why every serious API limits requests, how fixed windows, sliding windows, token buckets and leaky buckets actually differ (with a live simulator), and how to do it across many servers with Redis. Case files from Stripe, GitHub, Cloudflare, Shopify and Zerodha.",
    publishedAt: "2026-10-22",
    tags: ["apis", "reliability", "algorithms"],
    headerNote: "go on, spam the button",
  },
  {
    slug: "crdts-and-yjs",
    title: "CRDTs and Yjs: How Apps Merge Edits Without Losing Your Work",
    description:
      "Why 'last write wins' silently loses data, how Operational Transformation and CRDTs each solve concurrent editing, how Yjs works under the hood, and when a simpler server-authoritative design is the better call. With two real Yjs docs you can take offline.",
    publishedAt: "2026-10-22",
    tags: ["collaboration", "crdt", "offline-first"],
    headerNote: "take a phone offline",
  },
];
