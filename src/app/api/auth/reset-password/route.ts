import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { validatePasswordResetToken } from "@/lib/verification-token"
import { resetPasswordLimiter, getIP, checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const rateLimited = await checkRateLimit(resetPasswordLimiter, getIP(request))
  if (rateLimited) return rateLimited

  const { token, password, confirmPassword } = await request.json()

  if (!token || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "Token, password, and confirmPassword are required" },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    )
  }

  const result = await validatePasswordResetToken(token)
  if (!result) {
    return NextResponse.json(
      { error: "Invalid or expired reset link. Please request a new one." },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { email: result.email },
    data: { password: hashedPassword },
  })

  return NextResponse.json({ message: "Password reset successfully." })
}
