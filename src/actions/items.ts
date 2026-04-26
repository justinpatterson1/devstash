"use server";

import { z } from "zod";
import { auth } from "@/auth";
import {
  updateItem as updateItemQuery,
  deleteItem as deleteItemQuery,
  createItem as createItemQuery,
} from "@/lib/db/items";
import type { ItemFull } from "@/lib/db/items";

const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable(),
  content: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  url: z
    .union([z.literal(""), z.url("Must be a valid URL")])
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  language: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type UpdateItemInput = z.input<typeof updateItemSchema>;

export type UpdateItemResult =
  | { success: true; data: ItemFull }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function updateItem(
  itemId: string,
  input: UpdateItemInput
): Promise<UpdateItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const updated = await updateItemQuery(session.user.id, itemId, parsed.data);
  if (!updated) {
    return { success: false, error: "Not found" };
  }

  return { success: true, data: updated };
}

export type DeleteItemResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteItem(itemId: string): Promise<DeleteItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const deleted = await deleteItemQuery(session.user.id, itemId);
  if (!deleted) {
    return { success: false, error: "Not found" };
  }

  return { success: true };
}

const titleField = z.string().trim().min(1, "Title is required");
const descriptionField = z
  .string()
  .transform((v) => (v.trim() === "" ? null : v))
  .nullable();
const tagsField = z.array(z.string().trim().min(1)).default([]);
const contentField = z
  .string()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .default(null);
const languageField = z
  .string()
  .transform((v) => (v.trim() === "" ? null : v))
  .nullable()
  .default(null);
const urlField = z.url("Must be a valid URL");

const createItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("snippet"),
    title: titleField,
    description: descriptionField,
    tags: tagsField,
    content: contentField,
    language: languageField,
  }),
  z.object({
    type: z.literal("prompt"),
    title: titleField,
    description: descriptionField,
    tags: tagsField,
    content: contentField,
  }),
  z.object({
    type: z.literal("command"),
    title: titleField,
    description: descriptionField,
    tags: tagsField,
    content: contentField,
    language: languageField,
  }),
  z.object({
    type: z.literal("note"),
    title: titleField,
    description: descriptionField,
    tags: tagsField,
    content: contentField,
  }),
  z.object({
    type: z.literal("link"),
    title: titleField,
    description: descriptionField,
    tags: tagsField,
    url: urlField,
  }),
]);

export type CreateItemInput = z.input<typeof createItemSchema>;

export type CreateItemResult =
  | { success: true; data: ItemFull }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function createItem(
  input: CreateItemInput
): Promise<CreateItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const created = await createItemQuery(session.user.id, parsed.data);
  if (!created) {
    return { success: false, error: "Item type not found" };
  }

  return { success: true, data: created };
}
