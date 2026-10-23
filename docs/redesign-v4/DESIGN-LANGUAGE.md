# Redesign v4: design language

The owner approved the hero, Projects and Experience on branch `redesign/v4`. Every other section must look like it belongs on the same whiteboard. Read this before touching any section.

## Idea

A creative developer's whiteboard: typed text and handwriting side by side, things pinned and taped to the board, hand-drawn strokes that draw themselves. One design in light and dark; only token colours change. Never hide or add an element per theme.

## Ground

- Page background: dot-grid whiteboard (`--hero-bg` + `--grid` dots, set on `body`). Sections sit directly on it. No section background boxes, no gradients behind sections.

## Type

| Role | Utility | Notes |
| --- | --- | --- |
| Section headings (h2), card titles | `font-display` (Clash Display) | weight 500 only, letter-spacing no tighter than -0.01em |
| UI text, labels, buttons, body | `font-grotesk` (Space Grotesk) | 400–600 |
| Handwritten notes, asides, margin labels | `font-hand` (Caveat) | 600–700, colour `--hero-pen` (or `--hero-muted` for quiet labels) |

Section header pattern (see `src/components/sections/Projects.tsx`): typed h2 + a handwritten aside with a small drawn arrow (`DrawnPath` + `sketchArrow`).

## Colour tokens (src/app/globals.css)

- Ground and text: `--hero-bg`, `--hero-ink`, `--hero-muted`, `--hero-pen` (marker yellow/orange), `--hero-surface`.
- Doodles and accents: `--doodle-1..3` (indigo, rose, amber).
- Paper that follows the theme (index cards, pages): `--page-bg`, `--page-ink`, `--page-muted`, `--page-border`, `--card-rule`, `--card-margin`.
- Paper that never changes (sticky notes, polaroid): `--note-1..4`, `--paper-card`. Use only for sticky notes and photo prints.
- Projects screenshot frame: `--print-frame`.
- New colours: add a token to the FIRST `:root` block (dark value) and override in the existing `html[data-theme="light"]` block. Never hard-code a colour twice.

## Building blocks (reuse, never re-implement)

- `DrawnPath` (src/components/blog/Annotation.tsx) and `sketchLine/Rect/Ellipse/Arrow` (src/lib/blog/sketch.ts, deterministic seeds) for every hand-drawn stroke.
- Tape (shared component used by ProfilePhoto / BeliefsBoard / ProjectCard) for anything pinned.
- `Stamp` (src/components/hero/elements/Stamp.tsx): hand-bordered label; `onPaper` variant on page-coloured cards.
- `TechIcon` (src/components/icons/TechIcon.tsx): custom line icons for technologies; unknown names fall back to a generic mark. Add new icons there in the same style (24×24, stroke 1.75, round caps, 2–5 paths, recognisable simplified marks, not brand copies).
- CSS hand-drawn borders: `.hand-border`, `.hand-border-alt`, `.hand-border-morph` (irregular border-radius). Buttons follow `ResumeButton` (filled) or its outline variant on Projects cards.
- Index cards: `src/components/experience/ExperienceCard.tsx`. Sticky notes: `BeliefsBoard`. Pinned prints: `ProjectCard`.

## Motion

- Micro: cards straighten from a small deterministic tilt (-2..2deg) and lift 3–4px on hover/focus-within; strokes draw in once on view; small pops.
- Macro: strokes or lines tied to scroll progress (framer-motion `useScroll`), as in the Experience timeline.
- Transform and opacity only. No blur, glow, backdrop-filter or heavy shadows (one soft paper shadow token). It must stay smooth on phones and browsers without GPU acceleration.
- `prefers-reduced-motion`: everything in its final state, no movement, no autoplay.

## Rules

- Accessibility: semantic headings (h2 per section, h3 per card), lists as `ol`/`ul`, real buttons and links, focus-visible, keyboard operable, 44px targets, decorative SVG `aria-hidden`, alt text on images, contrast at least 4.5:1 for text.
- Phones first: no horizontal overflow at 390px.
- Never invent facts, numbers or quotes. Use only what the data files contain.
- Code: no `any`, no `as` casts to silence types, no lint suppressions, no `console.log`, no dead code, no setState synchronously in `useEffect`, no new npm dependencies. Stylelint: alpha as %, range media queries, lowercase keywords, no duplicate selectors, no redundant shorthand values.
- Local machine: never run npm, npx, node, builds or dev servers. CI checks after push.
