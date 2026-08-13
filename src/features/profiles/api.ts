import { supabase } from "@/lib/supabase";

export async function getFollowStatus(targetProfileId: string) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("follows")
    .select("status")
    .eq("follower_id", userId)
    .eq("following_id", targetProfileId)
    .maybeSingle();

  if (error) throw error;
  return data?.status || null; // Returns 'active', 'pending', or null
}

export async function toggleFollow(targetProfileId: string, isPrivate: boolean) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not logged in");

  // Check current status
  const currentStatus = await getFollowStatus(targetProfileId);

  if (currentStatus) {
    // If we are already following (or pending), unfollow (delete the row)
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", userId)
      .eq("following_id", targetProfileId);
      
    if (error) throw error;
    return null;
  } else {
    // If we aren't following, create a new follow
    const newStatus = isPrivate ? 'pending' : 'active';
    const { error } = await supabase
      .from("follows")
      .insert({
        follower_id: userId,
        following_id: targetProfileId,
        status: newStatus
      });
      
    if (error) throw error;
    return newStatus;
  }
}

export async function getProfileByHandle(handle: string) {
  // 1. Fetch the core profile data
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", handle)
    .single();

  if (error) throw error;
  
  const profileId = data.id;

  // 2. Count Followers (people following this user)
  // { count: "exact", head: true } tells Supabase to ONLY return the number, not the rows
  const { count: followerCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profileId)
    .eq("status", "active");

  // 3. Count Following (people this user follows)
  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profileId)
    .eq("status", "active");

  // 4. Return the fully populated profile
  return {
    id: data.id,
    handle: data.username,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    bio: data.bio || "",
    type: data.profile_type,
    followerCount: followerCount || 0,
    followingCount: followingCount || 0,
    isPrivate: data.profile_type === 'private',
    verified: false,
  };
}

export async function getProfilePosts(profileId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:profiles(*)")
    .eq("author_profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((row: any) => ({
    id: row.id,
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