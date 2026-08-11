import { useState, type FormEvent } from "react";
import FormInput from "./FormInput";
import PrimaryButton from "./PrimaryButton";

export interface LogInFormProps {
  onSubmit?: (values: { email: string; password: string }) => void | Promise<void>;
  onForgotPassword?: () => void;
  onSwitchToSignUp: () => void;
}

export default function LogInForm({ onSubmit, onForgotPassword, onSwitchToSignUp }: LogInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit?.({ email, password });
    } catch {
      setFormError("Incorrect email or password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold leading-tight text-[#1C1A17] dark:text-[#F2EFE9]">
          Welcome back
        </h1>
        <p className="text-[15px] text-[#6B6459] dark:text-[#B8B1A3]">
          Log in to pick up right where you left off.
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="rounded-lg border-l-4 border-[#8C2F2F] bg-[#8C2F2F]/5 px-4 py-3 text-sm text-[#8C2F2F] dark:border-[#E17272] dark:bg-[#E17272]/10 dark:text-[#E17272]"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
        />

        <div className="flex flex-col gap-1.5">
          <FormInput
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={onForgotPassword}
            className="self-end text-sm text-[#1F3A5F] hover:underline dark:text-[#5B84B4]"
          >
            Forgot password?
          </button>
        </div>

        <PrimaryButton type="submit" loading={submitting} className="mt-2">
          Log in
        </PrimaryButton>
      </form>

      <p className="text-center text-[15px] text-[#6B6459] dark:text-[#B8B1A3]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-medium text-[#1F3A5F] hover:underline dark:text-[#5B84B4]"
        >
          Create one
        </button>
      </p>
    </div>
  );
}
