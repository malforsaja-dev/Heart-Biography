import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value || '';

  // If the user is not logged in and they visit '/', redirect them to the welcome page
  if (!token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/welcome', req.url));
  }

  // If the user is logged in and visits '/', allow access (dashboard will be loaded on client side)
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
