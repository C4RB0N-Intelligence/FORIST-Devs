import type { Conversation, Message, Profile } from "@/types/domain";

/** Conversation enriched with resolved participant profiles and unread state,
 *  for list rendering (Messages Home) without re-resolving profiles per row. */
export interface ConversationSummary {
  conversation: Conversation;
  participants: Profile[];
  /** The other participant(s), excluding the current viewer — for DM display name/avatar. */
  otherParticipants: Profile[];
  unreadCount: number;
}
