"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/Input";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "@/components/ui/StateViews";
import { useConversation, useMessages, useSendMessage } from "@/features/messaging/hooks";
import { conversationDisplayName, conversationAvatarProfile } from "@/features/messaging/utils";
import { timeAgo } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function ConversationThreadPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  const router = useRouter();
  
  // Replace missing Zustand store with real Supabase Auth state
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: summary, isLoading: loadingConversation, isError: conversationError } = useConversation(conversationId);
  const { data: messages, isLoading: loadingMessages } = useMessages(conversationId);
  const sendMessage = useSendMessage();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setActiveProfileId(data.user?.id || null);
    });
  }, []);

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

  const name = conversationDisplayName(summary as any);
  const avatarProfile = conversationAvatarProfile(summary as any);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage.mutate({ conversationId, text: draft.trim() });
    setDraft("");
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-[#E8E3DC] dark:border-[#2C2A25] px-4 py-3">
        <button
          onClick={() => router.push("/messages")}
          aria-label="Back to messages"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B6459] hover:bg-[#F1EEE9] hover:text-[#1C1A17] dark:text-[#B8B1A3] dark:hover:bg-[#0F0E0C] dark:hover:text-[#F2EFE9]"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {avatarProfile && <Avatar src={avatarProfile.avatarUrl || ""} alt={name} size="inline" isPage={avatarProfile.type === "page"} />}
        <span className="flex items-center gap-1.5 text-[15px] font-medium text-[#1C1A17] dark:text-[#F2EFE9]">
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
            {messages?.map((message: any) => {
              // We use the sender data directly from the API response now!
              const sender = message.sender;
              if (!sender) return null;
              
              const isOwn = message.senderId === activeProfileId;
              
              return (
                <div key={message.id} className="flex items-start gap-2">
                  <Avatar src={sender.avatarUrl || ""} alt={sender.displayName} size="inline" isPage={sender.type === "page"} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#1C1A17] dark:text-[#F2EFE9]">
                        {isOwn ? "You" : sender.displayName}
                      </span>
                      <span className="text-[11px] text-[#A39C8F] dark:text-[#736C5F]">{timeAgo(message.createdAt)}</span>
                    </div>
                    <p className="text-[15px] text-[#1C1A17] dark:text-[#F2EFE9]">{message.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex shrink-0 items-end gap-2 border-t border-[#E8E3DC] dark:border-[#2C2A25] px-4 py-3">
        <div className="flex-1">
          <InputText
            aria-label={`Message ${name}`}
            placeholder="Write a message..."
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