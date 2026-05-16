# AGENTS.md

> Rules for every AI agent operating in this codebase. Read fully before any action.
> Non-negotiable. No exceptions unless explicitly overridden per-task.

---

## 0. Prime Directive

**Plan → Verify → Execute. Never the reverse.**

Before writing a single line: state what you're doing, what files you'll touch, and what the expected outcome is. If uncertain about scope, ask. One question, not five.

---

## 1. Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript — strict mode |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| State | React state / context (no Redux unless pre-existing) |
| Forms | React Hook Form + Zod |
| HTTP | Custom fetch abstraction (see `lib/api`) |
| Auth | As configured per project |
| Testing | Vitest + React Testing Library |
| Package Manager | As indicated by lockfile (`pnpm` default) |

Never introduce a new dependency without flagging it first.

---

## 2. Project Structure

Follow this layout. Do not deviate unless the project already diverges — in that case, match existing convention.

```
src/
├── app/                        # App Router — pages, layouts, routes only
│   ├── (groups)/               # Route groups for shared layouts
│   ├── api/                    # Route handlers
│   └── [...page]/
│       ├── page.tsx
│       ├── layout.tsx
│       └── loading.tsx / error.tsx
├── components/
│   ├── ui/                     # shadcn/ui primitives — do not modify
│   ├── common/                 # Reusable app-level components
│   └── [feature]/              # Feature-scoped components
├── lib/
│   ├── api/                    # Fetch abstractions, API clients
│   ├── utils/                  # Pure utility functions
│   ├── validations/            # Zod schemas — shared across forms + API
│   └── constants/              # App-wide constants
├── hooks/                      # Custom React hooks
├── types/                      # Global TypeScript types/interfaces
├── config/                     # App config, env schema
└── styles/                     # Global CSS only
```

### Naming

| Thing | Convention |
|---|---|
| Components | `PascalCase.tsx` |
| Hooks | `use-kebab-case.ts` |
| Utilities | `kebab-case.ts` |
| Types | `PascalCase` (interface preferred over type for objects) |
| Constants | `SCREAMING_SNAKE_CASE` |
| Route segments | `kebab-case` |

---

## 3. Component Rules

### 3.1 Server vs Client

Default to **Server Components**. Add `"use client"` only when the component needs:
- `useState` / `useReducer`
- `useEffect`
- Browser APIs
- Event handlers
- Framer Motion animations

Push `"use client"` as far down the tree as possible. Never make a layout or page client-side just to pass a handler.

### 3.2 Structure (every component)

```tsx
// 1. Imports — external, then internal, then types
// 2. Types / interfaces
// 3. Constants (if component-local)
// 4. Component function
// 5. Sub-components (if small and tightly coupled)
// 6. Default export
```

### 3.3 Props

- Always define a `Props` interface. Never inline complex prop types.
- Destructure in the function signature.
- Use `children: React.ReactNode` not `JSX.Element`.
- `className?: string` on every reusable component — allow override.

```tsx
interface CardProps {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export default function Card({ title, description, className, children }: CardProps) {
  ...
}
```

### 3.4 No Duplication

Before creating any component, hook, or utility — **search the codebase**. If something does 80%+ of what you need, extend it. Do not create a parallel implementation.

---

## 4. TypeScript

- `strict: true` — always. No `any`. No `@ts-ignore` without a comment explaining why.
- Use `unknown` over `any` for truly unknown shapes, then narrow.
- Colocate types with the code that uses them. Move to `types/` only when shared across 3+ files.
- Never use `as` casting to silence errors — fix the actual type.
- API response types live in `lib/api/` alongside the fetcher.

```ts
// Bad
const data = response as SomeType

// Good
function isSomeType(val: unknown): val is SomeType {
  return typeof val === 'object' && val !== null && 'id' in val
}
```

---

## 5. Data Fetching

### 5.1 App Router Patterns

- **Server Components**: fetch directly, no useEffect, no SWR/React Query.
- **Client Components**: use a custom hook wrapping fetch, or a lib function.
- **Route Handlers** (`app/api/`): validate input with Zod before touching any DB or external service.

### 5.2 Fetch Abstraction

All HTTP calls go through `lib/api/`. Never raw-fetch in a component.

```ts
// lib/api/client.ts
export async function apiGet<T>(path: string, options?: RequestInit): Promise<T>
export async function apiPost<T>(path: string, body: unknown, options?: RequestInit): Promise<T>
```

### 5.3 Error Handling

Every fetch must handle errors explicitly. No silent failures.

```ts
const { data, error } = await safeFetch<ResponseType>(...)
if (error) { /* handle */ return }
```

### 5.4 Caching

Use Next.js cache directives explicitly:
```ts
fetch(url, { next: { revalidate: 60 } })   // ISR
fetch(url, { cache: 'no-store' })           // SSR
fetch(url, { cache: 'force-cache' })        // Static
```

---

## 6. Forms

All forms: React Hook Form + Zod. No exceptions.

```ts
// lib/validations/some-feature.ts
export const someSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
})
export type SomeFormData = z.infer<typeof someSchema>
```

```tsx
const form = useForm<SomeFormData>({
  resolver: zodResolver(someSchema),
  defaultValues: { ... }
})
```

- Schema in `lib/validations/` — reused by both form and API route handler.
- Never duplicate validation logic between client and server.

---

## 7. API Routes

Structure every route handler the same way:

