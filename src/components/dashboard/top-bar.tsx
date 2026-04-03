import { Search, Plus, Menu, FolderPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-4" />
        </Button>
        <span className="text-lg font-bold text-foreground">DevStash</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="w-64 pl-9"
          />
        </div>
        <Button
          size="sm"
          className="border border-blue-500 bg-black text-blue-500 hover:bg-black/80"
        >
          <FolderPlus className="size-4" />
          <span className="hidden sm:inline">New Collection</span>
        </Button>
        <Button size="sm">
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
