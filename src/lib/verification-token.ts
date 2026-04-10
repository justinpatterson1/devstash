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

export async function generatePasswordResetToken(email: string) {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  const identifier = `reset:${email}`

  await prisma.verificationToken.deleteMany({
    where: { identifier },
  })

  const resetToken = await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  })

  return resetToken
}

export async function validatePasswordResetToken(token: string) {
  const resetToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!resetToken) return null
  if (!resetToken.identifier.startsWith("reset:")) return null
  if (resetToken.expires < new Date()) return null

  await prisma.verificationToken.delete({
    where: { token },
  })

  return { email: resetToken.identifier.replace("reset:", "") }
}
