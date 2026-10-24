/*
 * resume.ts
 * Built-in content of the /resume page: a one-page resume and a full CV.
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
  full: ResumeDocument;
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

const EDUCATION: ResumeSection = {
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
};

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
            "Designed the PostgreSQL (Neon) schema and REST APIs for four lead-capture pipelines, with server-side Zod validation and Redis rate limiting.",
            "Built an internal admin console with role-based access, filterable lead tables and Excel export, on signed httpOnly sessions and scrypt hashing.",
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
            "Secured the password-reset flow with Redis sliding-window rate limits, short-lived JWTs and reCAPTCHA v3, and set up the Vitest suite.",
            "Built a typed REST client, Zod form validation and optimistic UI for the Next.js App Router rewrite.",
          ],
        },
      ],
    },
    {
      kind: "entries",
      heading: "Projects",
      entries: [
        {
          title: "Flick",
          link: gh("flick"),
          dates: "In development",
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
        { label: "Languages", value: "TypeScript, JavaScript, SQL, Go, Rust, Kotlin, C#, Swift" },
        { label: "Frontend", value: "React, Next.js, Tailwind CSS, shadcn/ui, WebAssembly" },
        {
          label: "Backend & Data",
          value: "Node.js, Express, REST, WebSockets, Convex, PostgreSQL, MongoDB, Redis, Firebase",
        },
        { label: "Security", value: "OAuth, JWT, 2FA, rate limiting, AES-GCM, Argon2" },
        {
          label: "Testing & DevOps",
          value: "Vitest, Playwright, React Testing Library, GitHub Actions, Vercel, Sentry",
        },
      ],
    },
    EDUCATION,
    {
      kind: "text",
      heading: "Certifications",
      text: "Google Cloud Generative AI Learning Path; HackerRank Frontend Developer (React), SQL and Node.js",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Full CV                                                             */
/* ------------------------------------------------------------------ */

