"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ItemFull } from "@/lib/db/items";
import { ItemDrawer } from "@/components/items/item-drawer";

type ItemDrawerContextValue = {
  openItem: (id: string) => void;
};

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) {
    throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  }
  return ctx;
}

export function ItemDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<ItemFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const latestIdRef = useRef<string | null>(null);

  const openItem = useCallback(async (id: string) => {
    latestIdRef.current = id;
    setItem(null);
    setLoading(true);
    setIsEditing(false);
    setOpen(true);

    try {
      const res = await fetch(`/api/items/${id}`);
      if (latestIdRef.current !== id) return;
      if (res.ok) {
        const data = (await res.json()) as ItemFull;
        if (latestIdRef.current === id) setItem(data);
      }
    } catch {
      // leave item null — drawer will show skeleton indefinitely until closed
    } finally {
      if (latestIdRef.current === id) setLoading(false);
    }
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setIsEditing(false);
  }, []);

  const startEdit = useCallback(() => setIsEditing(true), []);
  const cancelEdit = useCallback(() => setIsEditing(false), []);
  const applyUpdate = useCallback((updated: ItemFull) => {
    setItem(updated);
    setIsEditing(false);
  }, []);
  const handleDeleted = useCallback(() => {
    latestIdRef.current = null;
    setOpen(false);
    setItem(null);
    setIsEditing(false);
  }, []);

  return (
    <ItemDrawerContext.Provider value={{ openItem }}>
      {children}
      <ItemDrawer
        open={open}
        onOpenChange={handleOpenChange}
        item={item}
        loading={loading}
        isEditing={isEditing}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSaved={applyUpdate}
        onDeleted={handleDeleted}
      />
    </ItemDrawerContext.Provider>
  );
}
