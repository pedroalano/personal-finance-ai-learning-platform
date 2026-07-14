# CLAUDE.md — apps/web

Next.js frontend for the Personal Finance AI Learning Platform. See the root `CLAUDE.md` for cross-cutting rules.

## Router

**App Router only** — all pages are under `src/app/`. Do not use the Pages Router.

## Route Structure

| Route | Page |
|---|---|
| `/(auth)/login` | Login form |
| `/(auth)/register` | Registration form |
| `/onboarding` | Hybrid onboarding flow (see below) |
| `/dashboard` | Personalized learning path view |
| `/modules/[id]` | Socratic module view |
| `/chat` | Chat advisor (persistent page or sidebar) |
| `/admin` | Admin panel (protected, `ADMIN` role only) |

## Onboarding UX

The onboarding flow is **hybrid**:

1. **Structured form steps** for simple numeric/range inputs: age, income range, monthly expenses, total debt, savings.
2. **Chat-bubble interface** for open-ended questions: financial goals, fears about money, investment aspirations.

Do not collapse both into a single form or a single chat — the distinction is intentional (fast data entry for numbers, engaging conversation for qualitative inputs).

## Learning Path View (`/dashboard`)

- Renders an ordered list of `LearningPathModule` items.
- Each module card shows its status: `not_started`, `in_progress`, or `completed`.
- New modules appear automatically as the user completes existing ones (poll or use a refetch trigger after completion).

## Module View (`/modules/[id]`)

- Socratic interactive content: the AI asks questions and waits for user responses.
- Not a passive article/reading view — every screen interaction involves a prompt from the AI.
- Module completion is triggered explicitly (e.g., a "Mark complete" action), not inferred from scroll position.

## Chat Advisor (`/chat`)

- Persistent chat interface — history is loaded from the api on mount.
- User sends a message → POST to api → api streams tokens back via SSE.
- Consume the SSE stream with `EventSource` and append tokens to the current assistant message as they arrive.
- Do not buffer the full response and render it at once.

```typescript
// SSE consumption pattern
const source = new EventSource(`${API_URL}/chat/stream?token=${jwt}`);
source.onmessage = (e) => appendToken(JSON.parse(e.data).token);
source.onerror = () => source.close();
```

## Admin Panel (`/admin`)

- Protected routes: redirect to `/login` if the user's role is not `ADMIN`.
- CRUD for Topics and Modules — standard form + table pattern.
- No rich text editor required; plain textarea for module `content`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the NestJS api (e.g., `https://api.yourdomain.railway.app`) |

## Deployment

Deployed to Vercel on push to `main`. No build-time configuration beyond the env vars above.
