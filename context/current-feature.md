# Current Feature

## Status
Not Started

## Goals
<!-- Bullet points of what success looks like -->

## Notes
<!-- Additional context, constraints, or details from spec -->

---

## History

### Rate Limiting for Auth
- **Status:** Completed

#### Goals
- Upstash sliding window rate limiting on register (3/hr), forgot-password (3/hr), reset-password (5/15min), change-password (5/15min), sign-in (5/15min)
- 429 responses with Retry-After header, fail-open if Redis unavailable
- Sign-in uses custom CredentialsSignin subclass (authorize can only throw)

#### References
- `context/features/rate-limiting-spec.md`
- `src/lib/rate-limit.ts`, `src/auth.ts`

---

### Profile Page
- **Status:** Completed

#### Goals
- Protected `/profile` route with user info, avatar, join date
- Usage stats with item type breakdown using `_count` aggregates
- Change password form (email/password users only)
- Delete account with confirmation dialog
- Sidebar avatar popover with Profile and Sign out options

#### References
- `context/features/profile-spec.md`
- `src/app/profile/page.tsx`, `src/lib/db/profile.ts`
- `src/components/profile/change-password-form.tsx`, `src/components/profile/delete-account-button.tsx`

---

### Forgot Password
- **Status:** Completed

#### Goals
- Forgot password link on sign-in page
- `/forgot-password` page + API route (generates reset token, sends email via Resend)
- `/reset-password` page + API route (validates token, updates password)
- Reuses VerificationToken model with `reset:` prefix, 1-hour expiry
- Success/error messaging throughout flow, toast duration set to 5s

#### References
- `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/reset-password/page.tsx`
- `src/app/api/auth/forgot-password/route.ts`, `src/app/api/auth/reset-password/route.ts`
- `src/lib/verification-token.ts`, `src/lib/email.ts`

---

### Email Verification Toggle
- **Status:** Completed

#### Goals
- `ENABLE_EMAIL_VERIFICATION` env variable (default `false`)
- When disabled: auto-verify on register, skip email check on sign-in
- When enabled: full Resend verification flow

#### References
- `src/app/api/auth/register/route.ts`, `src/auth.ts`

---

### Email Verification on Register
- **Status:** Completed

#### Goals
- Resend SDK for email delivery
- Verification token generation and storage (reuses NextAuth VerificationToken model)
- Verification email with styled link, 24h expiry
- Verify-email endpoint sets `emailVerified` on User
- Blocked sign-in for unverified users with custom `EmailNotVerified` error
- Messaging on sign-in page: verify prompt, success, invalid token, unverified

#### References
- `src/lib/email.ts`, `src/lib/verification-token.ts`
- `src/app/api/auth/verify-email/route.ts`
- `src/auth.ts`, `src/app/api/auth/register/route.ts`

---

### Auth UI - Sign In, Register & Sign Out
- **Status:** Completed

#### Goals
- Custom `/sign-in` page with email/password + GitHub OAuth button
- Custom `/register` page with form validation, submits to `/api/auth/register`
- Reusable UserAvatar component (GitHub image or initials fallback)
- Sidebar popover with sign-out option
- Toast notification on successful sign-in
- NextAuth `pages.signIn` configured to `/sign-in`

#### References
- `context/features/auth-phase-3-spec.md`
- `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/register/page.tsx`
- `src/components/user-avatar.tsx`, `src/components/dashboard/sidebar.tsx`

---

### Auth Credentials - Email/Password Provider
- **Status:** Completed

#### Goals
- Add `password` field to User model via Prisma migration
- Add Credentials provider placeholder in `auth.config.ts`
- Override Credentials provider in `auth.ts` with bcrypt validation logic
- Create registration API route at `POST /api/auth/register`
- Validate passwords match, check for existing user, hash with bcryptjs
- GitHub OAuth continues to work alongside credentials

#### References
- `context/features/auth-phase-2-spec.md`
- `src/auth.ts`, `src/auth.config.ts`, `src/app/api/auth/register/route.ts`

---

### Auth Setup - NextAuth + GitHub Provider
- **Status:** Completed

#### Goals
- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility (`auth.config.ts` + `auth.ts`)
- Add GitHub OAuth provider
- Create API route handler at `src/app/api/auth/[...nextauth]/route.ts`
- Create `src/proxy.ts` for route protection with redirect logic
- Protect `/dashboard/*` routes, redirecting unauthenticated users to sign-in
- Add `src/types/next-auth.d.ts` to extend Session type with `user.id`
- Use `session: { strategy: 'jwt' }` with the split config pattern
- Use NextAuth's default sign-in page (no custom `pages.signIn`)

