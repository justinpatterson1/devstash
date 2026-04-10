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
  ChevronDown,
  Star,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";
import type { SidebarData } from "@/components/dashboard/dashboard-shell";

const proTypes = new Set(["file", "image"]);

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
};

function getTypeSlug(name: string) {
  return name.toLowerCase();
}

export function Sidebar({
  collapsed,
  onToggle,
  data,
}: {
  collapsed: boolean;
  onToggle: () => void;
  data: SidebarData;
}) {
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

      {/* Navigation header / collapsed type icons */}
      {!collapsed ? (
        <div className="px-2">
          <div className="flex items-center gap-2 px-2 py-2.5">
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {data.itemTypes.map((type) => {
              const Icon = iconMap[type.icon] ?? Layers;
              return (
                <Link
                  key={type.id}
                  href={`/items/${getTypeSlug(type.name)}`}
                  className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" style={{ color: type.color }} />
                    <span>{type.name}</span>
                    {proTypes.has(type.name) && (
                      <Badge variant="secondary" className="h-4 px-1 text-[10px] font-semibold tracking-wide">
                        PRO
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{type.count}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : (
        <nav className="flex flex-col items-center gap-2 px-2">
          {data.itemTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? Layers;
            return (
              <Link
                key={type.id}
                href={`/items/${getTypeSlug(type.name)}`}
                className="flex size-8 items-center justify-center rounded-md hover:bg-sidebar-accent"
                title={type.name}
              >
                <Icon className="size-4" style={{ color: type.color }} />
              </Link>
            );
          })}
        </nav>
      )}

      {/* Favorite Collections */}
      {!collapsed && data.favoriteCollections.length > 0 && (
        <div className="mt-6 px-2">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Favorites
          </p>
          <nav className="flex flex-col gap-1">
            {data.favoriteCollections.map((col) => (
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
            {data.recentCollections.map((col) => (
              <Link
                key={col.id}
                href="/dashboard"
                className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: col.dominantColor }}
                  />
                  <span>{col.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{col.itemCount}</span>
              </Link>
            ))}
          </nav>
          <Link
            href="/collections"
            className="mt-2 block px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            View all collections
          </Link>
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
        <Popover>
          <PopoverTrigger
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent cursor-pointer"
          >
            <UserAvatar name={data.userName} image={data.userImage} className="size-7" />
            {!collapsed && (
              <div className="flex flex-1 flex-col overflow-hidden text-left">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {data.userName}
                </span>
                {!data.isPro && (
                  <span className="text-xs text-muted-foreground">Free Plan</span>
                )}
              </div>
            )}
          </PopoverTrigger>
          <PopoverContent side="top" align="start" sideOffset={8} className="w-48 p-1">
            <Link
              href="/profile"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <User className="size-4" />
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}

export function SidebarContent({ data }: { data: SidebarData }) {
  return (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <div className="px-2 pt-2">
        <div className="flex items-center gap-2 px-2 py-2.5">
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {data.itemTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? Layers;
            return (
              <Link
                key={type.id}
                href={`/items/${getTypeSlug(type.name)}`}
                className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" style={{ color: type.color }} />
                  <span>{type.name}</span>
                  {proTypes.has(type.name) && (
                    <Badge variant="secondary" className="h-4 px-1 text-[10px] font-semibold tracking-wide">
                      PRO
                    </Badge>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">{type.count}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Favorite Collections */}
      {data.favoriteCollections.length > 0 && (
        <div className="mt-6 px-2">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Favorites
          </p>
          <nav className="flex flex-col gap-1">
            {data.favoriteCollections.map((col) => (
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
          {data.recentCollections.map((col) => (
            <Link
              key={col.id}
              href="/dashboard"
              className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: col.dominantColor }}
                />
                <span>{col.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">{col.itemCount}</span>
            </Link>
          ))}
        </nav>
        <Link
          href="/collections"
          className="mt-2 block px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          View all collections
        </Link>
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
        <Popover>
          <PopoverTrigger
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent cursor-pointer"
          >
            <UserAvatar name={data.userName} image={data.userImage} className="size-7" />
            <div className="flex flex-1 flex-col overflow-hidden text-left">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {data.userName}
              </span>
              {!data.isPro && (
                <span className="text-xs text-muted-foreground">Free Plan</span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" sideOffset={8} className="w-48 p-1">
            <Link
              href="/profile"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <User className="size-4" />
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
