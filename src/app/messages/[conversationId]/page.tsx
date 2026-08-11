"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/Input";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "@/components/ui/StateViews";
import { useConversation, useMessages, useSendMessage } from "@/features/messaging/hooks";
import { conversationDisplayName, conversationAvatarProfile } from "@/features/messaging/utils";
import { getProfileById } from "@/lib/mock-api/db";
import { useSessionStore } from "@/stores/session";
import { timeAgo } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

/**
 * Conversation Thread (G2) — 1:1/Group DM message thread (7.1.1, 7.1.2, 7.3).
 * Visually consistent with Chat Channel View by design — same underlying
 * no-bubble list-row message pattern (Design System Part IX/XIV Rule 4), but
 * a distinct permission model (participant list vs. community roles) and
 * moderation reach (private, platform-moderation-on-report only, per
 * architecture doc §4.6).
 */
export default function ConversationThreadPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  const router = useRouter();
  const activeProfileId = useSessionStore((s) => s.activeProfileId);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: summary, isLoading: loadingConversation, isError: conversationError } = useConversation(conversationId);
  const { data: messages, isLoading: loadingMessages } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  if (loadingConversation) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (conversationError || !summary) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        {conversationError ? (
          <ErrorBanner message="Couldn't load this conversation." />
        ) : (
          <EmptyState heading="Conversation not found" supportingText="You may not have access to this conversation." />
        )}
      </div>
    );
  }

  const name = conversationDisplayName(summary);
  const avatarProfile = conversationAvatarProfile(summary);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage.mutate({ body: draft.trim(), replyToMessageId: null });
    setDraft("");
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-border-subtle px-4 py-3">
        <button
          onClick={() => router.push("/messages")}
          aria-label="Back to messages"
          className="tap-target text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {avatarProfile && <Avatar src={avatarProfile.avatarUrl} alt={name} size="inline" isPage={avatarProfile.type === "page"} />}
        <span className="flex items-center gap-1.5 text-body-md font-medium text-text-primary">
          {name}
          {avatarProfile?.verified && <VerifiedBadge />}
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {loadingMessages ? (
          <LoadingSkeleton className="h-40 w-full" />
        ) : messages && messages.length === 0 ? (
          <EmptyState icon={<MessageCircle className="h-8 w-8" />} heading="No messages yet" supportingText={`Say hello to ${name}.`} />
        ) : (
          <div className="flex flex-col gap-3">
            {messages?.map((message) => {
              const sender = getProfileById(message.senderProfileId);
              if (!sender) return null;
              const isOwn = message.senderProfileId === activeProfileId;
              return (
                <div key={message.id} className="flex items-start gap-2">
                  <Avatar src={sender.avatarUrl} alt={sender.displayName} size="inline" isPage={sender.type === "page"} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-medium text-text-primary">
                        {isOwn ? "You" : sender.displayName}
                      </span>
                      <span className="text-caption text-text-tertiary">{timeAgo(message.createdAt)}</span>
                    </div>
                    <p className="text-body-md text-text-primary">{message.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex shrink-0 items-end gap-2 border-t border-border-subtle px-4 py-3">
        <div className="flex-1">
          <InputText
            aria-label={`Message ${name}`}
            placeholder="Write a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" size="md" disabled={!draft.trim()} loading={sendMessage.isPending}>
          Send
        </Button>
      </form>
    </div>
  );
}
