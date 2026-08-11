import { supabase } from "@/lib/supabase";

export async function fetchConversations() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not logged in");

  // 1. Find all conversations this user is part of
  const { data: participants, error: participantError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("profile_id", userId);

  if (participantError) throw participantError;
  
  const conversationIds = participants.map(p => p.conversation_id);
  if (conversationIds.length === 0) return [];

  // 2. Fetch those conversations with the other participants' profiles
  const { data: convos, error: convoError } = await supabase
    .from("conversations")
    .select(`
      id,
      type,
      last_message_preview,
      last_message_at,
      conversation_participants!inner (
        profiles (
          id,
          username,
          display_name,
          avatar_url,
          profile_type
        )
      )
    `)
    .in("id", conversationIds)
    .order("last_message_at", { ascending: false });

  if (convoError) throw convoError;

  // 3. Map to frontend format
  return convos.map((c: any) => {
    // Filter out the current user so we only show the *other* person in the chat list
    const otherParticipants = c.conversation_participants
      .map((cp: any) => cp.profiles)
      .filter((p: any) => p.id !== userId);

    return {
      id: c.id,
      type: c.type,
      lastMessagePreview: c.last_message_preview,
      lastMessageAt: c.last_message_at,
      participants: otherParticipants.map((p: any) => ({
        id: p.id,
        handle: p.username,
        displayName: p.display_name,
        avatarUrl: p.avatar_url,
        type: p.profile_type,
      }))
    };
  });
}

export async function fetchMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      body,
      created_at,
      sender_profile_id,
      sender:profiles!sender_profile_id (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data.map((m: any) => ({
    id: m.id,
    body: m.body,
    createdAt: m.created_at,
    senderId: m.sender_profile_id,
    sender: {
      id: m.sender.id,
      handle: m.sender.username,
      displayName: m.sender.display_name,
      avatarUrl: m.sender.avatar_url,
    }
  }));
}

export async function sendMessage(conversationId: string, text: string) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_profile_id: userId,
      body: text
    })
    .select()
    .single();

  if (error) throw error;

  // Update the conversation's last message preview
  await supabase
    .from("conversations")
    .update({ 
      last_message_preview: text,
      last_message_at: new Date().toISOString()
    })
    .eq("id", conversationId);

  return data;
}