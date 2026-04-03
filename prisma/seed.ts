import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  // Clean existing data
  await prisma.itemTag.deleteMany();
  await prisma.itemCollection.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing data.");

  // ─── User ──────────────────────────────────────────────────────

  const hashedPassword = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.create({
    data: {
      email: "demo@devstash.io",
      name: "Demo User",
      isPro: false,
      emailVerified: new Date(),
      image: null,
    },
  });
  console.log(`Created user: ${user.email}`);

  // ─── Item Types ────────────────────────────────────────────────

  const typeData = [
    { name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
    { name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
    { name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
    { name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
    { name: "file", icon: "File", color: "#6b7280", isSystem: true },
    { name: "image", icon: "Image", color: "#ec4899", isSystem: true },
    { name: "link", icon: "Link", color: "#10b981", isSystem: true },
  ];

  const types: Record<string, string> = {};
  for (const t of typeData) {
    const created = await prisma.itemType.create({ data: t });
    types[t.name] = created.id;
  }
  console.log(`Created ${typeData.length} item types.`);

  // ─── Tags ──────────────────────────────────────────────────────

  const tagNames = [
    "react", "hooks", "typescript", "patterns", "state-management",
    "ai", "code-review", "documentation", "refactoring", "prompts",
    "docker", "ci-cd", "deployment", "devops", "infrastructure",
    "git", "npm", "shell", "process", "utilities",
    "css", "tailwind", "ui", "design", "icons",
  ];

  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.create({ data: { name } });
    tags[name] = tag.id;
  }
  console.log(`Created ${tagNames.length} tags.`);

  // ─── Collections ───────────────────────────────────────────────

  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
      isFavorite: true,
    },
  });

  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  });

  const devops = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  const terminalCommands = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
      isFavorite: true,
    },
  });

  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  console.log("Created 5 collections.");

  // ─── Items ─────────────────────────────────────────────────────

  // Helper to create an item with tags and collection
  async function createItem(data: {
    title: string;
    contentType: string;
    content?: string;
    url?: string;
    description?: string;
    language?: string;
    isFavorite?: boolean;
    isPinned?: boolean;
    itemTypeId: string;
    tagIds: string[];
    collectionId: string;
  }) {
    const item = await prisma.item.create({
      data: {
        title: data.title,
        contentType: data.contentType,
        content: data.content,
        url: data.url,
        description: data.description,
        language: data.language,
        isFavorite: data.isFavorite ?? false,
        isPinned: data.isPinned ?? false,
        userId: user.id,
        itemTypeId: data.itemTypeId,
      },
    });

    for (const tagId of data.tagIds) {
      await prisma.itemTag.create({
        data: { itemId: item.id, tagId },
      });
    }

    await prisma.itemCollection.create({
      data: { itemId: item.id, collectionId: data.collectionId },
    });

    return item;
  }

  // ── React Patterns (3 snippets) ────────────────────────────────

  await createItem({
    title: "useDebounce Hook",
    contentType: "snippet",
    description: "Custom hook for debouncing values in React",
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    itemTypeId: types.snippet,
    content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    tagIds: [tags.react, tags.hooks, tags.typescript],
    collectionId: reactPatterns.id,
  });

  await createItem({
    title: "Context Provider Pattern",
    contentType: "snippet",
    description: "Type-safe React context with custom hook",
    language: "typescript",
    isPinned: true,
    itemTypeId: types.snippet,
    content: `import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}`,
    tagIds: [tags.react, tags.patterns, tags.typescript],
    collectionId: reactPatterns.id,
  });

  await createItem({
    title: "useLocalStorage Hook",
    contentType: "snippet",
    description: "Persist state to localStorage with type safety",
    language: "typescript",
    itemTypeId: types.snippet,
    content: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    tagIds: [tags.react, tags.hooks, tags["state-management"]],
    collectionId: reactPatterns.id,
  });

  // ── AI Workflows (3 prompts) ───────────────────────────────────

  await createItem({
    title: "Code Review System Prompt",
    contentType: "prompt",
    description: "Thorough code review with actionable feedback",
    isFavorite: true,
    itemTypeId: types.prompt,
    content: `You are an expert code reviewer. Analyze the following code and provide feedback on:

1. **Bugs & Edge Cases** — Identify potential runtime errors or unhandled scenarios
2. **Performance** — Flag unnecessary re-renders, N+1 queries, or inefficient algorithms
3. **Security** — Check for injection, XSS, or data exposure risks
4. **Readability** — Suggest clearer naming, simpler logic, or better structure
5. **Best Practices** — Note deviations from framework conventions

Format: Use markdown with severity labels (🔴 Critical, 🟡 Warning, 🔵 Suggestion).`,
    tagIds: [tags.ai, tags["code-review"], tags.prompts],
    collectionId: aiWorkflows.id,
  });

  await createItem({
    title: "Documentation Generator",
    contentType: "prompt",
    description: "Generate comprehensive documentation from code",
    itemTypeId: types.prompt,
    content: `Analyze the following code and generate documentation that includes:

1. **Overview** — What the module/function does in one paragraph
2. **Parameters** — Table of all parameters with types, defaults, and descriptions
3. **Return Value** — What is returned and when
4. **Examples** — 2-3 usage examples covering common and edge cases
5. **Notes** — Any caveats, side effects, or dependencies

Use JSDoc format for inline docs and markdown for the README section.`,
    tagIds: [tags.ai, tags.documentation, tags.prompts],
    collectionId: aiWorkflows.id,
  });

  await createItem({
    title: "Refactoring Assistant",
    contentType: "prompt",
    description: "Guided refactoring with before/after comparisons",
    itemTypeId: types.prompt,
    content: `You are a refactoring expert. Given the following code:

1. Identify code smells (duplication, long functions, deep nesting, etc.)
2. Propose refactoring steps in order of impact
3. Show before/after for each change
4. Explain the benefit of each refactoring
5. Ensure all refactorings preserve existing behavior

Prioritize: readability > performance > brevity. Never change public APIs without noting it.`,
    tagIds: [tags.ai, tags.refactoring, tags.prompts],
    collectionId: aiWorkflows.id,
  });

  // ── DevOps (1 snippet, 1 command, 2 links) ────────────────────

  await createItem({
    title: "Multi-stage Dockerfile",
    contentType: "snippet",
    description: "Optimized multi-stage Docker build for Node.js",
    language: "dockerfile",
    itemTypeId: types.snippet,
    content: `FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]`,
    tagIds: [tags.docker, tags.devops, tags.deployment],
    collectionId: devops.id,
  });

  await createItem({
    title: "Deploy to Production",
    contentType: "command",
    description: "Build and deploy with zero-downtime",
    itemTypeId: types.command,
    content: `docker compose -f docker-compose.prod.yml up -d --build --remove-orphans`,
    tagIds: [tags.deployment, tags.docker, tags.devops],
    collectionId: devops.id,
  });

  await createItem({
    title: "GitHub Actions Documentation",
    contentType: "link",
    description: "Official GitHub Actions workflow syntax reference",
    itemTypeId: types.link,
    url: "https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions",
    tagIds: [tags["ci-cd"], tags.devops, tags.documentation],
    collectionId: devops.id,
  });

  await createItem({
    title: "Neon Database Docs",
    contentType: "link",
    description: "Neon serverless PostgreSQL documentation",
    itemTypeId: types.link,
    url: "https://neon.tech/docs/introduction",
    tagIds: [tags.infrastructure, tags.devops, tags.documentation],
    collectionId: devops.id,
  });

  // ── Terminal Commands (4 commands) ─────────────────────────────

  await createItem({
    title: "Git Interactive Rebase",
    contentType: "command",
    description: "Squash, reorder, or edit the last N commits",
    itemTypeId: types.command,
    isPinned: true,
    content: `git rebase -i HEAD~5`,
    tagIds: [tags.git, tags.shell, tags.utilities],
    collectionId: terminalCommands.id,
  });

  await createItem({
    title: "Docker Cleanup",
    contentType: "command",
    description: "Remove all stopped containers, unused images, and volumes",
    itemTypeId: types.command,
    content: `docker system prune -af --volumes`,
    tagIds: [tags.docker, tags.shell, tags.utilities],
    collectionId: terminalCommands.id,
  });

  await createItem({
    title: "Kill Process on Port",
    contentType: "command",
    description: "Find and kill the process occupying a specific port",
    itemTypeId: types.command,
    content: `lsof -ti:3000 | xargs kill -9`,
    tagIds: [tags.process, tags.shell, tags.utilities],
    collectionId: terminalCommands.id,
  });

  await createItem({
    title: "NPM Dependency Audit Fix",
    contentType: "command",
    description: "Audit and auto-fix vulnerable dependencies",
    itemTypeId: types.command,
    content: `npm audit fix --force && npm outdated`,
    tagIds: [tags.npm, tags.shell, tags.utilities],
    collectionId: terminalCommands.id,
  });

  // ── Design Resources (4 links) ────────────────────────────────

  await createItem({
    title: "Tailwind CSS Documentation",
    contentType: "link",
    description: "Official Tailwind CSS utility class reference",
    itemTypeId: types.link,
    isFavorite: true,
    url: "https://tailwindcss.com/docs",
    tagIds: [tags.tailwind, tags.css, tags.design],
    collectionId: designResources.id,
  });

  await createItem({
    title: "shadcn/ui Components",
    contentType: "link",
    description: "Beautifully designed components built with Radix and Tailwind",
    itemTypeId: types.link,
    url: "https://ui.shadcn.com",
    tagIds: [tags.ui, tags.design, tags.tailwind],
    collectionId: designResources.id,
  });

  await createItem({
    title: "Vercel Design System",
    contentType: "link",
    description: "Vercel's open-source design system and component library",
    itemTypeId: types.link,
    url: "https://vercel.com/geist/introduction",
    tagIds: [tags.design, tags.ui, tags.css],
    collectionId: designResources.id,
  });

  await createItem({
    title: "Lucide Icons",
    contentType: "link",
    description: "Beautiful and consistent open-source icon library",
    itemTypeId: types.link,
    url: "https://lucide.dev/icons",
    tagIds: [tags.icons, tags.design, tags.ui],
    collectionId: designResources.id,
  });

  // ─── Summary ───────────────────────────────────────────────────

  const itemCount = await prisma.item.count();
  const collectionCount = await prisma.collection.count();
  const tagCount = await prisma.tag.count();

  console.log(`\nSeed complete!`);
  console.log(`  User:        ${user.email}`);
  console.log(`  Item Types:  ${typeData.length}`);
  console.log(`  Collections: ${collectionCount}`);
  console.log(`  Items:       ${itemCount}`);
  console.log(`  Tags:        ${tagCount}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
