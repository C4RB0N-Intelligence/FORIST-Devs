"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navItems";

/**
 * MobileBottomNav — fixed bottom bar, visible below md. Pair with a
 * `pb-16 md:pb-0` (or similar) bottom padding on the page's scroll
 * container so content doesn't render underneath the fixed bar.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-[#E8E3DC] bg-white dark:border-[#2C2A25] dark:bg-[#211F1B] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            className="flex min-w-[64px] flex-col items-center justify-center gap-1 py-1"
          >
            <Icon
              className={cn("h-5 w-5", isActive ? "text-[#1F3A5F] dark:text-[#5B84B4]" : "text-[#A39C8F] dark:text-[#736C5F]")}
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-[11px] font-medium",
                isActive ? "text-[#1C1A17] dark:text-[#F2EFE9]" : "text-[#A39C8F] dark:text-[#736C5F]",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}