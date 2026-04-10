import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GitHub({
      // next-auth beta.30 uses "https://authjs.dev" as a fallback issuer,
      // which fails when GitHub includes an "iss" parameter in the response.
      // Setting the issuer to GitHub's actual value fixes the mismatch.
      issuer: "https://github.com",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig
