"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { updateItem as updateItemQuery } from "@/lib/db/items";
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
