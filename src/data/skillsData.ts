/*
 * SkillsData.ts
 * Curated skill categories for the home-page Skills section.
 * A focused subset of the full skillsData enriched with
 * per-skill project / experience references shown in popovers.
 * Types live in src/types/skill.ts.
 */

import { asset } from "@/config/assets";
import type { Skill, SkillCategory } from "@/types/skill";

export const SkillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: [
      {
        name: "TypeScript",
        Icon: "https://svgl.app/library/typescript.svg",
        usedIn: [
          "Strict mode across every production codebase",
          "Typed REST client layers with Zod validation",
        ],
      },
      {
        name: "JavaScript",
        Icon: "https://svgl.app/library/javascript.svg",
        usedIn: ["Chrome extension recorder at Trupeer", "Open Interactive Maps"],
      },
      {
        name: "SQL",
        Icon: asset("skills/sql.svg"),
        usedIn: ["Postgres (Neon) schemas & queries behind production forms"],
      },
      {
        name: "Go",
        Icon: "https://svgl.app/library/golang_dark.svg",
      },
      {
        name: "Kotlin",
        Icon: "/icons/kotlin.svg",
        usedIn: ["Edgepad Android app — trackpad, gamepad & media remote"],
      },
      {
        name: "Rust",
        Icon: "/icons/rust.svg",
        usedIn: [
          "Deskbeat — native Spotify widgets for Windows 11",
          "Saltcellar — encrypted local vault (Argon2id, AES-256-GCM)",
        ],
      },
      {
        name: "C#",
        Icon: "https://svgl.app/library/csharp.svg",
        usedIn: ["Edgepad Windows host — Bluetooth RFCOMM server on .NET 10"],
      },
    ],
  },
  {
    title: "Frontend",
    skills: [
      {
        name: "Next.js",
        Icon: "https://svgl.app/library/nextjs_icon_dark.svg",
        usedIn: [
          "Two production platforms on Next.js 16 at Elina Club",
          "App Router rewrite at Trupeer; Kiteloom's canvas app",
        ],
      },
      {
        name: "React",
        Icon: "https://svgl.app/library/react_dark.svg",
        usedIn: [
          "Complex stateful UIs — editors, canvases, dashboards",
          "Webhook-driven optimistic UI & custom hooks",
        ],
      },
      {
        name: "Tailwind CSS",
        Icon: "https://svgl.app/library/tailwindcss.svg",
        usedIn: ["Responsive, utility-first styling across every frontend"],
      },
      {
        name: "Shadcn",
        Icon: "https://svgl.app/library/shadcn-ui_dark.svg",
        usedIn: ["Accessible dialogs, dropdowns & form primitives in production UIs"],
      },
      {
        name: "Motion",
        Icon: "https://svgl.app/library/motion_dark.svg",
        usedIn: ["Page transitions, scroll animations & layout animations"],
      },
      {
        name: "GSAP",
        Icon: "/icons/gsap.svg",
      },
    ],
  },
  {
    title: "Backend & Data",
    skills: [
      {
        name: "Node.js",
        Icon: "https://svgl.app/library/nodejs.svg",
        usedIn: ["REST APIs, webhooks & third-party integrations"],
      },
      {
        name: "Express",
        Icon: "https://svgl.app/library/expressjs_dark.svg",
        usedIn: ["Middleware pipelines for auth & validation"],
      },
      {
        name: "Convex",
        Icon: "/icons/convex.svg",
        usedIn: ["Kiteloom's backend, alongside Yjs CRDTs for real-time multiplayer"],
      },
      {
        name: "PostgreSQL",
        Icon: "https://svgl.app/library/postgresql.svg",
        usedIn: ["Neon-hosted schemas for leads, careers, feedback & newsletter data"],
      },
      {
        name: "MongoDB",
        Icon: "https://svgl.app/library/mongodb-icon-dark.svg",
        usedIn: ["Document storage for SaaS entities at Trupeer"],
      },
      {
        name: "Redis",
        Icon: "https://svgl.app/library/redis.svg",
        usedIn: ["Sliding-window rate limiting on auth & form endpoints"],
      },
      {
        name: "Upstash",
        Icon: "https://svgl.app/library/upstash.svg",
        usedIn: ["Serverless Redis for rate limiting at Trupeer & Elina Club"],
      },
      {
        name: "Firebase",
        Icon: "https://svgl.app/library/firebase.svg",
        usedIn: ["Firestore + Auth for Plotline and Canopy"],
      },
    ],
  },
  {
    title: "Security & Testing",
    skills: [
      {
        name: "Better Auth",
        Icon: "/icons/betterauth.svg",
        usedIn: ["Email, Google & 2FA sign-in for Kiteloom"],
      },
      {
        name: "Auth0",
        Icon: "https://svgl.app/library/auth0.svg",
        usedIn: ["OAuth / OIDC flows and token validation in API middleware"],
      },
      {
        name: "JWT",
        Icon: "https://svgl.app/library/jwt.svg",
        usedIn: ["Short-lived tokens for a hardened password-reset flow"],
      },
      {
        name: "Vitest",
        Icon: "https://svgl.app/library/vitest.svg",
        usedIn: ["Set up from scratch at Trupeer across Auth0, Stripe, Intercom & Mixpanel code"],
      },
      {
        name: "Playwright",
        Icon: "",
        usedIn: ["End-to-end tests for Kiteloom, run in GitHub Actions"],
      },
      {
        name: "Testing Library",
        Icon: "/icons/testinglibrary.svg",
        usedIn: ["React component tests"],
      },
    ],
  },
  {
    title: "Mobile, Desktop & Tools",
    skills: [
      {
        name: "Android",
        Icon: "/icons/android.svg",
        usedIn: ["Edgepad — Bluetooth trackpad & gamepad app in Kotlin"],
      },
      {
        name: "Tauri",
        Icon: "/icons/tauri.svg",
        usedIn: ["Saltcellar's desktop app, with a Rust core"],
      },
      {
        name: ".NET",
        Icon: "https://svgl.app/library/dotnet.svg",
        usedIn: ["Edgepad's Windows host on .NET 10"],
      },
      {
        name: "Claude Code",
        Icon: "https://svgl.app/library/claude-ai-icon.svg",
        usedIn: [
          "Daily driver for shipping secure, well-tested code",
          "Built Plimsoll, a HUD for it",
        ],
      },
      {
        name: "GitHub Actions",
        Icon: "/icons/githubactions.svg",
        usedIn: ["CI for Kiteloom's unit and Playwright suites"],
      },
      {
        name: "Vercel",
        Icon: "/icons/vercel.svg",
        usedIn: ["Hosting and preview deployments for web projects"],
      },
      {
        name: "Sentry",
        Icon: "/icons/sentry.svg",
        usedIn: ["Error tracking for Kiteloom"],
      },
      {
        name: "Figma",
        Icon: "https://svgl.app/library/figma.svg",
        usedIn: ["UI design before code — dashboards, templates & app screens"],
      },
    ],
  },
];

