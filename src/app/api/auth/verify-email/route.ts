import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateVerificationToken } from "@/lib/verification-token"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(
      new URL("/sign-in?error=InvalidToken", request.url)
    )
  }

  const verificationToken = await validateVerificationToken(token)

  if (!verificationToken) {
    return NextResponse.redirect(
      new URL("/sign-in?error=InvalidToken", request.url)
    )
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  })

  return NextResponse.redirect(
    new URL("/sign-in?verified=true", request.url)
  )
}
