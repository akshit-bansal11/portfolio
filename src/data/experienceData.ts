import trupeerLogo from "@/assets/images/trupeer-dark.svg";
import type { ExperienceItem } from "@/types/experience";

// One named group of experience cards (e.g. "Work", "Internship", "Training").
export interface ExperienceCategory {
  title: string;
  items: ExperienceItem[];
}

// All experience entries, grouped by category, in display order.
export const experience: ExperienceCategory[] = [
  {
    title: "Work",
    items: [
      {
        location: "Bathinda (On-Site)",
        company: "Elina Club Pvt. Ltd.",
        role: "SDE-1 & Chief Advisor",
        date: "Jul 2026 - Present",
        generalPoint:
          "Only engineer at the company — I own frontend, backend, database, automation and deployments, and advise leadership on product and tech decisions.",
        points: [
          {
            label: "Production Platforms",
            body: "Built and shipped two production web platforms on Next.js 16, React 19 and TypeScript, from first commit to live site; about 350 commits in under three months.",
          },
          {
            label: "Data & APIs",
            body: "Designed the Postgres (Neon) schema and APIs behind the lead, careers, feedback and newsletter forms, with server-side Zod validation and Upstash Redis rate limiting.",
          },
          {
            label: "Admin Panel",
            body: "Wrote the admin panel: filterable lead tables, Excel export and viewer/editor roles, on signed httpOnly sessions with scrypt-hashed passwords.",
          },
        ],
        skills: ["Next.js", "React", "TypeScript", "PostgreSQL", "Neon", "Zod", "Upstash", "Redis"],
      },
      {
        location: "Undisclosed",
        company: "Stealth Startup",
        role: "Co-Founder & CTO",
        date: "Jul 2026 - Present",
        generalPoint:
          "Co-founded an early-stage company that is still in stealth; I own the technical direction, architecture and engineering.",
        points: [],
      },
      {
        location: "Remote",
        company: "Kiteloom",
        role: "Founder",
        date: "Jan 2026 - Present",
        generalPoint:
          "My own product: an infinite canvas where sketches, wireframes and diagrams are the same object, with real-time multiplayer on Yjs CRDTs.",
        points: [
          {
            label: "Auth & Billing",
            body: "Better Auth (email, Google, 2FA), Paddle billing, per-user rate limits and Sentry error tracking.",
          },
          {
            label: "Testing & CI",
            body: "70+ unit test files and Playwright end-to-end tests run in GitHub Actions.",
          },
          {
            label: "Localization",
            body: "Ships in 11 languages.",
          },
        ],
        skills: [
          "Next.js",
          "TypeScript",
          "Convex",
          "Better Auth",
          "Sentry",
          "Playwright",
          "GitHub Actions",
        ],
      },
    ],
  },
  {
    title: "Internship",
    items: [
      {
        location: "Bengaluru (On-Site)",
        company: "Trupeer",
        role: "Full-Stack Intern",
        date: "Jan 2026 - Jul 2026",
        logo: trupeerLogo,
        generalPoint:
          "Contributed across a distributed, microservices-oriented architecture spanning a Next.js web application, Chrome extension, and Node.js backend — interfacing with REST APIs, MongoDB, Redis, third-party webhooks, and containerized deployments throughout the feature lifecycle.",
        points: [
          {
            label: "Subtitle System",
            body: "Eliminated server-side subtitle processing by engineering a fully client-side pipeline using FFmpeg WASM and ElevenLabs Scribe v2 for in-browser transcription and SRT editing; reduced compute costs ~70% and enabled 90+ language support.",
          },
          {
            label: "Chrome Extension Recording Pipeline",
            body: "Migrated from MediaRecorder to the Web Codecs API; replaced in-memory buffering with IndexedDB-based chunked writes to prevent data loss on sessions exceeding 30 minutes; added exponential-backoff upload retry for failure resilience. Built a fallback web recorder for extension-restricted enterprise environments.",
          },
          {
            label: "API Security & Testing",
            body: "Hardened the password reset flow to OWASP A07:2021 compliance via Upstash Redis sliding-window rate limiting, short-lived JWT token caching, reCAPTCHA v3 risk scoring, and honeypot field injection detection. Established Vitest testing infrastructure from zero — covering Auth0 middleware, token refresh, signup routes, and Stripe/Intercom/Mixpanel integrations.",
          },
          {
            label: "Frontend Revamp",
            body: "Sole intern on a full-stack Next.js 14 App Router rewrite (TypeScript, Tailwind CSS, shadcn/ui, Framer Motion); architected a typed REST client abstraction layer, Zod-based form validation, and webhook-driven optimistic UI for async event reconciliation across the Organization module.",
          },
        ],
        skills: [
          "Next.js",
          "TypeScript",
          "React",
          "Tailwind CSS",
          "Shadcn",
          "Motion",
          "Node.js",
          "MongoDB",
          "Redis",
          "Upstash",
          "Auth0",
          "JWT",
          "Vitest",
          "FFmpeg WASM",
          "ElevenLabs",
        ],
      },
    ],
  },
  {
    title: "Training",
    items: [
      {
        location: "Punjab, India",
        company: "Bangalore Computer Education",
        role: "MERN Stack Development + AI Integration Training",
        date: "June 2025 - Aug 2025",
        generalPoint:
          "Hands-on training building production-style MERN applications with first-class AI integration, focused on shipping responsive, maintainable full-stack features end-to-end.",
        points: [],
        certificate:
          "https://drive.google.com/file/d/1rY3FJ0Zfqx1hOdFl-vjG_Pl1Wp1BqcG8/view?usp=sharing",
        skills: ["MongoDB", "Express", "React", "Node.js", "Redux", "Tailwind CSS", "Gemini"],
      },
      {
        location: "Punjab, India",
        company: "Bangalore Computer Education",
        role: "Data Structures and Algorithms Training",
        date: "Dec 2024 - Mar 2025",
        generalPoint:
          "Structured DSA program centered on building strong problem-solving instincts — practicing time and space tradeoffs across competitive programming patterns.",
        points: [],
        certificate:
          "https://drive.google.com/file/d/1mfCPu-_HIxtpQ9BmfRtOwTAolsryGTap/view?usp=sharing",
        skills: ["C++", "JavaScript", "Leetcode", "Hackerrank"],
      },
      {
        location: "Punjab, India",
        company: "Bangalore Computer Education",
        role: "NodeJS Full Stack Development Training",
        date: "June 2024 - July 2024",
        generalPoint:
          "Foundational full-stack training built around the Node.js ecosystem — server-side fundamentals, RESTful API design, persistence, and core security and performance practices.",
        points: [],
        certificate:
          "https://drive.google.com/file/d/1B-axWT0ka9cSEM2wT0wOrLmXubBDln5a/view?usp=sharing",
        skills: [
          "HTML5",
          "CSS3",
          "JavaScript",
          "jQuery",
          "Node.js",
          "Express",
          "MySQL",
          "Cloudinary",
        ],
      },
    ],
  },
];
