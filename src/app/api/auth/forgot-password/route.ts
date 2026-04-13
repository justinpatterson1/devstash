import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generatePasswordResetToken } from "@/lib/verification-token"
import { sendPasswordResetEmail } from "@/lib/email"
import { forgotPasswordLimiter, getIP, checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const rateLimited = await checkRateLimit(forgotPasswordLimiter, getIP(request))
  if (rateLimited) return rateLimited

  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
  }

  const resetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(email, resetToken.token)

  return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
}
