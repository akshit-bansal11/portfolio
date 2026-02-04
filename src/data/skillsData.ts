import React from "react";
import { ClionIcon } from "@/components/icons/clion-icon";
import { AzureBlobDarkIcon } from "@/components/icons/azure-blob-dark-icon";
import { JqueryIcon } from "@/components/icons/jquery-icon";
import { LeetcodeDarkIcon } from "@/components/icons/leetcode-dark-icon";
import { HackerRankDarkIcon } from "@/components/icons/hackerrank-dark-icon";
import { ChatgptDarkIcon } from "@/components/icons/chatgpt-dark-icon";
import { FirestoreIcon } from "@/components/icons/firestore-icon";
import { VercelBlobDarkIcon } from "@/components/icons/vercel-blob-dark-icon";
import { ReactRouterIcon } from "@/components/icons/reactrouter";
import { SqlIcon } from "@/components/icons/sql";
import { FfmpegIcon } from "@/components/icons/ffmpeg-icon";
import { FfmpegWasmIcon } from "@/components/icons/ffmpeg-wasm-icon";
import { ElevenLabsDarkIcon } from "@/components/icons/eleven-labs-dark-icon";

export interface Skill {
    name: string;
    Icon: string | React.ElementType;
}

export interface SkillCategory {
    title: string;
    description: string;
    projectCount: string;
    certifications: Skill[];
    skills: Skill[];
}

