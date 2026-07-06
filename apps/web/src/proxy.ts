import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/signin',
});

export const config = {
  matcher: [
    // Match all paths except API routes, static files, and the root path
    "/((?!api|_next/static|_next/image|banner-video|.*\\..*|$).*)",
  ],
};