import { ItemCard } from "@/components/items/item-card";
import type { ItemWithDetails } from "@/lib/db/items";

export function PinnedItems({ items }: { items: ItemWithDetails[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Pinned
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} showFavorite={false} />
        ))}
      </div>
    </section>
  );
}
