import { supabase } from "@/lib/supabase";

export async function fetchFeedPosts() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  // Fetch posts AND join the author's profile data in one query
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(*)
    `)
    .neq("author_profile_id", userId || "")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Map database columns to the frontend domain types
  return data.map((row: any) => ({
    id: row.id,
    authorProfileId: row.author_profile_id,
    type: row.type,
    caption: row.caption,
    mediaUrls: row.media_urls || [],
    discussionEligible: row.discussion_eligible,
    discussionCount: row.discussion_count,
    ratingAvg: row.rating_avg,
    ratingCount: row.rating_count,
    commentCount: row.comment_count,
    createdAt: row.created_at,
    author: {
      id: row.author.id,
      handle: row.author.username,
      displayName: row.author.display_name,
      type: row.author.profile_type,
      avatarUrl: row.author.avatar_url || "",
      verified: false,
    }
  }));
}

export async function fetchRecommendedAccounts() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", userId || "")
    .limit(4);

  if (error) throw error;

  return data.map((row: any) => ({
    id: row.id,
    handle: row.username,
    displayName: row.display_name,
    type: row.profile_type,
    avatarUrl: row.avatar_url || "",
    verified: false,
    isPrivate: row.profile_type === 'private',
  }));
}
