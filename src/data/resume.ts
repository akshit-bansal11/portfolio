/*
 * resume.ts
 * Built-in content of the /resume page: the one-page resume.
 * Written for ATS parsing: standard section names, one date format, no
 * first person, plain-text links. Inline text supports **bold** and
 * [label](url). DEFAULT_RESUME is the fallback when no edited revision is
 * stored (lib/resume/store.ts).
 */

export interface ResumeLink {
  label: string;
  href: string;
}

export interface ResumeEntry {
  title: string;
  link?: ResumeLink;
  dates?: string;
  subtitle?: string;
  location?: string;
  intro?: string;
  bullets?: string[];
}

export type ResumeSection =
  | { kind: "text"; heading: string; text: string }
  | { kind: "entries"; heading: string; entries: ResumeEntry[] }
  | { kind: "list"; heading: string; items: string[] }
  | { kind: "pairs"; heading: string; pairs: { label: string; value: string }[] };

export interface ResumeDocument {
  sections: ResumeSection[];
}

export interface ResumeHeader {
  name: string;
  title: string;
  location: string;
  links: ResumeLink[];
}

// Everything the page renders; the editor saves this shape to D1.
export interface ResumeContent {
  header: ResumeHeader;
  one: ResumeDocument;
}

const RESUME_HEADER: ResumeHeader = {
  name: "Akshit Bansal",
  title: "Full-Stack Software Engineer",
  location: "Punjab, India",
  links: [
    { label: "+91 70092 50361", href: "tel:+917009250361" },
    { label: "er.akshitbansal11@gmail.com", href: "mailto:er.akshitbansal11@gmail.com" },
    { label: "akshitbansal.dev", href: "https://akshitbansal.dev" },
    {
      label: "linkedin.com/in/akshit-bansal11",
      href: "https://www.linkedin.com/in/akshit-bansal11",
    },
    { label: "github.com/akshit-bansal11", href: "https://github.com/akshit-bansal11" },
  ],
};

const gh = (repo: string): ResumeLink => ({
  label: `github.com/akshit-bansal11/${repo}`,
  href: `https://github.com/akshit-bansal11/${repo}`,
});

const KITELOOM_LINK: ResumeLink = { label: "kiteloom.com", href: "https://kiteloom.com" };
const TRUPEER_LINK: ResumeLink = { label: "trupeer.ai", href: "https://www.trupeer.ai/" };

/* ------------------------------------------------------------------ */
/* One page                                                            */
/* ------------------------------------------------------------------ */

