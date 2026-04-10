import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { generateVerificationToken } from "@/lib/verification-token"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
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

  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hashedPassword,
    },
  })

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(email, verificationToken.token)

  return NextResponse.json(
    { message: "Verification email sent. Please check your inbox." },
    { status: 201 }
  )
}
