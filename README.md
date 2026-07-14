# Personal Finance AI Learning Platform

A restricted-access platform that gathers each user's financial profile during onboarding and uses AI to dynamically generate a personalized, progressive learning path through curated personal finance and investing content. A built-in Socratic chat advisor reinforces learning by guiding users to discover answers rather than simply delivering them.

## Key Features

- **Personalized learning path** — AI generates 2-3 modules after onboarding and continues adding modules as you complete each one
- **Socratic chat advisor** — responds with guiding questions rather than direct answers to build genuine understanding
- **Hybrid onboarding UX** — structured form for numeric inputs (age, income, debt, savings) + conversational chat for open-ended questions (goals, fears)
- **Streaming AI responses** — tokens rendered word-by-word via Server-Sent Events
- **Progress tracking** — modules carry `not_started`, `in_progress`, or `completed` status
- **Admin content management** — CRUD for topics and modules; curated content is the foundation the AI builds learning paths from

## Architecture

```
monorepo (npm workspaces)
├── apps/api       — NestJS REST API + SSE streaming     → deployed on Railway
├── apps/web       — Next.js frontend (App Router)       → deployed on Vercel
└── packages/
    └── shared-types — DTOs and enums shared across apps
                                                          ↕
                                          PostgreSQL + pgvector on Railway
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | NestJS |
| ORM | Prisma |
| Database | PostgreSQL with pgvector extension |
| AI / LLM orchestration | LangChain (provider-agnostic) |
| Auth | JWT + bcrypt (fully owned, no third-party provider) |
| Streaming | Server-Sent Events (`@Sse()` in NestJS, `EventSource` in Next.js) |
| Frontend framework | Next.js (App Router) |
| Language | TypeScript |
| Package manager | npm workspaces |
| Backend hosting | Railway |
| Frontend hosting | Vercel |

## Monorepo Structure

```
.
├── apps/
│   ├── api/                  # NestJS backend
│   │   └── src/
│   │       ├── auth/         # JWT auth, bcrypt, guards
│   │       ├── users/        # User CRUD, profile management
│   │       ├── onboarding/   # Onboarding flow (form + chat steps)
│   │       ├── learning-path/# Path generation, module sequencing
│   │       ├── modules/      # Curated content (topics + modules)
│   │       ├── chat/         # Socratic chat advisor, SSE streaming
│   │       └── admin/        # Admin-only topic/module CRUD
│   └── web/                  # Next.js frontend
│       └── src/app/
│           ├── (auth)/       # Login and registration pages
│           ├── onboarding/   # Hybrid onboarding flow
│           ├── dashboard/    # Learning path view
│           ├── modules/      # Module view (Socratic Q&A)
│           ├── chat/         # Chat advisor page
│           └── admin/        # Admin panel (protected)
└── packages/
    └── shared-types/         # Shared DTOs and enums
        └── src/
            ├── dtos/         # UserDto, ModuleDto, LearningPathDto, ChatMessageDto
            └── enums/        # UserRole, LearningPathStatus, ModuleType, ChatMessageRole
```

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+ with the [pgvector](https://github.com/pgvector/pgvector) extension enabled

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment variables**

Copy the example env files in each app:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Key variables for `apps/api/.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/pfai
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...   # or whichever LangChain provider you configure
```

Key variables for `apps/web/.env`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**3. Set up the database**

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed   # loads seed topics and modules
```

**4. Build shared types**

```bash
cd packages/shared-types
npm run build
```

## Development

Run the api and web apps in separate terminals:

```bash
# Terminal 1 — backend
npm run dev --workspace=apps/api

# Terminal 2 — frontend
npm run dev --workspace=apps/web
```

Or run both from the root if workspace scripts are wired up:

```bash
npm run dev
```

The api runs on `http://localhost:3001` and the web on `http://localhost:3000` by default.

## Testing Strategy

- **Backend E2E** — Supertest against a real test PostgreSQL database; no mocks for the database layer. Tests cover the full flow: onboarding → learning path generation → module completion → new module generation.
- **AI layer** — Integration tests that call LangChain with a seeded user profile and assert the response is non-empty, streams correctly, and contains contextual markers from the profile. No exact content matching.
- **Frontend E2E** — Playwright tests covering golden paths: registration → onboarding → first module → chat interaction.

```bash
# Backend tests
npm run test --workspace=apps/api
npm run test:e2e --workspace=apps/api

# Frontend tests
npm run test --workspace=apps/web
```

## Deployment

| Service | Platform | Trigger |
|---|---|---|
| `apps/api` | Railway | Push to `main` |
| PostgreSQL + pgvector | Railway | Managed by Railway |
| `apps/web` | Vercel | Push to `main` |

## Database Schema (key entities)

| Entity | Key fields |
|---|---|
| `User` | id, email, password_hash, subscription_status, created_at |
| `UserProfile` | userId (1:1), income_range, expenses, debt, savings, age, knowledge_level, risk_tolerance, goals, fears |
| `Topic` | id, title, description |
| `Module` | id, topicId, title, content, difficulty, prerequisites[], embedding (vector) |
| `LearningPath` | id, userId, created_at |
| `LearningPathModule` | id, learningPathId, moduleId, order, status (not_started/in_progress/completed), generated_content |
| `ChatMessage` | id, userId, role (user/assistant), content, created_at |

`subscription_status` on `User` defaults to `free` and is reserved for future Stripe integration — do not remove it.

## Out of Scope

- Payment processing / Stripe integration (field is reserved but not wired)
- Social login (OAuth)
- User analytics dashboard for admins
- Multi-tenancy / B2B
- Mobile native app
- External content ingestion (RSS, PDFs, third-party APIs)
- AI-assisted admin content authoring (planned for v2)
- Notifications or email reminders
