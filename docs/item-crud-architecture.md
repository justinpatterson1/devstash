# Item CRUD Architecture

A unified system for creating, reading, updating, and deleting all 7 item types through shared actions, queries, routes, and components.

## File Structure

```
src/
├── actions/
│   └── items.ts                          # All item mutations (create, update, delete, toggle)
│
├── lib/db/
│   └── items.ts                          # All item queries (existing + new)
│
├── app/
│   └── items/
│       └── [type]/
│           ├── page.tsx                   # Item list by type (server component)
│           └── [id]/
│               └── page.tsx              # Single item detail (server component)
│
└── components/
    └── items/
        ├── item-list.tsx                  # Renders filtered list of items
        ├── item-card.tsx                  # Single item in list/grid view
        ├── item-detail.tsx               # Full item view (delegates to type-specific renderers)
        ├── item-form.tsx                 # Unified create/edit form (adapts fields by type)
        ├── item-form-dialog.tsx          # Dialog wrapper for item-form
        ├── item-actions.tsx              # Delete confirmation, pin/favorite toggles
        ├── tag-input.tsx                 # Tag autocomplete/creation input
        ├── collection-picker.tsx         # Collection multi-select
        └── renderers/
            ├── snippet-renderer.tsx      # Syntax-highlighted code block
            ├── prompt-renderer.tsx       # Formatted prompt text
            ├── command-renderer.tsx       # Monospace terminal display
            ├── note-renderer.tsx          # Markdown/rich text
            ├── file-renderer.tsx          # File info + download
            ├── image-renderer.tsx         # Image preview + metadata
            └── link-renderer.tsx          # URL card + external link
```

## Routing: `/items/[type]`

### How it works

The sidebar links to `/items/{typeName}` where `typeName` is the lowercase item type name (e.g. `snippet`, `prompt`, `command`). The `[type]` dynamic segment maps directly to `ItemType.name` in the database.

### Route: `/items/[type]/page.tsx`

```
Server Component
  1. Authenticate via auth()
  2. Validate [type] param against known type names
  3. Fetch items: getItemsByType(userId, type)
  4. Fetch type metadata: getItemTypeByName(type)
  5. Render <ItemList items={items} itemType={itemType} />
```

### Route: `/items/[type]/[id]/page.tsx`

```
Server Component
  1. Authenticate via auth()
  2. Fetch item: getItemById(userId, id)
  3. 404 if not found or wrong user
  4. Render <ItemDetail item={item} />
```

### Valid type slugs

| Slug | ItemType.name |
|------|---------------|
| `snippet` | snippet |
| `prompt` | prompt |
| `command` | command |
| `note` | note |
| `file` | file |
| `image` | image |
| `link` | link |

## Mutations: `src/actions/items.ts`

All mutations use Next.js Server Actions with `"use server"`. Each action authenticates via `auth()`, validates input with Zod, and calls Prisma directly.

### Actions

| Action | Purpose | Key fields |
|--------|---------|------------|
| `createItem(formData)` | Create any item type | `title`, `contentType`, `itemTypeId`, plus type-specific fields |
| `updateItem(id, formData)` | Update any item | Same as create, ownership check |
| `deleteItem(id)` | Delete item + cascade tags/collections | Ownership check |
| `toggleFavorite(id)` | Flip `isFavorite` | Returns new state |
| `togglePin(id)` | Flip `isPinned` | Returns new state |

### Shared validation schema

```
Base: title (required), description (optional), tags (string[]), collectionIds (string[])

Type-specific:
  snippet/prompt/command/note → content (required), language (optional, snippet only)
  file/image                  → fileUrl, fileName, fileSize (required)
  link                        → url (required)
```

The `contentType` field on Item matches the ItemType `name` and determines which fields are validated and persisted. Type-specific validation happens in the action — the form sends `contentType` and the action applies the matching Zod schema branch.

### Action patterns (following existing codebase conventions)

```typescript
// Follows the same auth + Prisma pattern as existing API routes
const session = await auth();
if (!session?.user?.id) throw new Error("Unauthorized");

// Ownership check for update/delete
const item = await prisma.item.findUnique({ where: { id } });
if (!item || item.userId !== session.user.id) throw new Error("Not found");
```

## Queries: `src/lib/db/items.ts`

New queries added alongside existing ones. All follow the established pattern: accept `userId`, return typed DTOs, use `mapItem` helper and `itemInclude` constant.

### New query functions

| Function | Purpose | Used by |
|----------|---------|---------|
| `getItemsByType(userId, typeName, options?)` | Items filtered by type slug | `/items/[type]` page |
| `getItemById(userId, itemId)` | Single item with full details | `/items/[type]/[id]` page, edit form |
| `getItemTypeByName(name)` | Type metadata (icon, color) | Page headers, form defaults |

### `getItemsByType` options

```typescript
{
  search?: string;       // Filter by title/description (ILIKE)
  tagIds?: string[];     // Filter by tags (AND)
  sortBy?: "updatedAt" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}
```

### Extended item type for detail view

The existing `ItemWithDetails` type works for list views. The detail view needs additional fields:

```typescript
export type ItemFull = ItemWithDetails & {
  content: string | null;
  url: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  language: string | null;
  contentType: string;
  createdAt: Date;
  collectionIds: string[];
};
```

## Component Responsibilities

### Where type-specific logic lives

Type-specific logic is in **components only**, not in actions or queries. The data layer treats all items uniformly. The UI layer adapts.

| Component | Responsibility |
|-----------|---------------|
| `item-form.tsx` | Shows/hides fields based on `contentType`: code editor for snippets, URL input for links, file upload for files/images, textarea for prompts/commands/notes |
| `item-detail.tsx` | Delegates to the correct renderer based on `typeName` |
| `renderers/*.tsx` | Type-specific display: syntax highlighting (snippet), markdown (note), terminal style (command), image preview (image), etc. |
| `item-card.tsx` | Shared card layout; shows type icon + color, truncated content preview |

### Component data flow

```
Server Component (page.tsx)
  ├── fetches data via lib/db (server-side, no API call)
  └── passes plain objects to client components

Client Components
  ├── item-form.tsx         → calls server actions (createItem / updateItem)
  ├── item-actions.tsx      → calls server actions (deleteItem / toggleFavorite / togglePin)
  └── item-list.tsx         → display only, receives items as props
```

### Form adaptation by type

```
contentType === "snippet"  → content (code editor) + language select
contentType === "prompt"   → content (textarea, larger)
contentType === "command"  → content (monospace textarea, single/few lines)
contentType === "note"     → content (rich textarea / markdown)
contentType === "file"     → file upload (R2) → fileUrl, fileName, fileSize
contentType === "image"    → image upload (R2) → fileUrl, fileName, fileSize + preview
contentType === "link"     → url input + optional description
```

All types share: title, description, tag picker, collection picker.

## Integration with existing code

### Dashboard layout remains the parent

The `/items/[type]` routes should be nested under the dashboard layout to inherit the sidebar. Either:
- Place routes at `src/app/dashboard/items/[type]/page.tsx`, or
- Create a shared layout group `(app)` that wraps both `/dashboard` and `/items`

The current sidebar already links to `/items/{slug}`, so the route structure should match.

### Existing queries stay unchanged

`getPinnedItems`, `getRecentItems`, `getItemTypesWithCounts`, `getSidebarCollections`, and `getDashboardStats` continue serving the dashboard. New queries are additive.

### `revalidatePath` after mutations

Server actions call `revalidatePath("/items/[type]")` and `revalidatePath("/dashboard")` after mutations to keep both views fresh.
