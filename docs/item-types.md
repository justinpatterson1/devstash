# Item Types

DevStash supports 7 system-defined item types. Each type is stored in the `ItemType` model and referenced by items via `itemTypeId`.

## Type Reference

### 1. Snippet

| Property | Value |
|----------|-------|
| **Name** | `snippet` |
| **Icon** | `Code` (Lucide) |
| **Color** | `#3b82f6` (blue) |
| **Purpose** | Store reusable code fragments with syntax highlighting |
| **Key fields** | `content` (code body), `language` (syntax highlighting language) |

### 2. Prompt

| Property | Value |
|----------|-------|
| **Name** | `prompt` |
| **Icon** | `Sparkles` (Lucide) |
| **Color** | `#8b5cf6` (violet) |
| **Purpose** | Save AI/LLM prompts and system instructions |
| **Key fields** | `content` (prompt text), `description` |

### 3. Command

| Property | Value |
|----------|-------|
| **Name** | `command` |
| **Icon** | `Terminal` (Lucide) |
| **Color** | `#f97316` (orange) |
| **Purpose** | Store shell commands, CLI one-liners, and scripts |
| **Key fields** | `content` (command text), `description` |

### 4. Note

| Property | Value |
|----------|-------|
| **Name** | `note` |
| **Icon** | `StickyNote` (Lucide) |
| **Color** | `#fde047` (yellow) |
| **Purpose** | Freeform text notes, documentation, and templates |
| **Key fields** | `content` (note body), `description` |

### 5. File

| Property | Value |
|----------|-------|
| **Name** | `file` |
| **Icon** | `File` (Lucide) |
| **Color** | `#6b7280` (gray) |
| **Purpose** | Upload and store arbitrary files (via Cloudflare R2) |
| **Key fields** | `fileUrl`, `fileName`, `fileSize` |
| **Access** | **PRO only** |

### 6. Image

| Property | Value |
|----------|-------|
| **Name** | `image` |
| **Icon** | `Image` (Lucide) |
| **Color** | `#ec4899` (pink) |
| **Purpose** | Upload and store images with preview (via Cloudflare R2) |
| **Key fields** | `fileUrl`, `fileName`, `fileSize` |
| **Access** | **PRO only** |

### 7. Link

| Property | Value |
|----------|-------|
| **Name** | `link` |
| **Icon** | `Link` (Lucide) |
| **Color** | `#10b981` (emerald) |
| **Purpose** | Bookmark external URLs with descriptions |
| **Key fields** | `url`, `description` |

## Classification

### By primary data storage

| Classification | Types | Primary field |
|---------------|-------|--------------|
| **Text-based** | snippet, prompt, command, note | `content` |
| **File-based** | file, image | `fileUrl`, `fileName`, `fileSize` |
| **URL-based** | link | `url` |

### PRO-gated types

`file` and `image` require a PRO subscription. This is enforced in the sidebar via `proTypes = new Set(["file", "image"])`.

## Shared Properties

All items regardless of type share these fields from the `Item` model:

| Field | Type | Description |
|-------|------|-------------|
| `title` | `String` | Required display title |
| `contentType` | `String` | Matches the item type name (e.g. `"snippet"`) |
| `description` | `String?` | Optional summary |
| `isFavorite` | `Boolean` | User-flagged favorite |
| `isPinned` | `Boolean` | Pinned to top of lists |
| `tags` | `ItemTag[]` | Many-to-many tag associations |
| `collections` | `ItemCollection[]` | Many-to-many collection memberships |
| `createdAt` | `DateTime` | Auto-set on creation |
| `updatedAt` | `DateTime` | Auto-updated on changes |

## Display Differences

- **Snippets**: Rendered with syntax-highlighted code block; `language` determines highlighting
- **Prompts**: Displayed as formatted text content
- **Commands**: Displayed as monospace/terminal-style content
- **Notes**: Rendered as rich text / markdown
- **Files**: Show file name, size, and download action
- **Images**: Show image preview thumbnail with file metadata
- **Links**: Show URL with external link action

## Schema Details

The `ItemType` model (`prisma/schema.prisma:72-80`):

```prisma
model ItemType {
  id       String  @id @default(cuid())
  name     String  @unique
  icon     String
  color    String
  isSystem Boolean @default(false)

  items Item[]
}
```

All 7 types are seeded with `isSystem: true`, distinguishing them from potential future user-created custom types.
