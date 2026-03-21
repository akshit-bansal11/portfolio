import { DetailedProjectItem } from '@/types';


export const allProjects: Record<string, DetailedProjectItem[]> = {
    Web: [
        {
            type: 'large',
            title: 'Plotline',
            description: 'Organize your entire media library; movies, series, anime, manga, and games; all in one place. Plotline shows you exactly where to stream, buy, or rent everything you want.',
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/websites/plotline.png",
            techStack: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind'],
            siteLink: "https://plotline.akshitbansal.me/",
            openSource: false
        },
        {
            type: 'large',
            title: 'Canopy',
            description: 'Canopy is an open-source bookmarking tool built for the way the web actually feels—messy, fast, and full of ideas. Save links, organize them with flexible tags, and find anything instantly. No folders to fight, no lock-in, no noise. Your bookmarks live under one canopy: structured, searchable, and completely yours.',
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/websites/canopy.png",
            videoUrl: "https://res.cloudinary.com/dugsystpq/video/upload/v1772932699/canopy-demo-video_apmc8u.mp4",
            techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Firebase'],
            demoLink: 'https://use-canopy.vercel.app/',
            githubLink: 'https://github.com/akshit-bansal11/canopy',
            openSource: true
        },
        {
            type: 'large',
            title: 'Color Space',
            description: "Color Space is a comprehensive, all-in-one web application designed for designers and developers. It provides a full suite of tools to create, browse, extract, and convert colors and gradients, all in one centralized hub.",
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/websites/color-space.png",
            videoUrl: "https://res.cloudinary.com/dugsystpq/video/upload/v1772932701/color-space-demo-video_ojk09o.mp4",
            techStack: ['React', 'Tailwind', 'Gemini API'],
            demoLink: "https://color-space11.vercel.app/",
            githubLink: "https://github.com/akshit-bansal11/color-space",
            openSource: true
        },
        // {
        //     type: 'large',
        //     title: 'Medishare',
        //     description: 'MediShare is a donation-based platform that connects medicine donors with people in need through a secure and verified system.',
        //     ImgID: "1GlKKrrpe6OmzTt-zs9u-llJK6qWUjuuC",
        //     techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Cloudinary', 'Gemini API']
        // },
        {
            type: 'large',
            title: 'Influera',
            description: 'Influera is a platform that connects influencers with brands for collaborations.',
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/websites/influera.png",
            techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Cloudinary', 'Gemini API'],
            demoLink: "https://influera.onrender.com/",
            githubLink: "https://github.com/akshit-bansal11/influera",
            openSource: true
        },
        {
            type: 'small',
            title: 'Memory Game',
            description: 'A fun and modern Memory Game built with React, Vite, Tailwind CSS, Framer Motion, and React Icons.',
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/websites/memory.webp",
            techStack: ['React', 'Tailwind'],
            demoLink: 'https://memory-game-akshit-bansal11.vercel.app/',
            githubLink: 'https://github.com/akshit-bansal11/memory-game',
            openSource: true
        },
        {
            type: 'small',
            title: 'Bar Clock',
            description: 'A simple bar clock built with React & Tailwind. Displays the current time in a unique way.',
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/websites/bar-clock.webp",
            techStack: ['React', 'Tailwind'],
            githubLink: 'https://akshit-bansal11.github.io/bar-clock/',
            demoLink: 'https://bar-clock-akshit-bansal11.vercel.app/',
            openSource: true
        }
    ],
    Designs: [
        {
            type: 'large',
            title: 'IPO Dashboard - Bluestock',
            description: "A dashboard design for Bluestock Fintech's IPO section, showcasing the latest IPOs, upcoming IPOs, and past IPOs.",
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/designs/ipo.webp",
            techStack: ['Figma'],
            designLink: 'https://www.figma.com/design/IyF5MKCS7GP2ChFBOiWXAK/bluestock-fintech-ui-ux-team?node-id=0-1&p=f&t=uex6AqWahwZjsA3R-0'
        },
        {
            type: 'large',
            title: 'E-Commerce Website Template',
            description: 'A modern e-commerce website template designed for a fictional clothing store, featuring a clean and user-friendly interface.',
            imgUrl: "https://media-server.akshitbansal.me/api/images/portfolio/designs/ecom.webp",
            techStack: ['Figma'],
            designLink: 'https://www.figma.com/design/32zeVVPSZBHL9GFSEXUqHp/Ecom-base?node-id=1-3&p=f&t=JxJOvK2iMlsW3gJ2-0/'
        }
    ],
    Scripts: [
        {
            type: 'smallWimg',
            title: 'Merge Folders',
            description: 'A python script to merge two or more folders.',
            techStack: ['Python'],
            githubLink: 'https://github.com/akshit-bansal11/useful-scripts',
            openSource: true
        },
        {
            type: 'smallWimg',
            title: 'Audio Converter',
            description: 'A python script to convert audio files from one format to another.',
            techStack: ['Python'],
            githubLink: 'https://github.com/akshit-bansal11/useful-scripts',
            openSource: true
        }
    ]
}
