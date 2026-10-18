/*
 * ProjectCard.tsx
 * Card for one project in the Projects grid.
 * Optionally displays a media preview (image or iframe),
 * a video play overlay that opens a modal, the project's
 * title/description/tech stack, and footer action buttons.
 */

"use client";
import { motion } from "framer-motion";
import { Figma, Github, Globe, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SkillPill from "@/components/pills/SkillPill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { skillsData } from "@/data/skillsData";
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/types/project";

// Public props: extends ProjectItem with optional iframe + sizing.
interface ProjectCardProps extends ProjectItem {
  iframe?: string;
  size?: "default" | "small";
  className?: string;
}

// Modal that plays the demo video, on a native <dialog> opened with showModal():
// the browser supplies the top layer, background inertness, Escape and focus return.
function VideoModal({
  videoUrl,
  title,
  onClose,
}: {
  videoUrl: string;
  title: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const downOnBackdrop = useRef(false);

  useEffect(() => {
    // Open as modal and lock body scroll (a native dialog does not lock it).
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Every close path (Escape, Close button, backdrop) ends in the native close event.
  return (
    <dialog
      ref={dialogRef}
      aria-label={`${title} demo video`}
      onClose={onClose}
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Close only when the press and the release both landed on the backdrop
        // (a drag that starts in the video and ends outside must not close).
        if (downOnBackdrop.current && e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-4xl max-h-none overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <motion.div
        className="flex flex-col items-end gap-2"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="rounded-md p-2 text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          aria-label="Close video"
        >
          <X className="h-6 w-6" />
        </button>
        <video
          src={videoUrl}
          className="aspect-video max-h-[calc(100dvh-6rem)] w-full rounded-xl bg-black shadow-2xl"
          controls
          autoPlay
          muted
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          title={title}
        >
          <track kind="captions" />
        </video>
      </motion.div>
    </dialog>
  );
}

// Renders one project card.
export default function ProjectCard({
  title,
  description,
  imgUrl,
  logoUrl,
  videoUrl,
  iframe,
  demoLink,
  designLink,
  githubLink,
  siteLink,
  techStack = [],
  isPublic,
  size = "default",
  className,
}: ProjectCardProps) {
  // Tracks whether the demo video modal is open.
  const [showVideo, setShowVideo] = useState(false);

  // Small render flags — drives optional sections of the card.
  const hasMedia = !!(imgUrl || iframe);
  const hasFooter = !!(demoLink || designLink || githubLink || siteLink);

  // Map the techStack strings to Skill objects using skillsData.
  const projectSkills = techStack.map((tech) => {
    const found = skillsData.find((s) => s.name.toLowerCase() === tech.toLowerCase());

    return {
      name: tech,
      Icon: found?.Icon ?? "",
      variant: "projectCard" as const,
    };
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("w-full", size === "small" ? "max-w-md" : "max-w-lg", className)}
      >
        <Card className="group overflow-hidden border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50 h-full flex flex-col">
          {/* Top media block — image, iframe, or play-button overlay. */}
          {hasMedia && (
            <div
              className={cn(
                "relative overflow-hidden border-b border-neutral-800",
                size === "small" ? "h-48" : "aspect-video",
              )}
            >
              {iframe ? (
                <iframe
                  src={iframe}
                  title={`${title} preview`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={imgUrl ?? ""}
                  alt={`${title} preview`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              {/* Play overlay only when a video is attached and we're not iframing. */}
              {videoUrl && !iframe && (
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all duration-300 cursor-pointer"
                  aria-label={`Play video for ${title}`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                    <Play className="h-4 w-4 text-black fill-current ml-0.5" />
                  </div>
                </button>
              )}
            </div>
          )}

          {/* Title + description + optional open-source badge. */}
          <CardHeader className="space-y-2 grow">
            <div className="flex items-center gap-2 flex-wrap">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0 object-contain"
                />
              )}
              <CardTitle className="font-clash text-xl tracking-wide text-white">{title}</CardTitle>
              {isPublic ? (
                <Badge
                  variant="outline"
                  className="!border-sky-700 !text-sky-500 text-xs font-medium"
                >
                  Public
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="!border-neutral-700 !text-neutral-500 text-xs font-medium"
                >
                  Private
                </Badge>
              )}
            </div>
            <CardDescription className="text-neutral-400 line-clamp-3">
              {description}
            </CardDescription>
          </CardHeader>

          {/* Tech stack tag list. */}
          <CardContent className="pb-0">
            <div className="flex flex-wrap gap-1.5">
              {projectSkills.map((skill, index) => (
                <SkillPill key={index} skill={skill} />
              ))}
            </div>
          </CardContent>

          {/* Footer action buttons — only the link types that are provided. */}
          {hasFooter && (
            <CardFooter className="gap-2 pt-4 flex-wrap">
              {designLink && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-5 md:h-7 px-1.5 md:px-2.5 text-[10px] md:text-xs rounded-sm lg:h-9 lg:px-3 lg:text-sm lg:rounded-md border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <a
                    className="items-center"
                    href={designLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Figma className="mr-0.5 h-2.5 w-2.5 md:h-3 md:w-3 lg:mr-1.5 lg:h-3.5 lg:w-3.5" />{" "}
                    Design
                  </a>
                </Button>
              )}
              {demoLink && (
                <Button
                  asChild
                  size="sm"
                  className="h-5 md:h-7 px-1.5 md:px-2.5 text-[10px] md:text-xs rounded-sm lg:h-9 lg:px-3 lg:text-sm lg:rounded-md bg-white text-black hover:bg-neutral-200"
                >
                  <a
                    className="items-center"
                    href={demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-0.5 h-2.5 w-2.5 md:h-3 md:w-3 lg:mr-1.5 lg:h-3.5 lg:w-3.5" />{" "}
                    Demo
                  </a>
                </Button>
              )}
              {siteLink && (
                <Button
                  asChild
                  size="sm"
                  className="h-5 md:h-7 px-1.5 md:px-2.5 text-[10px] md:text-xs rounded-sm lg:h-9 lg:px-3 lg:text-sm lg:rounded-md bg-white text-black hover:bg-neutral-200"
                >
                  <a
                    className="items-center"
                    href={siteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-0.5 h-2.5 w-2.5 md:h-3 md:w-3 lg:mr-1.5 lg:h-3.5 lg:w-3.5" />{" "}
                    Site
                  </a>
                </Button>
              )}
              {githubLink && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-5 md:h-7 px-1.5 md:px-2.5 text-[10px] md:text-xs rounded-sm lg:h-9 lg:px-3 lg:text-sm lg:rounded-md border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <a
                    className="items-center"
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-0.5 h-2.5 w-2.5 md:h-3 md:w-3 lg:mr-1.5 lg:h-3.5 lg:w-3.5" />{" "}
                    GitHub
                  </a>
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </motion.div>

      {/* Demo video modal; mounted only while open. */}
      {showVideo && videoUrl && (
        <VideoModal videoUrl={videoUrl} title={title} onClose={() => setShowVideo(false)} />
      )}
    </>
  );
}