#### References
- `context/features/auth-phase-1-spec.md`
- `src/auth.ts`, `src/auth.config.ts`, `src/proxy.ts`

---

### Add Pro Badge to Sidebar
- **Status:** Completed

#### Goals
- Add a "PRO" badge to the Files type in the sidebar
- Add a "PRO" badge to the Images type in the sidebar
- Use the shadcn/ui Badge component
- Badge should be clean and subtle, with "PRO" in uppercase

#### References
- `context/features/add-pro-badge-sidebar.md`
- `src/components/dashboard/sidebar.tsx`

---

### Stats & Sidebar (Live Data)
- **Status:** Completed

#### Goals
- Display stats from database data, keeping current design/layout
- Display item types in sidebar with their icons, linking to /items/[typename]
- Add "View all collections" link under the collections list that goes to /collections
- Keep star icons for favorite collections; recents show colored circle based on most-used item type
- Add database functions to src/lib/db/items.ts

#### References
- `context/features/stats-sidebar-spec.md`
- `src/lib/db/collections.ts`

---

### Dashboard Items (Live Data)
- **Status:** Completed

#### Goals
- Create `src/lib/db/items.ts` with data fetching functions
- Replace mock data with live Prisma queries for pinned and recent items
- Fetch items directly in server component
- Item card icon/border derived from item type
- Display item type tags and existing card details
- If no pinned items, hide the pinned section
- Update stats display

#### References
- `context/features/dashboard-items-spec.md`
- `context/screenshots/DashboardUI_1.png`
- `context/screenshots/DashboardUI_2.png`

---

### Dashboard Collections (Live Data)
- **Status:** Completed

#### Goals
- Create `src/lib/db/collections.ts` with data fetching functions
- Replace mock data with live Prisma queries in the collections section
- Fetch collections directly in server component
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types present in each collection
- Update collection stats display
- Do not add items underneath yet

#### References
- `context/features/dashboard-collections-spec.md`
- `context/screenshots/DashboardUI_1.png`
- `context/screenshots/DashboardUI_2.png`

---

### Seed Database with Sample Data
- **Status:** Completed

#### Goals
- Create seed script at `prisma/seed.ts`
- Seed a demo user (demo@devstash.io, hashed password)
- Seed all 7 system item types
- Seed 5 collections with items: React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources
- Associate items with tags and collections

#### References
- `context/features/seed-spec.md`
- `prisma/schema.prisma`

---

### Prisma + Neon PostgreSQL Setup
- **Status:** Completed

#### Goals
- Set up Prisma 7 ORM with Neon PostgreSQL (serverless)
- Create initial schema with data models and NextAuth models
- Add indexes and cascade deletes
- Configure development database branch
- Create initial migration

#### References
- `context/features/database-spec.md`
- `context/project_overview.md`
- `context/coding-standards.md`

---

### Dashboard UI Phase 3
- **Status:** Completed

#### Goals
- The main area to the right
- Recent collections
- Pinned Items
- 10 Recent items
- 4 stats cards at the top for number of items, collections, favorite items and favorite collections (Not in screenshot)

#### References
- `context/features/dashboard-phase-3-spec.md`
- `context/screenshots/DashboardUI_1.png`
- `context/screenshots/DashboardUI_2.png`
- `context/project_overview.md`
- `src/lib/mock-data.ts`

---

### Dashboard UI Phase 2
- **Status:** Completed

#### Goals
- Collapsible sidebar
- Items/types with links to /items/TYPE (e.g. /items/snippets)
- Favorite collections
- Most recent collections
- User avatar area at the bottom
- Drawer icon to open/close sidebar
- Always a drawer on mobile view

#### References
- `context/features/dashboard-phase-2-spec.md`
- `context/screenshots/DashboardUI_1.png`
- `context/screenshots/DashboardUI_2.png`
- `context/project_overview.md`
- `src/lib/mock-data.ts`

---

### Dashboard UI Phase 1
- **Status:** Completed

#### Goals
- Initialize ShadCN UI and install required components
- Create dashboard route at `/dashboard`
- Build main dashboard layout with global styles
- Dark mode by default
- Top bar with search and new item button (display only)
- Placeholder sidebar and main area (h2 with "Sidebar" and "Main")

#### References
- `context/features/dashboard-phase-1-spec.md`
- `context/screenshots/DashboardUI_1.png`
- `context/project_overview.md`
- `src/lib/mock-data.ts`

