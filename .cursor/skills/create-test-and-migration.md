# Skill: Create Database Migration

Use this prompt template when adding new tables, columns, or indexes.

---

## Prompt Template

```
Create a PostgreSQL migration file for 1BT WIKI.

Migration purpose: [What schema change this makes]
File name: [YYYYMMDDHHMMSS]_[short_description].sql (use current timestamp)

Changes to make:
[Describe tables to create, columns to add, indexes to add, constraints to add]

Rules to follow:
- Table names: snake_case, plural
- Column names: snake_case
- Primary key: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- Always include: `created_at TIMESTAMPTZ DEFAULT NOW()`
- Include `updated_at TIMESTAMPTZ DEFAULT NOW()` on mutable tables
- Include `deleted_at TIMESTAMPTZ` if soft-delete is needed
- Foreign keys: `[table_singular]_id UUID REFERENCES [table](id)`
- Add indexes for all foreign key columns and frequently filtered columns
- Include a rollback comment at the top: `-- Rollback: DROP TABLE IF EXISTS [table];`
- Never use `SERIAL` or `AUTO_INCREMENT` — always use UUID

Generate:
1. The complete SQL migration file
2. The corresponding TypeScript type/interface for the new table (add to src/types/)
3. The repository method skeleton for this table
```

---

# Skill: Create Unit Test

## Prompt Template

```
Write a Jest unit test for the following 1BT WIKI service method.

Service file: `src/services/[name].service.ts`
Method to test: `[methodName]`

Method signature:
[Paste the method signature and its body or describe what it does]

Business rules the test must cover:
[List the rules — happy path, error cases, edge cases]

Dependencies to mock:
[List repositories or external services this method calls]

Generate:
1. Test file: `src/services/__tests__/[name].service.test.ts`
2. Use Jest + `jest.mock()` for all dependencies
3. Follow AAA pattern: Arrange / Act / Assert
4. One `describe` block per method
5. Separate `it()` blocks for: happy path, each error case, each edge case
6. Use `toThrow(new AppError(...))` for error assertions
7. Use `toHaveBeenCalledWith(...)` to verify repository calls
8. Clear all mocks in `beforeEach` with `jest.clearAllMocks()`

Rules:
- Mock external services (Claude API, notifications) — never call real APIs in unit tests
- Test the service in isolation — no DB, no HTTP
- Name test cases clearly: "should [expected behavior] when [condition]"
```

---

# Skill: Create Cypress E2E Test

## Prompt Template

```
Write a Cypress E2E test for 1BT WIKI.

Feature: [Feature name, e.g., "Article Lifecycle: Draft → Published"]
File: `cypress/e2e/[feature-slug].cy.ts`
MVP: [1 | 2 | 3 | 4]

User journey to test:
[Step-by-step description of what the user does and what they expect to see]

Roles involved: [User | Reviewer | Admin] (list all roles needed)

Setup required:
[Any DB seed data, test users, or fixture files needed]

Generate:
1. The Cypress test file using `cy.login()` custom command for auth
2. Use `data-testid` selectors (e.g., `cy.get('[data-testid="submit-btn"]')`)
3. Use `cy.intercept()` to mock API calls where needed
4. Include `beforeEach` for setup (login, seed if needed)
5. Include `afterEach` or `after` for cleanup
6. One `it()` block per distinct scenario (happy path + at least one error case)

Rules:
- Never use brittle selectors like `cy.get('button:nth-child(2)')` — always data-testid
- Chain assertions: `cy.get(...).should('be.visible').and('contain', '...')`
- Use `cy.wait('@alias')` after `cy.intercept()` before asserting response-dependent UI
- Test must pass in CI (no hardcoded timeouts under 2s, no environment-specific assumptions)
```
