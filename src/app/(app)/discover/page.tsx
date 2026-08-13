"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { EmptyState, LoadingSkeleton, ErrorBanner } from "@/components/ui/StateViews";
import { CardPost } from "@/components/patterns/CardPost";
import { useDiscoverPosts } from "@/features/feed/hooks";

function DiscoverContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  // Pass the search query into our new hook
  const { data: posts, isLoading, isError, refetch } = useDiscoverPosts(query);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {query && (
        <h2 className="mb-2 text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
          Results for "{query}"
        </h2>
      )}
      
      {isLoading && (
        <>
          <LoadingSkeleton className="h-80 w-full" />
          <LoadingSkeleton className="h-80 w-full" />
        </>
      )}

      {isError && <ErrorBanner message="Couldn't load discover feed." onRetry={() => refetch()} />}

      {!isLoading && !isError && posts && posts.length === 0 && (
        <EmptyState 
          icon={<Search className="h-8 w-8" />}
          heading={query ? "No results found" : "Nothing to discover right now"}
          supportingText={query ? "Try a different search term." : "Check back later for new content from around the world."}
        />
      )}

      {!isLoading && !isError && posts?.map((post: any) => {
        const author = post.author;
        if (!author) return null;
        return <CardPost key={post.id} post={post} author={author} />;
      })}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <TopBar showSearch={true} /> 
      <Suspense fallback={
        <div className="p-4">
          <LoadingSkeleton className="h-24 w-full" />
        </div>
      }>
        <DiscoverContent />
      </Suspense>
    </div>
  );
}