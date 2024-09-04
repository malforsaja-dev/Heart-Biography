import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value || '';

  const protectedRoutes = ['/lebensplan', '/seiten-page', '/print'];
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // If the route is protected and there is no token, redirect to home
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect logged-in users accessing the root or authenticate page to the dashboard
  if ((req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/authenticate') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Specify which routes the middleware should protect
export const config = {
  matcher: [ '/lebensplan/:path*', '/seiten-page/:path*', '/print/:path*'],
};
