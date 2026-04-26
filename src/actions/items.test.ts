import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db/items", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/db/items")>("@/lib/db/items");
  return {
    ...actual,
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
    createItem: vi.fn(),
  };
});

import { auth } from "@/auth";
import {
  updateItem as updateItemQuery,
  deleteItem as deleteItemQuery,
  createItem as createItemQuery,
} from "@/lib/db/items";
import type { ItemFull } from "@/lib/db/items";
import { updateItem, deleteItem, createItem } from "./items";

const mockAuth = vi.mocked(auth);
const mockUpdateItemQuery = vi.mocked(updateItemQuery);
const mockDeleteItemQuery = vi.mocked(deleteItemQuery);
const mockCreateItemQuery = vi.mocked(createItemQuery);

const validInput = {
  title: "Updated",
  description: "desc",
  content: "body",
  url: "",
  language: "ts",
  tags: ["react", "hooks"],
};

const fakeItem: ItemFull = {
  id: "item1",
  title: "Updated",
  description: "desc",
  isFavorite: false,
  isPinned: false,
  tags: ["react", "hooks"],
  typeIcon: "Code",
  typeColor: "#fff",
  typeName: "snippet",
  updatedAt: new Date(),
  content: "body",
  url: null,
  fileUrl: null,
  fileName: null,
  fileSize: null,
  language: "ts",
  createdAt: new Date(),
  collections: [],
};

function authedSession() {
  return { user: { id: "user1" } } as Awaited<ReturnType<typeof auth>>;
}

describe("updateItem action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateItem("item1", validInput);
    expect(result).toEqual({ success: false, error: "Unauthorized" });
    expect(mockUpdateItemQuery).not.toHaveBeenCalled();
  });

  it("returns field errors when title is empty", async () => {
    mockAuth.mockResolvedValue(authedSession());
    const result = await updateItem("item1", { ...validInput, title: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid input");
      expect(result.fieldErrors?.title?.[0]).toMatch(/required/i);
    }
    expect(mockUpdateItemQuery).not.toHaveBeenCalled();
  });

  it("returns field errors when url is malformed", async () => {
    mockAuth.mockResolvedValue(authedSession());
    const result = await updateItem("item1", {
      ...validInput,
      url: "not a url",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.url).toBeDefined();
    }
  });

  it("returns Not found when the query returns null (ownership miss)", async () => {
    mockAuth.mockResolvedValue(authedSession());
    mockUpdateItemQuery.mockResolvedValue(null);
    const result = await updateItem("item1", validInput);
    expect(result).toEqual({ success: false, error: "Not found" });
    expect(mockUpdateItemQuery).toHaveBeenCalledWith(
      "user1",
      "item1",
      expect.objectContaining({ title: "Updated", url: null })
    );
  });

  it("passes validated data to the query and returns the updated item", async () => {
    mockAuth.mockResolvedValue(authedSession());
    mockUpdateItemQuery.mockResolvedValue(fakeItem);
    const result = await updateItem("item1", validInput);
    expect(result).toEqual({ success: true, data: fakeItem });
    expect(mockUpdateItemQuery).toHaveBeenCalledWith("user1", "item1", {
      title: "Updated",
      description: "desc",
      content: "body",
      url: null,
      language: "ts",
      tags: ["react", "hooks"],
    });
  });

  it("trims title whitespace and coerces empty optional fields to null", async () => {
    mockAuth.mockResolvedValue(authedSession());
    mockUpdateItemQuery.mockResolvedValue(fakeItem);
    await updateItem("item1", {
      title: "  Spaced  ",
      description: "   ",
      content: "",
      url: "",
      language: "",
      tags: [],
    });
    expect(mockUpdateItemQuery).toHaveBeenCalledWith("user1", "item1", {
      title: "Spaced",
      description: null,
      content: null,
      url: null,
      language: null,
      tags: [],
    });
  });
});

