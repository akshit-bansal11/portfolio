/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { animate } from 'animejs';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiGithub } from 'react-icons/fi';
import { FaExternalLinkAlt, FaFigma } from 'react-icons/fa';
import Image, { StaticImageData } from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string | StaticImageData;
  demoLink?: string;
  designLink?: string;
  githubLink?: string;
  techStack?: string[];
}

export default function ProjectCard({
  title,
  description,
  image,
  demoLink,
  designLink,
  githubLink,
  techStack = [],
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-lg"
    >
      <Card
        onMouseEnter={(e) => {
          // Animate badges
          const badges = e.currentTarget.querySelectorAll('.project-badge');
          if (badges.length) {
            animate(badges, {
              translateY: [-5, 0],
              opacity: [0.5, 1], // subtle flash
              delay: (_el: any, i: number) => i * 50,
              easing: 'easeOutElastic(1, .8)',
              duration: 600
            });
          }
        }}
        className="group overflow-hidden border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50"
      >
        <div className="relative overflow-hidden border-b border-neutral-800 aspect-video">
          <Image
            src={image}
            alt={`${title} preview`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardHeader className="space-y-2">
          <CardTitle className="font-clash text-2xl tracking-wide text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-neutral-400 line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="project-badge bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-3 pt-0">
          {demoLink || githubLink || designLink ? (
            <>
              {demoLink && (
                <Button asChild size="sm" className="bg-white text-black hover:bg-neutral-200">
                  <a href={demoLink} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt className="mr-2 h-3 w-3" /> Demo
                  </a>
                </Button>
              )}
              {githubLink && (
                <Button asChild size="sm" variant="outline" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white">
                  <a href={githubLink} target="_blank" rel="noopener noreferrer">
                    <FiGithub className="mr-2 h-4 w-4" /> GitHub
                  </a>
                </Button>
              )}
              {designLink && (
                <Button asChild size="sm" variant="outline" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white">
                  <a href={designLink} target="_blank" rel="noopener noreferrer">
                    <FaFigma className="mr-2 h-4 w-4" /> Design
                  </a>
                </Button>
              )}
            </>
          ) : (
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500/80">
              * Private Project
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
