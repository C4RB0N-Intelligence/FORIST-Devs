import { supabase } from "@/lib/supabase";

// 1. We create a single formatter so ALL messages look identical to the UI
const formatMessage = (m: any) => ({
  id: m.id,
  body: m.body,
  createdAt: m.created_at,
  profile_id: m.profile_id, // We need this for the isSameUser grouping!
  author: m.profiles ? {
    id: m.profiles.id,
    name: m.profiles.display_name,
    username: m.profiles.username,
    avatar: m.profiles.avatar_url
  } : {
    id: "unknown",
    name: "Unknown User",
    username: "unknown",
    avatar: null
  }
});

export async function getChannelMessages(channelId: string) {
  const { data, error } = await supabase
    .from("channel_messages")
    // Added profile_id to the select string!
    .select("id, body, created_at, profile_id, profiles(id, username, display_name, avatar_url)")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  // 2. Format the historical messages
  return data.map(formatMessage);
}

export async function sendChannelMessage({ channelId, body }: { channelId: string; body: string }) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("channel_messages")
    .insert({ channel_id: channelId, profile_id: userData.user.id, body })
    // Added the exact same select string here so new messages get the profile data too!
    .select("id, body, created_at, profile_id, profiles(id, username, display_name, avatar_url)")
    .single();

  if (error) throw error;
  
  // 3. Format the brand new message
  return formatMessage(data);
}