const RESUME_ONE_PAGE: ResumeDocument = {
  sections: [
    {
      kind: "text",
      heading: "Summary",
      text: "Full-stack software engineer building production web, desktop and Android software with TypeScript, React, Next.js, Node.js and Rust. Sole engineer at Elina Club, where two web platforms went from first commit to production in under three months. Previously at Trupeer AI, cut subtitle compute cost by about 70% by moving processing into the browser.",
    },
    {
      kind: "entries",
      heading: "Experience",
      entries: [
        {
          title: "Elina Club Pvt. Ltd.",
          dates: "Jul 2026 – Present",
          subtitle: "SDE Lead",
          location: "Bathinda, India",
          bullets: [
            "Own the full stack as the company's only engineer: frontend, backend, database, CI/CD and deployments.",
            "Built and launched two production web platforms with Next.js 16, React 19 and TypeScript in under three months.",
            "Designed the PostgreSQL (Neon) schema, REST APIs and role-based admin console behind four lead-capture pipelines, with Zod validation and Redis rate limiting.",
          ],
        },
        {
          title: "Kiteloom",
          link: KITELOOM_LINK,
          dates: "Nov 2025 – Present",
          subtitle: "Founder (in development)",
          bullets: [
            "Building an infinite canvas for sketches, wireframes and diagrams with real-time collaboration on Yjs CRDTs (Next.js, TypeScript, Convex).",
            "Set up email, Google OAuth and 2FA sign-in (Better Auth), Paddle billing and Sentry; CI runs 70+ unit test files and Playwright E2E tests.",
          ],
        },
        {
          title: "Trupeer AI",
          link: TRUPEER_LINK,
          dates: "Jan 2026 – Jul 2026",
          subtitle: "Full-Stack Intern",
          location: "Bengaluru, India",
          bullets: [
            "Moved subtitle generation into the browser with FFmpeg WASM and ElevenLabs Scribe v2, cutting compute cost by about 70% and adding 90+ languages.",
            "Rebuilt the Chrome extension recorder on WebCodecs with chunked IndexedDB writes, fixing data loss on recordings over 30 minutes.",
            "Secured password reset with Redis sliding-window rate limits, short-lived JWTs and reCAPTCHA v3; built the typed REST client for the Next.js App Router rewrite.",
          ],
        },
      ],
    },
    {
      kind: "entries",
      heading: "Projects",
      entries: [
        {
          title: "Flick (in development)",
          link: gh("flick"),
          subtitle: "Rust, Tauri, React, TypeScript",
          bullets: [
            "Keyboard-first Windows launcher for apps, files, system commands and AI chat with provider fallback; fuzzy search over 305K file paths at p95 ≤ 4.7 ms; 470+ tests.",
          ],
        },
        {
          title: "Edgepad",
          link: gh("edgepad"),
          subtitle: "Kotlin, C#, .NET, Swift, Bluetooth RFCOMM",
          bullets: [
            "Android app that works as a trackpad, keyboard, media remote and virtual Xbox controller for Windows and macOS over a custom Bluetooth protocol with two-way state sync.",
            "26 GitHub stars, 4 forks, 12 releases and 258 release downloads; 25 merged pull requests, 300+ tests.",
          ],
        },
        {
          title: "Saltcellar",
          link: gh("saltcellar"),
          subtitle: "Rust, Tauri, TypeScript",
          bullets: [
            "Offline secrets vault for Windows, macOS and Linux with AES-256-GCM envelope encryption under Argon2id, no network access, clipboard auto-clear and signed release builds.",
          ],
        },
        {
          title: "Offkit",
          link: gh("offkit"),
          subtitle: "Rust, Slint, Next.js, WebAssembly",
          bullets: [
            "37 offline media, PDF, image and developer tools shipped as a native Rust desktop app and a WebAssembly web app from one tool registry; 800+ tests.",
          ],
        },
      ],
    },
    {
      kind: "pairs",
      heading: "Skills",
      pairs: [
        { label: "Languages", value: "TypeScript, SQL, Go, Rust, Kotlin, C#, Swift" },
        { label: "Frontend", value: "React, Next.js, WebAssembly" },
        {
          label: "Backend & Data",
          value:
            "Node.js, Express, REST, Convex, PostgreSQL, MongoDB, Redis, Cloudflare D1, KV and R2",
        },
        {
          label: "System Design",
          value:
            "Rate limiting, caching, load balancing, real-time sync (WebSockets, CRDTs), circuit breakers, retries with backoff, event-driven architecture",
        },
        { label: "Security", value: "OAuth, JWT, 2FA, AES-GCM, Argon2" },
        {
          label: "Testing & DevOps",
          value: "Vitest, Playwright, React Testing Library, GitHub Actions, Sentry, PostHog",
        },
      ],
    },
    {
      kind: "entries",
      heading: "Education",
      entries: [
        {
          title: "B.Tech, Computer Science and Engineering",
          dates: "Aug 2022 – Jun 2026",
          subtitle: "Maharaja Ranjit Singh Punjab Technical University",
          location: "Bathinda, India",
        },
      ],
    },
    {
      kind: "text",
      heading: "Certifications",
      text: "Google Cloud Generative AI Learning Path; HackerRank Frontend Developer (React), SQL and Node.js",
    },
  ],
};

export const DEFAULT_RESUME: ResumeContent = {
  header: RESUME_HEADER,
  one: RESUME_ONE_PAGE,
};