```ts
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({ ... })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    // business logic here

    return NextResponse.json({ data: result })
  } catch (err) {
    console.error('[POST /api/resource]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

Always:
- Validate input with Zod before anything else.
- Return typed, consistent response shapes: `{ data }` or `{ error }`.
- Log errors with route context.
- Apply rate limiting if the route is public-facing (Upstash Redis).

---

## 8. Styling

- Tailwind only. No inline `style={{}}` unless dealing with dynamic CSS custom properties.
- Use `cn()` (from `lib/utils`) to merge class names — always.
- For CSS custom properties (e.g., brand color contracts), use inline style only for the variable, not for full styling.
- Responsive: mobile-first. `sm:` / `md:` / `lg:` breakpoints.
- Dark mode: use Tailwind `dark:` variants, not JS toggling.
- Never hardcode colors directly — use Tailwind tokens or CSS variables.

```tsx
// Bad
<div style={{ color: '#e11d48' }}>

// Good
<div className="text-rose-600 dark:text-rose-400">

// Acceptable — dynamic CSS var only
<div style={{ '--brand': color } as React.CSSProperties} className="text-(--brand)">
```

---

## 9. Performance

- Every `page.tsx` exports `metadata` or a `generateMetadata` function.
- Images: always `next/image`. Never raw `<img>`.
- Fonts: always `next/font`. Never `@import` in CSS.
- Heavy client components: `dynamic(() => import(...), { ssr: false })`.
- Avoid unnecessary `useEffect` — if you can derive it, derive it.
- Never block render with unrelated data fetching. Parallel fetch with `Promise.all`.

```ts
const [users, products] = await Promise.all([getUsers(), getProducts()])
```

---

## 10. Reusability Protocol

> If you're writing the same pattern more than once, stop and abstract it.

### When to abstract

- Repeated JSX structure across 2+ components → new component in `components/common/`
- Repeated fetch + state + error pattern → new hook in `hooks/`
- Repeated transform/util logic → function in `lib/utils/`
- Repeated Zod shape → shared schema in `lib/validations/`

### Hook pattern

```ts
// hooks/use-[thing].ts
export function useThing(id: string) {
  const [data, setData] = useState<Thing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await apiGet<Thing>(`/api/things/${id}`)
        if (!cancelled) setData(result)
      } catch (e) {
        if (!cancelled) setError('Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  return { data, loading, error }
}
```

---

## 11. State Management

- Component state: `useState`
- Derived state: compute it, don't store it
- Shared state across siblings: lift up or context
- Global app state: context + `useReducer`
- Server state: React cache / fetch cache, not client state
- Never store server data in client state unless you need to mutate it locally

---

## 12. Security

For any public-facing route or form:

| Concern | Implementation |
|---|---|
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Bot protection | reCAPTCHA v3 |
| Spam/honeypot | Hidden honeypot field on public forms |
| CORS | Explicit allowlist in route handler |
| Auth tokens | HttpOnly cookies, never localStorage |
| Input | Zod on every API boundary |
| Env vars | Never expose `NEXT_PUBLIC_` for secrets |

---

## 13. Testing

Every new feature must have tests. No skipping.

### What to test

- Utility functions: unit tests, edge cases
- API route handlers: mock DB/external calls, test success + error paths
- Hooks: `renderHook` with mocked fetch
- Critical UI flows: component tests with user-event

### Vitest patterns

```ts
// Mock modules at top — hoisting matters in Vitest
vi.mock('@/lib/api/client', () => ({
  apiPost: vi.fn(),
}))

// Always import after vi.mock
import { apiPost } from '@/lib/api/client'

describe('Feature', () => {
  beforeEach(() => vi.clearAllMocks())

  it('does the thing', async () => {
    vi.mocked(apiPost).mockResolvedValueOnce({ data: mockResponse })
    // ...
  })
})
```

Do not mock what you don't need to. Test behavior, not implementation.

---

## 14. Git & Commits

Conventional commits. Always.

```
feat(scope): what was added
fix(scope): what was fixed
refactor(scope): what changed without new behavior
test(scope): what was tested
chore(scope): config, deps, tooling
```

- One logical change per commit.
- Never commit: `.env`, `node_modules`, build artifacts, `console.log` left in intentionally.
- Branch naming: `feat/slug`, `fix/slug`, `chore/slug`.

---

## 15. Agent Execution Protocol

### Before starting any task

1. Read this file.
2. Identify all files that will be created or modified. State them explicitly.
3. Check for existing abstractions before building new ones.
4. If the task is ambiguous, ask **one** clarifying question.

### During execution

- Work in logical steps. Complete each step before starting the next.
- Do not refactor unrelated code while implementing a feature.
- If you discover a bug while working, note it. Fix it in a separate step or flag for later — do not silently fix and expand scope.

### After completion

- Verify the implementation matches the plan.
- Check for TypeScript errors.
- Confirm no new dependencies were added without flagging.
- List any follow-up items or known trade-offs.

### Hard stops — ask before proceeding if

- Task requires deleting or renaming more than 2 existing files
- Task requires a new third-party dependency
- The right approach is genuinely unclear
- You're about to modify a shared abstraction used in 3+ places

---

## 16. What Never to Do

- No `any` in TypeScript
- No raw `fetch` in components — use `lib/api/`
- No `useEffect` for data that can be server-fetched
- No `console.log` left in production code
- No hardcoded secrets or API keys anywhere in source
- No new component that duplicates an existing one
- No skipping Zod validation on API routes
- No `as` casting to shut up TypeScript errors
- No `!important` in CSS
- No `<img>` — use `next/image`
- No `@import` fonts — use `next/font`
- No `style={{}}` for anything expressible in Tailwind

---

*Last updated: May 2026 | Stack: Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui*