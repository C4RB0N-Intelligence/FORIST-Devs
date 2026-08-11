import Link from "next/link";
import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { CountBadge } from "@/components/ui/Badge";
import { formatCount, timeAgo, cn } from "@/lib/utils";
import type { Post, Profile } from "@/types/domain";

export interface CardPostProps {
  post: Post;
  author: Profile;
  compact?: boolean;
  className?: string;
}

export function CardPost({ post, author, compact, className }: CardPostProps) {
  if (compact) {
    return (
      <Link href={`/post/${post.id}`} className="block">
        <div className={cn("relative aspect-square overflow-hidden rounded-md bg-[#F1EEE9] dark:bg-[#0F0E0C]", className)}>
          {post.mediaUrls[0] && <Image src={post.mediaUrls[0]} alt="" fill sizes="240px" className="object-cover" />}
        </div>
      </Link>
    );
  }

  return (
    <Card className={cn("flex flex-col gap-3 overflow-hidden p-0", className)}>
      <Link href={`/${author.handle}`} className="flex items-center gap-2 px-4 pt-4">
        <Avatar src={author.avatarUrl} alt={author.displayName} size="inline" isPage={author.type === "page"} />
        <span className="text-sm font-medium text-[#1C1A17] dark:text-[#F2EFE9]">{author.displayName}</span>
        <span className="ml-auto text-xs text-[#A39C8F] dark:text-[#736C5F]">{timeAgo(post.createdAt)}</span>
      </Link>

      {post.mediaUrls[0] && (
        <Link href={`/post/${post.id}`} className="relative block aspect-[4/3] w-full bg-[#F1EEE9] dark:bg-[#0F0E0C]">
          <Image src={post.mediaUrls[0]} alt="" fill sizes="600px" className="object-cover" />
        </Link>
      )}

      <div className="flex flex-col gap-2 px-4 pb-4">
        <Link href={`/post/${post.id}`}>
          <p className="line-clamp-3 text-[15px] text-[#1C1A17] dark:text-[#F2EFE9]">{post.caption}</p>
        </Link>
        <div className="flex items-center gap-3 text-xs text-[#A39C8F] dark:text-[#736C5F]">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="tabular-nums">{post.ratingAvg.toFixed(1)}</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="tabular-nums">{formatCount(post.commentCount)}</span>
          </span>
          {post.discussionCount > 0 && (
            <Link href={`/post/${post.id}`} className="ml-auto">
              <CountBadge count={post.discussionCount} label="Visit Discussions" bridge />
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}