"use client";

import { TopBar } from "@/components/nav/TopBar";
import { EmptyState } from "@/components/ui/StateViews";

export default function CommunityHomePage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar showSearch={false} />
      <div className="flex-1 p-4">
        <EmptyState 
          heading="Welcome to the Community" 
          supportingText="Select a channel from the sidebar to start reading and chatting." 
        />
      </div>
    </div>
  );
}