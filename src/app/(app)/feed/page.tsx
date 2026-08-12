"use client"; 

import Link from "next/link"; 
import { Rss } from "lucide-react"; 
import { TopBar } from "@/components/nav/TopBar"; 
import { Avatar } from "@/components/ui/Avatar"; 
import { VerifiedBadge } from "@/components/ui/Badge"; 
import { Button } from "@/components/ui/Button"; 
import { LoadingSkeleton, ErrorBanner, EmptyState } from "@/components/ui/StateViews"; 
import { CardPost } from "@/components/patterns/CardPost"; 
import { useFeedPosts, useRecommendedAccounts } from "@/features/feed/hooks"; 
import { useFollowStatus, useToggleFollow } from "@/features/profiles/hooks"; 
import type { Profile } from "@/types/domain";  

export default function FeedPage() {   
  const { data: posts, isLoading, isError, refetch } = useFeedPosts();   
  const { data: recommended } = useRecommendedAccounts();   

  return (     
    <div className="mx-auto max-w-2xl">       
      <TopBar />       
      <div className="flex flex-col gap-4 px-4 py-4">         
        {isLoading && (           
          <>             
            <LoadingSkeleton className="h-80 w-full" />             
            <LoadingSkeleton className="h-80 w-full" />           
          </>         
        )}         
        
        {isError && <ErrorBanner message="Couldn't load your feed right now." onRetry={() => refetch()} />}         
        
        {!isLoading && !isError && posts && posts.length === 0 && (           
          <EmptyState             
            icon={<Rss className="h-8 w-8" />}             
            heading="Your feed is empty"             
            supportingText="Follow some accounts to see their posts here, or check out these recommendations."           
          />         
        )}         
        
        {/* THIS IS THE SECTION WE UPDATED */}
        {!isLoading && !isError && posts?.map((post: any, i) => {             
          const author = post.author;             
          if (!author) return null;             
          
          const items = [<CardPost key={post.id} post={post} author={author} />];             
          
          // Recommended Accounts rail, periodically inserted (UI spec C1 layout note).             
          if (i === 2 && recommended && recommended.length > 0) {               
            items.push(                 
              <div key="recommended" className="flex flex-col gap-3 rounded-md border border-border-subtle bg-surface-raised p-4">                   
                <h2 className="text-heading-md font-serif text-text-primary">Recommended Accounts</h2>                   
                <div className="flex flex-col divide-y divide-border-subtle">                     
                  {recommended.map((p) => (                       
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
  ); 
}

function RecommendedAccountRow({ profile }: { profile: Profile }) {   
  const { data: followStatus } = useFollowStatus(profile.id);   
  const toggleFollow = useToggleFollow(profile.id, profile.isPrivate);   
  const isFollowing = followStatus === "active";   
  const isPending = followStatus === "pending";   

  return (     
    <div className="flex items-center gap-3 py-2">       
      <Link href={`/${profile.handle}`} className="flex min-w-0 flex-1 items-center gap-3">         
        <Avatar src={profile.avatarUrl} alt={profile.displayName} size="list" isPage={profile.type === "page"} />         
        <div className="min-w-0">           
          <div className="flex items-center gap-1 truncate text-body-sm font-medium text-text-primary">             
            {profile.displayName}             
            {profile.verified && <VerifiedBadge />}           
          </div>           
          <div className="truncate text-caption text-text-tertiary">@{profile.handle}</div>         
        </div>       
      </Link>       
      <Button         
        variant={isFollowing || isPending ? "secondary" : "primary"}         
        size="sm"         
        loading={toggleFollow.isPending}         
        onClick={() => toggleFollow.mutate()}       
      >         
        {isPending ? "Requested" : isFollowing ? "Following" : "Follow"}       
      </Button>     
    </div>   
  ); 
}