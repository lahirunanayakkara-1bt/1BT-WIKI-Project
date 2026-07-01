# User Ban/Deactivation Process

## Overview

The user ban/deactivation process allows administrators to disable and re-enable user accounts without permanently deleting them from the system. This functionality leverages the Neon Auth database schema fields banned and banReason to manage and track the user's account status.

When a user account is deactivated, the banned field is set to TRUE, indicating that the user is no longer permitted to access the system. When the account is reactivated, the banned field is updated to FALSE, restoring the user's access.

---

## Architecture

### Data Model

User accounts have three deactivation-related fields in the `neon_auth.user` table:

| Field | Type | Description |
|-------|------|-------------|
| `banned` | `boolean` | `true` when account is deactivated; `false` or `null` when active |
| `banReason` | `string \| null` | Required reason text when `banned = true`; otherwise `null` |
| `banExpires` | `timestamp \| null` | Future feature: optional expiration date for temporary bans |

### Layers

**Repository** ([`userRepository.ts`](../apps/api/src/repositories/userRepository.ts))
- `updateBanStatus(id, { banned, banReason })`
- Updates database and returns full user record

**Service** ([`userService.ts`](../apps/api/src/services/userService.ts))
- `updateUserBanStatus(userId, input: UpdateUserBanInput)`
- Validates user exists and ban reason is provided when banning
- Delegates to repository

**Controller** ([`userController.ts`](../apps/api/src/controllers/userController.ts))
- `updateUserBanStatus(req, res, next)`
- Handles HTTP request/response and boolean parsing

**Routes** ([`adminRoutes.ts`](../apps/api/src/routes/adminRoutes.ts))
- `PATCH /api/v1/admin/users/:userId/ban`

---

## API Endpoints

### Deactivate (Ban) a User

```http
PATCH /api/v1/admin/users/{userId}/ban
Content-Type: application/json

{
  "banned": true,
  "banReason": "Violated community guidelines"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "Chathurika Sandamali",
    "email": "chathurika.sandamali+1@1billiontech.com",
    "role": "User",
    "banned": true,
    "banReason": "Violated community guidelines",
    "banExpires": null,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-06-30T09:20:33.053Z",
    "emailVerified": false,
    "image": null
  },
  "message": "User deactivated successfully"
}
```

### Reactivate (Unban) a User

```http
PATCH /api/v1/admin/users/{userId}/ban
Content-Type: application/json

{
  "banned": false
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "Chathurika Sandamali",
    "email": "chathurika.sandamali+1@1billiontech.com",
    "role": "User",
    "banned": false,
    "banReason": null,
    "banExpires": null,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-06-30T09:21:45.100Z",
    "emailVerified": false,
    "image": null
  },
  "message": "User reactivated successfully"
}
```

---
