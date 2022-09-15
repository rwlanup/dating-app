import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl.clone();
    const needsAuthForURL = req.nextUrl.pathname.startsWith('/profile');
    const hasUser = Boolean(req.nextauth.token);
    if (needsAuthForURL && !hasUser) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    } else if (!needsAuthForURL && hasUser) {
      url.pathname = '/profile';
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);
