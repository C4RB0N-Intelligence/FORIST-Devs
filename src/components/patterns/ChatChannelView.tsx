"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { timeAgo } from "@/lib/utils";

export interface ChatChannelViewProps {
  messages: any[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function ChatChannelView({ messages, onSendMessage, isLoading }: ChatChannelViewProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-[#211F1B]">
      {/* Messages Area (Bubbleless, Dense Rows) */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-[#A39C8F]">
            Loading messages...
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
            <p className="font-serif text-lg font-medium text-[#1C1A17] dark:text-[#F2EFE9]">
              Welcome to the beginning of this channel!
            </p>
            <p className="text-sm text-[#A39C8F]">Be the first to say hello.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {messages?.map((msg, idx) => {
              // Group messages from the same user if they are consecutive
              const isSameUser = idx > 0 && messages[idx - 1].profile_id === msg.profile_id;
              
              // We know our API sends the data inside 'author' now
              const profile = msg.author; 

              return (
                <div 
                  key={msg.id} 
                  className={`group flex gap-3 px-2 py-1 hover:bg-[#F1EEE9]/50 dark:hover:bg-[#0F0E0C]/50 ${!isSameUser ? "mt-4" : ""}`}
                >
                  <div className="w-10 shrink-0">
                    {!isSameUser && profile && (
                      <Avatar src={profile.avatar} alt={profile.name} size="inline" />
                    )}
                  </div>
                  
                  <div className="flex min-w-0 flex-col">
                    {!isSameUser && profile && (
                      <div className="flex items-baseline gap-2 pb-0.5">
                        <span className="text-[15px] font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
                          {profile.name}
                        </span>
                        <span className="text-xs font-medium text-[#A39C8F] dark:text-[#736C5F]">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#1C1A17] dark:text-[#E8E3DC]">
                      {msg.body}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="shrink-0 border-t border-[#E8E3DC] p-4 dark:border-[#2C2A25]">
        <form 
          onSubmit={handleSend} 
          className="relative flex items-end gap-2 rounded-xl border border-[#E8E3DC] bg-[#F1EEE9] px-3 py-2 focus-within:border-[#1F3A5F] dark:border-[#2C2A25] dark:bg-[#0F0E0C] dark:focus-within:border-[#5B84B4]"
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              // Allow Enter to send, Shift+Enter for new line
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Message channel..."
            className="max-h-32 min-h-[24px] w-full resize-none bg-transparent text-[15px] text-[#1C1A17] placeholder:text-[#A39C8F] focus:outline-none dark:text-[#F2EFE9] dark:placeholder:text-[#736C5F]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#1F3A5F] transition-colors hover:bg-[#1F3A5F]/10 disabled:opacity-50 dark:text-[#5B84B4] dark:hover:bg-[#5B84B4]/10"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}