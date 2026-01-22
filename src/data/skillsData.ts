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

export interface Skill {
    name: string;
    Icon: string | React.ElementType;
}

export interface SkillCategory {
    title: string;
    skills: Skill[];
}

export const skillsData: SkillCategory[] = [
    {
        title: "Core Frontend & UI/UX",
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
        skills: [
            { name: "Node.js", Icon: "https://svgl.app/library/nodejs.svg" },
            { name: "Express", Icon: "https://svgl.app/library/expressjs_dark.svg" },
            { name: "Go", Icon: "https://svgl.app/library/golang_dark.svg" },
            { name: "Bun", Icon: "https://svgl.app/library/bun.svg" },
            { name: "C#", Icon: "https://svgl.app/library/csharp.svg" },
            { name: ".NET", Icon: "https://svgl.app/library/dotnet.svg" },
            { name: "MongoDB", Icon: "https://svgl.app/library/mongodb-icon-dark.svg" },
            { name: "MySQL", Icon: "https://svgl.app/library/mysql-icon-dark.svg" },
            { name: "PostgreSQL", Icon: "https://svgl.app/library/postgresql.svg" },
            { name: "Supabase", Icon: "https://svgl.app/library/supabase.svg" },
            { name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
        ]
    },
    {
        title: "DSA & Problem Solving",
        skills: [
            { name: "JavaScript", Icon: "https://svgl.app/library/javascript.svg" },
            { name: "Python", Icon: "https://svgl.app/library/python.svg" },
            { name: "C++", Icon: "https://svgl.app/library/c-plusplus.svg" },
            { name: "Leetcode", Icon: LeetcodeDarkIcon },
            { name: "Hackerrank", Icon: HackerRankDarkIcon },
        ]
    },
    {
        title: "Dev Tools & Environments",
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
        skills: [
            { name: "Cloudinary", Icon: "https://svgl.app/library/cloudinary.svg" },
            { name: "Firestore", Icon: FirestoreIcon },
            { name: "SVG", Icon: "https://svgl.app/library/svg.svg" },
            { name: "Vercel Blob", Icon: VercelBlobDarkIcon },
            { name: "Azure Blob", Icon: AzureBlobDarkIcon },
        ]
    },
    {
        title: "AI Tools & Services",
        skills: [
            { name: "Gemini", Icon: "https://svgl.app/library/gemini.svg" },
            { name: "ChatGPT", Icon: ChatgptDarkIcon },
            { name: "Claude", Icon: "https://svgl.app/library/claude-ai-icon.svg" },
            { name: "Firebase Studio", Icon: "https://svgl.app/library/firebase-studio.svg" },
            { name: "MCP", Icon: "https://svgl.app/library/model-context-protocol-dark.svg" },
            { name: "Perplexity", Icon: "https://svgl.app/library/perplexity.svg" },
            { name: "Grok", Icon: "https://svgl.app/library/grok-dark.svg" },
            { name: "Ollama", Icon: "https://svgl.app/library/ollama_dark.svg" },
        ]
    },
    {
        title: "Authentication",
        skills: [
            { name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
            { name: "Auth0", Icon: "https://svgl.app/library/auth0.svg" },
            { name: "Authy", Icon: "https://svgl.app/library/authy.svg" },
            { name: "JWT", Icon: "https://svgl.app/library/jwt.svg" },
            { name: "Auth.js", Icon: "https://svgl.app/library/authjs.svg" },
        ]
    }
];
