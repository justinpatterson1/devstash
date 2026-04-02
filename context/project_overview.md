# DevStash – Project Overview

## 🧠 Core Idea
Developers currently store knowledge across multiple fragmented tools:
- Code snippets in VS Code, Notion
- AI prompts in chat tools
- Docs in folders
- Links in bookmarks
- Commands in text files or terminal history

**DevStash solves this by providing one centralized, fast, searchable, AI-powered hub for developer knowledge.**

---

## 🎯 Target Users

### 1. Everyday Developer
- Needs quick access to snippets, commands, links

### 2. AI-first Developer
- Saves prompts, workflows, system messages

### 3. Content Creator / Educator
- Stores explanations, notes, reusable examples

### 4. Full-stack Builder
- Organizes patterns, APIs, boilerplates

---

## 🧩 Core Features

### 🗂️ Item Types
System-defined types (non-editable initially):
- snippet
- prompt
- note
- command
- link
- file (Pro)
- image (Pro)

Each item supports:
- Text content OR file OR URL
- Tags
- Favorites / Pinning
- Language metadata (for code)

---

### 📚 Collections
- Group items by topic
- Many-to-many relationship with items
- Examples:
  - React Patterns
  - Context Files
  - Python Snippets

---

### 🔍 Search
Search across:
- Title
- Content
- Tags
- Type

---

### 🔐 Authentication
- Email / Password
- GitHub OAuth

---

### ⚙️ Additional Features
- Favorites & pinning
- Recently used
- Markdown editor
- File uploads
- Export (JSON / ZIP)
- Multi-collection assignment

---

## 🤖 AI Features (Pro)
- Auto-tag suggestions
- Code explanation
- Summaries
- Prompt optimizer

---

## 🗄️ Data Model (Prisma – Rough Draft)

```prisma
model User {
  id                    String   @id @default(cuid())
  email                 String   @unique
  isPro                 Boolean  @default(false)
  stripeCustomerId      String?
  stripeSubscriptionId  String?

  items       Item[]
  collections Collection[]
}

model Item {
  id          String   @id @default(cuid())
  title       String
  contentType String
  content     String?
  fileUrl     String?
  fileName    String?
  fileSize    Int?
  url         String?
  description String?
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  language    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId     String
  user       User      @relation(fields: [userId], references: [id])

  itemTypeId String
  itemType   ItemType  @relation(fields: [itemTypeId], references: [id])

  tags       Tag[]
  collections ItemCollection[]
}

model ItemType {
  id       String  @id @default(cuid())
  name     String
  icon     String
  color    String
  isSystem Boolean @default(false)

  items Item[]
}

model Collection {
  id          String   @id @default(cuid())
  name        String
  description String?
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId String
  user   User @relation(fields: [userId], references: [id])

  items ItemCollection[]
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id])
  collection Collection @relation(fields: [collectionId], references: [id])

  @@id([itemId, collectionId])
}

model Tag {
  id    String @id @default(cuid())
  name  String

  items Item[]
}
```

---

## 🏗️ Architecture Diagram

```
Frontend (Next.js 16 + React 19)
    |
    |-- UI (ShadCN + Tailwind)
    |-- State Management
    |
Backend (API Routes)
    |
    |-- Auth (NextAuth v5)
    |-- Item Service
    |-- Collection Service
    |-- AI Service (OpenAI)
    |-- File Upload Service
    |
Database (Neon PostgreSQL)
    |
    |-- Prisma ORM

Storage (Cloudflare R2)

Optional:
Redis (Caching)
```

---

## 🧰 Tech Stack

### Frontend
- Next.js 16
- React 19
- Tailwind CSS v4
- ShadCN UI

### Backend
- API Routes (Node.js)
- TypeScript

### Database
- Neon PostgreSQL
- Prisma ORM

### Auth
- NextAuth v5

### Storage
- Cloudflare R2

### AI
- OpenAI (gpt-5-nano)

---

## 💰 Monetization

### Free Tier
- 50 items
- 3 collections
- No file uploads
- No AI features

### Pro Tier ($8/month or $72/year)
- Unlimited items
- Unlimited collections
- File & image uploads
- AI features
- Export data

---

## 🎨 UI/UX Design

### Design Principles
- Minimal, developer-focused
- Dark mode default
- Clean typography

### Layout
- Sidebar + main content
- Drawer for item editing

### Color System
| Type     | Color     | Icon       |
|----------|----------|------------|
| Snippet  | #3b82f6  | Code       |
| Prompt   | #8b5cf6  | Sparkles   |
| Command  | #f97316  | Terminal   |
| Note     | #fde047  | StickyNote |
| File     | #6b7280  | File       |
| Image    | #ec4899  | Image      |
| Link     | #10b981  | Link       |

---

## ⚠️ Important Notes

- Always use Prisma migrations
- Never use db push in production
- Keep schema versioned and controlled

---

## 🚀 Future Ideas
- Browser extension
- VS Code extension
- Team collaboration
- Public sharing links
- Version history for items

---

## 📌 Summary

DevStash is positioned as a **developer knowledge operating system**, combining:
- Storage
- Organization
- Search
- AI assistance

into one fast, minimal, and developer-friendly platform.

---

### Screenshots

Refer to the images below as a base of reference for the look and feel of the application. It does not have to be exact however , try to get all the pieces that have been show

@context/screenshots/DashboardUI_1.png
@context/screenshots/DashboardUI_2.png
@context/screenshots/DashboardUI_DrawOpen.png

📎 Source: User planning notes fileciteturn0file0

