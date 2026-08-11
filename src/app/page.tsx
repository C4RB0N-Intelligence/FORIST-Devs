"use client";
import { AuthCard } from "@/components/auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <AuthCard 
        onSignUp={async (values) => {
          const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });
          
          if (error) throw error; // The AuthCard will catch this and display the red error banner
          
          router.push("/onboarding"); // Send new users to set up their profile
        }}
        
        onLogIn={async (values) => {
          const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (error) throw error; 

          // For now, send them to the feed. Later we will add the "Onboarding Gate" logic here.
          router.push("/feed"); 
        }}
      />
    </main>
  );
}