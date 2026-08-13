import { supabase } from "@/lib/supabase";

export async function createCommunity({
  name,
  description,
  type,
  tag,
}: {
  name: string;
  description: string;
  type: "public" | "private";
  tag: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not logged in");

  // 1. Create the Community
  const { data: community, error: communityError } = await supabase
    .from("communities")
    .insert({
      name,
      description,
      type,
      tag: tag.toLowerCase().replace(/[^a-z0-9_]/g, ''), // Sanitize tag
    })
    .select()
    .single();

  if (communityError) throw communityError;

  // 2. Assign the creator as the Owner
  const { error: memberError } = await supabase
    .from("community_memberships")
    .insert({
      community_id: community.id,
      profile_id: userId,
      role: "owner",
    });

  if (memberError) throw memberError;

  // 3. Create a default Chat channel so the community isn't empty
  const { error: channelError } = await supabase
    .from("channels")
    .insert({
      community_id: community.id,
      name: "general",
      type: "chat",
    });

  if (channelError) throw channelError;

  return community;
}

export async function getCommunityByTag(tag: string) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  // 1. Fetch community details
  const { data: community, error: communityError } = await supabase
    .from("communities")
    .select("*")
    .ilike("tag", tag) // Case-insensitive match
    .single();

  if (communityError) throw communityError;

  // 2. Fetch the channels for this community
  const { data: channels, error: channelsError } = await supabase
    .from("channels")
    .select("*")
    .eq("community_id", community.id)
    .order("created_at", { ascending: true });

  if (channelsError) throw channelsError;

  // 3. Check if the current user is a member
  let isMember = false;
  let userRole = null;

  if (userId) {
    const { data: membership } = await supabase
      .from("community_memberships")
      .select("role")
      .eq("community_id", community.id)
      .eq("profile_id", userId)
      .maybeSingle();

    if (membership) {
      isMember = true;
      userRole = membership.role;
    }
  }

  return {
    ...community,
    channels,
    isMember,
    userRole,
  };
}
export async function getCommunityMembers(communityId: string) {
  const { data, error } = await supabase
    .from("community_memberships")
    .select("role, profiles(id, username, display_name, avatar_url, profile_type)")
    .eq("community_id", communityId);

  if (error) throw error;

  return data.map((m: any) => ({
    role: m.role,
    ...m.profiles
  }));
}
// Fetch communities the user is a member of
export async function getUserCommunities() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("community_memberships")
    .select("role, communities(*)")
    .eq("profile_id", userData.user.id);

  if (error) throw error;
  
  // Flatten the response so it's easier to use in the UI
  return data.map((m: any) => ({
    role: m.role,
    ...m.communities
  }));
}

// Fetch public communities for the AI recommendation simulation
export async function getRecommendedCommunities() {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("type", "public")
    .limit(5); // Just grab 5 for the UI simulation
  
  if (error) throw error;
  return data;
}