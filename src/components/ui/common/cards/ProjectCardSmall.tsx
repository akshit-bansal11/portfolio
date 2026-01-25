"use client";
import Image from 'next/image';
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
import { FaExternalLinkAlt } from 'react-icons/fa';


interface ProjectCardSmallProps {
  title: string;
  description: string;
  GDriveID?: string;
  iframe?: string;
  demoLink?: string;
  githubLink?: string;
  techStack?: string[];
}

export default function ProjectCardSmall({
  title,
  description,
  GDriveID,
  iframe,
  demoLink,
  githubLink,
  techStack = [],
}: ProjectCardSmallProps) {
  // Construct the URL if GDriveID is present
  const imageUrl = GDriveID
    ? `https://lh3.googleusercontent.com/d/${GDriveID}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="group overflow-hidden border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50 h-full flex flex-col">
        {/* Render image container if we have an image or iframe */}
        {(imageUrl || iframe) && (
          <div className="relative overflow-hidden border-b border-neutral-800 h-48">
            {iframe ? (
              <iframe
                src={iframe}
                title={`${title} preview`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                allowFullScreen
              />
            ) : (
              <Image
                src={imageUrl!}
                alt={`${title} preview`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        )}

        <CardHeader className="space-y-2 p-5">
          <CardTitle className="font-clash text-xl tracking-wide text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-neutral-400 text-sm line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-0 flex-grow">
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

        <CardFooter className="gap-2 p-5">
          {demoLink && (
            <Button asChild size="sm" className="h-8 text-xs bg-white text-black hover:bg-neutral-200">
              <a href={demoLink} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt className="mr-1.5 h-3 w-3" /> Demo
              </a>
            </Button>
          )}
          {githubLink && (
            <Button asChild size="sm" variant="outline" className="h-8 text-xs border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white">
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
