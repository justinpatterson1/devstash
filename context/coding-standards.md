# Coding Standards

## TypeScript

- Strict mode enabled — no `any` types unless absolutely necessary.
- Use interfaces for object shapes, types for unions/intersections.
- Prefer `const` over `let`. Never use `var`.

## React / Next.js

- Components are server components by default. Only add `"use client"` when client interactivity is needed.
- Use the App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Colocate related files (component, styles, types) within the same route folder.
- Use `@/*` path alias for imports (maps to `./src/*`).

## Styling

- Use Tailwind CSS v4 utility classes.
- Use shadcn/ui components where applicable.
- Dark mode is the default — always ensure dark mode works first.

## Database

- Use Prisma for all database access.
- Always use migrations (`npx prisma migrate dev`) — never `db push` in production.
- Keep the schema versioned and controlled.

## Naming Conventions

- **Files:** kebab-case for files (`item-card.tsx`), PascalCase for component exports (`ItemCard`).
- **Variables/functions:** camelCase.
- **Types/interfaces:** PascalCase.
- **Database fields:** camelCase (Prisma convention).

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
    context/     # React context providers
  components/    # Shared UI components
  lib/           # Utilities, helpers, Prisma client
  types/         # Shared TypeScript types
```
