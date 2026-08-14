"use client";

import { useState } from "react";
import Link from "next/link";
import { Rss, PenLine } from "lucide-react";

import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "@/components/ui/StateViews";
import { CardPost } from "@/components/patterns/CardPost";
import { CreatePostSheet } from "@/components/patterns/CreatePostSheet";

import { useFeedPosts, useRecommendedAccounts, useCreatePost } from "@/features/feed/hooks";
import { useFollowStatus, useToggleFollow } from "@/features/profiles/hooks";
import type { Profile } from "@/types/domain";

export default function FeedPage() {
  const { data: posts, isLoading, isError, refetch } = useFeedPosts();
  const { data: recommended } = useRecommendedAccounts();
  
  // Sheet State & Mutation hook
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const createPostMutation = useCreatePost();

  return (
    <div className="flex h-full flex-col bg-[#FAF8F5] dark:bg-[#171512]">
      <TopBar showSearch={false} />
      
      {/* Outer wrapper allows scrolling, inner wrapper controls the wide 2xl width */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8">
          
          {/* COMPOSER TRIGGER */}
          <Card interactive onClick={() => setIsComposerOpen(true)} className="flex w-full items-center gap-3 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEE9] dark:bg-[#0F0E0C]">
               <PenLine className="h-5 w-5 text-[#6B6459] dark:text-[#B8B1A3]" aria-hidden="true" />
            </div>
            <span className="text-[15px] text-[#A39C8F] dark:text-[#736C5F]">What's on your mind?</span>
          </Card>

          {isLoading && (
            <div className="flex flex-col gap-6">
              <LoadingSkeleton className="h-[400px] w-full rounded-xl" />
              <LoadingSkeleton className="h-[400px] w-full rounded-xl" />
            </div>
          )}

          {isError && (
            <ErrorBanner message="Couldn't load your feed right now." onRetry={() => refetch()} />
          )}

          {!isLoading && !isError && posts && posts.length === 0 && (
            <EmptyState
              icon={<Rss className="h-8 w-8" />}
              heading="Your feed is empty"
              supportingText="Follow some accounts or create a new post to get started."
            />
          )}

          {!isLoading && !isError && posts?.map((post: any, i: number) => {
            const author = post.author;
            if (!author) return null;

            const items = [<CardPost key={post.id} post={post} author={author} />];

            // Recommended Accounts rail injected after the 2nd post
            if (i === 1 && recommended && recommended.length > 0) {
              items.push(
                <div key="recommended" className="flex w-full flex-col gap-3 rounded-xl border border-[#E8E3DC] bg-white p-5 dark:border-[#2C2A25] dark:bg-[#211F1B]">
                  <h2 className="font-serif text-lg font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">Recommended Accounts</h2>
                  <div className="flex flex-col divide-y divide-[#E8E3DC] dark:divide-[#2C2A25]">
                    {recommended.map((p: any) => (
                      <RecommendedAccountRow key={p.id} profile={p} />
                    ))}
                  </div>
                </div>
              );
            }
            return items;
          })}
        </div>
      </div>

      {/* THE COMPOSER SHEET */}
      <CreatePostSheet 
        open={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)} 
        onSubmit={async (values) => {
          await createPostMutation.mutateAsync(values);
          setIsComposerOpen(false);
        }}
      />
    </div>
  );
}

function RecommendedAccountRow({ profile }: { profile: Profile }) {
  const { data: followStatus } = useFollowStatus(profile.id);
  const toggleFollow = useToggleFollow(profile.id, profile.isPrivate);

  const isFollowing = followStatus === "active";
  const isPending = followStatus === "pending";

  return (
    <div className="flex items-center gap-3 py-4">
      <Link href={`/${profile.handle}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar src={profile.avatarUrl} alt={profile.displayName} size="list" isPage={profile.type === "page"} />
        <div className="min-w-0">
          <div className="flex items-center gap-1 truncate text-[15px] font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
            {profile.displayName}
            {profile.verified && <VerifiedBadge />}
          </div>
          <div className="truncate text-sm text-[#6B6459] dark:text-[#B8B1A3]">@{profile.handle}</div>
        </div>
      </Link>
      <Button
        variant={isFollowing || isPending ? "secondary" : "primary"}
        size="sm"
        loading={toggleFollow.isPending}
        onClick={() => toggleFollow.mutate()}
        className="shrink-0"
      >
        {isPending ? "Requested" : isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}