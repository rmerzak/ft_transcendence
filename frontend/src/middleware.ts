import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
async function isValidAccessToken(accessToken: any,userId :any): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/auth/validateToken', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        body: userId,
      },
    });
    const result = await response.json();
    
    if(response.status === 401)
      return false;
    return result;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}


export async function middleware(req: NextRequest) {
  const cookies  = req.cookies.get("accesstoken");
  const userId = req.cookies.get("userId");
  const valid = await isValidAccessToken(cookies?.value, userId?.value);
  if (!cookies && !userId) {
    console.log("i m herre one")
      return NextResponse.redirect(new URL("/", process.env.SERVER_FRONTEND));
  }
  if(userId && !cookies) {
    if(req.nextUrl.pathname !== "/auth/twofa")
      return NextResponse.redirect(new URL("/", process.env.SERVER_FRONTEND));
  }
  if (valid.user?.isVerified === false) {
    console.log("i m herre three")
    if(req.nextUrl.pathname !== "/auth/verify")
      return NextResponse.redirect(new URL("/auth/verify", process.env.SERVER_FRONTEND));
  }
  // this is the logic to do
  // if it his first time to login redirect him to /auth/verify if not /dashboard/profile
  // if his login required two factor authentication redirect him to /auth/twoFactor then to /dashboard/profile
  return NextResponse.next();
}
export const config = {
    matcher:["/dashboard/:path*", "/auth/twofa"]
}