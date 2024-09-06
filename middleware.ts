import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value || '';

  // Define public routes that do not require authentication
  const publicRoutes = ['/welcome', '/authenticate'];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // If the user is not logged in and the route is not public, redirect to /welcome
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/welcome', req.url));
  }

  // If the user is logged in and tries to access a public route, redirect them to /
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Middleware applies to all routes except /welcome and /authenticate
export const config = {
  matcher: ['/', '/lebensplan/:path*', '/print/:path*', '/seiten-page/:path*'],
};
