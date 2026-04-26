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
  };
});

import { auth } from "@/auth";
import { updateItem as updateItemQuery } from "@/lib/db/items";
import type { ItemFull } from "@/lib/db/items";
import { updateItem } from "./items";

const mockAuth = vi.mocked(auth);
const mockUpdateItemQuery = vi.mocked(updateItemQuery);

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
