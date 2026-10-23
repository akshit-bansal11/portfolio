/*
 * resume.ts
 * Content of the /resume page, transcribed from the Google Docs
 * "Akshit Bansal - Resume (Oct 2026)" (one page) and "Akshit Bansal - CV"
 * (full). The CV keeps its longer write-ups but takes the newer facts from
 * the one-page resume (role title, project names, Edgepad numbers).
 * Inline text supports **bold** and [label](url).
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

export const RESUME_HEADER = {
  name: "Akshit Bansal",
  title: "Full-Stack Software Engineer",
  location: "Punjab, India",
  links: [
    { label: "er.akshitbansal11@gmail.com", href: "mailto:er.akshitbansal11@gmail.com" },
    { label: "akshitbansal.dev", href: "https://akshitbansal.dev" },
    {
      label: "linkedin.com/in/akshit-bansal11",
      href: "https://www.linkedin.com/in/akshit-bansal11",
    },
    { label: "github.com/akshit-bansal11", href: "https://github.com/akshit-bansal11" },
  ],
} as const satisfies { name: string; title: string; location: string; links: ResumeLink[] };

const gh = (repo: string): ResumeLink => ({
  label: `github.com/akshit-bansal11/${repo}`,
  href: `https://github.com/akshit-bansal11/${repo}`,
});

const KITELOOM_LINK: ResumeLink = { label: "kiteloom.com", href: "https://kiteloom.com" };
const TRUPEER_LINK: ResumeLink = { label: "trupeer.ai", href: "https://www.trupeer.ai/" };

/* ------------------------------------------------------------------ */
/* One page                                                            */
/* ------------------------------------------------------------------ */

