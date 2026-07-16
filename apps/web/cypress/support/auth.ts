export type StubRole = 'Admin' | 'User' | 'Reviewer' | null;

interface MockUserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'Admin' | 'User' | 'Reviewer';
  isActive: boolean;
  createdAt: string;
}

// Shape-only fake JWT (3 dot-separated segments) — apps/web's apiFetch only
// checks JWT *shape* client-side; real signature verification happens
// server-side in apps/api, which we bypass entirely by stubbing /users/me.
const FAKE_JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMSJ9.fake-signature';

function mockUserFor(role: 'Admin' | 'User' | 'Reviewer'): MockUserData {
  return {
    id: 'test-user-1',
    name: 'Test User',
    email: 'test.user@1billiontech.com',
    avatarUrl: null,
    role,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

/**
 * Stubs the Neon Auth (better-auth) endpoints and the backend `/users/me`
 * call so the real app (real routing, real RoleGuard/UserProvider) can be
 * driven through login/session/logout without touching Google OAuth or a
 * running apps/api. Confirmed against the real dev server responses:
 *   POST /api/auth/sign-in/social -> { url, redirect }
 *   GET  /api/auth/get-session    -> { session, user } | null
 *   GET  /api/auth/token          -> { token } | 401
 *   POST /api/auth/sign-out       -> { success }
 *
 * `role: null` stubs a logged-out session. The sign-out intercept flips the
 * internal state to logged-out itself, so a subsequent visit after clicking
 * logout in the UI correctly reflects a torn-down session.
 */
export function stubAuthSession(initialRole: StubRole): void {
  let role = initialRole;

  cy.intercept('POST', '**/api/auth/sign-in/social', {
    statusCode: 200,
    body: { redirect: false },
  }).as('signInSocial');

  cy.intercept('GET', '**/api/auth/get-session', (req) => {
    req.reply({
      statusCode: 200,
      body: role
        ? { session: { id: 'test-session-1', userId: 'test-user-1' }, user: mockUserFor(role) }
        : null,
    });
  }).as('getSession');

  cy.intercept('GET', '**/api/auth/token', (req) => {
    if (role) {
      req.reply({ statusCode: 200, body: { token: FAKE_JWT } });
    } else {
      req.reply({ statusCode: 401, body: {} });
    }
  }).as('getToken');

  cy.intercept('GET', '**/api/v1/users/me', (req) => {
    if (role) {
      req.reply({ statusCode: 200, body: { success: true, data: mockUserFor(role) } });
    } else {
      req.reply({ statusCode: 401, body: { success: false, error: 'Authentication required' } });
    }
  }).as('usersMe');

  cy.intercept('POST', '**/api/auth/sign-out', (req) => {
    role = null;
    req.reply({ statusCode: 200, body: { success: true } });
  }).as('signOut');
}
