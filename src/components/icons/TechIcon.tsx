/*
 * TechIcon.tsx
 * Custom line icons for technologies and tools, in the hero's drawing language: a 24 x 24
 * grid, no fill, 1.75 round-cap strokes in currentColor. They are simplified marks, not
 * brand logos. Decorative: always sits next to a visible label, so it is aria-hidden.
 * Unknown names fall back to a "code brackets" icon.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const HEXAGON = "M12 2.5l8.5 5v9l-8.5 5-8.5-5v-9z";
const CYLINDER =
  "M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6 M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3";

const code = <path d="M8 7l-5 5 5 5 M16 7l5 5-5 5 M13.5 5l-3 14" />;
const merge = <path d="M4 5l6 5v4 M20 5l-6 5v4 M12 14v6 M9.5 17.5L12 20l2.5-2.5" />;
const database = <path d={CYLINDER} />;
const flask = (
  <path d="M9 3h6 M10 3v6l-5 10a1.5 1.5 0 0 0 1.4 2h11.2A1.5 1.5 0 0 0 19 19L14 9V3 M8 15h8" />
);
const lock = <path d="M5 11h14v9H5z M8 11V8a4 4 0 0 1 8 0v3 M12 15v2" />;
const wasm = (
  <>
    <path d="M3.5 3.5h17v17h-17z" />
    <path d="M6.5 9l1.8 6 1.7-4.5 1.7 4.5 1.8-6 M17 9v6" />
  </>
);

// Keyed by the name used in the project and skill data (also the lookup for TECH_ICON_NAMES).
const ICONS: Record<string, ReactNode> = {
  React: (
    <>
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <path d="M12 11.6v.8" />
    </>
  ),
  Rust: (
    <>
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M19 5l-2 2 M7 17l-2 2" />
      <path d="M10 15v-6h2.5a1.7 1.7 0 0 1 0 3.4H10 M12.5 12.4L14 15" />
    </>
  ),
  TypeScript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M6.5 10h5 M9 10v7 M17.5 10.2c-.5-.4-3.5-.8-3.5 1s3.5.7 3.5 2.6-3 1.5-3.7.9" />
    </>
  ),
  JavaScript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M11.5 9v6.2a1.7 1.7 0 0 1-3.2.8 M17.5 10.2c-.5-.4-3.5-.8-3.5 1s3.5.7 3.5 2.6-3 1.5-3.7.9" />
    </>
  ),
  "Next.js": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 16V8l6.5 8.5 M15 8v5" />
    </>
  ),
  Tauri: (
    <>
      <circle cx="8.5" cy="8.5" r="3" />
      <circle cx="15.5" cy="15.5" r="3" />
      <path d="M12 6a6.5 6.5 0 0 1 6 6 M12 18a6.5 6.5 0 0 1-6-6" />
    </>
  ),
  Kotlin: (
    <>
      <path d="M4 4h16L4 20z" />
      <path d="M7.5 8v6 M7.5 11l3-3 M7.5 11l3 3" />
    </>
  ),
  "C#": (
    <>
      <path d={HEXAGON} />
      <path d="M10 8.5l-1 7 M14 8.5l-1 7 M8 10.5h8 M7.8 13.5h8" />
    </>
  ),
  ".NET": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="5" />
      <path d="M7 16h.01 M10 16V9l5 7V9" />
    </>
  ),
  Swift: <path d="M20 6c-4 4-9 7-14 8 M4 16c4 3 11 3 16-2 M7 9c3 3 7 6 9 8 M20 6c1 4 0 8-3 11" />,
  Slint: <path d="M12 3l9 4.5-9 4.5-9-4.5z M3 12l9 4.5 9-4.5 M3 16.5l9 4.5 9-4.5" />,
  "Node.js": (
    <>
      <path d={HEXAGON} />
      <path d="M9.5 15v-5l5 5v-5" />
    </>
  ),
  Convex: merge,
  Yjs: merge,
  CRDT: merge,
  Zustand: (
    <>
      <circle cx="12" cy="13.5" r="7" />
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="18" cy="6.5" r="2.5" />
      <path d="M9.5 12.5h.01 M14.5 12.5h.01 M11 16h2" />
    </>
  ),
  WebAssembly: wasm,
  "FFmpeg WASM": wasm,
  FFmpeg: <path d="M3 4h18v16H3z M8 4v16 M16 4v16 M3 9h5 M3 15h5 M16 9h5 M16 15h5" />,
  SQL: database,
  PostgreSQL: database,
  MySQL: database,
  MongoDB: database,
  Redis: database,
  Firestore: database,
  Firebase: database,
  Supabase: database,
  Upstash: database,
  Neon: <path d="M13 3L6 13h5l-1 8 7-10h-5z" />,
  "Drizzle ORM": (
    <path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3z M10 14a2.2 2.2 0 0 0 2 2" />
  ),
  Direct2D: <path d="M3 4h18v16H3z M3 12h18 M12 4v16" />,
  Win32: <path d="M3 4h18v16H3z M3 9h18 M6 6.5h.01 M9 6.5h.01" />,
  "Claude Code": <path d="M4 6l5 5-5 5 M11 18h5 M18 3v4 M16 5h4" />,
  "Tailwind CSS": <path d="M3 10c2-4 5-4 7-2s5 2 7-2 M3 17c2-4 5-4 7-2s5 2 7-2" />,
  Android: <path d="M6 16v-6a6 6 0 0 1 12 0v6z M9 6L8 3 M15 6l1-3 M9.5 11h.01 M14.5 11h.01" />,
  Git: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="9" r="2" />
      <path d="M6 7v10 M18 11c0 4-6 3-12 6" />
    </>
  ),
  Vercel: <path d="M12 4l9 16H3z" />,
  Zod: <path d="M5 5h14L5 19h14" />,
  Vitest: flask,
  Jest: flask,
  Playwright: flask,
  "Testing Library": flask,
  jsdom: flask,
  "happy-dom": flask,
  JWT: lock,
  Auth0: lock,
  "Auth.js": lock,
  "Better Auth": lock,
  Authy: lock,
  GSAP: <path d="M3 18c4-14 14 0 18-12 M16 6h5v5" />,
  Motion: <path d="M3 18c4-14 14 0 18-12 M16 6h5v5" />,
  Go: (
    <>
      <circle cx="15" cy="12" r="6" />
      <path d="M2 9.5h6 M3.5 14.5h4.5 M15 10v4" />
    </>
  ),
  Python: (
    <path d="M9 3h4a3 3 0 0 1 3 3v4H8a3 3 0 0 0-3 3v1 M15 21h-4a3 3 0 0 1-3-3v-4h8a3 3 0 0 0 3-3v-1 M9.5 6h.01 M14.5 18h.01" />
  ),
  C: <path d="M17 7.5a6.5 6.5 0 1 0 0 9" />,
  "C++": <path d="M12 8a5 5 0 1 0 0 8 M16 12h4 M18 10v4 M21.5 12h.01" />,
  Bun: (
    <path d="M12 4c5 0 9 3 9 8s-4 8-9 8-9-3-9-8 4-8 9-8z M9 12h.01 M15 12h.01 M10.5 15.5c1 .8 2 .8 3 0" />
  ),
  npm: <path d="M3 7h18v10H3z M7 17v-7h4v7 M15 17v-7h2v7" />,
  pnpm: (
    <path d="M3 4h5v5H3z M9.5 4h5v5h-5z M16 4h5v5h-5z M3 11h5v5H3z M9.5 11h5v5h-5z M16 18h5v-5" />
  ),
  Express: <path d="M3 8l6 8 M9 8l-6 8 M14 8v8 M14 8h7 M14 12h5 M14 16h7" />,
  Figma: (
    <>
      <path d="M9 3a3 3 0 0 0 0 6h3V3z M12 3h3a3 3 0 0 1 0 6h-3z M9 9a3 3 0 0 0 0 6h3V9z" />
      <circle cx="15" cy="12" r="3" />
      <path d="M9 15a3 3 0 1 0 3 3v-3z" />
    </>
  ),
  Sentry: <path d="M12 4l8 14h-5c0-4-2-7-5-8 M3 18h4c0-2-1-3-2.5-3.5" />,
  "GitHub Actions": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l5 3.5-5 3.5z" />
    </>
  ),
  Shadcn: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 7.5L7.5 16 M17 12l-5 5" />
    </>
  ),
  "Radix UI": (
    <>
      <circle cx="15" cy="7.5" r="3.5" />
      <path d="M7 4v16 M10.5 20h8l-4-6.5z" />
    </>
  ),
  HTML5: <path d="M4 3h16l-1.5 16.5L12 21.5l-6.5-2z M8 8h8l-.5 5-3.5 1-3.5-1" />,
  CSS3: <path d="M4 3h16l-1.5 16.5L12 21.5l-6.5-2z M16 8H8.5l.4 4h6.2l-.4 3.5-2.7.8-2.7-.8" />,
  SVG: (
    <>
      <path d="M3 15h3v3H3z M18 15h3v3h-3z M10.5 4.5h3v3h-3z" />
      <path d="M5 15c1-6 4-7.5 7-7.5 M19 15c-1-6-4-7.5-7-7.5" />
    </>
  ),
  MCP: <path d="M9 3v5 M15 3v5 M6 8h12v4a6 6 0 0 1-12 0z M12 18v3" />,
  Spotify: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7 9.5c3.5-1 7-.7 10 1 M7.5 12.8c3-.8 6-.5 8.5 1 M8 16c2.5-.6 5-.3 7 .8" />
    </>
  ),
};

/** Every name with a dedicated icon. */
export const TECH_ICON_NAMES: readonly string[] = Object.keys(ICONS);

interface TechIconProps {
  name: string;
  className?: string;
}

// Renders the icon for `name`, or code brackets when there is none.
export default function TechIcon({ name, className }: TechIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 shrink-0", className)}
    >
      {ICONS[name] ?? code}
    </svg>
  );
}
