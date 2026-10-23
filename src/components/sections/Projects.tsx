/*
 * Projects.tsx
 * Home-page Projects section, laid out as a whiteboard: a typed heading with a
 * handwritten aside, the first project (Kiteloom, the owner's own product) as a
 * full-width featured card, and the rest as a board of pinned screenshot cards.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import ScrollSection from "@/components/layout/ScrollSection";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projectsData";
import { sketchArrow } from "@/lib/blog/sketch";

// Small arrow from the handwritten aside toward the heading.
const ASIDE_ARROW = sketchArrow(46, 6, 4, 22, { seed: 61, curve: 0.3, headSize: 7 });

// Top-level Projects section component.
export default function Projects() {
  const [featured, ...board] = projects;

  return (
    <ScrollSection id="projects" className="gap-10 md:gap-12 lg:gap-14">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <h2 className="font-display text-5xl font-medium tracking-[-0.01em] text-hero-ink md:text-6xl lg:text-7xl">
          Projects
        </h2>
        <p className="flex items-center gap-1 pb-2 font-hand text-3xl font-semibold leading-none text-hero-pen">
          <svg aria-hidden viewBox="0 0 50 30" className="h-7 w-12 shrink-0 overflow-visible">
            <DrawnPath d={ASIDE_ARROW.shaft} duration={0.5} />
            <DrawnPath d={ASIDE_ARROW.head} delay={0.5} duration={0.2} />
          </svg>
          things I&apos;ve built
        </p>
      </div>
      {featured && <ProjectCard project={featured} index={0} featured />}
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {board.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </ScrollSection>
  );
}
