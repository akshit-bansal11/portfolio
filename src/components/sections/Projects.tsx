/*
 * Projects.tsx
 * Home-page Projects section.
 * Shows every project from projectsData in a
 * responsive grid.
 */

import ProjectCard from "@/components/cards/ProjectCard";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import { projects } from "@/data/projectsData";

// Top-level Projects section component.
export default function Projects() {
  return (
    <ScrollSection id="projects">
      {/* Section heading. */}
      <div className="mb-4">
        <ScrollSectionHeading heading="projects" />
      </div>
      {/* All projects. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </ScrollSection>
  );
}
