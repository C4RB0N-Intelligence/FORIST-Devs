import { Hash, Megaphone, MessageSquare, Mic, FileText, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChannelType = "chat" | "announcement" | "discussion" | "voice" | "resource";

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
}

export interface Community {
  id: string;
  name: string;
  tag: string;
}

export interface CommunitySidebarProps {
  community: Community;
  channels: Channel[];
  /** Currently active channel ID — hardcode a channel id when wiring this up
   *  standalone, replace with real route-derived state once mounted. */
  activeChannelId?: string;
  onChannelClick?: (channel: Channel) => void;
}

const CHANNEL_ICONS: Record<ChannelType, LucideIcon> = {
  chat: Hash,
  announcement: Megaphone,
  discussion: MessageSquare,
  voice: Mic,
  resource: FileText,
};

/**
 * CommunitySidebar — the left pane of the 3-pane Community Home layout.
 * Dense list rows (36px) with a left-border + tinted background active
 * state, distinct from the primary nav's pill-style active state — this is
 * the deliberately denser register for Community World per the design system.
 */
export function CommunitySidebar({ community, channels, activeChannelId, onChannelClick }: CommunitySidebarProps) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-[#E8E3DC] bg-white dark:border-[#2C2A25] dark:bg-[#211F1B]">
      <div className="border-b border-[#E8E3DC] px-4 py-4 dark:border-[#2C2A25]">
        <h2 className="truncate font-serif text-lg font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">
          {community.name}
        </h2>
        <p className="mt-0.5 truncate text-sm text-[#6B6459] dark:text-[#B8B1A3]">@{community.tag}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Channels">
        {channels.map((channel) => {
          const Icon = CHANNEL_ICONS[channel.type];
          const isActive = channel.id === activeChannelId;

          return (
            <button
              key={channel.id}
              type="button"
              onClick={() => onChannelClick?.(channel)}
              aria-current={isActive ? "page" : undefined}
              style={{ height: 36 }}
              className={cn(
                "flex w-full items-center gap-2 rounded-r-md pl-2.5 pr-2 text-left text-sm transition-colors duration-150 ease-out",
                "border-l-2",
                isActive
                  ? "border-[#1F3A5F] bg-[#1F3A5F]/[0.06] text-[#1C1A17] dark:border-[#5B84B4] dark:bg-[#5B84B4]/10 dark:text-[#F2EFE9]"
                  : "border-transparent text-[#6B6459] hover:bg-[#F1EEE9] hover:text-[#1C1A17] dark:text-[#B8B1A3] dark:hover:bg-[#0F0E0C] dark:hover:text-[#F2EFE9]",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-[#1F3A5F] dark:text-[#5B84B4]" : "text-[#A39C8F] dark:text-[#736C5F]",
                )}
                aria-hidden="true"
              />
              <span className="truncate">{channel.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}