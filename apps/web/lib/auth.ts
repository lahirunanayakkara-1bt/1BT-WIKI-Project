// lib/auth/server.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    domain: process.env.NEON_AUTH_COOKIE_DOMAIN!,
    sessionDataTtl: 300, // 7 days
  },
  // logLevel: 'silent',
});