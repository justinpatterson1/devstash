import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { generateVerificationToken } from "@/lib/verification-token"
import { sendVerificationEmail } from "@/lib/email"
import { registerLimiter, getIP, checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const rateLimited = await checkRateLimit(registerLimiter, getIP(request))
  if (rateLimited) return rateLimited

  const body = await request.json()
  const { name, email, password, confirmPassword } = body

  if (!email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "Email, password, and confirmPassword are required" },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    )
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const emailVerificationEnabled = process.env.ENABLE_EMAIL_VERIFICATION === "true"

  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hashedPassword,
      emailVerified: emailVerificationEnabled ? null : new Date(),
    },
  })

  if (emailVerificationEnabled) {
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(email, verificationToken.token)

    return NextResponse.json(
      { message: "Verification email sent. Please check your inbox." },
      { status: 201 }
    )
  }

  return NextResponse.json(
    { message: "Account created successfully. You can now sign in." },
    { status: 201 }
  )
}
