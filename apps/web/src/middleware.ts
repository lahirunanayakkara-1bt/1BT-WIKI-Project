import { auth } from "@/lib/auth";

export default auth.middleware({
  loginUrl: "/signin",
});

export const config = {
  matcher: [
    // "/:path*",
    // "/projects/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};