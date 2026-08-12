"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, SquarePen } from "lucide-react";
import { TopBar } from "@/components/nav/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { ListRow } from "@/components/ui/ListRow";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "@/components/ui/StateViews";
import { useConversations } from "@/features/messaging/hooks";
import { conversationDisplayName, conversationAvatarProfile } from "@/features/messaging/utils";
import { timeAgo, cn } from "@/lib/utils";
import { NewConversationSheet } from "@/components/patterns/NewConversationSheet";

/**
 * Messages Home (G1) — DM/Group DM conversation list (7.1.1, 7.1.2). Community
 * Chat is intentionally NOT listed here despite shared transport (7.1.3) — per
 * IA, it's reached by entering the community, not by browsing Messages.
 */
export default function MessagesHomePage() {
  const { data: conversations, isLoading, isError, refetch } = useConversations();
  const [newConversationOpen, setNewConversationOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <TopBar showSearch={false} />

      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <h1 className="text-heading-md font-serif text-text-primary">Messages</h1>
        <button
          onClick={() => setNewConversationOpen(true)}
          aria-label="New conversation"
          className="tap-target flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
        >
          <SquarePen className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="px-4 py-4">
        {isLoading && (
          <div className="flex flex-col gap-2">
            <LoadingSkeleton className="h-16 w-full" />
            <LoadingSkeleton className="h-16 w-full" />
            <LoadingSkeleton className="h-16 w-full" />
          </div>
        )}

        {isError && <ErrorBanner message="Couldn't load your messages." onRetry={() => refetch()} />}

        {!isLoading && !isError && conversations && conversations.length === 0 && (
          <EmptyState
            icon={<MessageCircle className="h-8 w-8" />}
            heading="No conversations yet"
            supportingText="Start a conversation with someone you follow or who follows you."
            actionLabel="New conversation"
            onAction={() => setNewConversationOpen(true)}
          />
        )}

        {!isLoading && !isError && conversations && conversations.length > 0 && (
          <div className="flex flex-col overflow-hidden rounded-md border border-border-subtle">
            {conversations.map((summary) => {
              const avatarProfile = conversationAvatarProfile(summary);
              const name = conversationDisplayName(summary);
              return (
                <Link key={summary.conversation.id} href={`/messages/${summary.conversation.id}`}>
                  <ListRow
                    leading={
                      avatarProfile ? (
                        <Avatar
                          src={avatarProfile.avatarUrl}
                          alt={name}
                          size="list"
                          isPage={avatarProfile.type === "page"}
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-caption text-text-tertiary">
                          {name.slice(0, 1)}
                        </span>
                      )
                    }
                    title={
                      <span className={cn(summary.unreadCount > 0 && "font-semibold")}>{name}</span>
                    }
                    subtitle={summary.conversation.lastMessagePreview || "No messages yet"}
                    trailing={
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-caption text-text-tertiary">
                          {timeAgo(summary.conversation.lastMessageAt)}
                        </span>
                        {summary.unreadCount > 0 && (
                          <span
                            className="flex h-2 w-2 rounded-full bg-accent"
                            aria-label={`${summary.unreadCount} unread`}
                          />
                        )}
                      </div>
                    }
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <NewConversationSheet open={newConversationOpen} onClose={() => setNewConversationOpen(false)} />
    </div>
  );
}
