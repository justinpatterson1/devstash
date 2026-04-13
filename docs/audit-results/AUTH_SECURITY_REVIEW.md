# Auth Security Review

**Last audited:** 2026-04-11
**Auditor:** Claude Auth Auditor
**Scope:** NextAuth v5 — credentials, GitHub OAuth, email verification, password reset, profile

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low / Advisory | 1 |

---

## Issues

### [MEDIUM] Email Verification Silently Disabled by Default

**File:** `src/app/api/auth/register/route.ts` (line 42), `src/auth.ts` (line 45)

**Description:** Email verification is gated entirely on the `ENABLE_EMAIL_VERIFICATION` environment variable being set to the exact string `"true"`. When the variable is absent or set to any other value, new accounts are created with `emailVerified` pre-set to the current timestamp, and the sign-in check in `auth.ts` is skipped. This means a misconfigured or missing environment variable silently bypasses the entire email ownership verification mechanism — a new user can register with any email address and immediately sign in without proving they own it. The risk is account impersonation: an attacker who knows someone's email address could register an account under it before the real owner does.

**Fix:** Flip the default to opt-out rather than opt-in. Treat a missing or unknown value as `true` (verification enabled), and only skip it when explicitly set to `"false"`:

```ts
// In register/route.ts and auth.ts
const emailVerificationEnabled = process.env.ENABLE_EMAIL_VERIFICATION !== "false"
```

This makes the secure behavior the default and requires a deliberate decision to disable it.

---

### [MEDIUM] Timing Side-Channel on Forgot-Password Endpoint

**File:** `src/app/api/auth/forgot-password/route.ts` (lines 14–22)

**Description:** The endpoint returns an identical response body for both registered and unregistered email addresses, which is correct. However, the code paths have very different execution times: for a non-existent user, it returns immediately after a single fast `findUnique` call; for an existing user, it additionally runs `generatePasswordResetToken` (two database writes) and `sendPasswordResetEmail` (an outbound network call to Resend). An attacker who can measure response latencies with sufficient precision can distinguish "user exists" from "user does not exist" responses, turning this into a user-enumeration oracle despite the uniform response text.

```ts
// Current code — returns early for unknown emails, does expensive work for known ones
const user = await prisma.user.findUnique({ where: { email } })
if (!user) {
  return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
}
const resetToken = await generatePasswordResetToken(email)
await sendPasswordResetEmail(email, resetToken.token)
return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
```

**Fix:** Always perform a constant-time response by waiting for all async operations before returning, regardless of whether the user was found. Return the response only after the same minimum delay in both branches. A simple pattern is to run a dummy await on the non-existent-user path:

```ts
export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    const resetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(email, resetToken.token)
  }
  // Always return the same response after the same DB lookup, regardless of outcome
  return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
}
```

With this pattern both branches complete after a single DB read at minimum, and the absence of a token-generation + email-send step is no longer observable via response time from the outside.

---

### [LOW / ADVISORY] No Rate Limiting on Auth Endpoints

**Files:** `src/app/api/auth/register/route.ts`, `src/app/api/auth/forgot-password/route.ts`, `src/app/api/auth/reset-password/route.ts`, `src/app/api/profile/change-password/route.ts`, `src/app/api/auth/[...nextauth]/route.ts`

**Description:** None of the authentication endpoints implement rate limiting or account lockout. This exposes the application to:
- Credential stuffing / brute-force attacks against the sign-in endpoint.
- Bulk account enumeration via the register endpoint (distinct 409 vs 201 responses for existing vs new emails).
- Abuse of the forgot-password endpoint to flood a victim's inbox with reset emails.
- Unlimited attempts against the password reset and change-password endpoints.

This is flagged as advisory because NextAuth v5 does not provide built-in rate limiting and it is commonly addressed at the infrastructure layer (CDN, reverse proxy, or API gateway) rather than in application code. However, if no such infrastructure controls exist, application-level rate limiting should be added.

**Fix options:**
- At the infrastructure layer: configure rate limiting rules in Cloudflare (the project already uses Cloudflare R2, so WAF rules are available) or a reverse proxy.
- At the application layer: use a library such as `@upstash/ratelimit` with Redis, or `rate-limiter-flexible`, keyed by IP address and/or email address on the sensitive endpoints.

---

## Passed Checks

- **bcrypt cost factor** — All password hashing uses `bcrypt.hash(password, 12)`. Cost factor 12 meets the current recommended minimum (12+) and produces approximately 250–300 ms hashes, which is appropriate for this application.
- **Passwords not leaked in responses or logs** — The register, change-password, and reset-password routes never return password or hash data. The profile DB query in `src/lib/db/profile.ts` selects `password` only to derive the boolean `hasPassword` and does not expose the raw value.
- **Minimum password length** — An 8-character minimum is enforced server-side in all three password-setting flows: registration (`register/route.ts` line 25), password reset (`reset-password/route.ts` line 20), and change password (`change-password/route.ts` line 25). Client-side checks are present as UX only and are not relied upon for security.
- **Token generation is cryptographically secure** — Both `generateVerificationToken` and `generatePasswordResetToken` use `crypto.randomBytes(32).toString("hex")` (256 bits of entropy), which is cryptographically secure.
- **Token expiration** — Email verification tokens expire after 24 hours; password reset tokens expire after 1 hour. Both are enforced server-side by comparing `expires` against `new Date()`.
- **Single-use tokens** — `validateVerificationToken` and `validatePasswordResetToken` both delete the token immediately after validation, before returning to the caller. Tokens cannot be replayed.
- **Password reset token validated before password change** — `reset-password/route.ts` calls `validatePasswordResetToken(token)` and only proceeds to update the password if it returns a valid result. The token is consumed (deleted) as part of validation.
- **Verification token cannot be used as a reset token and vice versa** — `validatePasswordResetToken` checks `resetToken.identifier.startsWith("reset:")` and rejects tokens that don't have that prefix. Verification tokens use the bare email as identifier and will fail this check.
- **Email enumeration prevention on forgot-password** — The response body is identical for both found and not-found users. (A timing side-channel exists, noted above, but the text-level response is correct.)
- **Session auth on profile routes** — Both `/api/profile/change-password` and `/api/profile/delete-account` call `auth()` and reject requests with no valid session before doing any database work.
- **Route protection via proxy middleware** — `src/proxy.ts` correctly exports a Next.js 16 `proxy` function with a `config.matcher` covering `/dashboard/:path*` and `/profile/:path*`. The middleware redirects unauthenticated requests to `/sign-in` with a `callbackUrl`.
- **callbackUrl open redirect** — NextAuth v5 validates `callbackUrl` by default, only allowing same-origin URLs. The sign-in page passes `callbackUrl` directly to `signIn()` but NextAuth's built-in redirect callback blocks external URLs.
- **GitHub OAuth** — Uses the standard NextAuth GitHub provider. The `issuer` override is a documented workaround for a known beta.30 incompatibility, not a security issue.
- **Current password required for password change** — The change-password endpoint fetches the user's stored hash and calls `bcrypt.compare(currentPassword, user.password)` before allowing the update.
- **OAuth accounts cannot use the password change endpoint** — The endpoint checks `if (!user?.password)` and returns a 400 for accounts without a stored password hash (i.e., OAuth-only accounts).
- **Delete account requires active session** — Account deletion is gated on a valid session check identical to the change-password endpoint.
- **JWT session strategy** — Using JWT strategy with the PrismaAdapter is the correct configuration for credentials-based auth in NextAuth v5 with a database.
