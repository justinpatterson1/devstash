# Current Feature

None

---

## History

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
