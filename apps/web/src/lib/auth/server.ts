// lib/auth.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || "my-secret-at-least-32-characters-long",
    domain: process.env.NEON_AUTH_COOKIE_DOMAIN!,
    sessionDataTtl: 300, // 7 days
  },
  // logLevel: 'silent',
});