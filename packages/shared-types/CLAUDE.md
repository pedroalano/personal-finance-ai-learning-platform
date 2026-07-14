# CLAUDE.md — packages/shared-types

TypeScript DTOs and enums shared between `apps/api` and `apps/web`. No business logic lives here.

## What Goes Here

- **DTOs** (`src/dtos/`) — data shapes that cross the API boundary: request bodies, response payloads.
- **Enums** (`src/enums/`) — values that both the api and web need to reference (e.g., `UserRole`, `LearningPathStatus`).

If something is only used inside the api or only inside the web, keep it there — don't promote it here.

## Build

The apps import from compiled output in `dist/`, not from `src/`. After any change to `src/`:

```bash
npm run build   # run from inside packages/shared-types/
```

Both workspaces resolve `@personal-finance/shared-types` to this package via npm workspaces — no symlink management needed.

## Adding a New DTO

1. Create `src/dtos/<entity>.dto.ts` with the interface(s).
2. Export it from `src/dtos/index.ts`.
3. Confirm it's re-exported from the package root `src/index.ts`.
4. Run `npm run build`.

## Adding a New Enum

1. Create `src/enums/<name>.enum.ts`.
2. Export it from `src/enums/index.ts`.
3. Confirm it's re-exported from the package root `src/index.ts`.
4. Run `npm run build`.

## Naming Conventions

- DTOs: `<Entity>Dto`, `Create<Entity>Dto`, `Update<Entity>Dto` — e.g., `UserDto`, `CreateUserDto`.
- Enum files: `<name>.enum.ts` — e.g., `role.enum.ts`, `learning-path-status.enum.ts`.
- Enum type names: PascalCase — e.g., `UserRole`, `LearningPathStatus`.

## Current Types

**DTOs**: `UserDto`, `CreateUserDto`, `UpdateUserDto`, `ModuleDto`, `LearningPathDto`, `ChatMessageDto`

**Enums**: `UserRole` (STUDENT, ADMIN), `LearningPathStatus`, `ModuleType`, `ChatMessageRole`
