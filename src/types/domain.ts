export type ProfileType = "public" | "private" | "page";

export interface Profile {
  id: string;
  userId: string;
  handle: string;
  displayName: string;
  type: ProfileType;
  bio: string;
  avatarUrl: string;
  bannerUrl?: string;
  verified: boolean;
  followerCount: number;
  followingCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  authorProfileId: string;
  type: "image" | "text" | "reel";
  caption: string;
  mediaUrls: string[];
  discussionEligible: boolean;
  discussionCount: number;
  ratingAvg: number;
  ratingCount: number;
  commentCount: number;
  createdAt: string;
  editedAt?: string;
  deleted?: boolean;
  removedForPolicy?: boolean;
}

export interface Conversation {
  id: string;
  type: "dm" | "group";
  participantProfileIds: string[];
  lastMessagePreview: string;
  lastMessageAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderProfileId: string;
  body: string;
  createdAt: string;
  replyToMessageId: string | null;
}