"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Users, MessageSquare, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavDestination {
  href: string;
  label: string;
  icon: LucideIcon;
}

const DESTINATIONS: NavDestination[] = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "You", icon: User },
];

/**
 * AppNavigation — one component serving both the desktop left rail and the
 * mobile bottom bar via responsive classes, so the destination list and
 * active-state logic only ever live in one place.
 *
 * Desktop (md+): fixed left rail, icon + label stacked horizontally per row.
 * Mobile (<md): fixed bottom bar, icons only, centered.
 *
 * Pair with `pb-16 md:pb-0 md:pl-20 lg:pl-56` (or similar) on your page's
 * main content wrapper so content never renders underneath the nav.
 */
export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around",
        "border-t border-[#E8E3DC] bg-[#FAF8F5] dark:border-[#2C2A25] dark:bg-[#171512]",
        "md:inset-y-0 md:inset-x-auto md:left-0 md:h-screen md:w-20 md:flex-col md:items-center md:justify-start md:gap-1 md:border-r md:border-t-0 md:py-6",
        "lg:w-56 lg:items-stretch lg:px-3",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="hidden px-2 pb-6 md:block">
        <span className="hidden font-serif text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9] lg:block">
          Forist
        </span>
        <span className="font-serif text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9] lg:hidden">F</span>
      </div>

      {DESTINATIONS.map((dest) => {
        const isActive = pathname === dest.href || pathname.startsWith(`${dest.href}/`);
        const Icon = dest.icon;

        return (
          <Link
            key={dest.href}
            href={dest.href}
            aria-current={isActive ? "page" : undefined}
            aria-label={dest.label}
            className={cn(
              "flex items-center justify-center gap-3 rounded-lg text-sm font-medium transition-colors duration-200 ease-out",
              // Mobile: compact icon-only tap target.
              "h-12 w-12 flex-col gap-0.5",
              // Desktop: wider row, icon + label horizontally aligned.
              "md:h-auto md:w-full md:flex-row md:justify-start md:px-3 md:py-2.5",
              isActive
                ? "bg-[#1F3A5F]/[0.06] text-[#1F3A5F] dark:bg-[#5B84B4]/10 dark:text-[#5B84B4]"
                : "text-[#6B6459] hover:bg-[#F1EEE9] hover:text-[#1C1A17] dark:text-[#B8B1A3] dark:hover:bg-[#0F0E0C] dark:hover:text-[#F2EFE9]",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="text-[10px] md:hidden">{dest.label}</span>
            <span className="hidden md:inline lg:inline">{dest.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}