describe("deleteItem action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await deleteItem("item1");
    expect(result).toEqual({ success: false, error: "Unauthorized" });
    expect(mockDeleteItemQuery).not.toHaveBeenCalled();
  });

  it("returns Not found when the query reports no row deleted", async () => {
    mockAuth.mockResolvedValue(authedSession());
    mockDeleteItemQuery.mockResolvedValue(false);
    const result = await deleteItem("item1");
    expect(result).toEqual({ success: false, error: "Not found" });
    expect(mockDeleteItemQuery).toHaveBeenCalledWith("user1", "item1");
  });

  it("returns success when the query deletes the row", async () => {
    mockAuth.mockResolvedValue(authedSession());
    mockDeleteItemQuery.mockResolvedValue(true);
    const result = await deleteItem("item1");
    expect(result).toEqual({ success: true });
    expect(mockDeleteItemQuery).toHaveBeenCalledWith("user1", "item1");
  });
});

describe("createItem action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validSnippet = {
    type: "snippet" as const,
    title: "Hello",
    description: "desc",
    tags: ["react"],
    content: "const x = 1",
    language: "ts",
  };

  it("rejects when there is no session", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await createItem(validSnippet);
    expect(result).toEqual({ success: false, error: "Unauthorized" });
    expect(mockCreateItemQuery).not.toHaveBeenCalled();
  });

  it("returns field errors when title is empty", async () => {
    mockAuth.mockResolvedValue(authedSession());
    const result = await createItem({ ...validSnippet, title: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid input");
      expect(result.fieldErrors?.title?.[0]).toMatch(/required/i);
    }
    expect(mockCreateItemQuery).not.toHaveBeenCalled();
  });

  it("requires a URL for link items and rejects malformed values", async () => {
    mockAuth.mockResolvedValue(authedSession());
    const bad = await createItem({
      type: "link",
      title: "Search",
      description: "",
      tags: [],
      url: "not a url",
    });
    expect(bad.success).toBe(false);
    if (!bad.success) {
      expect(bad.fieldErrors?.url).toBeDefined();
    }
  });

  it("returns 'Item type not found' when the query reports no matching type", async () => {
    mockAuth.mockResolvedValue(authedSession());
    mockCreateItemQuery.mockResolvedValue(null);
    const result = await createItem(validSnippet);
    expect(result).toEqual({ success: false, error: "Item type not found" });
    expect(mockCreateItemQuery).toHaveBeenCalledWith(
      "user1",
      expect.objectContaining({ type: "snippet", title: "Hello" })
    );
  });

  it("creates a snippet, passing validated data and returning the row", async () => {
    mockAuth.mockResolvedValue(authedSession());
    const created: ItemFull = {
      id: "new1",
      title: "Hello",
      description: "desc",
      isFavorite: false,
      isPinned: false,
      tags: ["react"],
      typeIcon: "Code",
      typeColor: "#fff",
      typeName: "snippet",
      updatedAt: new Date(),
      content: "const x = 1",
      url: null,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      language: "ts",
      createdAt: new Date(),
      collections: [],
    };
    mockCreateItemQuery.mockResolvedValue(created);
    const result = await createItem(validSnippet);
    expect(result).toEqual({ success: true, data: created });
    expect(mockCreateItemQuery).toHaveBeenCalledWith("user1", {
      type: "snippet",
      title: "Hello",
      description: "desc",
      tags: ["react"],
      content: "const x = 1",
      language: "ts",
    });
  });

  it("creates a link, validating the URL and ignoring content/language fields", async () => {
    mockAuth.mockResolvedValue(authedSession());
    const created: ItemFull = {
      id: "new2",
      title: "Anthropic",
      description: null,
      isFavorite: false,
      isPinned: false,
      tags: [],
      typeIcon: "Link",
      typeColor: "#fff",
      typeName: "link",
      updatedAt: new Date(),
      content: null,
      url: "https://www.anthropic.com",
      fileUrl: null,
      fileName: null,
      fileSize: null,
      language: null,
      createdAt: new Date(),
      collections: [],
    };
    mockCreateItemQuery.mockResolvedValue(created);
    const result = await createItem({
      type: "link",
      title: "Anthropic",
      description: "",
      tags: [],
      url: "https://www.anthropic.com",
    });
    expect(result).toEqual({ success: true, data: created });
    expect(mockCreateItemQuery).toHaveBeenCalledWith("user1", {
      type: "link",
      title: "Anthropic",
      description: null,
      tags: [],
      url: "https://www.anthropic.com",
    });
  });
});
