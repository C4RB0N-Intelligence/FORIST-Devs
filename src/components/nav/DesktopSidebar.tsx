"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navItems";

/**
 * DesktopSidebar — fixed left rail, visible md and up. Hidden on small
 * screens in favor of MobileBottomNav. An href is considered active if the
 * current path matches it exactly or is nested under it (e.g. /profile/123
 * still highlights Profile), except for "/" which only matches exactly.
 */
export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col items-center gap-1 border-r border-[#E8E3DC] bg-white py-6 dark:border-[#2C2A25] dark:bg-[#211F1B] md:flex lg:w-56 lg:items-stretch lg:px-3"
    >
      <div className="mb-6 px-2">
        <span className="hidden font-serif text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9] lg:block">
          Forist
        </span>
        <span className="font-serif text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9] lg:hidden">F</span>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-out",
              "lg:w-full lg:justify-start",
              "justify-center",
              isActive
                ? "bg-[#1F3A5F]/[0.06] text-[#1C1A17] dark:bg-[#5B84B4]/10 dark:text-[#F2EFE9]"
                : "text-[#A39C8F] hover:bg-[#F1EEE9] hover:text-[#1C1A17] dark:text-[#736C5F] dark:hover:bg-[#0F0E0C] dark:hover:text-[#F2EFE9]",
            )}
          >
            <Icon
              className={cn("h-5 w-5 shrink-0", isActive ? "text-[#1F3A5F] dark:text-[#5B84B4]" : "")}
              aria-hidden="true"
            />
            <span className="hidden lg:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}