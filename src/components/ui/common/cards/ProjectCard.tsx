/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

import { motion, AnimatePresence } from 'framer-motion';
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
import { FaGithub, FaGlobe, FaFigma, FaPlay } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';


interface ProjectCardProps {
  title: string;
  description: string;
  imgUrl?: string;
  videoUrl?: string;
  demoLink?: string;
  designLink?: string;
  githubLink?: string;
  siteLink?: string;
  techStack?: string[];
  openSource?: boolean;
}

function VideoModal({ videoUrl, title, onClose }: { videoUrl: string; title: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!mounted) return null;

  const modalContent = (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 z-10 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Close video"
        >
          <IoClose className="h-8 w-8" />
        </button>
        <video
          src={videoUrl}
          title={`${title} demo video`}
          className="h-full w-full"
          controls
          autoPlay
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
        />
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}

export default function ProjectCard({
  title,
  description,
  imgUrl,
  videoUrl,
  demoLink,
  designLink,
  githubLink,
  siteLink,
  techStack = [],
  openSource,
}: ProjectCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const imageUrl = imgUrl ?? null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <Card
          className="group overflow-hidden border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50"
        >
          {imageUrl && (
            <div className="relative overflow-hidden border-b border-neutral-800 aspect-video">
              <Image
                src={imageUrl}
                alt={`${title} preview`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all duration-300 cursor-pointer"
                  aria-label={`Play ${title} demo video`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                    <FaPlay className="h-4 w-4 text-black ml-0.5" />
                  </div>
                </button>
              )}
            </div>
          )}

          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="font-clash text-2xl tracking-wide text-white">
                {title}
              </CardTitle>
              {openSource && (
                <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  open source
                </span>
              )}
            </div>
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
            {designLink && (
              <Button asChild size="sm" variant="outline" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white">
                <a href={designLink} target="_blank" rel="noopener noreferrer">
                  <FaFigma className="mr-2 h-4 w-4" /> Design
                </a>
              </Button>
            )}
            {openSource === true && (
              <>
                {demoLink && (
                  <Button asChild size="sm" className="bg-white text-black hover:bg-neutral-200">
                    <a href={demoLink} target="_blank" rel="noopener noreferrer">
                      <FaGlobe className="mr-2 h-5 w-5" /> Demo
                    </a>
                  </Button>
                )}
                {githubLink && (
                  <Button asChild size="sm" variant="outline" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white">
                    <a href={githubLink} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="mr-2 h-5 w-5" /> GitHub
                    </a>
                  </Button>
                )}
              </>
            )}
            {openSource === false && siteLink && (
              <Button asChild size="sm" className="bg-white text-black hover:bg-neutral-200">
                <a href={siteLink} target="_blank" rel="noopener noreferrer">
                  <FaGlobe className="mr-2 h-5 w-5" /> Site
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showVideo && videoUrl && (
          <VideoModal videoUrl={videoUrl} title={title} onClose={() => setShowVideo(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
