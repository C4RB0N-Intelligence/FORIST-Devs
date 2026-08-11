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