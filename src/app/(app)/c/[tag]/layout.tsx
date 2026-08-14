"use client";

import { use } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSkeleton, ErrorBanner } from "@/components/ui/StateViews";
import { useCommunity, useCommunityMembers } from "@/features/communities/hooks";
import { CommunitySidebar } from "@/components/nav/CommunitySidebar";
import { MemberList } from "@/components/patterns/MemberList";

export default function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tag: string }>;
}) {
  const { tag } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: community, isLoading, isError } = useCommunity(tag);
  const { data: members, isLoading: loadingMembers } = useCommunityMembers(community?.id);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <LoadingSkeleton className="h-full w-full max-w-4xl" />
      </div>
    );
  }

  if (isError || !community) {
    return (
      <div className="p-8">
        <ErrorBanner message="Community not found or you don't have access." />
      </div>
    );
  }

  const currentChannelName = pathname.split("/").pop();
  const activeChannel = community.channels?.find(
    (c: any) => c.name.toLowerCase() === currentChannelName?.toLowerCase()
  );

  return (
    // Changed to h-full since the root layout now manages the screen height
    <div className="flex h-full w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#171512]">
      
      {/* LEFT PANE: Channel Sidebar */}
      <div className="hidden shrink-0 md:block">
        <CommunitySidebar
          community={{ id: community.id, name: community.name, tag: community.tag }}
          channels={community.channels || []}
          activeChannelId={activeChannel?.id}
          onChannelClick={(channel) => {
            router.push(`/c/${community.tag}/${channel.name.toLowerCase()}`);
          }}
        />
      </div>

      {/* CENTER PANE: Active Channel Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto relative shadow-[-4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[-4px_0_12px_rgba(0,0,0,0.2)]">
        <div className="mx-auto w-full max-w-[720px] flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* RIGHT PANE: Context/Member Rail */}
      <aside className="hidden w-[320px] shrink-0 flex-col border-l border-[#E8E3DC] bg-white p-4 dark:border-[#2C2A25] dark:bg-[#211F1B] xl:flex overflow-y-auto">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B6459] dark:text-[#B8B1A3]">
          Members
        </h3>
        {loadingMembers ? (
          <LoadingSkeleton className="h-24 w-full" />
        ) : (
          <MemberList members={members || []} />
        )}
      </aside>
      
    </div>
  );
}