import { supabase } from "@/lib/supabase";

export async function getChannelMessages(channelId: string) {
  const { data, error } = await supabase
    .from("channel_messages")
    .select("id, body, created_at, profiles(id, username, display_name, avatar_url)")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data.map((m: any) => ({
    id: m.id,
    body: m.body,
    createdAt: m.created_at,
    author: m.profiles
  }));
}

export async function sendChannelMessage({ channelId, body }: { channelId: string; body: string }) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("channel_messages")
    .insert({ channel_id: channelId, profile_id: userData.user.id, body })
    .select()
    .single();

  if (error) throw error;
  return data;
}