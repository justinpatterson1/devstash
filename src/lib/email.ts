import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email - DevStash",
    html: `
      <h2>Welcome to DevStash!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">
        Verify Email
      </a>
      <p style="margin-top:16px;color:#666;">This link expires in 24 hours.</p>
      <p style="color:#666;">If you didn't create an account, you can ignore this email.</p>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`

  await resend.emails.send({
    from: "DevStash <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password - DevStash",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;">
        Reset Password
      </a>
      <p style="margin-top:16px;color:#666;">This link expires in 1 hour.</p>
      <p style="color:#666;">If you didn't request a password reset, you can ignore this email.</p>
    `,
  })
}
