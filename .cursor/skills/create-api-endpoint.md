# Skill: Create API Endpoint

Use this prompt template when you need to generate a new REST API endpoint for 1BT WIKI.
Paste this into Cursor's chat and fill in the placeholders.

---

## Prompt Template

```
Create a complete REST API endpoint for 1BT WIKI following the project's layered architecture.

**Endpoint details:**
- HTTP Method: [GET | POST | PATCH | DELETE]
- Route: /api/v1/[resource-path]
- Description: [what this endpoint does]
- Auth required: [Yes / No]
- Roles allowed: [All authenticated | Admin only | Reviewer only | Owner only]
- Domain owner: [Lahiru | Chathurika | Malindu]

**Request body (if POST/PATCH):**
[Describe the expected request body fields and types]

**Response:**
[Describe what should be returned on success]

**Business rules:**
[List any validation rules, state checks, ownership checks, or notifications to trigger]

---

Generate all four layers in this exact structure:
1. **Types** (`src/types/[resource].types.ts`) — input/output interfaces
2. **Repository** (`src/repositories/[resource].repository.ts`) — SQL query method only, parameterized
3. **Service** (`src/services/[resource].service.ts`) — business logic, uses repository, throws AppError
4. **Controller** (`src/controllers/[resource].controller.ts`) — parses req, calls service, returns successResponse()
5. **Route** (add to `src/routes/[resource].routes.ts`) — route definition with middleware

Follow these rules:
- Use `async/await`, no callbacks
- Repository returns raw data or `null` — no AppError in repository
- Service throws `AppError(message, statusCode)` for all error cases
- Controller wraps in try/catch and calls `next(error)` on failure
- Response envelope: `{ success: true, data: {...} }` or `{ success: false, error: "..." }`
- TypeScript strict — no `any` types
- Parameterized SQL only (`$1`, `$2`) — never string interpolation
```

---

## Example (filled in)

```
Create a complete REST API endpoint for 1BT WIKI following the project's layered architecture.

Endpoint details:
- HTTP Method: POST
- Route: /api/v1/articles/:id/submit
- Description: Author submits a Draft article for review, transitioning it to Pending
- Auth required: Yes
- Roles allowed: Owner only (the article's author)
- Domain owner: Malindu

Request body: none

Response: Updated article object with status: "Pending"

Business rules:
- Article must exist
- Requesting user must be the article's author
- Article must be in Draft status (Pending/Published/Rejected cannot be submitted)
- On success, send notification to all Reviewers (call notificationService.sendToRole())
- Transition: Draft → Pending
```
