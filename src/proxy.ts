import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

const protectedPaths = ["/dashboard", "/profile"]

export const proxy = auth((req) => {
  const isProtected = protectedPaths.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  )
  if (!req.auth && isProtected) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href)
    return Response.redirect(signInUrl)
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
}
