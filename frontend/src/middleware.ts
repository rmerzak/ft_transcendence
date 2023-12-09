import { NextRequest,NextResponse } from "next/server";
async function isValidAccessToken(accessToken: any): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/auth/validateToken', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}


export async function middleware(req: NextRequest) {
  const cookies  = req.cookies.get("accesstoken");
  const userId = req.cookies.get("userId");
  const valid = await isValidAccessToken(cookies?.value);
  if (!cookies || !valid || !userId) {
    if (req.nextUrl.pathname !== "/auth/login") {
      return NextResponse.redirect(
        new URL("/", process.env.SERVER_FRONTEND)
      );
    }
  }
  // this is the logic to do
  // if it his first time to login redirect him to /auth/verify if not /dashboard/profile
  // if his login required two factor authentication redirect him to /auth/twoFactor then to /dashboard/profile

}
export const config = {
    matcher:["/dashboard/:path*","/auth/:path*"]
}