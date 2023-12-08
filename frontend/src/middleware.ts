import { NextRequest,NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const cookies = req.cookies.get("accesstoken");
  // must check the validation of the token
  console.log(cookies);
  if (!cookies) {
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