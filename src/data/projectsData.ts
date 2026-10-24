/*
 * projectsData.ts
 * Source-of-truth for the home-page Projects section.
 * A flat, ordered list: no categories and no separate
 * /projects page; every entry renders in the section grid.
 */

import { asset } from "@/config/assets";
import type { ProjectItem } from "@/types/project";

// Ordered project entries, rendered top-to-bottom in the grid.
export const projects: ProjectItem[] = [
  {
    title: "Kiteloom",
    notes: [
      "in development",
      "real-time multiplayer on Yjs",
      "70+ unit test files, 11 languages",
    ],
    description:
      "Real-time collaborative whiteboard in the browser. An infinite canvas with shapes, text and images, live cursors synced over WebSockets with Yjs CRDTs, and no account needed to join a room.",
    imgUrl: asset("projects/kiteloom/preview.svg"),
    logoUrl: asset("projects/kiteloom/logo.svg"),
    videoUrl: asset("projects/kiteloom/demo.mp4"),
    techStack: ["Next.js", "TypeScript", "Yjs", "Zustand", "Convex"],
    siteLink: "https://kiteloom.com",
    isPublic: false,
  },
  {
    title: "Edgepad",
    notes: ["26 stars, 4 forks, 258 downloads", "300+ tests"],
    description:
      "Turns an Android phone into a Bluetooth trackpad, media remote and control panel for a Windows laptop or a Mac. Corner dials, multi-finger gestures, an on-screen keyboard and a gamepad. No account, no server, no telemetry.",
    imgUrl: asset("projects/edgepad/preview.svg"),
    logoUrl: asset("projects/edgepad/logo.svg"),
    videoUrl: asset("projects/edgepad/demo.mp4"),
    techStack: ["Kotlin", "C#", ".NET", "Swift"],
    siteLink: "https://edgepad.akshitbansal.dev",
    githubLink: "https://github.com/akshit-bansal11/edgepad",
    isPublic: true,
  },
  {
    title: "Saltcellar",
    notes: ["AES-256-GCM + Argon2id", "zero network code"],
    description:
      "A local-only encrypted vault for passwords, environment keys and backup codes on Windows, macOS and Linux. AES-256-GCM under an Argon2id-derived key, a desktop app and a CLI, and no network code at all.",
    imgUrl: asset("projects/saltcellar/preview.png"),
    logoUrl: asset("projects/saltcellar/logo.svg"),
    videoUrl: asset("projects/saltcellar/demo.mp4"),
    techStack: ["Rust", "Tauri", "TypeScript"],
    siteLink: "https://saltcellar.akshitbansal.dev",
    githubLink: "https://github.com/akshit-bansal11/saltcellar",
    isPublic: true,
  },
   {
    title: "Offkit",
    notes: ["37 local-first tools", "800+ tests"],
    description:
      "A native desktop app for Windows, macOS and Linux, plus a web app, with 37 file tools for images, video, audio, PDFs, SVG, colors and text. Everything runs on your device: nothing is uploaded, and there is no account and no telemetry.",
    imgUrl: asset("projects/offkit/preview.png"),
    logoUrl: asset("projects/offkit/logo.svg"),
    videoUrl: asset("projects/offkit/demo.mp4"),
    techStack: ["Next.js", "TypeScript", "Rust", "Slint", "FFmpeg WASM"],
    githubLink: "https://github.com/akshit-bansal11/offkit",
    isPublic: true,
  },
  {
    title: "Inlay",
    notes: ["~54 MB RAM", "130+ tests"],
    description:
      "Live widgets set into the Windows 11 desktop: a clock, a Spotify spectrum visualizer, word-synced lyrics and a player, drawn behind the desktop icons by one small native app. A light alternative to Rainmeter.",
    imgUrl: asset("projects/inlay/preview.png"),
    logoUrl: asset("projects/inlay/logo.svg"),
    videoUrl: asset("projects/inlay/demo.mp4"),
    techStack: ["Rust", "Direct2D"],
    siteLink: "https://inlay.akshitbansal.dev",
    githubLink: "https://github.com/akshit-bansal11/inlay",
    isPublic: true,
  },
 {
    title: "Inklo",
    notes: ["140+ tests", "zero network code"],
    description:
      "A fully local, keyboard-first notes app for Windows. Notes are plain .md and .txt files in a folder you choose, every action is a rebindable command, and there is no network code.",
    imgUrl: asset("projects/keyslate/preview.png"),
    logoUrl: asset("projects/keyslate/logo.svg"),
    videoUrl: asset("projects/keyslate/demo.mp4"),
    techStack: ["Rust", "Tauri", "React", "TypeScript"],
    githubLink: "https://github.com/akshit-bansal11/inklo",
    isPublic: true,
  },
  {
    title: "Lorestep",
    description:
      "Story-order tracker for connected franchises: what to play, watch and read, in in-universe chronological order. 126 game franchises and 6 film and series chronologies, with progress kept in the browser and no account.",
    imgUrl: asset("projects/lorestep/preview.png"),
    logoUrl: asset("projects/lorestep/logo.svg"),
    videoUrl: asset("projects/lorestep/demo.mp4"),
    techStack: ["Next.js", "TypeScript", "Drizzle ORM", "Neon"],
    siteLink: "https://lorestep.akshitbansal.dev",
    githubLink: "https://github.com/akshit-bansal11/lorestep",
    isPublic: true,
  },
  {
    title: "Plimsoll",
    notes: ["a Claude Code HUD plugin"],
    description:
      "A heads-up display for Claude Code, drawn above the prompt: context-window fill, rate-limit windows, token cost, usage stats and git status, plus a small ASCII mascot.",
    imgUrl: asset("projects/plimsoll/preview.png"),
    logoUrl: asset("projects/plimsoll/logo.svg"),
    videoUrl: asset("projects/plimsoll/demo.mp4"),
    techStack: ["TypeScript", "Node.js"],
    siteLink: "https://plimsoll.akshitbansal.dev",
    githubLink: "https://github.com/akshit-bansal11/plimsoll",
    isPublic: true,
  },
];
