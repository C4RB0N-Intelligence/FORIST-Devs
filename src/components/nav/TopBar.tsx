"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TopBarProps {
  showSearch?: boolean;
  className?: string;
}

export function TopBar({ showSearch = true, className }: TopBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-[#E8E3DC] bg-[#FAF8F5]/95 px-4 backdrop-blur-sm",
        "dark:border-[#2C2A25] dark:bg-[#171512]/95",
        className,
      )}
    >
      {showSearch && (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl items-center gap-2">
          <div className="flex h-9 w-full items-center gap-2 rounded-full border border-[#E8E3DC] bg-[#F1EEE9] px-3 dark:border-[#2C2A25] dark:bg-[#0F0E0C]">
            <Search className="h-4 w-4 shrink-0 text-[#A39C8F] dark:text-[#736C5F]" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label="Search"
              className="h-full w-full bg-transparent text-sm text-[#1C1A17] placeholder:text-[#A39C8F] focus:outline-none dark:text-[#F2EFE9] dark:placeholder:text-[#736C5F]"
            />
          </div>
        </form>
      )}
      <Link
        href="/notifications"
        aria-label="Notifications"
        className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6B6459] hover:bg-[#F1EEE9] hover:text-[#1C1A17] dark:text-[#B8B1A3] dark:hover:bg-[#0F0E0C] dark:hover:text-[#F2EFE9]"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
      </Link>
    </header>
  );
}