"use client";

import { useRouter } from "next/navigation";
import { TopBar } from "@/components/nav/TopBar";
import { ListRow } from "@/components/ui/ListRow";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSkeleton, EmptyState } from "@/components/ui/StateViews";
import { useUserCommunities, useRecommendedCommunities } from "@/features/communities/hooks";
import { Globe, Lock } from "lucide-react";

export default function CommunitiesPage() {
  const router = useRouter();
  const { data: myCommunities, isLoading: loadingMine } = useUserCommunities();
  const { data: recommended, isLoading: loadingRecs } = useRecommendedCommunities();

  return (
    <div className="flex h-full flex-col bg-[#FAF8F5] dark:bg-[#171512]">
      <TopBar showSearch={true} />
      
      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto p-4 md:p-8">
        {/* YOUR COMMUNITIES SECTION */}
        <section className="mb-12">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
            Your Communities
          </h2>
          
          {loadingMine ? (
            <div className="flex flex-col gap-2">
              <LoadingSkeleton className="h-16 w-full" />
              <LoadingSkeleton className="h-16 w-full" />
            </div>
          ) : myCommunities?.length === 0 ? (
            <EmptyState 
              heading="No communities yet" 
              supportingText="Create one or join a recommended community below." 
            />
          ) : (
            <div className="flex flex-col overflow-hidden rounded-xl border border-[#E8E3DC] dark:border-[#2C2A25]">
              {myCommunities?.map((community: any) => (
                <ListRow
                  key={community.id}
                  leading={<Avatar src={community.avatar_url} alt={community.name} size="list" />}
                  title={community.name}
                  subtitle={
                    <span className="flex items-center gap-1.5">
                      @{community.tag} • {community.role}
                      {community.type === "private" ? (
                        <Lock className="h-3 w-3 text-[#A39C8F] dark:text-[#736C5F]" />
                      ) : (
                        <Globe className="h-3 w-3 text-[#A39C8F] dark:text-[#736C5F]" />
                      )}
                    </span>
                  }
                  onClick={() => router.push(`/c/${community.tag}/home`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* RECOMMENDED SECTION */}
        <section>
          <h2 className="mb-4 font-serif text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
            Recommended for you
          </h2>
          
          {loadingRecs ? (
            <div className="flex flex-col gap-2">
              <LoadingSkeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="flex flex-col overflow-hidden rounded-xl border border-[#E8E3DC] dark:border-[#2C2A25]">
              {recommended?.map((community: any) => (
                <ListRow
                  key={community.id}
                  leading={<Avatar src={community.avatar_url} alt={community.name} size="list" />}
                  title={community.name}
                  subtitle={`@${community.tag}`}
                  onClick={() => router.push(`/c/${community.tag}/home`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}