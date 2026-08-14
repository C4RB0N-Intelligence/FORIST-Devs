"use client";

import { use } from "react";
import { TopBar } from "@/components/nav/TopBar";
import { ChatChannelView } from "@/components/patterns/ChatChannelView";
import { useCommunity } from "@/features/communities/hooks";
import { useChannelMessages, useSendChannelMessage } from "@/features/channels/hooks";
import { ErrorBanner } from "@/components/ui/StateViews";

export default function ChannelPage({ params }: { params: Promise<{ tag: string; channel: string }> }) {
  const { tag, channel: channelName } = use(params);
  
  const { data: community } = useCommunity(tag);
  
  // Find the real channel ID matching the URL slug
  const currentChannel = community?.channels?.find(
    (c: any) => c.name.toLowerCase() === channelName.toLowerCase()
  );

  const { data: rawMessages, isLoading } = useChannelMessages(currentChannel?.id);
  const sendMessageMutation = useSendChannelMessage();

  if (!currentChannel) {
    return (
      <div className="flex h-full flex-col">
        <TopBar showSearch={false} />
        <div className="p-4">
          <ErrorBanner message={`Channel #${channelName} does not exist.`} />
        </div>
      </div>
    );
  }

  // Map backend message schema to match Claude's expected ChatMessage props
  const formattedMessages = (rawMessages || []).map((m: any) => ({
    id: m.id,
    authorId: m.author?.id,
    authorName: m.author?.display_name || m.author?.username || "User",
    authorAvatarUrl: m.author?.avatar_url || "",
    body: m.body,
    createdAt: m.createdAt,
  }));

  return (
    <div className="flex h-full flex-col">
      <TopBar showSearch={false} />
      <div className="flex-1 overflow-hidden">
        <ChatChannelView
          messages={formattedMessages}
          isLoading={isLoading}
          onSendMessage={async (body) => {
            await sendMessageMutation.mutateAsync({
              channelId: currentChannel.id,
              body,
            });
          }}
        />
      </div>
    </div>
  );
}