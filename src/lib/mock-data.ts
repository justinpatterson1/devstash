export type ItemType = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
};

export type Tag = {
  id: string;
  name: string;
};

export type Item = {
  id: string;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  language?: string;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  tags: string[];
  collectionIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  isFavorite: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
};

// Current user
export const currentUser: User = {
  id: "user_1",
  name: "Justin",
  email: "justin@devstash.io",
  isPro: false,
};

// Item types with colors from the design spec
export const itemTypes: ItemType[] = [
  { id: "type_snippet", name: "Snippets", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type_prompt", name: "Prompts", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type_note", name: "Notes", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type_command", name: "Commands", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type_link", name: "Links", icon: "Link", color: "#10b981", isSystem: true },
  { id: "type_file", name: "Files", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type_image", name: "Images", icon: "Image", color: "#ec4899", isSystem: true },
];

// Collections
export const collections: Collection[] = [
  { id: "col_1", name: "React Patterns", description: "Common React patterns and conventions", isFavorite: true, itemCount: 17, createdAt: "2026-02-10T10:00:00Z", updatedAt: "2026-03-28T14:00:00Z" },
  { id: "col_2", name: "Context Files", description: "System prompts and context templates", isFavorite: false, itemCount: 4, createdAt: "2026-02-15T09:00:00Z", updatedAt: "2026-03-25T11:00:00Z" },
  { id: "col_3", name: "Python Snippets", description: "Frequently used Python code", isFavorite: false, itemCount: 8, createdAt: "2026-03-01T08:00:00Z", updatedAt: "2026-03-30T16:00:00Z" },
  { id: "col_4", name: "CLI Commands", description: "Useful terminal commands and scripts", isFavorite: false, itemCount: 12, createdAt: "2026-02-20T12:00:00Z", updatedAt: "2026-03-29T09:00:00Z" },
  { id: "col_5", name: "API References", description: "API documentation and endpoint references", isFavorite: false, itemCount: 6, createdAt: "2026-03-05T14:00:00Z", updatedAt: "2026-03-27T10:00:00Z" },
];

// Items
export const items: Item[] = [
  {
    id: "item_1",
    title: "Project Architecture Notes",
    description: "Notes on the project architecture and decisions",
    content: "# Architecture\n\nA custom React hook for debouncing values...",
    isFavorite: true,
    isPinned: true,
    itemTypeId: "type_note",
    tags: ["architecture", "design", "notes"],
    collectionIds: ["col_2"],
    createdAt: "2026-02-12T10:00:00Z",
    updatedAt: "2026-03-28T14:30:00Z",
  },
  {
    id: "item_2",
    title: "useDebounce Hook",
    description: "A custom React hook for debouncing values",
    content: "import { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debouncedValue;\n}",
    language: "typescript",
    isFavorite: false,
    isPinned: true,
    itemTypeId: "type_snippet",
    tags: ["react", "hooks", "typescript"],
    collectionIds: ["col_1"],
    createdAt: "2026-02-18T09:00:00Z",
    updatedAt: "2026-03-20T11:00:00Z",
  },
  {
    id: "item_3",
    title: "Zustand Store Pattern",
    description: "Clean Zustand store with devtools and persistence",
    content: "import { create } from 'zustand';\nimport { devtools, persist } from 'zustand/middleware';\n\ninterface AppState {\n  count: number;\n  increment: () => void;\n}\n\nexport const useAppStore = create<AppState>()(devtools(persist((set) => ({\n  count: 0,\n  increment: () => set((state) => ({ count: state.count + 1 })),\n}), { name: 'app-store' })));",
    language: "typescript",
    isFavorite: true,
    isPinned: false,
    itemTypeId: "type_snippet",
    tags: ["react", "zustand", "state-management"],
    collectionIds: ["col_1"],
    createdAt: "2026-03-01T08:30:00Z",
    updatedAt: "2026-03-25T15:00:00Z",
  },
  {
    id: "item_4",
    title: "React Query Documentation",
    description: "Official TanStack Query documentation",
    url: "https://tanstack.com/query/latest/docs/overview",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_link",
    tags: ["react", "data-fetching", "documentation"],
    collectionIds: ["col_1", "col_5"],
    createdAt: "2026-03-05T14:00:00Z",
    updatedAt: "2026-03-05T14:00:00Z",
  },
  {
    id: "item_5",
    title: "Refactoring Assistant Prompt",
    description: "A prompt for code refactoring assistance",
    content: "You are a code refactoring expert. Help me refactor the following code to improve readability, performance, and maintainability while keeping the same functionality.",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_prompt",
    tags: ["ai", "refactoring", "code-review"],
    collectionIds: ["col_2"],
    createdAt: "2026-03-10T10:00:00Z",
    updatedAt: "2026-03-22T09:00:00Z",
  },
  {
    id: "item_6",
    title: "Meeting Notes Template",
    description: "Template for structured meeting notes",
    content: "# Meeting Notes\n\n**Date:** \n**Attendees:** \n\n## Agenda\n- \n\n## Action Items\n- [ ] \n\n## Notes\n",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_note",
    tags: ["template", "meetings", "productivity"],
    collectionIds: [],
    createdAt: "2026-03-08T11:00:00Z",
    updatedAt: "2026-03-08T11:00:00Z",
  },
  {
    id: "item_7",
    title: "Code Review System Prompt",
    description: "A detailed PR code review system prompt",
    content: "You are an expert code reviewer. Review the following pull request changes and provide feedback on:\n1. Code quality and readability\n2. Potential bugs or edge cases\n3. Performance implications\n4. Security concerns",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_prompt",
    tags: ["ai", "code-review"],
    collectionIds: ["col_2"],
    createdAt: "2026-02-25T16:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "item_8",
    title: "Vercel CLI Deploy",
    description: "Deploy to Vercel using the CLI",
    content: "vercel --prod",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_command",
    tags: ["vercel", "deployment", "cli"],
    collectionIds: ["col_4"],
    createdAt: "2026-03-12T08:00:00Z",
    updatedAt: "2026-03-12T08:00:00Z",
  },
  {
    id: "item_9",
    title: "NPM Cache Clean",
    description: "Clear the NPM cache completely",
    content: "npm cache clean --force && rm -rf node_modules && npm install",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_command",
    tags: ["npm", "troubleshooting"],
    collectionIds: ["col_4"],
    createdAt: "2026-03-14T13:00:00Z",
    updatedAt: "2026-03-14T13:00:00Z",
  },
  {
    id: "item_10",
    title: "Python List Comprehension",
    description: "Examples of list comprehension patterns",
    content: "# Basic\nsquares = [x**2 for x in range(10)]\n\n# With filter\nevens = [x for x in range(20) if x % 2 == 0]\n\n# Nested\nflattened = [item for sublist in matrix for item in sublist]",
    language: "python",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_snippet",
    tags: ["python", "comprehension", "basics"],
    collectionIds: ["col_3"],
    createdAt: "2026-03-18T09:00:00Z",
    updatedAt: "2026-03-18T09:00:00Z",
  },
  {
    id: "item_11",
    title: "Docker Compose Up",
    description: "Start Docker containers in detached mode with rebuild",
    content: "docker compose up -d --build",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_command",
    tags: ["docker", "devops", "containers"],
    collectionIds: ["col_4"],
    createdAt: "2026-03-20T07:00:00Z",
    updatedAt: "2026-03-20T07:00:00Z",
  },
  {
    id: "item_12",
    title: "Git Interactive Rebase",
    description: "Rebase last N commits interactively",
    content: "git rebase -i HEAD~5",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_command",
    tags: ["git", "rebase", "history"],
    collectionIds: ["col_4"],
    createdAt: "2026-03-22T15:00:00Z",
    updatedAt: "2026-03-22T15:00:00Z",
  },
];
