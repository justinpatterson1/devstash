"use client";

import Link from "next/link";
import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image,
  Layers,
  Search,
  Star,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { itemTypes, collections, currentUser, items } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
};

function getItemCountForType(typeId: string) {
  return items.filter((item) => item.itemTypeId === typeId).length;
}

function getTypeSlug(name: string) {
  return name.toLowerCase();
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = [...collections]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-sidebar transition-all duration-200 ${
        collapsed ? "w-14" : "w-[20vw] min-w-48 max-w-72"
      }`}
    >
      {/* Toggle button */}
      <div className="flex h-10 items-center justify-end px-2">
        <Button variant="ghost" size="icon-xs" onClick={onToggle}>
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      {/* All Items */}
      <div className="px-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Layers className="size-4 shrink-0" />
          {!collapsed && <span>All Items</span>}
        </Link>
      </div>

      {/* Search */}
      <div className="px-2 mt-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Search className="size-4 shrink-0" />
          {!collapsed && <span>Search</span>}
        </Link>
      </div>

      {/* Favorites */}
      <div className="px-2 mt-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Star className="size-4 shrink-0" />
          {!collapsed && <span>Favorites</span>}
        </Link>
      </div>

      {/* Item Types */}
      {!collapsed && (
        <div className="mt-6 px-2">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Types
          </p>
          <nav className="flex flex-col gap-1">
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon] ?? Layers;
              const count = getItemCountForType(type.id);
              return (
                <Link
                  key={type.id}
                  href={`/items/${getTypeSlug(type.name)}`}
                  className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" style={{ color: type.color }} />
                    <span>{type.name}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Favorite Collections */}
      {!collapsed && favoriteCollections.length > 0 && (
        <div className="mt-6 px-2">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Favorites
          </p>
          <nav className="flex flex-col gap-1">
            {favoriteCollections.map((col) => (
              <Link
                key={col.id}
                href="/dashboard"
                className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <span className="flex items-center gap-2">
                  <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                  <span>{col.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{col.itemCount}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Recent Collections */}
      {!collapsed && (
        <div className="mt-6 px-2">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Collections
          </p>
          <nav className="flex flex-col gap-1">
            {recentCollections.map((col) => (
              <Link
                key={col.id}
                href="/dashboard"
                className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
                  <span>{col.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{col.itemCount}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <div className="px-2 mb-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="size-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* User avatar area */}
      <div className="border-t border-border p-2">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {currentUser.name}
              </span>
              {!currentUser.isPro && (
                <span className="text-xs text-muted-foreground">Free Plan</span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function SidebarContent() {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = [...collections]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex h-full flex-col">
      {/* All Items */}
      <div className="px-2 pt-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Layers className="size-4 shrink-0" />
          <span>All Items</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-2 mt-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Search className="size-4 shrink-0" />
          <span>Search</span>
        </Link>
      </div>

      {/* Favorites */}
      <div className="px-2 mt-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Star className="size-4 shrink-0" />
          <span>Favorites</span>
        </Link>
      </div>

      {/* Item Types */}
      <div className="mt-6 px-2">
        <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Types
        </p>
        <nav className="flex flex-col gap-1">
          {itemTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? Layers;
            const count = getItemCountForType(type.id);
            return (
              <Link
                key={type.id}
                href={`/items/${getTypeSlug(type.name)}`}
                className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" style={{ color: type.color }} />
                  <span>{type.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Favorite Collections */}
      {favoriteCollections.length > 0 && (
        <div className="mt-6 px-2">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Favorites
          </p>
          <nav className="flex flex-col gap-1">
            {favoriteCollections.map((col) => (
              <Link
                key={col.id}
                href="/dashboard"
                className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <span className="flex items-center gap-2">
                  <Star className="size-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                  <span>{col.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{col.itemCount}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Recent Collections */}
      <div className="mt-6 px-2">
        <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Collections
        </p>
        <nav className="flex flex-col gap-1">
          {recentCollections.map((col) => (
            <Link
              key={col.id}
              href="/dashboard"
              className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
                <span>{col.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">{col.itemCount}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <div className="px-2 mb-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="size-4 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>

      {/* User avatar area */}
      <div className="border-t border-border p-2">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {currentUser.name}
            </span>
            {!currentUser.isPro && (
              <span className="text-xs text-muted-foreground">Free Plan</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
