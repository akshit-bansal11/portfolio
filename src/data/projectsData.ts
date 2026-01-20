import Canopy from '@/assets/images/projects/websites/canopy.png';
import Medishare from '@/assets/images/projects/websites/medishare.webp';
import ColorSpace from '@/assets/images/projects/websites/color-space.png';
import { ProjectItem } from "@/types";

export const projects: ProjectItem[] = [
    {
        title: "Color Space",
        description: "Color Space is a comprehensive, all-in-one web application designed for designers and developers. It provides a full suite of tools to create, browse, extract, and convert colors and gradients, all in one centralized hub.",
        image: ColorSpace,
        techStack: ['React', 'Tailwind', 'Gemini API'],
        demoLink: "https://color-space11.vercel.app/",
        githubLink: "https://github.com/akshit-bansal11/color-space"
    },
    {
        title: "Canopy",
        description: "Canopy is an open-source bookmarking tool built for the way the web actually feels—messy, fast, and full of ideas. Save links, organize them with flexible tags, and find anything instantly. No folders to fight, no lock-in, no noise. Your bookmarks live under one canopy: structured, searchable, and completely yours.",
        image: Canopy,
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Firebase'],
        demoLink: "https://use-canopy.vercel.app/",
        githubLink: "https://github.com/akshit-bansal11/canopy"
    },
    {
        title: "Medishare",
        description: "MediShare is a donation-based platform that connects medicine donors with people in need through a secure and verified system.",
        image: Medishare,
        techStack: ['React', 'Node.js', 'Express', 'MongoDB']
    }
];
