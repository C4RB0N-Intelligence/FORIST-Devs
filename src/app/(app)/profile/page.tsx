"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
      // 1. Get the securely logged-in user from the browser session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      // 2. Fetch their specific handle from your profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      // 3. The Limbo Check: If they have an account but no profile, force them to onboarding
      if (!profile?.username) {
        router.replace("/onboarding");
      } else {
        // 4. Success: Route to their dynamic page
        router.replace(`/${profile.username}`);
      }
    }

    redirectUser();
  }, [router]);

  // Show a blank screen or spinner while calculating the redirect
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-[#6B6459]">Locating profile...</p>
    </div>
  );
}