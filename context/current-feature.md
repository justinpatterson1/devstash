# Current Feature

## Prisma + Neon PostgreSQL Setup

### Status: In Progress

### Goals
- Set up Prisma ORM with Neon PostgreSQL (serverless)
- Create initial schema based on data models in project-overview.md
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Use Prisma 7 (has breaking changes — follow upgrade guide)
- Always create migrations, never push directly unless specified
- Configure development and production database branches

### Notes
- DATABASE_URL points to the development branch
- Read Prisma 7 upgrade guide before setup: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Prisma Postgres quickstart: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

### References
- `context/features/database-spec.md`
- `context/project_overview.md`
- `context/coding-standards.md`

---

## History

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
