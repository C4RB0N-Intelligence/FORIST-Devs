import { useState } from "react";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";

export type AuthView = "signup" | "login";

export interface AuthCardProps {
  /** Which view to show first. Defaults to "signup". */
  initialView?: AuthView;
  onSignUp?: (values: { email: string; password: string }) => void | Promise<void>;
  onLogIn?: (values: { email: string; password: string }) => void | Promise<void>;
  onForgotPassword?: () => void;
}

/**
 * AuthCard — a self-contained, dark/light-mode-aware authentication card
 * that toggles between Sign Up and Log In. Drop it anywhere in a React +
 * Tailwind project; dark mode follows the OS/browser preference
 * automatically via Tailwind's `dark:` variant (Tailwind's default
 * `darkMode: 'media'` strategy — no extra config or class toggling needed).
 *
 * Usage:
 *   <AuthCard onSignUp={handleSignUp} onLogIn={handleLogIn} />
 */
export default function AuthCard({ initialView = "signup", onSignUp, onLogIn, onForgotPassword }: AuthCardProps) {
  const [view, setView] = useState<AuthView>(initialView);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF8F5] px-4 py-12 dark:bg-[#171512]">
      <div className="w-full max-w-[480px] rounded-2xl border border-[#E8E3DC] bg-white p-8 shadow-[0_16px_32px_rgba(28,26,23,0.08)] dark:border-[#2C2A25] dark:bg-[#211F1B] dark:shadow-none sm:p-10">
        {view === "signup" ? (
          <SignUpForm onSubmit={onSignUp} onSwitchToLogIn={() => setView("login")} />
        ) : (
          <LogInForm
            onSubmit={onLogIn}
            onForgotPassword={onForgotPassword}
            onSwitchToSignUp={() => setView("signup")}
          />
        )}
      </div>
    </div>
  );
}
