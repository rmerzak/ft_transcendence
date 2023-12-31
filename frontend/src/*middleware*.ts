import { NextRequest, NextResponse } from 'next/server';
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
  const valid: any = await isValidAccessToken(cookies?.value, userId?.value);
  if (!cookies && !userId) {
    return NextResponse.redirect(new URL("/", process.env.SERVER_FRONTEND));
  }
  if (userId && !cookies) {
    if (req.nextUrl.pathname !== "/auth/twofa")
      return NextResponse.redirect(new URL("/", process.env.SERVER_FRONTEND));
  }
  if (valid?.user?.isVerified === false) {
    if (req.nextUrl.pathname !== "/auth/verify")
      return NextResponse.redirect(new URL("/auth/verify", process.env.SERVER_FRONTEND));
  }
  if(req.nextUrl.pathname === "/auth/verify" && !cookies){
    return NextResponse.redirect(new URL("/", process.env.SERVER_FRONTEND));
  }
  return NextResponse.next();
}
export const config = {
    matcher:["/dashboard", "/dashboard/:path*", "/auth/twofa", "/auth/verify"]
}