export type ProfileType = "public" | "private" | "page";

export interface OnboardingResult {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  profileType: ProfileType;
  interests: string[];
}

/** Default interest set — override via the `interests` prop if needed. */
export const DEFAULT_INTERESTS = [
  "Technology",
  "Art",
  "Philosophy",
  "Coding",
  "Music",
  "Fitness",
  "Gaming",
  "Photography",
  "Travel",
  "Cooking",
  "Books",
  "Film",
  "Fashion",
  "Science",
  "Sports",
] as const;