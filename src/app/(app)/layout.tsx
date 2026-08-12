import { DesktopSidebar } from "@/components/nav/DesktopSidebar";
import { MobileBottomNav } from "@/components/nav/MobileBottomNav";

/**
 * Shared shell for every authenticated route — wraps Feed, Discover,
 * Messages, Profile, etc. Adjust the route group name/path to match
 * wherever your actual pages live if it isn't `(app)`.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#171512]">
      <DesktopSidebar />
      <main className="pb-16 md:pb-0 md:pl-20 lg:pl-56">{children}</main>
      <MobileBottomNav />
    </div>
  );
}