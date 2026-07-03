// lib/auth.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

const cookieSecret = process.env.VERCEL_NEON_AUTH_COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error('VERCEL_NEON_AUTH_COOKIE_SECRET environment variable is not set');
}

export const auth = createNeonAuth({
  baseUrl: process.env.VERCEL_NEON_AUTH_BASE_URL!,
  cookies: {
    secret: cookieSecret,
    sessionDataTtl: 300, // 5 minutes
  },
  // logLevel: 'silent',
});