const RESUME_FULL: ResumeDocument = {
  sections: [
    {
      kind: "text",
      heading: "Summary",
      text: "Full-stack software engineer working across web, desktop and Android. Currently the sole engineer at Elina Club, responsible for two production web platforms end to end, and building Kiteloom, a collaborative canvas product. Previously a full-stack intern at Trupeer AI on the web app, Chrome extension and Node.js backend. Maintains open-source desktop and Android apps in Rust, Kotlin, C# and Swift, each with automated tests and CI-built releases.",
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
            "Sole engineer, responsible for frontend, backend, database, automation and deployments.",
            "Built and launched two production web platforms on Next.js 16, React 19 and TypeScript, from first commit to live site in under three months.",
            "Designed the PostgreSQL (Neon) schema and APIs behind the lead, careers, feedback and newsletter forms; every submission is validated server-side with Zod, rate limited with Upstash Redis and stored before the visitor is handed off to WhatsApp.",
            "Built the internal admin panel with searchable lead tables, Excel export and viewer/editor roles, on signed httpOnly session cookies and scrypt password hashing; the super-admin account lives in environment config so it cannot be locked out from inside the app.",
            "Built a drill-down location map (state, district, town, village) and lazy-loaded its bundle to keep it off the initial page load.",
            "Set up Vitest unit tests, Playwright end-to-end tests and a single pre-commit check for formatting, linting and type-checking.",
            "Contribute to the company's Android apps and internal automation tooling.",
          ],
        },
        {
          title: "Kiteloom",
          link: KITELOOM_LINK,
          dates: "Nov 2025 – Present",
          subtitle: "Founder (in development)",
          intro:
            "Infinite canvas, in development, where sketches, wireframes and diagrams are the same kind of object, so work moves from rough idea to finished diagram without switching tools. Next.js, TypeScript, Convex, Yjs.",
          bullets: [
            "Built real-time collaboration on Yjs CRDTs over a separately hosted WebSocket server; each client keeps a local copy that reconciles after a dropped connection.",
            "Implemented connectors that bind to shape edges and re-route when shapes move, instead of detaching.",
            "Integrated Better Auth (email, Google OAuth, 2FA), Paddle billing, per-user rate limits and Sentry; documents are private by default, with revocable share links.",
            "Maintain 70+ unit test files and a Playwright end-to-end suite in GitHub Actions; the marketing site is localized into 11 languages.",
          ],
        },
        {
          title: "Trupeer AI",
          link: TRUPEER_LINK,
          dates: "Jan 2026 – Jul 2026",
          subtitle: "Full-Stack Intern",
          location: "Bengaluru, India",
          intro:
            "Worked across the Next.js web app, the Chrome extension and the Node.js backend (MongoDB, Redis, third-party webhooks).",
          bullets: [
            "Moved subtitle processing from the server to the browser, using FFmpeg WASM and ElevenLabs Scribe v2 for transcription and SRT editing; cut compute cost by about 70% and extended support to 90+ languages.",
            "Replaced MediaRecorder with the WebCodecs API in the Chrome extension and streamed chunks to IndexedDB instead of memory, ending data loss on recordings longer than 30 minutes.",
            "Added upload retries with exponential backoff and a fallback web recorder for organizations that block browser extensions.",
            "Secured the password-reset flow with Upstash Redis sliding-window rate limiting, short-lived JWTs, reCAPTCHA v3 and a honeypot field.",
            "Set up Vitest from scratch and wrote tests for the Auth0 middleware, token refresh, signup routes and the Stripe, Intercom and Mixpanel integrations.",
            "Only intern on the Next.js App Router rewrite (TypeScript, Tailwind CSS, shadcn/ui); built a typed REST client, Zod form validation and webhook-driven optimistic UI for the Organization module.",
          ],
        },
      ],
    },
    {
      kind: "entries",
      heading: "Projects",
      entries: [
        {
          title: "Flick",
          link: gh("flick"),
          dates: "In development",
          subtitle: "Rust, Tauri, React, TypeScript",
          intro:
            "Keyboard-first Windows launcher: one search bar with a prefix per mode for system commands, apps, file search and AI chat.",
          bullets: [
            "Fuzzy search matches 2,000 apps in 0.25 ms and 305K file paths at p95 ≤ 4.7 ms, with frecency ranking on a 7-day half-life; 470+ automated tests.",
            "Bring-your-own-key AI chat over local models (Ollama, LM Studio, llama.cpp) and hosted providers (OpenAI, Anthropic, OpenRouter), falling back down the user's order on connection errors, 429s and 5xx responses.",
            "Provider keys live in Windows Credential Manager, are bound to the host they were entered for and are sent only over HTTPS; all network calls run in Rust, and text that looks like a secret is blocked from reaching a model.",
            "Offline natural-language file finder, port and process lookup, media controls, inline math and unit conversion, and quick capture to Obsidian, Notion or a webhook.",
          ],
        },
        {
          title: "Edgepad",
          link: gh("edgepad"),
          dates: "Sep 2026 – Present",
          subtitle: "Kotlin, C#, .NET, Swift, Bluetooth RFCOMM",
          intro:
            "Open-source Android app that turns a phone into a trackpad, keyboard, media remote and virtual Xbox controller for Windows and macOS over a direct Bluetooth link, with no account, Wi-Fi or server.",
          bullets: [
            "Designed a binary wire protocol over Bluetooth RFCOMM (2 to 258-byte semantic frames, one write per batch) between the Kotlin Android app and desktop companions in C# on .NET and Swift.",
            "All three codecs are tested against one set of golden-byte fixtures, so the Android, Windows and macOS apps cannot drift apart on the protocol.",
            "Implemented multi-finger gestures, volume and brightness dials, drawn-shape macro shortcuts, an on-screen keyboard and a gamepad the OS sees as a virtual Xbox controller.",
            "Built two-way state sync, so the phone shows the computer's real volume, brightness and playback position, including changes made on the computer; each new phone must be explicitly trusted on the computer.",
            "26 GitHub stars, 4 forks, 12 releases and 258 release downloads; 25 merged pull requests; 300+ tests; submitted to the winget community repository.",
          ],
        },
        {
          title: "Saltcellar",
          link: gh("saltcellar"),
          dates: "Sep 2026",
          subtitle: "Rust, Tauri, TypeScript",
          intro:
            "Offline encrypted vault for passwords, environment keys and backup codes on Windows, macOS and Linux; an open-source alternative to paid password managers.",
          bullets: [
            "Tauri desktop app and CLI built on one shared Rust core crate; the vault is a single encrypted file on disk.",
            "Entries are sealed with AES-256-GCM under a random data key, which is sealed under a key derived from the master password with Argon2id (64 MiB, 3 passes).",
            "No network code: the content security policy blocks every connection. The clipboard clears after 30 seconds and stays out of Windows clipboard history, the window is excluded from screen capture, and the vault locks after 5 minutes idle.",
            "Master passwords must be at least 15 characters and are checked against breach lists; 6 releases, each with SHA-256 checksums and a signed build attestation.",
          ],
        },
        {
          title: "Offkit",
          link: gh("offkit"),
          subtitle: "Rust, Slint, Next.js, WebAssembly",
          intro:
            "37 offline audio, video, image, PDF, SVG, CSS and developer tools, shipped as a native desktop app for Windows, macOS and Linux and as a web app.",
          bullets: [
            "One tool registry drives both apps; the desktop app runs each tool on shared engines (FFmpeg, PDFium and lopdf, resvg).",
            "Moved the desktop UI from Electron to Slint; files never leave the device and existing files are never overwritten without a save dialog.",
            "800+ automated tests; the web app is served with a strict content security policy.",
          ],
        },
        {
          title: "Inlay",
          link: gh("inlay"),
          subtitle: "Rust, Direct2D, Win32",
          intro:
            "Lightweight Rainmeter alternative that embeds a clock, audio visualizer, time-synced lyrics and a Spotify player in the Windows desktop.",
          bullets: [
            "Runs as one native process with event-driven redraws at about 54 MB RAM; 130+ tests, 9 releases.",
          ],
        },
        {
          title: "Inklo",
          link: gh("inklo"),
          subtitle: "Tauri, Rust, React, CodeMirror 6",
          intro:
            "Local, keyboard-driven Markdown notes app for Windows, macOS and Linux that works directly on plain .md files.",
          bullets: [
            "Command palette, rebindable shortcuts, pins and tags; no network code, enforced by CSP; 140+ tests.",
          ],
        },
        {
          title: "Plimsoll",
          link: gh("plimsoll"),
          subtitle: "TypeScript, Node.js, Claude Code plugin API",
          intro: "Claude Code status-bar plugin, distributed through the plugin marketplace.",
          bullets: [
            "Shows context-window usage, 5-hour and weekly rate limits, token spend at API prices, and Git, PR and CI status.",
          ],
        },
      ],
    },
    {
      kind: "list",
      heading: "Other Projects",
      items: [
        "Open Whiteboard: real-time collaborative whiteboard with a custom HTML5 Canvas engine, Yjs CRDTs and a Node.js WebSocket server.",
        "Lyric Veil ([lyric-veil.vercel.app](https://lyric-veil.vercel.app)): transparent, click-through desktop overlay for word-synced Spotify lyrics (Electron, React, TypeScript) with a drift-corrected playback clock.",
        "Smaller projects: Is It Canon (story-order tracker for connected franchises), cmd-ref (developer command reference), Audio Visualizer (C#, WPF, WASAPI loopback), Plotline (media tracker), Canopy (bookmark manager).",
      ],
    },
    {
      kind: "pairs",
      heading: "Skills",
      pairs: [
        {
          label: "Languages",
          value: "TypeScript, JavaScript, SQL, Go; Rust, Kotlin, C#, Swift (open-source projects)",
        },
        {
          label: "Frontend",
          value: "React, Next.js, Tailwind CSS, shadcn/ui, Motion, GSAP, CodeMirror, WebAssembly",
        },
        { label: "Backend", value: "Node.js, Express, REST APIs, WebSockets, Convex, Yjs (CRDTs)" },
        {
          label: "Databases",
          value: "PostgreSQL (Neon), MongoDB, Redis (Upstash), Firebase, IndexedDB",
        },
        {
          label: "Security",
          value: "Better Auth, Auth0, OAuth, JWT, 2FA, rate limiting, reCAPTCHA, AES-GCM, Argon2",
        },
        { label: "Testing", value: "Vitest, Playwright, React Testing Library" },
        { label: "Mobile & Desktop", value: "Android (Kotlin), Tauri, Slint, .NET" },
        {
          label: "Tools",
          value: "GitHub Actions, Vercel, Sentry, Biome, Figma, Postman, Claude Code",
        },
      ],
    },
    EDUCATION,
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
          label: "HackerRank",
          value:
            "[Frontend Developer (React)](https://www.hackerrank.com/certificates/ce37450b1013), [JavaScript](https://www.hackerrank.com/certificates/9eabe8ab61b1), [CSS](https://www.hackerrank.com/certificates/35384d086309), [SQL](https://www.hackerrank.com/certificates/7f1a01b7b859), [React](https://www.hackerrank.com/certificates/23a74130dbd8), [Node](https://www.hackerrank.com/certificates/893d3bf8ee68)",
        },
        {
          label: "Microsoft & LinkedIn",
          value:
            "[Career Essentials in Generative AI](https://www.linkedin.com/learning/certificates/b0d6803487e5b12b7ddf935a52b4efa6541460fcae5faacb7e7354ec96f78832?trk=share_certificate), [Career Essentials in Software Development](https://www.linkedin.com/learning/certificates/b49081d79547f863f12dd8656302ede27f342d628631d481085b14b727dcc910?trk=share_certificate)",
        },
      ],
    },
    {
      kind: "list",
      heading: "Talks",
      items: [
        "Give regular seminars to students at several colleges on planning their careers after graduation.",
      ],
    },
  ],
};

export const DEFAULT_RESUME: ResumeContent = {
  header: RESUME_HEADER,
  one: RESUME_ONE_PAGE,
  full: RESUME_FULL,
};
