/*
 * homeSkillsData.ts
 * Curated skill categories for the home-page Skills section.
 * A focused subset of the full skillsData enriched with
 * per-skill project / experience references shown in popovers.
 */

// A skill with an optional list of places it was used.
export interface HomeSkill {
	name: string;
	Icon: string;
	usedIn: string[];
}

// One display category for the home-page skills grid.
export interface HomeSkillCategory {
	title: string;
	skills: HomeSkill[];
}

export const homeSkillCategories: HomeSkillCategory[] = [
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