export const skillsData: Skill[] = [
  { name: "HTML5", Icon: "https://svgl.app/library/html5.svg" },
  { name: "CSS3", Icon: "https://svgl.app/library/css.svg" },
  { name: "JavaScript", Icon: "https://svgl.app/library/javascript.svg" },
  { name: "Tailwind CSS", Icon: "https://svgl.app/library/tailwindcss.svg" },
  { name: "React", Icon: "https://svgl.app/library/react_dark.svg" },
  { name: "TypeScript", Icon: "https://svgl.app/library/typescript.svg" },
  { name: "Next.js", Icon: "https://svgl.app/library/nextjs_icon_dark.svg" },
  { name: "Canva", Icon: "https://svgl.app/library/canva.svg" },
  { name: "Figma", Icon: "https://svgl.app/library/figma.svg" },
  { name: "Framer", Icon: "https://svgl.app/library/framer_dark.svg" },
  { name: "Shadcn", Icon: "https://svgl.app/library/shadcn-ui_dark.svg" },
  { name: "Magic UI", Icon: "https://svgl.app/library/magicui.svg" },
  { name: "Motion", Icon: "https://svgl.app/library/motion_dark.svg" },
  { name: "Radix UI", Icon: "https://svgl.app/library/radix-ui_dark.svg" },
  { name: "Redux", Icon: "https://svgl.app/library/redux.svg" },
  { name: "Zustand", Icon: asset("skills/zustand.svg") },
  {
    name: "React Router",
    Icon: "https://svgl.app/library/reactrouter.svg",
  },
  {
    name: "jQuery",
    Icon: "https://svgl.app/library/jquery_dark.svg",
  },
  { name: "Bootstrap", Icon: "https://svgl.app/library/bootstrap.svg" },
  { name: "Material UI", Icon: "https://svgl.app/library/materialui.svg" },
  { name: "Slint", Icon: asset("skills/slint.svg") },
  { name: "Node.js", Icon: "https://svgl.app/library/nodejs.svg" },
  { name: "Express", Icon: "https://svgl.app/library/expressjs_dark.svg" },
  { name: "Go", Icon: "https://svgl.app/library/golang_dark.svg" },
  { name: "Bun", Icon: "https://svgl.app/library/bun.svg" },
  { name: "C#", Icon: "https://svgl.app/library/csharp.svg" },
  { name: ".NET", Icon: "https://svgl.app/library/dotnet.svg" },
  { name: "Swift", Icon: "https://svgl.app/library/swift.svg" },
  {
    name: "SQL",
    Icon: asset("skills/sql.svg"),
  },
  { name: "MongoDB", Icon: "https://svgl.app/library/mongodb-icon-dark.svg" },
  { name: "MySQL", Icon: "https://svgl.app/library/mysql-icon-dark.svg" },
  { name: "PostgreSQL", Icon: "https://svgl.app/library/postgresql.svg" },
  { name: "Supabase", Icon: "https://svgl.app/library/supabase.svg" },
  { name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
  { name: "Yjs", Icon: asset("skills/yjs.svg") },
  { name: "Drizzle ORM", Icon: "https://svgl.app/library/drizzle-orm_dark.svg" },
  { name: "Upstash", Icon: "https://svgl.app/library/upstash.svg" },
  { name: "Redis", Icon: "https://svgl.app/library/redis.svg" },
  { name: "Python", Icon: "https://svgl.app/library/python.svg" },
  { name: "C", Icon: "https://svgl.app/library/c.svg" },
  { name: "C++", Icon: "https://svgl.app/library/c-plusplus.svg" },
  {
    name: "Leetcode",
    Icon: asset("skills/leetcode-dark.svg"),
  },
  {
    name: "Hackerrank",
    Icon: asset("skills/hacker-rank-dark.svg"),
  },
  { name: "Git", Icon: "https://svgl.app/library/git.svg" },
  { name: "GitHub", Icon: "https://svgl.app/library/github_dark.svg" },
  { name: "Postman", Icon: "https://svgl.app/library/postman.svg" },
  { name: "dotenv", Icon: "https://svgl.app/library/dotenv.svg" },
  { name: "vite", Icon: "https://svgl.app/library/vite.svg" },
  { name: "postcss", Icon: "https://svgl.app/library/postcss.svg" },
  { name: "npm", Icon: "https://svgl.app/library/npm.svg" },
  { name: "pnpm", Icon: "https://svgl.app/library/pnpm_dark.svg" },
  { name: "vscode", Icon: "https://svgl.app/library/vscode.svg" },
  { name: "pycharm", Icon: "https://svgl.app/library/pycharm.svg" },
  { name: "webstorm", Icon: "https://svgl.app/library/webstorm.svg" },
  {
    name: "CLion",
    Icon: asset("skills/c-lion.svg"),
  },
  { name: "Cloudinary", Icon: "https://svgl.app/library/cloudinary.svg" },
  {
    name: "Firestore",
    Icon: asset("skills/firestore.svg"),
  },
  { name: "SVG", Icon: "https://svgl.app/library/svg.svg" },
  {
    name: "Vercel Blob",
    Icon: asset("skills/vercel-blob-dark.svg"),
  },
  {
    name: "Azure Blob",
    Icon: asset("skills/azure-blob-dark.svg"),
  },
  {
    name: "FFmpeg",
    Icon: asset("skills/ffmpeg.svg"),
  },
  {
    name: "FFmpeg WASM",
    Icon: asset("skills/ffmpeg-wasm.svg"),
  },
  { name: "Gemini", Icon: "https://svgl.app/library/gemini.svg" },
  {
    name: "ChatGPT",
    Icon: asset("skills/chatgpt-dark.svg"),
  },
  { name: "Claude", Icon: "https://svgl.app/library/claude-ai-icon.svg" },
  { name: "Firebase Studio", Icon: "https://svgl.app/library/firebase-studio.svg" },
  { name: "MCP", Icon: "https://svgl.app/library/model-context-protocol-dark.svg" },
  { name: "Perplexity", Icon: "https://svgl.app/library/perplexity.svg" },
  { name: "Grok", Icon: "https://svgl.app/library/grok-dark.svg" },
  { name: "Ollama", Icon: "https://svgl.app/library/ollama_dark.svg" },
  {
    name: "ElevenLabs",
    Icon: asset("skills/eleven-labs-dark.svg"),
  },
  { name: "Auth0", Icon: "https://svgl.app/library/auth0.svg" },
  { name: "Authy", Icon: "https://svgl.app/library/authy.svg" },
  { name: "JWT", Icon: "https://svgl.app/library/jwt.svg" },
  { name: "Auth.js", Icon: "https://svgl.app/library/authjs.svg" },
  {
    name: "Passport.js",
    Icon: asset("skills/passport-js-dark.svg"),
  },
  { name: "Vitest", Icon: "https://svgl.app/library/vitest.svg" },
  { name: "Jest", Icon: "https://svgl.app/library/jest.svg" },
  {
    name: "happy-dom",
    Icon: asset("skills/happy-dom.svg"),
  },
  {
    name: "jsdom",
    Icon: asset("skills/jsdom.svg"),
  },
  { name: "Kotlin", Icon: "/icons/kotlin.svg" },
  { name: "Rust", Icon: "/icons/rust.svg" },
  { name: "Android", Icon: "/icons/android.svg" },
  { name: "Tauri", Icon: "/icons/tauri.svg" },
  { name: "Convex", Icon: "/icons/convex.svg" },
  { name: "Neon", Icon: "/icons/neon.svg" },
  { name: "Zod", Icon: "/icons/zod.svg" },
  { name: "GSAP", Icon: "/icons/gsap.svg" },
  { name: "Better Auth", Icon: "/icons/betterauth.svg" },
  { name: "Playwright", Icon: "" },
  { name: "Testing Library", Icon: "/icons/testinglibrary.svg" },
  { name: "Sentry", Icon: "/icons/sentry.svg" },
  { name: "Vercel", Icon: "/icons/vercel.svg" },
  { name: "GitHub Actions", Icon: "/icons/githubactions.svg" },
  { name: "Spotify", Icon: "/icons/spotify.svg" },
  { name: "Claude Code", Icon: "https://svgl.app/library/claude-ai-icon.svg" },
];
