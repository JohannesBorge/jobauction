import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  console.log('Middleware session check:', { session: !!session, error });

  // If there's an error getting the session, treat it as no session
  if (error) {
    console.error('Error getting session in middleware:', error);
  }

  // If user is not signed in and the current path is not /login or /register
  // redirect the user to /login
  if (!session && !['/login', '/register', '/forgot-password', '/auth/callback'].includes(req.nextUrl.pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in and the current path is /login or /register
  // redirect the user to /dashboard
  if (session && ['/login', '/register'].includes(req.nextUrl.pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 