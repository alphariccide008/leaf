import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session"

/**
 * Guards the admin panel and admin API. Everything under /admin (except the
 * login page) and /api/admin (except /api/admin/login) needs a valid session.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login"
  if (isLogin) return NextResponse.next()

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)

  if (session) return NextResponse.next()

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = req.nextUrl.clone()
  url.pathname = "/admin/login"
  url.search = ""
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
