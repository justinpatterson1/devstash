import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getItemsByType, getItemTypeByName } from "@/lib/db/items";
import { ItemCard } from "@/components/items/item-card";

const VALID_TYPES = new Set([
  "snippet",
  "prompt",
  "command",
  "note",
  "file",
  "image",
  "link",
]);

export default async function ItemsTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (!VALID_TYPES.has(type)) {
    notFound();
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [itemType, items] = await Promise.all([
    getItemTypeByName(type),
    getItemsByType(session.user.id, type),
  ]);

  if (!itemType) {
    notFound();
  }

  const pluralName = itemType.name.charAt(0).toUpperCase() + itemType.name.slice(1) + "s";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{pluralName}</h1>
        <span className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No {itemType.name}s yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
