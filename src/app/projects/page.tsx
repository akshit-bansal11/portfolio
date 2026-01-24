"use client";
import React from 'react'
import { motion } from 'framer-motion'
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from '@/components/ui/common/cards/ProjectCard'
import ProjectCardSmall from '@/components/ui/common/cards/ProjectCardSmall'
import ProjectCardSmallWimg from '@/components/ui/common/cards/ProjectCardSmallWimg'
import { allProjects } from '@/data/allProjectsData'
import { DetailedProjectItem } from '@/types';

const sectionMotion = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
}

function renderProjectCards(projects: DetailedProjectItem[], layout: string) {
    return (
        <motion.div
            initial={sectionMotion.initial}
            animate={sectionMotion.animate}
            className={layout}
        >
            {projects.map((project: DetailedProjectItem, idx: number) => {
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
        <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-16">
            <div className="max-w-7xl mx-auto space-y-24">
                {/* Header & Controls */}
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-6">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit group"
                            >
                                <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
                                Back to Home
                            </Link>

                            <div className="space-y-4">
                                <motion.h1
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "text-5xl md:text-7xl font-bold",
                                        "bg-gradient-to-r from-white via-neutral-400 to-neutral-600",
                                        "bg-clip-text text-transparent"
                                    )}
                                >
                                    Featured Projects
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-neutral-500 max-w-2xl text-lg"
                                >
                                    A collection of web applications, tools, and experiments built with modern technologies.
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-32">
                    {sectionConfigs.map(({ id, heading, layout, dataKey }, index) => (
                        <ScrollReveal key={id} delay={index * 100} className="w-full">
                            <section
                                id={id}
                                className="space-y-8 scroll-mt-32"
                            >
                                <h2 className="text-xl md:text-2xl font-light tracking-tight text-neutral-300">
                                    {heading}
                                </h2>
                                {renderProjectCards(allProjects[dataKey], layout)}
                            </section>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Projects