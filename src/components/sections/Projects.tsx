"use client";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import ScrollSection from '@/components/ui/common/sections/ScrollSection';
import ScrollSectionHeading from '@/components/ui/common/headings/ScrollSectionHeading';
import ProjectCard from '@/components/ui/common/cards/ProjectCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { projects } from '@/data/projectsData';

export default function Projects() {
    return (
        <ScrollSection id="projects">
            <div className="flex w-full items-center justify-between gap-4 mb-4">
                <ScrollSectionHeading heading="projects" />
                <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-800" asChild>
                    <Link href="/projects">
                        See More <GoArrowUpRight className="ml-2" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {projects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>
        </ScrollSection>
    );
}
