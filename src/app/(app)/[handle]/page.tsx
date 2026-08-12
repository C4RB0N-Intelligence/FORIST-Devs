"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CardPost } from "@/components/patterns/CardPost";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "@/components/ui/StateViews";
import { useProfile, useProfilePosts, useFollowStatus, useToggleFollow } from "@/features/profiles/hooks";
import { formatCount } from "@/lib/utils";
import { ImageOff, Grid3x3 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch the currently logged-in user to check if this is "our" profile
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  const { data: profile, isLoading, isError, refetch } = useProfile(handle);
  const { data: posts, isLoading: loadingPosts } = useProfilePosts(profile?.id);
  const { data: followStatus } = useFollowStatus(profile?.id);
  const toggleFollow = useToggleFollow(profile?.id ?? "", Boolean(profile?.isPrivate));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <LoadingSkeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        {isError ? (
          <ErrorBanner message="Couldn't load this profile." onRetry={() => refetch()} />
        ) : (
          <EmptyState heading="Profile not found" supportingText="This handle doesn't exist." />
        )}
      </div>
    );
  }

  const isSelf = profile.id === currentUserId;
  const isFollowing = followStatus === "active";
  const isPending = followStatus === "pending";
  const isPrivateAndNotFollowing = profile.isPrivate && !isFollowing && !isSelf;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Banner */}
      {profile.bannerUrl && (
        <div className="relative h-32 w-full bg-[#F1EEE9] dark:bg-[#0F0E0C] sm:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.bannerUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="px-4 py-5">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <span
            className={[
              "relative h-24 w-24 shrink-0 overflow-hidden bg-[#F1EEE9] dark:bg-[#0F0E0C]",
              profile.type === "page" ? "rounded-2xl" : "rounded-full",
            ].join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover" />}
          </span>

          <div className="min-w-0 flex-1 pt-2">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
                {profile.displayName}
              </h1>
              {profile.verified && <VerifiedBadge />}
            </div>
            <p className="text-sm text-[#6B6459] dark:text-[#B8B1A3]">@{profile.handle}</p>
          </div>
        </div>

        {profile.bio && <p className="mt-4 text-[15px] text-[#1C1A17] dark:text-[#F2EFE9]">{profile.bio}</p>}

        <div className="mt-3 flex items-center gap-4 text-sm text-[#6B6459] dark:text-[#B8B1A3]">
          <span>
            <span className="font-medium tabular-nums text-[#1C1A17] dark:text-[#F2EFE9]">
              {formatCount(profile.followerCount || 0)}
            </span>{" "}
            followers
          </span>
          <span>
            <span className="font-medium tabular-nums text-[#1C1A17] dark:text-[#F2EFE9]">
              {formatCount(profile.followingCount || 0)}
            </span>{" "}
            following
          </span>
        </div>

        <div className="mt-5">
          {isSelf ? (
            <Link href="/settings/profile">
              <Button variant="secondary" size="md">
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Button
              variant={isFollowing || isPending ? "secondary" : "primary"}
              size="md"
              loading={toggleFollow.isPending}
              onClick={() => toggleFollow.mutate()}
            >
              {isPending ? "Requested" : isFollowing ? "Following" : profile.isPrivate ? "Request to Follow" : "Follow"}
            </Button>
          )}
        </div>

        {/* Post grid */}
        <div className="mt-8 border-t border-[#E8E3DC] pt-6 dark:border-[#2C2A25]">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#6B6459] dark:text-[#B8B1A3]">
            <Grid3x3 className="h-4 w-4" aria-hidden="true" />
            Posts
          </div>

          {isPrivateAndNotFollowing ? (
            <EmptyState
              icon={<ImageOff className="h-8 w-8" />}
              heading="This account is private"
              supportingText="Follow this account to see their posts."
            />
          ) : loadingPosts ? (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post: any) => (
                <CardPost key={post.id} post={post} author={profile} compact />
              ))}
            </div>
          ) : (
            <EmptyState heading="No posts yet" />
          )}
        </div>
      </div>
    </div>
  );
}