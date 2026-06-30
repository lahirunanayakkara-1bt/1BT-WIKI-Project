// apps/api/src/middleware/auth.middleware.ts
//
// ──────────────────────────────────────────────────────────────────────────────
// STUB — PLACEHOLDER FOR LAHIRU'S IMPLEMENTATION
//
// This file is owned by Lahiru (see .cursor/rules/06-lahiru-domain.mdc).
// It exists here so that routes that import `authenticate` compile and
// integration tests can run before the real auth middleware is delivered.
//
// CONTRACT (per 06-lahiru-domain.mdc § "Auth Middleware"):
//   - Reads `Authorization: Bearer <token>` header
//   - Verifies the JWT with jwtService.verify()
//   - On success: sets req.user = { userId, email, role } and calls next()
//   - On failure: returns 401 with errorResponse('Authentication required')
//                 or      401 with errorResponse('Invalid or expired token')
//
// DO NOT add real JWT/session logic here — that belongs in Lahiru's PR.
// ──────────────────────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedUser } from '../types/userTypes.js';
import { errorResponse } from '../types/userTypes.js';

// Extend Express Request so TypeScript knows about req.user everywhere
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * STUB: authenticate middleware.
 *
 * ⚠️  THIS IS A PLACEHOLDER — Lahiru will replace this with real JWT verification.
 *
 * Current behaviour in tests: callers can inject `req.user` via supertest headers
 * using the `X-Test-User-*` mechanism or by mocking this module.
 *
 * Current behaviour in production (NODE_ENV !== 'test'): always returns 401
 * so that no route accidentally goes unprotected before the real middleware lands.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // ── TEST MODE: allow integration tests to inject a synthetic user ──────────
  // Tests mock this module via jest.unstable_mockModule(), so in practice this
  // branch is never reached in the test suite unless the mock is skipped.
  if (process.env.NODE_ENV === 'test') {
    const userId  = req.headers['x-test-user-id']  as string | undefined;
    const email   = req.headers['x-test-user-email'] as string | undefined;
    const role    = req.headers['x-test-user-role']  as string | undefined;

    if (userId && email && role) {
      req.user = { userId, email, role };
      next();
      return;
    }

    res.status(401).json(errorResponse('Authentication required'));
    return;
  }

  // ── PRODUCTION STUB: always reject until Lahiru lands the real middleware ──
  res.status(401).json(errorResponse('Authentication required'));
};
