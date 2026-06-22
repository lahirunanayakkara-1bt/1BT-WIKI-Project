# API (Express + TypeScript)

Minimal Express + TypeScript scaffold with a simple MVC and repository pattern example.

Scripts:

- `pnpm --filter ./apps/api dev` — start dev server with hot reload (requires `ts-node-dev`).
- `pnpm --filter ./apps/api build` — compile TypeScript to `dist/`.
- `pnpm --filter ./apps/api start` — run compiled server.

Endpoints:

- `GET /api/users` — list users
- `POST /api/users` — create user { name, email }
