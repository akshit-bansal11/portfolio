"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaFigma, FaGithub, FaGlobe, FaPlay } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import OpenSourceBadge from "@/components/common/badges/OpenSourceBadge";
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
import { cn } from "@/lib/utils";
import type { ProjectItem } from "@/types";

interface ProjectCardProps extends ProjectItem {
	/** Embed an iframe preview instead of a static image */
	iframe?: string;
	/** 'small' → max-w-md + h-48 media; 'default' → max-w-lg + aspect-video media */
	size?: "default" | "small";
	className?: string;
}

function VideoModal({
	videoUrl,
	title,
	onClose,
}: {
	videoUrl: string;
	title: string;
	onClose: () => void;
}) {
	const [mounted, setMounted] = useState(false);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		},
		[onClose],
	);

	useEffect(() => {
		setMounted(true);
		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [handleKeyDown]);

	if (!mounted) return null;

	return createPortal(
		<motion.div
			className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute -top-10 right-0 z-10 text-white/70 hover:text-white transition-colors cursor-pointer"
					aria-label="Close video modal"
				>
					<IoClose className="h-8 w-8" />
				</button>
				<video
					src={videoUrl}
					className="h-full w-full"
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
		</motion.div>,
		document.body,
	);
}

export default function ProjectCard({
	title,
	description,
	imgUrl,
	videoUrl,
	iframe,
	demoLink,
	designLink,
	githubLink,
	siteLink,
	techStack = [],
	openSource,
	size = "default",
	className,
}: ProjectCardProps) {
	const [showVideo, setShowVideo] = useState(false);

	const hasMedia = !!(imgUrl || iframe);
	const hasFooter = !!(demoLink || designLink || githubLink || siteLink);

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
							{videoUrl && !iframe && (
								<button
									type="button"
									onClick={() => setShowVideo(true)}
									className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all duration-300 cursor-pointer"
									aria-label={`Play video for ${title}`}
								>
									<div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
										<FaPlay className="h-4 w-4 text-black ml-0.5" />
									</div>
								</button>
							)}
						</div>
					)}

					<CardHeader className="space-y-2 grow">
						<div className="flex items-center gap-2 flex-wrap">
							<CardTitle className="font-clash text-xl tracking-wide text-white">{title}</CardTitle>
							{openSource && <OpenSourceBadge />}
						</div>
						<CardDescription className="text-neutral-400 line-clamp-3">
							{description}
						</CardDescription>
					</CardHeader>

					<CardContent className="pb-0">
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

					{hasFooter && (
						<CardFooter className="gap-2 pt-4 flex-wrap">
							{designLink && (
								<Button
									asChild
									size="sm"
									variant="outline"
									className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
								>
									<a href={designLink} target="_blank" rel="noopener noreferrer">
										<FaFigma className="mr-1.5 h-3.5 w-3.5" /> Design
									</a>
								</Button>
							)}
							{demoLink && (
								<Button asChild size="sm" className="bg-white text-black hover:bg-neutral-200">
									<a href={demoLink} target="_blank" rel="noopener noreferrer">
										<FaGlobe className="mr-1.5 h-3.5 w-3.5" /> Demo
									</a>
								</Button>
							)}
							{siteLink && (
								<Button asChild size="sm" className="bg-white text-black hover:bg-neutral-200">
									<a href={siteLink} target="_blank" rel="noopener noreferrer">
										<FaGlobe className="mr-1.5 h-3.5 w-3.5" /> Site
									</a>
								</Button>
							)}
							{githubLink && (
								<Button
									asChild
									size="sm"
									variant="outline"
									className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
								>
									<a href={githubLink} target="_blank" rel="noopener noreferrer">
										<FaGithub className="mr-1.5 h-3.5 w-3.5" /> GitHub
									</a>
								</Button>
							)}
						</CardFooter>
					)}
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
