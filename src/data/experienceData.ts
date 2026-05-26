/*
 * experienceData.ts
 * Source-of-truth for the Experience section.
 * Groups entries into categories (Internship, Training) and
 * resolves their tech-stack pills against shared skillsData
 * so icon URLs aren't duplicated.
 */

import trupeerLogo from "@/assets/images/trupeer-dark.svg";
import { skillsData } from "@/data/skillsData";
import type { ExperienceItem } from "@/types/experience";
import type { Skill } from "@/types/skill";

// One named group of experience cards (e.g. "Internship", "Training").
export interface ExperienceCategory {
	title: string;
	items: ExperienceItem[];
}

// Resolve a skill by name directly from the flat skillsData list.
const skillByName = (name: string): Skill | undefined =>
	skillsData.find((skill) => skill.name === name);

// Pick a typed list of Skill objects from a free-form name list.
const pickSkills = (...names: string[]): Skill[] =>
	names.map(skillByName).filter((skill): skill is Skill => Boolean(skill));

// All experience entries, grouped by category, in display order.
export const experience: ExperienceCategory[] = [
	{
		title: "Internship",
		items: [
			{
				location: "Bengaluru (On-Site)",
				company: "Trupeer",
				role: "Full Stack Developer (Next.js & Typescript)",
				date: "Jan 2026 - Ongoing",
				logo: trupeerLogo,
				generalPoint:
					"Contributed across a distributed, microservices-oriented architecture spanning a Next.js web application, Chrome extension, and Node.js backend — interfacing with REST APIs, MongoDB, Redis, third-party webhooks, and containerized deployments throughout the feature lifecycle.",
				points: [
					{
						label: "Subtitle System",
						body: "Eliminated server-side subtitle processing by engineering a fully client-side pipeline using FFmpeg WASM and ElevenLabs Scribe v2 for in-browser transcription and SRT editing; reduced compute costs ~70% and enabled 90+ language support.",
					},
					{
						label: "Chrome Extension Recording Pipeline",
						body: "Migrated from MediaRecorder to the Web Codecs API; replaced in-memory buffering with IndexedDB-based chunked writes to prevent data loss on sessions exceeding 30 minutes; added exponential-backoff upload retry for failure resilience. Built a fallback web recorder for extension-restricted enterprise environments.",
					},
					{
						label: "API Security & Testing",
						body: "Hardened the password reset flow to OWASP A07:2021 compliance via Upstash Redis sliding-window rate limiting, short-lived JWT token caching, reCAPTCHA v3 risk scoring, and honeypot field injection detection. Established Vitest testing infrastructure from zero — covering Auth0 middleware, token refresh, signup routes, and Stripe/Intercom/Mixpanel integrations.",
					},
					{
						label: "Frontend Revamp",
						body: "Sole intern on a full-stack Next.js 14 App Router rewrite (TypeScript, Tailwind CSS, shadcn/ui, Framer Motion); architected a typed REST client abstraction layer, Zod-based form validation, and webhook-driven optimistic UI for async event reconciliation across the Organization module.",
					},
				],
				skills: pickSkills(
					"Next.js",
					"TypeScript",
					"React",
					"Tailwind CSS",
					"Shadcn",
					"Motion",
					"Node.js",
					"MongoDB",
					"Redis",
					"Upstash",
					"Auth0",
					"JWT",
					"Vitest",
					"FFmpeg WASM",
					"ElevenLabs",
				),
			},
		],
	},
	{
		title: "Training",
		items: [
			{
				location: "Punjab, India",
				company: "Bangalore Computer Education",
				role: "MERN Stack Development + AI Integration Training",
				date: "June 2025 - Aug 2025",
				generalPoint:
					"Hands-on training building production-style MERN applications with first-class AI integration, focused on shipping responsive, maintainable full-stack features end-to-end.",
				points: [],
				certificate:
					"https://drive.google.com/file/d/1rY3FJ0Zfqx1hOdFl-vjG_Pl1Wp1BqcG8/view?usp=sharing",
				skills: pickSkills(
					"MongoDB",
					"Express",
					"React",
					"Node.js",
					"Redux",
					"Tailwind CSS",
					"Gemini",
				),
			},
			{
				location: "Punjab, India",
				company: "Bangalore Computer Education",
				role: "Data Structures and Algorithms Training",
				date: "Dec 2024 - Mar 2025",
				generalPoint:
					"Structured DSA program centered on building strong problem-solving instincts — practicing time and space tradeoffs across competitive programming patterns.",
				points: [],
				certificate:
					"https://drive.google.com/file/d/1mfCPu-_HIxtpQ9BmfRtOwTAolsryGTap/view?usp=sharing",
				skills: pickSkills("C++", "JavaScript", "Leetcode", "Hackerrank"),
			},
			{
				location: "Punjab, India",
				company: "Bangalore Computer Education",
				role: "NodeJS Full Stack Development Training",
				date: "June 2024 - July 2024",
				generalPoint:
					"Foundational full-stack training built around the Node.js ecosystem — server-side fundamentals, RESTful API design, persistence, and core security and performance practices.",
				points: [],
				certificate:
					"https://drive.google.com/file/d/1B-axWT0ka9cSEM2wT0wOrLmXubBDln5a/view?usp=sharing",
				skills: pickSkills(
					"HTML5",
					"CSS3",
					"JavaScript",
					"jQuery",
					"Node.js",
					"Express",
					"MySQL",
					"Cloudinary",
				),
			},
		],
	},
];
