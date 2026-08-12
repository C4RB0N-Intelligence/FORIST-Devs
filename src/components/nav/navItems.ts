import { Home, Search, MessageCircle, User, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Single source of truth for the four primary destinations — shared by
 *  DesktopSidebar and MobileBottomNav so link order/labels never drift apart. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];