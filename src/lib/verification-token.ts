import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

export async function generateVerificationToken(email: string) {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  return verificationToken
}

export async function validateVerificationToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) return null
  if (verificationToken.expires < new Date()) return null

  // Delete the token after use
  await prisma.verificationToken.delete({
    where: { token },
  })

  return verificationToken
}
