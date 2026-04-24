import { ItemCard } from "@/components/items/item-card";
import type { ItemWithDetails } from "@/lib/db/items";

export function RecentItems({
  items,
  totalCount,
}: {
  items: ItemWithDetails[];
  totalCount: number;
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          All Items
        </h2>
        <span className="text-xs text-muted-foreground">{totalCount} items</span>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} showPin={false} />
        ))}
      </div>
    </section>
  );
}
