"use client";

import AuthCard from "@/components/auth/AuthCard";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F5] p-4 dark:bg-[#171512]">
      <AuthCard
        onLogIn={async (values) => {
          const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          
          if (error) {
            alert(error.message); 
            return;
          }
          
          // Refresh server state to catch the new auth cookie
          router.refresh(); 
          router.push("/feed");
        }}
        onSignUp={async (values) => {
          const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });
          
          if (error) {
            alert(error.message); 
            return;
          }
          
          // Refresh server state to catch the new auth cookie
          router.refresh();
          router.push("/onboarding");
        }}
      />
    </main>
  );
}