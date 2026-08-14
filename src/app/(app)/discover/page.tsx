"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/nav/TopBar";
import { ListRow } from "@/components/ui/ListRow";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSkeleton, EmptyState } from "@/components/ui/StateViews";
import { useSearchCommunities, useRecommendedCommunities } from "@/features/communities/hooks";
import { Compass, Search as SearchIcon } from "lucide-react";

export default function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // Fetch search results if there's a query, otherwise fetch recommendations
  const { data: searchResults, isLoading: loadingSearch } = useSearchCommunities(query);
  const { data: recommended, isLoading: loadingRecs } = useRecommendedCommunities();

  const isSearching = query.length > 0;
  const isLoading = isSearching ? loadingSearch : loadingRecs;
  const displayData = isSearching ? searchResults : recommended;

  return (
    <div className="flex h-full flex-col bg-[#FAF8F5] dark:bg-[#171512]">
      {/* We pass showSearch=true so the user can keep typing */}
      <TopBar showSearch={true} />
      
      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEE9] dark:bg-[#0F0E0C]">
            {isSearching ? (
              <SearchIcon className="h-5 w-5 text-[#6B6459] dark:text-[#B8B1A3]" />
            ) : (
              <Compass className="h-5 w-5 text-[#6B6459] dark:text-[#B8B1A3]" />
            )}
          </div>
          <h1 className="font-serif text-2xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
            {isSearching ? `Search results for "${query}"` : "Discover Communities"}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            <LoadingSkeleton className="h-16 w-full" />
            <LoadingSkeleton className="h-16 w-full" />
            <LoadingSkeleton className="h-16 w-full" />
          </div>
        ) : displayData?.length === 0 ? (
          <EmptyState 
            icon={<SearchIcon className="h-8 w-8" />}
            heading="No communities found" 
            supportingText={isSearching ? "Try a different search term." : "Check back later for new communities."} 
          />
        ) : (
          <div className="flex flex-col overflow-hidden rounded-xl border border-[#E8E3DC] dark:border-[#2C2A25] bg-white dark:bg-[#211F1B]">
            {displayData?.map((community: any) => (
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
      </div>
    </div>
  );
}