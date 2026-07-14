# CLAUDE.md — apps/api

NestJS backend for the Personal Finance AI Learning Platform. See the root `CLAUDE.md` for cross-cutting rules (LangChain, testing, streaming, out-of-scope items).

## Module Structure

All feature logic lives in NestJS modules under `src/`:

| Module | Responsibility |
|---|---|
| `auth` | JWT issuance, bcrypt password hashing, `JwtAuthGuard`, `RolesGuard` |
| `users` | User CRUD, `UserProfile` management |
| `onboarding` | Orchestrates the two-step onboarding flow; triggers initial learning path generation on completion |
| `learning-path` | LangChain-powered path generation; progressive module addition as the user progresses |
| `modules` | Curated content (Topics + Modules); vector embeddings via pgvector |
| `chat` | Socratic chat advisor; SSE streaming; chat history persistence |
| `admin` | Protected CRUD endpoints for topics and modules (requires `ADMIN` role) |

## Auth

- JWT + bcrypt. No third-party auth provider.
- `JwtAuthGuard` applied globally; routes that need to be public are decorated with `@Public()`.
- `RolesGuard` + `@Roles(UserRole.ADMIN)` gates the admin module.
- `User.subscription_status` exists for future Stripe — do not remove it.

## Prisma

- Schema: `prisma/schema.prisma`
- Migrations: `npx prisma migrate dev`
- Seeding: `npx prisma db seed` (seeds topics and modules for the curated content catalog)
- Client is provided via a `PrismaModule` / `PrismaService` singleton — import it, don't instantiate `PrismaClient` directly.

## LangChain Context Composition

Every LangChain invocation must compose this context before calling the LLM:

```typescript
// Pseudocode — actual implementation may vary
const context = {
  profile: await this.usersService.getProfile(userId),
  completedModules: await this.learningPathService.getCompletedSummaries(userId),
  chatHistory: await this.chatService.getLastN(userId, N),
};
```

Retrieve the most relevant curated modules for a user's profile using pgvector semantic search before generating a learning path.

## Streaming (SSE)

Chat advisor endpoint pattern:

```typescript
@Sse('chat/stream')
@UseGuards(JwtAuthGuard)
streamChat(@Body() dto: ChatDto, @Req() req): Observable<MessageEvent> {
  return this.chatService.streamResponse(req.user.id, dto);
}
```

Pipe the LangChain stream into an `Observable<MessageEvent>`. Do not buffer the full response before sending.

## Database Schema Reference

| Entity | Key fields |
|---|---|
| `User` | id, email, password_hash, subscription_status, created_at |
| `UserProfile` | userId (1:1), income_range, expenses, debt, savings, age, knowledge_level, risk_tolerance, goals (text), fears (text) |
| `Topic` | id, title, description |
| `Module` | id, topicId, title, content, difficulty, prerequisites (string[]), embedding (vector) |
| `LearningPath` | id, userId, created_at |
| `LearningPathModule` | id, learningPathId, moduleId, order, status (not_started/in_progress/completed), generated_content |
| `ChatMessage` | id, userId, role (user/assistant), content, created_at |

## Testing

- E2E tests use **Supertest** against a real test PostgreSQL database — no mocks for the DB layer.
- Cover the full loop: registration → onboarding → learning path generated → module completed → new module generated.
- AI integration tests: seed a user profile, call LangChain, assert response is non-empty, streams, and references profile context. No exact content assertions.
- Test database URL is set via `DATABASE_URL` in the test environment (separate DB from dev).

```bash
npm run test        # unit tests
npm run test:e2e    # E2E suite against test DB
```
