import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect routes that require authentication
  const protectedPaths = ["/dashboard", "/subjects", "/progress", "/settings"]
  const isPathProtected = protectedPaths.some((path) => pathname.startsWith(path))

  // Public paths that don't require authentication
  const isAuthPath = pathname === "/" || pathname === "/signup" || pathname === "/reset-password"

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect to login if accessing protected route without auth
  if (isPathProtected && !token) {
    const url = new URL("/", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
