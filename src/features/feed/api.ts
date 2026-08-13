import { supabase } from "@/lib/supabase";

// --- THE CURATED FEED (Following & Your Own Posts) ---
export async function fetchFeedPosts() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not logged in");

  // 1. Get the IDs of the profiles this user is actively following
  const { data: follows, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId)
    .eq("status", "active");

  if (followError) throw followError;

  // 2. Create an array of IDs to fetch posts for (including their own)
  const followingIds = follows.map((f: any) => f.following_id);
  followingIds.push(userId); 

  // 3. Fetch posts only from those specific authors
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles(*)
    `)
    .in("author_profile_id", followingIds)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  return mapPostData(data);
}

// --- THE GLOBAL DISCOVER / SEARCH FEED ---
export async function fetchDiscoverPosts(searchQuery?: string | null) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  let query = supabase
    .from("posts")
    .select(`*, author:profiles(*)`)
    .order("created_at", { ascending: false })
    .limit(50); // Cap it for performance

  // If there's a search term, filter by the caption. 
  // Otherwise, just show global posts (excluding the user's own to focus on discovery)
  if (searchQuery) {
    query = query.ilike('caption', `%${searchQuery}%`);
  } else if (userId) {
    query = query.neq("author_profile_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return mapPostData(data);
}

// Helper to map DB columns to our frontend types so we don't repeat code
function mapPostData(data: any[]) {
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

// ... Keep your existing fetchRecommendedAccounts and createPost functions below

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

export async function createPost({ caption, imageFile }: { caption: string; imageFile: File | null }) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not logged in");

  let mediaUrls: string[] = [];

  // 1. Upload the media to Supabase Storage (if attached)
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('post_media')
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    // 2. Get the public URL for the newly uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('post_media')
      .getPublicUrl(fileName);

    mediaUrls.push(publicUrl);
  }

  // 3. Determine post type based on attachments
  const type = mediaUrls.length > 0 ? "image" : "text";

  // 4. Insert the new post into the database
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      author_profile_id: userId,
      caption,
      media_urls: mediaUrls,
      type,
      discussion_eligible: true, // Default to true per your DB schema
    })
    .select()
    .single();

  if (error) throw error;
  return post;
}