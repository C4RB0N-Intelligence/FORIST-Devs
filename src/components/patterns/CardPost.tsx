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
  // Gracefully check if media exists and isn't an empty string
  const hasMedia = post.mediaUrls && post.mediaUrls.length > 0 && post.mediaUrls[0].trim() !== "";

  if (compact) {
    return (
      <Link href={`/post/${post.id}`} className="block w-full">
        <div className={cn("relative aspect-square w-full overflow-hidden rounded-md bg-[#F1EEE9] dark:bg-[#0F0E0C]", className)}>
          {hasMedia && (
            <Image src={post.mediaUrls[0]} alt="Post media" fill sizes="(max-width: 768px) 33vw, 240px" className="object-cover" />
          )}
        </div>
      </Link>
    );
  }

  return (
    <Card className={cn("flex w-full flex-col gap-3 overflow-hidden p-0 transition-shadow hover:shadow-sm", className)}>
      {/* AUTHOR HEADER */}
      <Link href={`/${author.handle}`} className="flex items-center gap-3 px-4 pt-4">
        <Avatar src={author.avatarUrl} alt={author.displayName} size="list" isPage={author.type === "page"} />
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">{author.displayName}</span>
          <span className="text-xs text-[#A39C8F] dark:text-[#736C5F]">@{author.handle}</span>
        </div>
        <span className="ml-auto text-xs text-[#A39C8F] dark:text-[#736C5F]">{timeAgo(post.createdAt)}</span>
      </Link>

      {/* MEDIA BLOCK */}
      {hasMedia && (
        <Link href={`/post/${post.id}`} className="relative block aspect-[4/3] w-full bg-[#F1EEE9] dark:bg-[#0F0E0C]">
          <Image src={post.mediaUrls[0]} alt="" fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
        </Link>
      )}

      {/* CAPTION & INTERACTIONS */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {post.caption && (
          <Link href={`/post/${post.id}`}>
            <p className="line-clamp-3 text-[15px] leading-relaxed text-[#1C1A17] dark:text-[#F2EFE9]">
              {post.caption}
            </p>
          </Link>
        )}
        
        <div className="mt-1 flex items-center gap-4 text-xs font-medium text-[#6B6459] dark:text-[#B8B1A3]">
          <span className="flex items-center gap-1.5 hover:text-[#1C1A17] dark:hover:text-[#F2EFE9] transition-colors">
            <Star className="h-4 w-4" aria-hidden="true" />
            <span className="tabular-nums">{post.ratingAvg ? post.ratingAvg.toFixed(1) : "0.0"}</span>
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#1C1A17] dark:hover:text-[#F2EFE9] transition-colors">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            <span className="tabular-nums">{formatCount(post.commentCount || 0)}</span>
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