/*
 * SkillsData.ts
 * Curated skill categories for the home-page Skills section.
 * A focused subset of the full skillsData enriched with
 * per-skill project / experience references shown in popovers.
 * Types live in src/types/skill.ts.
 */

import type { Skill, SkillCategory } from "@/types/skill";

export const SkillCategories: SkillCategory[] = [
	{
		title: "Core Web",
		skills: [
			{
				name: "Next.js",
				Icon: "https://svgl.app/library/nextjs_icon_dark.svg",
				usedIn: [
					"App Router with nested layouts, dynamic segments & route groups",
					"SSR, SSG, and ISR across production SaaS apps",
					"Middleware for auth guards, redirects & session validation",
				],
			},
			{
				name: "TypeScript",
				Icon: "https://svgl.app/library/typescript.svg",
				usedIn: [
					"Strict mode across all production codebases",
					"Typed API client abstraction layers with Zod validation",
					"Schema-driven data modeling for complex UI state",
				],
			},
			{
				name: "React",
				Icon: "https://svgl.app/library/react_dark.svg",
				usedIn: [
					"Complex stateful UIs — editors, modals, dashboards",
					"Custom hooks for data fetching, optimistic updates & side effects",
					"Component-driven architecture with reusable design systems",
				],
			},
			{
				name: "Tailwind CSS",
				Icon: "https://svgl.app/library/tailwindcss.svg",
				usedIn: [
					"Responsive, utility-first styling across SaaS frontends",
					"Dark/light theming with CSS variable integration",
					"Rapid UI prototyping without leaving markup",
				],
			},
			{
				name: "Node.js",
				Icon: "https://svgl.app/library/nodejs.svg",
				usedIn: [
					"REST API development with auth & rate limiting",
					"Background job processing and webhook handling",
					"Server-side integration with third-party services",
				],
			},
			{
				name: "Express",
				Icon: "https://svgl.app/library/expressjs_dark.svg",
				usedIn: [
					"Custom middleware pipelines for auth & validation",
					"RESTful API architecture for full-stack apps",
				],
			},
			{
				name: "Shadcn",
				Icon: "https://svgl.app/library/shadcn-ui_dark.svg",
				usedIn: [
					"Base component library extended with custom variants",
					"Accessible dialogs, dropdowns & form primitives in production UIs",
				],
			},
			{
				name: "Motion",
				Icon: "https://svgl.app/library/motion_dark.svg",
				usedIn: [
					"Page transitions, scroll animations & entrance effects",
					"Gesture-driven interactions and layout animations",
				],
			},
		],
	},
	{
		title: "Data & Media",
		skills: [
			{
				name: "MongoDB",
				Icon: "https://svgl.app/library/mongodb-icon-dark.svg",
				usedIn: [
					"Document storage for SaaS entities — users, orgs, campaigns",
					"Slug-based content lookup and visitor analytics tracking",
				],
			},
			{
				name: "PostgreSQL",
				Icon: "https://svgl.app/library/postgresql.svg",
				usedIn: [
					"Relational data modeling for multi-tenant SaaS",
					"Used with Supabase for RBAC and structured queries",
				],
			},
			{
				name: "Firebase",
				Icon: "https://svgl.app/library/firebase.svg",
				usedIn: [
					"Realtime Firestore for live data sync in media tracking",
					"Firebase Auth for user identity and session management",
				],
			},
			{
				name: "Cloudinary",
				Icon: "https://svgl.app/library/cloudinary.svg",
				usedIn: [
					"Media upload, transformation & optimized CDN delivery",
					"Image processing pipelines for user-generated content",
				],
			},
		],
	},
	{
		title: "Auth & Security",
		skills: [
			{
				name: "Auth0",
				Icon: "https://svgl.app/library/auth0.svg",
				usedIn: [
					"OAuth 2.0 / OIDC flows with role-based access control",
					"Token validation in API middleware layers",
				],
			},
			{
				name: "JWT",
				Icon: "https://svgl.app/library/jwt.svg",
				usedIn: [
					"Stateless session management across API routes",
					"Custom token validation in server middleware",
				],
			},
			{
				name: "Upstash",
				Icon: "https://svgl.app/library/upstash.svg",
				usedIn: [
					"Serverless Redis for rate limiting on API routes",
					"reCAPTCHA v3 + OWASP-compliant request throttling",
				],
			},
			{
				name: "Redis",
				Icon: "https://svgl.app/library/redis.svg",
				usedIn: [
					"Multi-layered API security with sliding window rate limits",
					"Caching and deduplication for high-frequency endpoints",
				],
			},
		],
	},
	{
		title: "Testing",
		skills: [
			{
				name: "Vitest",
				Icon: "https://svgl.app/library/vitest.svg",
				usedIn: [
					"Unit & integration test suites for middleware and API routes",
					"Mocking complex modules — Upstash Redis, reCAPTCHA, Stripe",
					"Coverage for auth flows, redirects & error boundary paths",
				],
			},
			{
				name: "happy-dom",
				Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/happy-dom.svg",
				usedIn: ["Lightweight DOM environment for server-rendered component tests"],
			},
		],
	},
	{
		title: "AI Tools & APIs",
		skills: [
			{
				name: "ElevenLabs",
				Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/eleven-labs-dark.svg",
				usedIn: ["AI voiceover generation integrated into automated video production"],
			},
			{
				name: "Claude",
				Icon: "https://svgl.app/library/claude-ai-icon.svg",
				usedIn: [
					"AI-assisted code generation, refactoring & architecture planning",
					"Prompt engineering for structured agent workflows",
				],
			},
			{
				name: "MCP",
				Icon: "https://svgl.app/library/model-context-protocol-dark.svg",
				usedIn: [
					"Tool-augmented AI workflows with context-aware agents",
					"Connecting LLMs to local dev environment and external services",
				],
			},
			{
				name: "Ollama",
				Icon: "https://svgl.app/library/ollama_dark.svg",
				usedIn: [
					"Running local LLMs for offline-capable AI features",
					"Low-latency inference for personal AI assistant tooling",
				],
			},
			{
				name: "OpenRouter",
				Icon: "https://svgl.app/library/openrouter_dark.svg",
				usedIn: [
					"Unified API gateway for switching between LLM providers",
					"Multi-model routing in AI-powered personal projects",
				],
			},
		],
	},
];

