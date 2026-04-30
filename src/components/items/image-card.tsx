"use client";

import { Image as ImageIcon } from "lucide-react";
import { useItemDrawer } from "@/components/items/item-drawer-provider";
import type { ItemWithDetails } from "@/lib/db/items";

export function ImageCard({ item }: { item: ItemWithDetails }) {
  const { openItem } = useItemDrawer();

  return (
    <button
      type="button"
      onClick={() => openItem(item.id)}
      title={item.title}
      aria-label={item.title}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-md border border-border bg-muted"
    >
      {item.fileUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.fileUrl}
          alt={item.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <ImageIcon className="size-8 text-muted-foreground" />
        </div>
      )}
    </button>
  );
}
