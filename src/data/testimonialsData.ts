/*
 * testimonialsData.ts
 * Static list of testimonials shown in the auto-scrolling
 * Testimonials section. Each entry carries author identity,
 * accent color (avatar tint), and the quoted feedback text.
 * Types live in src/types/testimonial.ts.
 */

import type { TestimonialItem } from "@/types/testimonial";

// All testimonials in display order; duplicated at render-time for looping.
export const testimonials: TestimonialItem[] = [
	{
		id: "1",
		name: "Ravi Sharma",
		email: "ravi.sharma@trupeer.ai",
		role: "Senior Engineer",
		company: "Trupeer",
		initials: "RS",
		accentColor: "bg-indigo-500",
		text: "Akshit consistently delivered high-quality work that exceeded expectations. His ability to quickly understand complex systems and contribute meaningfully from day one was genuinely impressive.",
	},
	{
		id: "2",
		name: "Priya Mehta",
		email: "priya.mehta@trupeer.ai",
		role: "Product Manager",
		company: "Trupeer",
		initials: "PM",
		accentColor: "bg-rose-500",
		text: "Working with Akshit was a pleasure. He brought both technical excellence and great collaborative energy to every sprint. His work on the subtitle system was a game-changer for our product.",
	},
	{
		id: "3",
		name: "Arjun Patel",
		email: "arjun.patel@bce.in",
		role: "Technical Instructor",
		company: "Bangalore Computer Education",
		initials: "AP",
		accentColor: "bg-amber-500",
		text: "Akshit was one of the most dedicated students I've taught. His grasp of concepts was fast and his projects always went beyond what was asked. A true self-starter who doesn't wait to be guided.",
	},
	{
		id: "4",
		name: "Sneha Reddy",
		email: "sneha.r@dev.io",
		role: "Full Stack Developer",
		company: "Open Source Collab",
		initials: "SR",
		accentColor: "bg-emerald-500",
		text: "Collaborated with Akshit on an open-source project. His code is clean, well-documented, and he communicates clearly across async environments. Would love to build together again.",
	},
	{
		id: "5",
		name: "Karan Verma",
		email: "karan.v@techteam.in",
		role: "Tech Lead",
		company: "Freelance Project",
		initials: "KV",
		accentColor: "bg-cyan-500",
		text: "Akshit's ability to architect scalable solutions while keeping code maintainable is rare at his level. He takes ownership and delivers end-to-end without needing hand-holding.",
	},
	{
		id: "6",
		name: "Nisha Gupta",
		email: "nisha.g@design.co",
		role: "UI/UX Designer",
		company: "Collaborative Project",
		initials: "NG",
		accentColor: "bg-violet-500",
		text: "As a designer, I appreciate devs who care about details. Akshit faithfully implemented every spec and proactively surfaced improvements. That kind of collaboration is what makes great products.",
	},
	{
		id: "7",
		name: "Dev Malhotra",
		email: "dev.m@startup.io",
		role: "Co-Founder",
		company: "SideProject",
		initials: "DM",
		accentColor: "bg-pink-500",
		text: "Akshit built our MVP in record time. His Next.js skills are top-notch and the performance he achieved right from the start saved us months of optimization work later on.",
	},
	{
		id: "8",
		name: "Ananya Singh",
		email: "ananya.s@cloudops.dev",
		role: "DevOps Engineer",
		company: "Collaborative Work",
		initials: "AS",
		accentColor: "bg-orange-500",
		text: "Akshit understands deployment concerns better than most frontend devs I've worked with. He thinks beyond just making it work — he makes it work reliably, at scale, under real conditions.",
	},
];