export const skillsData: Skill[] = [
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
	{
		name: "React Router",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/reactrouter-dark.svg",
	},
	{
		name: "jQuery",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/jquery.svg",
	},
	{ name: "Bootstrap", Icon: "https://svgl.app/library/bootstrap.svg" },
	{ name: "Material UI", Icon: "https://svgl.app/library/materialui.svg" },
	{ name: "Node.js", Icon: "https://svgl.app/library/nodejs.svg" },
	{ name: "Express", Icon: "https://svgl.app/library/expressjs_dark.svg" },
	{ name: "Go", Icon: "https://svgl.app/library/golang_dark.svg" },
	{ name: "Bun", Icon: "https://svgl.app/library/bun.svg" },
	{ name: "C#", Icon: "https://svgl.app/library/csharp.svg" },
	{ name: ".NET", Icon: "https://svgl.app/library/dotnet.svg" },
	{
		name: "SQL",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/sql.svg",
	},
	{ name: "MongoDB", Icon: "https://svgl.app/library/mongodb-icon-dark.svg" },
	{ name: "MySQL", Icon: "https://svgl.app/library/mysql-icon-dark.svg" },
	{ name: "PostgreSQL", Icon: "https://svgl.app/library/postgresql.svg" },
	{ name: "Supabase", Icon: "https://svgl.app/library/supabase.svg" },
	{ name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
	{ name: "Upstash", Icon: "https://svgl.app/library/upstash.svg" },
	{ name: "Redis", Icon: "https://svgl.app/library/redis.svg" },
	{ name: "JavaScript", Icon: "https://svgl.app/library/javascript.svg" },
	{ name: "Python", Icon: "https://svgl.app/library/python.svg" },
	{ name: "C", Icon: "https://svgl.app/library/c.svg" },
	{ name: "C++", Icon: "https://svgl.app/library/c-plusplus.svg" },
	{
		name: "Leetcode",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/leetcode-dark.svg",
	},
	{
		name: "Hackerrank",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/hacker-rank-dark.svg",
	},
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
	{
		name: "CLion",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/c-lion.svg",
	},
	{ name: "Cloudinary", Icon: "https://svgl.app/library/cloudinary.svg" },
	{
		name: "Firestore",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/firestore.svg",
	},
	{ name: "SVG", Icon: "https://svgl.app/library/svg.svg" },
	{
		name: "Vercel Blob",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/vercel-blob-dark.svg",
	},
	{
		name: "Azure Blob",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/azure-blob-dark.svg",
	},
	{
		name: "FFmpeg",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/ffmpeg.svg",
	},
	{
		name: "FFmpeg WASM",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/ffmpeg-wasm.svg",
	},
	{ name: "Gemini", Icon: "https://svgl.app/library/gemini.svg" },
	{
		name: "ChatGPT",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/chatgpt-dark.svg",
	},
	{ name: "Claude", Icon: "https://svgl.app/library/claude-ai-icon.svg" },
	{ name: "Firebase Studio", Icon: "https://svgl.app/library/firebase-studio.svg" },
	{ name: "MCP", Icon: "https://svgl.app/library/model-context-protocol-dark.svg" },
	{ name: "Perplexity", Icon: "https://svgl.app/library/perplexity.svg" },
	{ name: "Grok", Icon: "https://svgl.app/library/grok-dark.svg" },
	{ name: "Ollama", Icon: "https://svgl.app/library/ollama_dark.svg" },
	{
		name: "ElevenLabs",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/eleven-labs-dark.svg",
	},
	{ name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
	{ name: "Auth0", Icon: "https://svgl.app/library/auth0.svg" },
	{ name: "Authy", Icon: "https://svgl.app/library/authy.svg" },
	{ name: "JWT", Icon: "https://svgl.app/library/jwt.svg" },
	{ name: "Auth.js", Icon: "https://svgl.app/library/authjs.svg" },
	{
		name: "Passport.js",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/passport-js-dark.svg",
	},
	{ name: "Vitest", Icon: "https://svgl.app/library/vitest.svg" },
	{ name: "Jest", Icon: "https://svgl.app/library/jest.svg" },
	{
		name: "happy-dom",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/happy-dom.svg",
	},
	{
		name: "jsdom",
		Icon: "https://media-server.akshitbansal.me/api/images/logos/non-svgl/jsdom.svg",
	},
];
