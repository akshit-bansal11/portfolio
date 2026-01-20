"use client";
import React from 'react'
import { motion } from 'framer-motion'
import ScrollSection from '@/components/ui/common/sections/ScrollSection'
import ProjectCard from '@/components/ui/common/cards/ProjectCard'
import ProjectCardSmall from '@/components/ui/common/cards/ProjectCardSmall'
import ProjectCardSmallWimg from '@/components/ui/common/cards/ProjectCardSmallWimg'
import ScrollSectionHeading from '@/components/ui/common/headings/ScrollSectionHeading'
import { allProjects } from '@/data/allProjectsData'

const sectionMotion = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
}

function renderProjectCards(projects: any[], layout: string) {
    return (
        <motion.div
            initial={sectionMotion.initial}
            animate={sectionMotion.animate}
            className={layout}
        >
            {projects.map((project: any, idx: number) => {
                switch (project.type) {
                    case 'large':
                        return <ProjectCard key={idx} {...project} />
                    case 'small':
                        return <ProjectCardSmall key={idx} {...project} />
                    case 'smallWimg':
                        return <ProjectCardSmallWimg key={idx} {...project} />
                    default:
                        // Fallback if needed, or stick to a default card
                        return <ProjectCardSmall key={idx} {...project} />
                }
            })}
        </motion.div>
    )
}

type ProjectCategory = keyof typeof allProjects

const sectionConfigs: {
    id: string
    heading: string
    layout: string
    dataKey: ProjectCategory
}[] = [
    {
        id: 'websites',
        heading: 'websites',
        // Updated layout to use specific grid cols for better responsiveness
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center',
        dataKey: 'websites'
    },
    {
        id: 'games',
        heading: 'games',
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center',
        dataKey: 'games'
    },
    {
        id: 'tools',
        heading: 'tools',
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center',
        dataKey: 'tools'
    },
    {
        id: 'designs',
        heading: 'designs',
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center',
        dataKey: 'designs'
    },
    {
        id: 'scripts',
        heading: 'scripts',
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center',
        dataKey: 'scripts'
    }
]

function Projects() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-20">
            {sectionConfigs.map(({ id, heading, layout, dataKey }) => (
                <ScrollSection id={id} key={id}>
                    <div className="flex w-full mb-8"><ScrollSectionHeading heading={heading} /></div>
                    {renderProjectCards(allProjects[dataKey], layout)}
                </ScrollSection>
            ))}
        </div>
    )
}

export default Projects