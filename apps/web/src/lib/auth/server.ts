import { createNeonAuth } from '@neondatabase/auth/next/server';

const cookieSecret = process.env.VERCEL_NEON_AUTH_COOKIE_SECRET || 'dummy-secret-for-build-must-be-at-least-32-chars-long';

if (!process.env.VERCEL_NEON_AUTH_COOKIE_SECRET) {
  console.warn('⚠️ VERCEL_NEON_AUTH_COOKIE_SECRET environment variable is not set. Auth will fail or be insecure at runtime.');
}

export const auth = createNeonAuth({
  baseUrl: process.env.VERCEL_NEON_AUTH_BASE_URL || 'https://dummy.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth',
  cookies: {
    secret: cookieSecret,
    sessionDataTtl: 300, // 5 minutes
  },
  // @ts-ignore - NeonAuthConfig type is missing this Better Auth property
  trustedOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  // logLevel: 'silent',
});