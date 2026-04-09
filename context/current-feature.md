# Current Feature: Auth Credentials - Email/Password Provider

## Status
In Progress

## Goals
- Add `password` field to User model via Prisma migration
- Add Credentials provider placeholder in `auth.config.ts` (`authorize: () => null`)
- Override Credentials provider in `auth.ts` with bcrypt validation logic
- Create registration API route at `POST /api/auth/register`
- Registration accepts name, email, password, confirmPassword
- Validate passwords match, check for existing user, hash with bcryptjs
- Ensure GitHub OAuth still works alongside credentials

## Notes
- bcryptjs is already installed
- Split config pattern: placeholder in auth.config.ts, real logic in auth.ts
- Registration endpoint returns success/error JSON response
- Test via curl and NextAuth's default sign-in page

---

## History

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
