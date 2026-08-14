"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Search, Bell, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { CreateCommunityModal } from "@/components/patterns/CreateCommunityModal";
import { useCreateCommunity } from "@/features/communities/hooks";

export interface TopBarProps {
  showSearch?: boolean;
  className?: string;
}

export function TopBar({ showSearch = true, className }: TopBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  
  // Modal State & Hook
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createCommunityMutation = useCreateCommunity();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.refresh(); 
    router.push("/"); 
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-[#E8E3DC] bg-[#FAF8F5]/95 px-4 backdrop-blur-sm",
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
                placeholder="Search..."
                aria-label="Search"
                className="h-full w-full bg-transparent text-sm text-[#1C1A17] placeholder:text-[#A39C8F] focus:outline-none dark:text-[#F2EFE9] dark:placeholder:text-[#736C5F]"
              />
            </div>
          </form>
        )}

        {/* ACTION ICONS */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setIsCreateOpen(true)}
            aria-label="Create Community"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#1F3A5F] hover:bg-[#F1EEE9] dark:text-[#5B84B4] dark:hover:bg-[#0F0E0C]"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
          </button>
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6B6459] hover:bg-[#F1EEE9] hover:text-[#1C1A17] dark:text-[#B8B1A3] dark:hover:bg-[#0F0E0C] dark:hover:text-[#F2EFE9]"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            onClick={handleSignOut}
            aria-label="Sign Out"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8C2F2F] hover:bg-[#8C2F2F]/10 dark:text-[#E17272] dark:hover:bg-[#E17272]/10"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* RENDER THE MODAL */}
      <CreateCommunityModal 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={async (values) => {
          await createCommunityMutation.mutateAsync(values);
          router.push(`/c/${values.tag}/home`);
        }}
      />
    </>
  );
}