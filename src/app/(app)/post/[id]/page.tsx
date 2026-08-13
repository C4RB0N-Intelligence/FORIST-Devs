"use client";

import { use } from "react";
import { TopBar } from "@/components/nav/TopBar";
import { EmptyState } from "@/components/ui/StateViews";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="mx-auto max-w-2xl">
      <TopBar showSearch={false} />
      <div className="p-4">
        <EmptyState 
          heading="Post Detail View" 
          supportingText={`You are viewing post ID: ${id}. We will build the comments and expanded UI here next.`} 
        />
      </div>
    </div>
  );
}