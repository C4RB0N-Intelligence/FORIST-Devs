"use client";

import { AppNavigation } from "@/components/nav/AppNavigation";

export default function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#171512]">
      {/* The Global Navigation (Self-positions as Bottom Bar or Left Rail) */}
      <AppNavigation />
      
      {/* 
        Main content wrapper: 
        - pb-16 clears the mobile bottom bar 
        - md:pl-20 clears the tablet sidebar
        - lg:pl-56 clears the fully expanded desktop sidebar
      */}
      <main className="flex h-screen flex-col overflow-hidden pb-16 md:pb-0 md:pl-20 lg:pl-56">
        {children}
      </main>
    </div>
  );
}