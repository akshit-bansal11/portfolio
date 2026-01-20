"use client";
import React from 'react';
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

interface ProjectCardTextProps {
  title: string;
  description: string;
  githubLink?: string;
  techStack?: string[];
}

export default function ProjectCardSmallWimg({ title, description, githubLink, techStack = [] }: ProjectCardTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="group border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50 h-full flex flex-col">
        <CardHeader className="space-y-2 p-6 pb-2">
          <CardTitle className="font-clash text-xl tracking-wide text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-neutral-400 text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4 flex-grow">
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent text-[10px] px-2"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          {githubLink && (
            <Button asChild size="sm" variant="outline" className="h-8 text-xs border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white w-full">
              <a href={githubLink} target="_blank" rel="noopener noreferrer">
                <FiGithub className="mr-1.5 h-3 w-3" /> GitHub
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