export const RESUME_ONE_PAGE: ResumeDocument = {
  sections: [
    {
      kind: "text",
      heading: "Summary",
      text: "Full-stack engineer shipping production software for web, Android, Windows and macOS. Sole engineer at Elina Club, Co-Founder & CTO of a stealth startup and founder of Kiteloom. Maintain 7 open-source apps with **650+ commits** and **1,900+ automated tests** behind signed CI releases. Seeking an SDE-1 / SDE-2 role.",
    },
    {
      kind: "entries",
      heading: "Experience",
      entries: [
        {
          title: "Elina Club Pvt. Ltd",
          dates: "Jul 2026 – Present",
          subtitle: "SDE-3 & Chief Advisor",
          location: "Bathinda, India (On-site)",
          bullets: [
            "Sole engineer owning frontend, backend, database, CI/CD and deployments; advise leadership on product and tech strategy.",
            "Shipped **2 production web platforms** on Next.js 16, React 19 and TypeScript, zero to launch in under 3 months (**~350 commits**).",
            "Designed the Postgres (Neon) schema and REST APIs for **4 lead-capture pipelines** with Zod validation and Redis rate limiting.",
            "Built an RBAC admin console with filterable lead tables and Excel export, on signed httpOnly sessions and scrypt hashing.",
          ],
        },
        {
          title: "Stealth Startup",
          dates: "Jul 2026 – Present",
          subtitle: "Co-Founder & CTO",
          bullets: [
            "Own technical direction, system architecture and engineering execution for a pre-launch company.",
          ],
        },
        {
          title: "Kiteloom",
          link: KITELOOM_LINK,
          dates: "Jan 2026 – Present",
          subtitle: "Founder",
          bullets: [
            "Infinite canvas unifying sketches, wireframes and diagrams, with real-time multiplayer on **Yjs CRDTs** (Next.js, TypeScript, Convex).",
            "Better Auth (email, Google OAuth, 2FA), Paddle billing, per-user rate limiting and Sentry; **70+ unit test files** plus Playwright E2E gated in GitHub Actions; localized in **11 languages**.",
          ],
        },
        {
          title: "Trupeer AI",
          link: TRUPEER_LINK,
          dates: "Jan 2026 – Jul 2026",
          subtitle: "Full-Stack Intern",
          location: "Bengaluru, India (On-site)",
          bullets: [
            "Moved subtitles client-side with FFmpeg WASM + ElevenLabs Scribe v2: **~70%** lower compute cost and **90+ languages**.",
            "Rebuilt the Chrome extension recorder on WebCodecs with chunked IndexedDB writes, ending data loss on **30+ min** recordings.",
            "Hardened auth (OWASP A07): Redis sliding-window rate limits, short-lived JWTs, reCAPTCHA v3; built the Vitest suite.",
            "Sole intern on the Next.js App Router rewrite: typed REST client, Zod schemas, webhook-driven optimistic UI.",
          ],
        },
      ],
    },
    {
      kind: "entries",
      heading: "Projects",
      entries: [
        {
          title: "Edgepad",
          link: gh("edgepad"),
          subtitle: "Kotlin, C# / .NET, Swift, Bluetooth RFCOMM",
          bullets: [
            "Turns an Android phone into a trackpad, media remote, keyboard and virtual Xbox gamepad for Windows and macOS over a custom Bluetooth wire protocol with live two-way state sync; v3.5, **248 commits, 300+ tests, 25 GitHub stars**.",
          ],
        },
        {
          title: "Flick",
          subtitle: "Rust, Tauri, React, TypeScript",
          bullets: [
            "Keyboard-first Windows launcher: apps, system commands, file search and BYO-key AI chat (OpenAI, Anthropic, OpenRouter, Ollama) in one bar; fuzzy-matches 2,000 apps in **0.25 ms** and **305K file paths at p95 ≤ 4.7 ms**; **470+ tests**.",
          ],
        },
        {
          title: "Offkit",
          link: gh("offkit"),
          subtitle: "Rust, Slint, Next.js, WebAssembly",
          bullets: [
            "**37 local-first** media, PDF, image, SVG and dev tools shipped as a native Rust app (Windows/macOS/Linux) and a WASM web app from one shared tool registry; replaced Electron with Slint; **800+ tests**.",
          ],
        },
        {
          title: "Saltcellar",
          link: gh("saltcellar"),
          subtitle: "Rust, Tauri, TypeScript",
          bullets: [
            "Offline secrets vault: AES-256-GCM envelope encryption under an Argon2id KDF (64 MiB), CSP blocking all network I/O, 30 s clipboard auto-clear and screen-capture exclusion; SHA-256 checksums and signed build attestations.",
          ],
        },
        {
          title: "Inlay",
          link: gh("inlay"),
          subtitle: "Rust, Direct2D, Win32",
          bullets: [
            "Lightweight Rainmeter alternative embedding a clock, audio visualizer, time-synced lyrics and a Spotify player into the Windows desktop; single native process with event-driven redraws at **~54 MB RAM**; **130+ tests**.",
          ],
        },
        {
          title: "Inklo",
          link: gh("inklo"),
          subtitle: "Tauri, Rust, React, CodeMirror 6",
          bullets: [
            "Fully local, keyboard-first Markdown notes app for Windows, macOS and Linux over plain .md files; command palette, rebindable shortcuts, pins and tags, with zero network code enforced by CSP; **140+ tests**.",
          ],
        },
        {
          title: "Plimsoll",
          link: gh("plimsoll"),
          subtitle: "TypeScript, Node.js, Claude Code plugin API",
          bullets: [
            "Claude Code HUD plugin showing context-window usage, 5-hour/weekly rate limits, token spend at API prices and Git/PR/CI status, with an animated pixel-art mascot; distributed via the plugin marketplace.",
          ],
        },
      ],
    },
    {
      kind: "pairs",
      heading: "Technical Skills",
      pairs: [
        { label: "Languages", value: "TypeScript, JavaScript, Rust, Kotlin, C#, Swift, SQL, Go" },
        {
          label: "Frontend",
          value: "Next.js, React, Tailwind CSS, shadcn/ui, Motion, GSAP, CodeMirror, WebAssembly",
        },
        {
          label: "Backend & Data",
          value:
            "Node.js, Express, REST, WebSockets, Convex, PostgreSQL (Neon), MongoDB, Redis (Upstash), Firebase",
        },
        {
          label: "Security & Testing",
          value:
            "Better Auth, Auth0, JWT, OAuth, 2FA, rate limiting, reCAPTCHA, AES-GCM, Argon2, Vitest, Playwright, RTL",
        },
        {
          label: "Mobile, Desktop & Tools",
          value:
            "Android (Kotlin), Tauri (Rust), Slint, .NET (C#), Claude Code, GitHub Actions, Vercel, Sentry, Figma",
        },
      ],
    },
    {
      kind: "entries",
      heading: "Education",
      entries: [
        {
          title:
            "B.Tech, Computer Science & Engineering, Maharaja Ranjit Singh Punjab Technical University",
          dates: "Aug 2022 – Jun 2026",
        },
      ],
    },
    {
      kind: "text",
      heading: "Certifications",
      text: "Google Cloud Generative AI Learning Path · Microsoft & LinkedIn Career Essentials (Generative AI, Software Development) · HackerRank Frontend Developer (React)",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Full CV                                                             */
/* ------------------------------------------------------------------ */

export const RESUME_FULL: ResumeDocument = {
  sections: [
    {
      kind: "text",
      heading: "Profile",
      text: "Full-stack software engineer who has shipped production software for the web, Android, Windows and macOS. I run engineering end to end as SDE-3 at Elina Club, co-founded a stealth startup as its CTO, and built my own product, Kiteloom. I use Claude Code every day and know how to get secure, well-tested code out of it. Looking for an SDE-1 / SDE-2 role where I can keep building reliable products with a strong team.",
    },
    {
      kind: "entries",
      heading: "Experience",
      entries: [
        {
          title: "Elina Club Pvt. Ltd",
          dates: "Jul 2026 – Present",
          subtitle: "SDE-3 & Chief Advisor",
          location: "Bathinda, India (On-site)",
          intro:
            "I'm the only engineer here, so everything technical is mine: frontend, backend, database, automation and deployments. As Chief Advisor I also advise leadership on product and technical decisions.",
          bullets: [
            "**Two production platforms.** Built and shipped two web platforms on Next.js 16, React 19 and TypeScript, from the first commit to the live site. About 350 commits across both in under three months.",
            "**Database and lead pipeline.** Designed the Postgres (Neon) schema and the APIs behind the lead, careers, feedback and newsletter forms. Every submission is validated with Zod on the server, rate limited with Upstash Redis and saved before the visitor is handed off to WhatsApp.",
            "**Admin panel and access control.** Wrote the internal admin panel: searchable and filterable lead tables, Excel export and viewer/editor permissions. Sessions are signed by httpOnly cookies and passwords are hashed with scrypt. The one super admin lives in an environment config, so it can never be locked out from inside the app.",
            "**Interactive location map.** Built a map that drills down from state to district to town and village, and deferred its bundle so it doesn't slow down the first page load.",
            "**Testing and code quality.** Set up Vitest unit tests and Playwright end-to-end tests, plus a single command that formats, lints and type-checks the code. Nothing gets committed unless it passes.",
            "**Android and automation.** Also working on the company's Android apps and the internal automation the rest of the team depends on.",
          ],
        },
        {
          title: "Stealth Startup",
          dates: "Jul 2026 – Present",
          subtitle: "Co-Founder & CTO",
          bullets: [
            "Co-founded an early-stage company that is still in stealth, so I can't name it or its products yet. I own the technical direction, architecture and engineering.",
          ],
        },
        {
          title: "Kiteloom",
          link: KITELOOM_LINK,
          dates: "Jan 2026 – Present",
          subtitle: "Founder",
          intro:
            "Kiteloom is my own product: an infinite canvas where sketches, wireframes and diagrams are the same object, so an idea never has to be exported into another tool to get finished. Built with Next.js, TypeScript, Convex and Yjs.",
          bullets: [
            "**Real-time multiplayer.** Yjs CRDTs over a WebSocket server that I run separately. Each browser keeps a local copy that reconciles after a dropped connection.",
            "**Diagramming.** Arrows bind to a shape's edge, so a diagram re-routes instead of breaking when you move things.",
            "**Backend, auth and billing.** Convex with Better Auth (email, Google sign-in, 2FA), Paddle billing, per-user rate limits and Sentry error tracking. Private by default, with shared links that can be revoked.",
            "**Quality and reach.** 70+ unit test files and a Playwright end-to-end suite run in GitHub Actions. The marketing site ships in 11 languages.",
          ],
        },
        {
          title: "Trupeer AI",
          link: TRUPEER_LINK,
          dates: "Jan 2026 – Jul 2026",
          subtitle: "Full-Stack Intern",
          location: "Bengaluru, India (On-site)",
          intro:
            "Worked across the Next.js web app, the Chrome extension and the Node.js backend, with MongoDB, Redis and third-party webhooks.",
          bullets: [
            "**Subtitle system.** Moved subtitle processing off the server and into the browser, using FFmpeg WASM and ElevenLabs Scribe v2 for transcription and SRT editing. That cut compute costs by about 70% and added support for 90+ languages.",
            "**Chrome extension recording.** Switched the recorder from MediaRecorder to the WebCodecs API and wrote chunks to IndexedDB instead of holding them in memory, so recordings longer than 30 minutes stopped losing data. Added upload retries with exponential backoff, and a fallback web recorder for companies that block extensions.",
            "**Backend security and tests.** Tightened the password reset flow with Upstash Redis sliding-window rate limiting, short-lived JWTs, reCAPTCHA v3 and a honeypot field. Set up Vitest from scratch and covered the Auth0 middleware, token refresh, signup routes and the Stripe, Intercom and Mixpanel integrations.",
            "**Frontend rewrite.** I was the only intern on the rewrite to the Next.js App Router with TypeScript, Tailwind CSS and shadcn/ui. Wrote a typed REST client, Zod form validation and webhook-driven optimistic UI for the Organization module.",
          ],
        },
      ],
    },
    {
      kind: "entries",
      heading: "Projects",
      entries: [
        {
          title: "Edgepad",
          link: gh("edgepad"),
          dates: "Sep 2026 – Present",
          subtitle: "Kotlin, C# / .NET, Swift, Bluetooth RFCOMM",
          intro:
            "Turns an Android phone into a trackpad, media remote, keyboard and virtual Xbox gamepad for Windows and macOS over a direct Bluetooth link. No account, no Wi-Fi, no server in between. Open source, 25 GitHub stars.",
          bullets: [
            "Android app in Kotlin with desktop companions in C# on .NET (Windows) and Swift (macOS), talking over a custom Bluetooth RFCOMM wire protocol I designed.",
            "Multi-finger gestures, corner dials for volume and brightness, drawn-shape shortcuts that run macros, an on-screen keyboard, and a gamepad that shows up on the computer as a real virtual Xbox controller.",
            "Live two-way state sync: the dials show the computer's real volume, brightness and playback position, and follow changes made on the computer itself.",
            "248 commits, 300+ tests and regular releases (v3.5 at the moment), built and tested in CI. Submitted to the Windows Package Manager (winget) community repository.",
          ],
        },
        {
          title: "Saltcellar",
          link: gh("saltcellar"),
          dates: "Sep 2026",
          subtitle: "Rust, Tauri, TypeScript",
          intro:
            "An offline encrypted vault for passwords, environment keys and backup codes. A free, open-source alternative to paid password managers.",
          bullets: [
            "Written in Rust: a Tauri desktop app and a CLI on top of one shared core crate.",
            "AES-256-GCM envelope encryption under an Argon2id KDF (64 MiB). The whole vault is one encrypted file on disk.",
            "No network code at all; the app's content security policy blocks every connection. Clipboard auto-clears after 30 s and the window is excluded from screen capture.",
            "Rejects master passwords found in leaked-password lists, and every release ships with SHA-256 checksums and a signed build attestation.",
          ],
        },
      ],
    },
    {
      kind: "list",
      heading: "Other Projects",
      items: [
        "**Flick:** keyboard-first Windows launcher in Rust, Tauri, React and TypeScript: apps, system commands, file search and BYO-key AI chat (OpenAI, Anthropic, OpenRouter, Ollama) in one bar. Fuzzy-matches 2,000 apps in 0.25 ms and 305K file paths at p95 ≤ 4.7 ms; 470+ tests.",
        "**Offkit** ([github.com/akshit-bansal11/offkit](https://github.com/akshit-bansal11/offkit)): 37 local-first media, PDF, image, SVG and dev tools, shipped as a native Rust app (Windows/macOS/Linux) and a WebAssembly web app from one shared tool registry. Replaced Electron with Slint; 800+ tests.",
        "**Inlay** ([github.com/akshit-bansal11/inlay](https://github.com/akshit-bansal11/inlay)): lightweight Rainmeter alternative in Rust, Direct2D and Win32 that embeds a clock, audio visualizer, time-synced lyrics and a Spotify player into the Windows desktop. One native process with event-driven redraws at ~54 MB RAM; 130+ tests.",
        "**Inklo** ([github.com/akshit-bansal11/inklo](https://github.com/akshit-bansal11/inklo)): fully local, keyboard-first Markdown notes app for Windows, macOS and Linux built with Tauri (Rust), React and CodeMirror 6, over plain .md files. Command palette, rebindable shortcuts, pins and tags; zero network code enforced by CSP; 140+ tests.",
        "**Plimsoll** ([github.com/akshit-bansal11/plimsoll](https://github.com/akshit-bansal11/plimsoll)): Claude Code HUD plugin showing context-window usage, 5-hour/weekly rate limits, token spend at API prices and Git/PR/CI status, with an animated pixel-art mascot. Distributed via the plugin marketplace.",
        "**Open Whiteboard** ([github.com/akshit-bansal11/open-whiteboard](https://github.com/akshit-bansal11/open-whiteboard)): real-time collaborative whiteboard with my own HTML5 Canvas engine, Yjs CRDTs and a Node.js WebSocket server.",
        "**Lyric Veil** ([lyric-veil.vercel.app](https://lyric-veil.vercel.app)): word-synced Spotify lyrics as a transparent, click-through desktop overlay (Electron, React, TypeScript) with its own drift-corrected clock.",
        "**Also:** Is It Canon (story-order tracker for connected franchises), cmd-ref (dev command reference, one JSON file per route), Audio Visualizer (C#, WPF, WASAPI loopback), Plotline (media tracker), Canopy (bookmark manager).",
      ],
    },
    {
      kind: "pairs",
      heading: "Technical Skills",
      pairs: [
        {
          label: "Languages",
          value: "TypeScript, JavaScript, SQL, Go; Kotlin, Rust, C# and Swift in my own projects",
        },
        {
          label: "Frontend",
          value: "Next.js, React, Tailwind CSS, shadcn/ui, Motion, GSAP, CodeMirror, WebAssembly",
        },
        { label: "Backend", value: "Node.js, Express, REST APIs, WebSockets, Convex, CRDTs, Yjs" },
        {
          label: "Databases",
          value: "PostgreSQL (Neon), MongoDB, Redis (Upstash), Firebase, IndexedDB",
        },
        {
          label: "Auth & Security",
          value: "Better Auth, Auth0, JWT, OAuth, 2FA, rate limiting, reCAPTCHA, AES-GCM, Argon2",
        },
        { label: "Testing", value: "Vitest, Playwright, React Testing Library" },
        { label: "Mobile & Desktop", value: "Android (Kotlin), Tauri (Rust), Slint, .NET (C#)" },
        {
          label: "AI & Dev Tools",
          value: "Claude Code (expert), GitHub Actions, Vercel, Sentry, Biome, Figma, Postman",
        },
      ],
    },
    {
      kind: "entries",
      heading: "Education",
      entries: [
        {
          title: "B.Tech, Computer Science & Engineering",
          dates: "Aug 2022 – Jun 2026",
          subtitle: "Maharaja Ranjit Singh Punjab Technical University",
          location: "Bathinda, Punjab",
        },
      ],
    },
    {
      kind: "entries",
      heading: "Training",
      entries: [
        {
          title: "MERN Stack + AI (API Integration)",
          dates: "Jun 2025 – Jul 2025",
          subtitle: "Sun Soft Technologies",
        },
        {
          title: "Data Structures & Algorithms",
          dates: "Dec 2024 – Feb 2025",
          subtitle: "Bangalore Computer Education",
        },
        {
          title: "Node.js Full Stack",
          dates: "Jun 2024 – Jul 2024",
          subtitle: "Bangalore Computer Education",
        },
      ],
    },
    {
      kind: "pairs",
      heading: "Certifications",
      pairs: [
        {
          label: "Google Cloud",
          value:
            "[Generative AI Learning Path](https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1/badges/24146512): Gen AI Agents, Gen AI Apps, Navigate the Landscape, Foundational Concepts, Beyond the Chatbot",
        },
        {
          label: "Microsoft & LinkedIn",
          value:
            "[Career Essentials in Generative AI](https://www.linkedin.com/learning/certificates/b0d6803487e5b12b7ddf935a52b4efa6541460fcae5faacb7e7354ec96f78832?trk=share_certificate), [Career Essentials in Software Development](https://www.linkedin.com/learning/certificates/b49081d79547f863f12dd8656302ede27f342d628631d481085b14b727dcc910?trk=share_certificate)",
        },
        {
          label: "HackerRank",
          value:
            "[Frontend Developer (React)](https://www.hackerrank.com/certificates/ce37450b1013), [JavaScript](https://www.hackerrank.com/certificates/9eabe8ab61b1), [CSS](https://www.hackerrank.com/certificates/35384d086309), [SQL](https://www.hackerrank.com/certificates/7f1a01b7b859), [React](https://www.hackerrank.com/certificates/23a74130dbd8), [Node](https://www.hackerrank.com/certificates/893d3bf8ee68)",
        },
      ],
    },
    {
      kind: "list",
      heading: "Open Source & Community",
      items: [
        "**Open source:** I build free, open alternatives to paid apps (Edgepad, Saltcellar, Inlay, Offkit) and help other people with their projects.",
        "**Reddit:** active contributor in developer communities.",
        "**Speaking:** I regularly give seminars to juniors at different colleges to help them plan what comes after their degree.",
      ],
    },
  ],
};
