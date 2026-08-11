import type { Profile } from "@/types/domain";
import type { ConversationSummary } from "./types";

/** Display name for a conversation row/header: the other person's name for a 1:1,
 *  a joined list for a group DM. */
export function conversationDisplayName(summary: ConversationSummary): string {
  if (summary.otherParticipants.length === 0) return "You";
  if (summary.conversation.type === "dm") return summary.otherParticipants[0]!.displayName;
  return summary.otherParticipants.map((p) => p.displayName).join(", ");
}

/** Avatar to show for a conversation row — the other participant's avatar for a 1:1;
 *  for a group DM, the first other participant's avatar stands in (no group-avatar
 *  composite in this mock — a real implementation would generate one). */
export function conversationAvatarProfile(summary: ConversationSummary): Profile | undefined {
  return summary.otherParticipants[0];
}
