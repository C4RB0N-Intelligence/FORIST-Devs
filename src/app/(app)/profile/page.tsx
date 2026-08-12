import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function ProfileRedirectPage() {
  // 1. Get the securely logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/"); // Send them to login if they aren't authenticated
  }

  // 2. Fetch their specific handle from your profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profile?.username) {
    redirect("/onboarding"); // Safety net: if they somehow skipped onboarding
  }

  // 3. Redirect them to their actual dynamic profile page!
  redirect(`/${profile.username}`);
}