---

### Items List View
- **Status:** Completed

#### Goals
- Dynamic route `/items/[type]` filtered by item type
- Responsive 2-column grid of ItemCard components (md and up)
- Type-colored left border on each card
- Sidebar available via shared items layout (mirrors dashboard shell)
- Added `getItemsByType` and `getItemTypeByName` queries
- Vitest set up for server actions + utilities (scope excludes components)

#### References
- `context/features/item-list-view-spec.md`
- `docs/item-crud-architecture.md`
- `src/app/items/[type]/page.tsx`, `src/app/items/layout.tsx`
- `src/components/items/item-card.tsx`
- `src/lib/db/items.ts`
- `vitest.config.ts`, `src/lib/utils.test.ts`

---

### Item Drawer
- **Status:** Completed

#### Goals
- Right-side slide-in drawer using shadcn Sheet component
- Clicking an ItemCard opens the drawer with that item's full data (dashboard + items list pages)
- Action bar: Favorite, Pin, Copy, Edit, Delete (display only)
- Client-side ItemDrawerProvider manages drawer state so pages remain server components
- Full item detail fetched via `/api/items/[id]` with auth check
- Skeleton loading state while fetching

#### References
- `context/features/item-drawer-spec.md`
- `src/components/items/item-drawer.tsx`, `src/components/items/item-drawer-provider.tsx`
- `src/app/api/items/[id]/route.ts`
- `src/lib/db/items.ts` (added `getItemById` + `ItemFull` type)

---

### Item Drawer — Edit Mode
- **Status:** Completed

#### Goals
- Edit button toggles the drawer into inline edit mode; Save/Cancel replace the action bar
- Cancel discards changes; Save persists via server action and returns to view mode
- Toast notification on save success or error
- Editable fields: Title (required), Description, Tags (comma-separated → array)
- Type-specific fields: Content (snippet/prompt/command/note), Language (snippet/command), URL (link)
- Zod validation of the update payload in the server action (source of truth)
- `updateItem` server action with `{ success, data, error }` return and field errors
- `updateItem` query disconnects existing tags and connect-or-creates new ones; returns updated `ItemFull`
- `router.refresh()` after save so the card list reflects changes

#### References
- `context/features/item-drawer-edit-spec.md`
- `src/actions/items.ts`, `src/actions/items.test.ts`
- `src/components/items/item-drawer-edit.tsx`
- `src/components/items/item-drawer.tsx`, `src/components/items/item-drawer-provider.tsx`
- `src/components/ui/textarea.tsx`
- `src/lib/db/items.ts` (added `updateItem`)

---

### Item Delete
- **Status:** Completed

#### Goals
- Delete button in the drawer opens a shadcn `AlertDialog` confirmation
- Confirm runs the server action; Cancel closes the dialog
- On success: close drawer, success toast, `router.refresh()` so dashboard/items lists update
- On error: error toast, drawer stays open
- `deleteItem` server action with `{ success, error }` return
- `deleteItem` query with ownership check; tag/collection joins cascade via Prisma schema
- Vitest coverage for the action (auth, ownership miss, success)
- Action bar gains right-padding so the rightmost button isn't hidden by the Sheet's absolute close X

#### References
- `src/actions/items.ts`, `src/actions/items.test.ts`
- `src/components/items/item-drawer-delete-dialog.tsx`
- `src/components/items/item-drawer.tsx`, `src/components/items/item-drawer-provider.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/lib/db/items.ts` (added `deleteItem`)

---

### Item Create
- **Status:** Completed

#### Goals
- shadcn `Dialog` opens from the top bar's "New Item" button
- Type selector for snippet, prompt, command, note, link
- Conditional fields by type: Content (snippet/prompt/command/note), Language (snippet/command), URL required for link
- `createItem` server action with Zod discriminated union per type and `{ success, data, error }` return
- `createItem` query looks up itemType by name and connect-or-creates tags
- On success: close modal, success toast, `router.refresh()` so the new row appears
- On error: per-field errors + error toast, modal stays open
- Content textarea has `max-h-64` so the dialog stays in the viewport when content auto-grows
- Vitest coverage (auth, title required, link URL validation, type-not-found, snippet success, link success)

#### References
- `context/features/item-create-spec.md`
- `src/actions/items.ts`, `src/actions/items.test.ts`
- `src/components/items/item-create-dialog.tsx`
- `src/components/dashboard/top-bar.tsx`
- `src/components/ui/select.tsx`
- `src/lib/db/items.ts` (added `createItem`)
