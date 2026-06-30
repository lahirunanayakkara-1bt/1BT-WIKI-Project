# Authenticated User Profile

The Authenticated User Profile feature allows users to fetch their own profile information once they are signed in. This functionality safely retrieves the user's data from the `neon_auth.user` table, omitting sensitive fields (such as ban details and verification status) and returning a clean `UserProfile` object.

## Architecture

### Data Model
The user profile relies on the `neon_auth.user` table but returns a sanitized version to the client using the `UserProfile` type:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier of the user |
| `name` | `string` | Display name of the user |
| `email` | `string` | User's email address |
| `avatarUrl` | `string \| null` | Mapped from the database `image` field |
| `role` | `string \| null` | User's role (e.g., 'User', 'Admin') |
| `isActive` | `boolean` | Derived from the database `banned` field (true if `banned` is not true) |
| `createdAt` | `timestamp` | Date the user account was created |

### Layers

**Repository (`userRepository.ts`)**
- `findById(userId)`
  - Parameterized SQL against `neon_auth.user` to fetch the raw database row.

**Service (`profileService.ts`)**
- `getProfile(userId)`
  - Validates if the user exists (throws `AppError` 404 if not found).
  - Maps raw database columns to the safe `UserProfile` shape (`image` -> `avatarUrl`, `!banned` -> `isActive`).

**Controller (`profileController.ts`)**
- `getOwnProfile(req, res, next)`
  - Reads `req.user.userId` from the authenticated request, delegates to the service layer, and wraps the result in the standard `successResponse` envelope.

**Routes (`userRoutes.ts`)**
- `GET /api/v1/users/me`
  - Endpoint mapped to the controller and protected by the `authenticate` middleware.

---

## API Endpoints

### Get Own Profile
`GET /api/v1/users/me`

**Headers:**
- `Authorization: Bearer <token>` (Handled by the auth middleware)

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "user-abc",
    "name": "Malindu Gurunada",
    "email": "malindu@1billiontech.com",
    "avatarUrl": "https://example.com/avatar.png",
    "role": "User",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Response (401 Unauthorized)**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**Response (404 Not Found)**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## Summary of Changes (Implementation)

| File | Action | Description |
|---|---|---|
| `userRepository.ts` | **Modified** | Added `findById(userId)` — parameterized SQL against `neon_auth.user`, exported in default |
| `userTypes.ts` | **Modified** | Added `UserProfile` (safe outward shape) and `AuthenticatedUser` (req.user contract) types |
| `auth.middleware.ts` | **Created** | Stub placeholder for Lahiru's middleware; test mode reads `X-Test-User-*` headers; clearly marked `// PLACEHOLDER` |
| `profileService.ts` | **Created** | `getProfile(userId)` — calls repo, throws `AppError('User not found', 404)`, maps `image`→`avatarUrl`, `!banned`→`isActive` |
| `profileController.ts` | **Created** | `getOwnProfile(req, res, next)` — reads `req.user.userId`, delegates to service, wraps in `successResponse` |
| `userRoutes.ts` | **Modified** | Added `GET /me` protected by `authenticate`, wired to `ProfileController.getOwnProfile` |
| `profile.service.test.ts` | **Created** | 5 unit tests: success, null avatarUrl, banned→isActive, false→isActive, 404 not-found |
| `users.me.integration.test.ts` | **Created** | 3 integration tests: 401 unauthenticated, 200 with full shape/leak assertions, 404 missing record |
| `app.ts` | **Bug fix** | Moved global error handler **inside** `appReady` so it's registered after async routes — fixing a pre-existing bug where `AppError` responses were rendered as HTML instead of JSON |
