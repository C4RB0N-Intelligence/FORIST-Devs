import { useState, type FormEvent } from "react";
import FormInput from "./FormInput";
import PrimaryButton from "./PrimaryButton";

export interface SignUpFormProps {
  onSubmit?: (values: { email: string; password: string }) => void | Promise<void>;
  onSwitchToLogIn: () => void;
}

export default function SignUpForm({ onSubmit, onSwitchToLogIn }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address";

    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit?.({ email, password });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold leading-tight text-[#1C1A17] dark:text-[#F2EFE9]">
          Create your account
        </h1>
        <p className="text-[15px] text-[#6B6459] dark:text-[#B8B1A3]">
          Start with your email — you can personalize everything else after.
        </p>
      </div>

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

        <FormInput
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="At least 8 characters"
        />

        <PrimaryButton type="submit" loading={submitting} className="mt-2">
          Create account
        </PrimaryButton>
      </form>

      <p className="text-center text-[15px] text-[#6B6459] dark:text-[#B8B1A3]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogIn}
          className="font-medium text-[#1F3A5F] hover:underline dark:text-[#5B84B4]"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
