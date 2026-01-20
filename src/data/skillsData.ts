import { IconType } from "react-icons";
import {
    SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
    SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb, SiFirebase,
    SiPython, SiCplusplus, SiSharp, SiDotnet, SiFigma, SiGit, SiGithub,
    SiVercel, SiPostman, SiCloudinary, SiGooglecloud, SiAdobexd, SiAdobephotoshop,
    SiCanva
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";
import { Firebase } from "@/components/icons/firebase-icon";
import { Nextjs } from "@/components/icons/next-icon";
import { React as ReactIcon } from "@/components/icons/react-icon";
import { TailwindCSS } from "@/components/icons/tailwind-icon";
import { TypeScript } from "@/components/icons/ts-icon";

export interface Skill {
    name: string;
    Icon: IconType | string | ((props: any) => any);
}

export interface SkillCategory {
    title: string;
    skills: Skill[];
}

export const skillsData: SkillCategory[] = [
    {
        title: "Frontend",
        skills: [
            { name: "React", Icon: ReactIcon },
            { name: "Next.js", Icon: Nextjs },
            { name: "TypeScript", Icon: TypeScript },
            { name: "JavaScript", Icon: SiJavascript },
            { name: "Tailwind CSS", Icon: TailwindCSS },
            { name: "HTML5", Icon: SiHtml5 },
            { name: "CSS3", Icon: SiCss3 },
            { name: "Figma", Icon: SiFigma },
        ]
    },
    {
        title: "Backend & Database",
        skills: [
            { name: "Node.js", Icon: SiNodedotjs },
            { name: "Express", Icon: SiExpress },
            { name: "MongoDB", Icon: SiMongodb },
            { name: "Firebase", Icon: Firebase },
            { name: "Cloudinary", Icon: SiCloudinary },
        ]
    },
    {
        title: "Languages",
        skills: [
            { name: "TypeScript", Icon: TypeScript },
            { name: "JavaScript", Icon: SiJavascript },
            { name: "Python", Icon: SiPython },
            { name: "C++", Icon: SiCplusplus },
            { name: "C#", Icon: SiSharp },
        ]
    },
    {
        title: "Tools & Others",
        skills: [
            { name: "Git", Icon: SiGit },
            { name: "GitHub", Icon: SiGithub },
            { name: "VS Code", Icon: VscCode },
            { name: "Postman", Icon: SiPostman },
            { name: "Vercel", Icon: SiVercel },
            { name: "Canva", Icon: SiCanva },
        ]
    }
];
