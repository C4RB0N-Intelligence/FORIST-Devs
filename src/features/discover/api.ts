import { supabase } from "@/lib/supabase";

export async function globalSearch(searchQuery: string) {
  // Format for fuzzy searching (finds the word anywhere in the string)
  const query = `%${searchQuery}%`;

  // Run all queries at the exact same time for max speed
  const [profilesRes, communitiesRes, postsRes] = await Promise.all([
    // 1. Search Users (by username or display name)
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .or(`username.ilike.${query},display_name.ilike.${query}`)
      .limit(5),

    // 2. Search Communities (by name or tags)
    supabase
      .from("communities")
      .select("id, name, tag, description, avatar_url")
      .or(`name.ilike.${query},tag.ilike.${query}`)
      .limit(5),

    // 3. Search Posts/Discussions (by content)
    supabase
      .from("posts")
      .select("id, body, created_at, profiles(username, display_name, avatar_url)")
      .ilike("body", query)
      .limit(10)
  ]);

  // Return a bundled result object
  return {
    users: profilesRes.data || [],
    communities: communitiesRes.data || [],
    posts: postsRes.data || [],
  };
}