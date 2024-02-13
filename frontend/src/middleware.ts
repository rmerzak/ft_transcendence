import { NextRequest, NextResponse } from 'next/server';
import { isValidAccessToken } from './authcheck';
import { User } from './interfaces';

export interface Valid{
  error: boolean,
  user: User
}

export async function middleware(req: NextRequest) {
  const privatePath = ['/dashboard', '/auth/verify'];
  try {
    const cookies = req.cookies.get('accesstoken');
    const isProtectedPath = privatePath.some((path) => req.nextUrl.pathname.startsWith(path));
    console.log('isProtectedPath', isProtectedPath, " ",req.nextUrl.pathname);
    const valid : Valid = await isValidAccessToken(cookies?.value);
    if (cookies === undefined && isProtectedPath) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (valid?.error === true) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (valid.user.isVerified === false) {
      console.log('redirecting to verify');
      if (req.nextUrl.pathname !== '/auth/verify') {
        return NextResponse.redirect(new URL('/auth/verify', req.url));
      }
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/verify'],
};