export const skillsData: SkillCategory[] = [
    {
        title: "Core Frontend & UI/UX",
        description: "Crafting fast, responsive, and accessible user interfaces where design decisions are guided by usability, motion, and real interaction patterns. This stack is how I translate ideas into clean, intuitive experiences—balancing aesthetics with performance and maintainability.",
        projectCount: "25+",
        certifications: [
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/html5.svg" },
            { name: "Front-End Development - HTML (Great Learning)", Icon: "https://svgl.app/library/html5.svg" },
            { name: "HTML Attributes & Tags (Great Learning)", Icon: "https://svgl.app/library/html5.svg" },
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/css.svg" },
            { name: "CSS(Basic) (HackerRank)", Icon: "https://svgl.app/library/css.svg" },
            { name: "Front-End Development - CSS (Great Learning)", Icon: "https://svgl.app/library/css.svg" },
            { name: "CSS Properties (Great Learning)", Icon: "https://svgl.app/library/css.svg" },
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/javascript.svg" },
            { name: "JavaScript (Basic) HackerRank", Icon: "https://svgl.app/library/javascript.svg" },
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: JqueryIcon },
            { name: "MERN Stack (Sun Soft Technologies)", Icon: "https://svgl.app/library/react_dark.svg" },
            { name: "MERN Stack (Sun Soft Technologies)", Icon: "https://svgl.app/library/tailwindcss.svg" },
        ],
        skills: [
            { name: "HTML5", Icon: "https://svgl.app/library/html5.svg" },
            { name: "CSS3", Icon: "https://svgl.app/library/css.svg" },
            { name: "JavaScript", Icon: "https://svgl.app/library/javascript.svg" },
            { name: "Tailwind CSS", Icon: "https://svgl.app/library/tailwindcss.svg" },
            { name: "React", Icon: "https://svgl.app/library/react_dark.svg" },
            { name: "TypeScript", Icon: "https://svgl.app/library/typescript.svg" },
            { name: "Next.js", Icon: "https://svgl.app/library/nextjs_icon_dark.svg" },
            { name: "Canva", Icon: "https://svgl.app/library/canva.svg" },
            { name: "Figma", Icon: "https://svgl.app/library/figma.svg" },
            { name: "Framer", Icon: "https://svgl.app/library/framer_dark.svg" },
            { name: "Shadcn", Icon: "https://svgl.app/library/shadcn-ui_dark.svg" },
            { name: "Magic UI", Icon: "https://svgl.app/library/magicui.svg" },
            { name: "Motion", Icon: "https://svgl.app/library/motion_dark.svg" },
            { name: "Radix UI", Icon: "https://svgl.app/library/radix-ui_dark.svg" },
            { name: "Redux", Icon: "https://svgl.app/library/redux.svg" },
            { name: "React Router", Icon: ReactRouterIcon },
            { name: "jQuery", Icon: JqueryIcon },
            { name: "Bootstrap", Icon: "https://svgl.app/library/bootstrap.svg" },
            { name: "Material UI", Icon: "https://svgl.app/library/materialui.svg" },
        ]
    },
    {
        title: "Backend & Databases",
        description: "Designing reliable backend systems that handle data, business logic, and scale without becoming fragile. I use these tools to build APIs, manage persistence, and ensure applications remain fast, secure, and predictable as complexity grows.",
        projectCount: "15+",
        certifications: [
            { name: "SQL(Basic) (HackerRank)", Icon: SqlIcon },
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/nodejs.svg" },
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/expressjs_dark.svg" },
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/mysql-icon-dark.svg" },
            { name: "MERN Stack (Sun Soft Technologies)", Icon: "https://svgl.app/library/mongodb-icon-dark.svg" },
            { name: "MERN Stack (Sun Soft Technologies)", Icon: "https://svgl.app/library/nodejs.svg" },
            { name: "MERN Stack (Sun Soft Technologies)", Icon: "https://svgl.app/library/expressjs_dark.svg" },

        ],
        skills: [
            { name: "Node.js", Icon: "https://svgl.app/library/nodejs.svg" },
            { name: "Express", Icon: "https://svgl.app/library/expressjs_dark.svg" },
            { name: "Go", Icon: "https://svgl.app/library/golang_dark.svg" },
            { name: "Bun", Icon: "https://svgl.app/library/bun.svg" },
            { name: "C#", Icon: "https://svgl.app/library/csharp.svg" },
            { name: ".NET", Icon: "https://svgl.app/library/dotnet.svg" },
            { name: "SQL", Icon: SqlIcon },
            { name: "MongoDB", Icon: "https://svgl.app/library/mongodb-icon-dark.svg" },
            { name: "MySQL", Icon: "https://svgl.app/library/mysql-icon-dark.svg" },
            { name: "PostgreSQL", Icon: "https://svgl.app/library/postgresql.svg" },
            { name: "Supabase", Icon: "https://svgl.app/library/supabase.svg" },
            { name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
        ]
    },
    {
        title: "DSA & Problem Solving",
        description: "Strengthening problem-solving instincts through data structures and algorithms, with a focus on efficiency, correctness, and edge-case thinking. This foundation sharpens how I approach real-world bugs, performance bottlenecks, and system design decisions.",
        projectCount: "50+",
        certifications: [
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/javascript.svg" },
            { name: "DSA (Bangalore Computer Education)", Icon: "https://svgl.app/library/c-plusplus.svg" },
            { name: "C++ Course -Learn The Essentials (Scaler)", Icon: "https://svgl.app/library/c-plusplus.svg" },
            { name: "C++ Complete Training Course (Udemy)", Icon: "https://svgl.app/library/c-plusplus.svg" },
            { name: "C Programming for Beginners (Udemy)", Icon: "https://svgl.app/library/c.svg" },
        ],
        skills: [
            { name: "JavaScript", Icon: "https://svgl.app/library/javascript.svg" },
            { name: "Python", Icon: "https://svgl.app/library/python.svg" },
            { name: "C", Icon: "https://svgl.app/library/c.svg" },
            { name: "C++", Icon: "https://svgl.app/library/c-plusplus.svg" },
            { name: "Leetcode", Icon: LeetcodeDarkIcon },
            { name: "Hackerrank", Icon: HackerRankDarkIcon },
        ]
    },
    {
        title: "Dev Tools & Environments",
        description: "Powering day-to-day development with tools that improve speed, reliability, and collaboration. From version control to build systems and IDEs, this category reflects how I reduce friction, automate workflows, and stay productive across projects.",
        projectCount: "All",
        certifications: [
        ],
        skills: [
            { name: "Git", Icon: "https://svgl.app/library/git.svg" },
            { name: "GitHub", Icon: "https://svgl.app/library/github_dark.svg" },
            { name: "Postman", Icon: "https://svgl.app/library/postman.svg" },
            { name: "dotenv", Icon: "https://svgl.app/library/dotenv.svg" },
            { name: "vite", Icon: "https://svgl.app/library/vite.svg" },
            { name: "postcss", Icon: "https://svgl.app/library/postcss.svg" },
            { name: "npm", Icon: "https://svgl.app/library/npm.svg" },
            { name: "pnpm", Icon: "https://svgl.app/library/pnpm_dark.svg" },
            { name: "vscode", Icon: "https://svgl.app/library/vscode.svg" },
            { name: "pycharm", Icon: "https://svgl.app/library/pycharm.svg" },
            { name: "webstorm", Icon: "https://svgl.app/library/webstorm.svg" },
            { name: "CLion", Icon: ClionIcon },
        ]
    },
    {
        title: "Storage & Media",
        description: "Managing files, images, and media assets with a focus on performance, scalability, and cost efficiency. These tools help me handle uploads, optimize delivery, and integrate cloud storage seamlessly into full-stack applications.",
        projectCount: "10+",
        certifications: [
            { name: "NodeJS - Full Stack (Bangalore Computer Education)", Icon: "https://svgl.app/library/cloudinary.svg" },
        ],
        skills: [
            { name: "Cloudinary", Icon: "https://svgl.app/library/cloudinary.svg" },
            { name: "Firestore", Icon: FirestoreIcon },
            { name: "SVG", Icon: "https://svgl.app/library/svg.svg" },
            { name: "Vercel Blob", Icon: VercelBlobDarkIcon },
            { name: "Azure Blob", Icon: AzureBlobDarkIcon },
            { name: "FFmpeg", Icon: FfmpegIcon },
            { name: "FFmpeg WASM", Icon: FfmpegWasmIcon },
        ]
    },
    {
        title: "AI Tools & Services",
        description: "Leveraging modern AI tools to enhance productivity and add intelligent features to applications. I use these services for automation, content generation, data extraction, and rapid prototyping—treating AI as an amplifier, not a black box.",
        projectCount: "8+",
        certifications: [],
        skills: [
            { name: "Gemini", Icon: "https://svgl.app/library/gemini.svg" },
            { name: "ChatGPT", Icon: ChatgptDarkIcon },
            { name: "Claude", Icon: "https://svgl.app/library/claude-ai-icon.svg" },
            { name: "Firebase Studio", Icon: "https://svgl.app/library/firebase-studio.svg" },
            { name: "MCP", Icon: "https://svgl.app/library/model-context-protocol-dark.svg" },
            { name: "Perplexity", Icon: "https://svgl.app/library/perplexity.svg" },
            { name: "Grok", Icon: "https://svgl.app/library/grok-dark.svg" },
            { name: "Ollama", Icon: "https://svgl.app/library/ollama_dark.svg" },
            { name: "ElevenLabs", Icon: ElevenLabsDarkIcon },
        ]
    },
    {
        title: "Authentication",
        description: "Implementing secure and flexible authentication flows to protect user data and application integrity. This stack enables login systems, token-based auth, and third-party providers while balancing security, usability, and scalability.",
        projectCount: "12+",
        certifications: [
            { name: "MERN Stack (Sun Soft Technologies)", Icon: "https://svgl.app/library/jwt.svg" },
        ],
        skills: [
            { name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
            { name: "Auth0", Icon: "https://svgl.app/library/auth0.svg" },
            { name: "Authy", Icon: "https://svgl.app/library/authy.svg" },
            { name: "JWT", Icon: "https://svgl.app/library/jwt.svg" },
            { name: "Auth.js", Icon: "https://svgl.app/library/authjs.svg" },
        ]
    }
];
