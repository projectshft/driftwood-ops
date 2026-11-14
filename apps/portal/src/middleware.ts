import { NextRequest, NextResponse } from "next/server";

// only guards page routes, not the /api/* routes themselves - login/
// logout obviously need to be reachable without a session already
//
// NOTE: this only checks that the cookie is present, not that it's a
// valid/unexpired token - jsonwebtoken needs node's crypto module and
// middleware runs on the edge runtime, so real verification happens in
// getSession() server-side on the page itself. a request with a bogus
// cookie value gets past this middleware but then getSession() returns
// null on the actual page and things break there instead. not great,
// works for now.
export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*"],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("portal_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
