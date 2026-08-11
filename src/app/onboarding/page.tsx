"use client";

import { OnboardingFlow } from "@/components/onboarding";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main>
      <OnboardingFlow 
        onComplete={async (result) => {
          try {
            // 1. Get the currently logged-in user's secure ID
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
              throw new Error("No user logged in");
            }

            // 2. Insert the user's choices into your new Supabase table
            const { error } = await supabase.from('profiles').insert({
              id: user.id, // This links the profile to their secure auth account
              username: result.username,
              display_name: result.displayName,
              avatar_url: result.avatarUrl,
              profile_type: result.profileType,
              interests: result.interests,
            });

            if (error) {
              // If they pick a username that is already taken, it will throw an error here
              console.error("Database error:", error);
              alert("Error saving profile. That username might be taken!");
              return;
            }

            // 3. Success! Route them into the app.
            router.push("/feed"); 
            
          } catch (error) {
            console.error("Unexpected error:", error);
            alert("Something went wrong. Please try again.");
          }
        }} 
      />
    </main>
  );
}