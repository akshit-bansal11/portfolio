---
name: write-tutorial
description: Use when adding or editing a tutorial on this portfolio (/tutorials/<slug>). Holds the owner's content, design, DIY, troubleshooting and PDF rules for every tutorial.
---

# Writing a tutorial

Tutorials are hands-on notes, not blog essays. The reader finishes with something running on their own machine. The first one, `src/content/tutorials/docker-kubernetes-vms.mdx`, is the reference for tone, depth and structure.

## What the owner asked for

Hold every tutorial to this. Reasons are given so the rule survives later edits.

**Content**
- The reader should get the full story without reading much. Points over paragraphs, tables (`Compare`) for any X-vs-Y, a diagram for any mechanism. Paragraphs only for the one sentence of "why". Never say the same thing twice (e.g. a logo card and a TLDR repeating each other).
- Detailed, typed notes on what is actually useful in today's dev market. No filler, no history lessons, nothing kept only for completeness. If a working developer would not use it, cut it.
- Detailed but to the point, in simple language. Explain each idea with a real-life reference or example before the jargon.
- Say what to skip as well as what to learn. Mark things that are outdated or retired.
- Never invent a statistic, benchmark, quote, case study or version number. Check versions and retirements with a web search on the day you write. Prefer commands that do not pin a version that will go stale.

**Visuals**
- Full width, unlike the blog: text, diagrams, grids, widgets and code all span the column.
- True black background with white text, or the inverse, following light or dark mode (tutorials override the blog's paper tones). Colour goes in the diagrams, terms, callouts and code, not the page.
- Tutorials have their own palette, separate from the blog: tones `blue violet green amber pink cyan red` plus brand-ish `docker k8s vm` and `term`, defined in `tutorials.css` for both themes. Coloured boxes use `bg-(image:--tone-fill)` and `tut-glow` (glows in dark mode only).
- Bold text renders as a key term in the term colour. Use `<Term def="...">` for terms worth a hover definition.
- Callout kinds: `note`, `insight`, `important`, `tip`, `warn`, `real-world`. Use them to break up long prose.
- Show the tools' logos (`<Logo tech>` / `<LogoRow>`; react-icons `si`) at the top and at each tool's section.
- Coloured diagrams, flowcharts, arrows and icons. Diagrams show the real mechanism and are not decoration.
- Draw diagrams in MDX with the HTML kit in `Diagram.tsx`: `Diagram` (canvas + caption), `Group` (titled region, `cols`, `dashed` for boundaries like a VM or network), `Node` (icon or `tech` logo, title, note), `Row` and `Link` (labelled arrow; `dir="right"` inside rows, `"both"` for two-way). Nest Groups to show "runs inside". Do not hand-draw SVG with fixed coordinates: text shrinks or balloons at full width.
- Code blocks look like a real IDE: title bar, file name, line numbers, syntax colours, copy button.
- Make it interactive where that teaches something a static picture cannot, such as a simulator the reader can break, a state machine, a step-through or a decision tree. Do not add interaction for show.
- Add a `<Quiz>` self-check after each hard idea, and a `FeatureGrid` where several parts work together.

**Content sources**
- Check topic coverage against the matching roadmap.sh roadmap (`kamranahmedse/developer-roadmap`, `src/data/roadmaps/<name>/content`; roadmap.sh itself may be blocked from cloud sessions, the GitHub repo is not). Cover the core topics, list the rest as "learn next" in a roadmap checklist.

**DIY walkthrough (required)**
- A full walkthrough the reader completes on their own machine, covering Windows, macOS and Linux with `Tabs group="os"`.
- Each step says what to run and ends with a `checkpoint` stating what they should see.
- End with a cleanup step that removes everything the tutorial created.

**Troubleshooting (required)**
- Every step that can fail gets troubleshooting: the exact error text as the symptom, then the cause, then the fix commands.
- Cover install, permissions, ports, networking, architecture mismatch and disk space where relevant.

**PDF (required)**
- The notes must download as a PDF in dark or light mode. `DownloadPdf` already does this on the page.

## How to build one

1. Add an entry to `src/data/tutorials.ts`. The home section and routes pick it up from there.
2. Write `src/content/tutorials/<slug>.mdx`. The kit is available without imports; see `src/components/tutorials/mdxComponents.tsx` for the components and their props.
3. Start a code block's first line with `# file: name` or `// file: name` to put the file name in the IDE title bar. The line is stripped from the display.
4. Put post-specific diagrams and simulators in `src/components/tutorials/<slug>/` and import them in the MDX.
5. Use Conventional Commits and let CI run the gate, as the global rules require.

## Rules that keep the PDF working

The PDF comes from `window.print()`, so anything missing from the printed DOM is missing from the PDF.

- Render diagrams on the server or SSR them. Never use `dynamic(..., { ssr: false })`, `ScrollReveal` or `DrawnPath` here: content that appears on scroll prints blank.
- Motion is CSS only, inside `@media screen`, and honours reduced motion.
- Every interactive widget must print a useful static state.
- Colours come from `data-tone` and the tokens in `src/app/tutorials/tutorials.css`, which define both themes. Never hardcode a hex in a component, or one PDF mode breaks.

## Verify before calling it done

- Every DIY command must run. Add the walkthrough to `.github/workflows/tutorial-smoke.yml`, which rebuilds the `# file:` blocks from the MDX and runs them on CI, so the published text is what gets tested.
- State what CI could not exercise, such as Windows or macOS installers, in the final report. A clean run covers only what ran.
- Never build or run the site on the owner's laptop; it crashes under load. CI, or a cloud session's container, is the gate.
