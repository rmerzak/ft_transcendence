import { NextRequest,NextResponse } from "next/server";
async function isValidAccessToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3000/auth/validateToken', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}


export async function middleware(req: NextRequest) {
  const cookies = req.cookies.get("accesstoken");
  const valid = await isValidAccessToken(cookies?.value);
  if (!cookies || !valid) {
    if (req.nextUrl.pathname !== "/auth/login") {
      return NextResponse.redirect(
        new URL("/", process.env.SERVER_FRONTEND)
      );
    }
  }
}
export const config = {
    matcher:["/dashboard/:path*","/auth/:path*"]
}