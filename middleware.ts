
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Retrieve the token from cookies
  const token = req.cookies.get('sb-access-token')?.value || '';

  // Define protected routes
  const protectedRoutes = ['/lebensplan', '/seiten-page', '/print'];

  // Determine if the requested route is protected
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // If the route is protected and there is no token, redirect to home
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Specify which routes the middleware should protect
export const config = {
  matcher: ['/lebensplan/:path*', '/seiten-page/:path*', '/print/:path*'],
};
