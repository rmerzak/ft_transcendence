import { NextRequest, NextResponse } from 'next/server';

async function isValidAccessToken(accessToken: string | undefined): Promise<boolean | { error: string }> {
  try {
    const response = await fetch('http://localhost:3000/auth/validateToken', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      return { error: 'Unauthorized' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error validating token:', error);
    return { error: 'Internal Server Error' };
  }
}

export async function middleware(req: NextRequest) {
  const privatePath = ['/dashboard', '/auth/verify'];
  try {
    const cookies = req.cookies.get('accesstoken');
  const userId = req.cookies.get('userId');
  console.log(req.nextUrl.pathname)
  const isProtectedPath = privatePath.some((path) => req.nextUrl.pathname.startsWith(path));
  const valid : any  = await isValidAccessToken(cookies?.value);
  if (cookies === undefined && isProtectedPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (valid?.error === 'Unauthorized') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (valid?.user?.isVerified === false) {
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
