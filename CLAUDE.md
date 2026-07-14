# CLAUDE.md — Personal Finance AI Learning Platform

## Project Overview

This is an AI-powered personal finance learning platform. Users complete a hybrid onboarding flow (structured form + conversational chat), and the system uses LangChain to generate a personalized, progressive learning path from a curated module catalog. A Socratic chat advisor guides users with questions rather than direct answers. The monorepo contains the NestJS API (`apps/api`), Next.js frontend (`apps/web`), and shared TypeScript types (`packages/shared-types`).

## Monorepo Layout

| Workspace | Role |
|---|---|
| `apps/api` | NestJS REST API + SSE streaming; deployed on Railway |
| `apps/web` | Next.js frontend (App Router); deployed on Vercel |
| `packages/shared-types` | DTOs and enums shared between api and web |

## Shared Types

- Always import shared types from `@personal-finance/shared-types`, never copy-paste types between apps.
- After modifying anything in `packages/shared-types/src/`, run `npm run build` inside that package before using the updated types in the apps.
- DTOs live in `src/dtos/`, enums in `src/enums/`, both exported via their respective `index.ts` and the package root `index.ts`.

## Tech Constraints

- **Backend**: NestJS module system only — no raw Express patterns, no ad-hoc middleware outside NestJS conventions.
- **ORM**: Prisma only — no raw SQL queries except in migration files.
- **AI**: LangChain provider-agnostic — never import the OpenAI SDK or any other provider SDK directly. All LLM calls go through LangChain abstractions so the provider can be swapped.
- **Auth**: JWT + bcrypt, fully owned — do not introduce Passport.js, Auth0, or any third-party auth provider unless explicitly asked.

## AI / LangChain Rules

Every LangChain call must compose the following context window before invoking the LLM:

1. Full user financial profile (`UserProfile` fields)
2. Summary of completed modules (titles + topics)
3. Last N chat messages (for the chat advisor)

The Socratic method is enforced at the **prompt engineering layer**. System prompts for both module delivery and the chat advisor must instruct the AI never to provide direct answers — only guiding questions. Do not add any code path that short-circuits this and returns a direct answer.

Learning path generation is progressive:
- Generate 2-3 modules immediately after onboarding completes.
- Generate additional modules each time the user completes a module.

## Testing Rules

- **No database mocks.** Backend tests run against a real test PostgreSQL database. This is non-negotiable — mock/prod divergence has caused issues before.
- AI layer tests assert that responses are non-empty, stream correctly, and contain contextual markers from the seeded profile. Never assert exact content.
- Frontend tests use Playwright E2E, not unit tests for UI components.

## Database

- Prisma schema is at `apps/api/prisma/schema.prisma`.
- pgvector is enabled on the `Module.embedding` field for semantic RAG retrieval.
- `User.subscription_status` defaults to `free` and is reserved for future Stripe integration — **do not remove this field**.
- Run migrations with `npx prisma migrate dev` from `apps/api/`.

## Streaming

- Chat advisor responses stream via **Server-Sent Events**: NestJS `@Sse()` decorator on the api side, `EventSource` on the Next.js side.
- Do not switch this to WebSockets.

## Out of Scope

Do not implement, stub, or add configuration for any of the following — they are explicitly deferred:

- Stripe / payment processing
- OAuth / social login
- User analytics dashboard
- Multi-tenancy or B2B features
- Mobile native app
- External content ingestion (RSS, PDFs, third-party APIs)
- Email notifications or reminders
