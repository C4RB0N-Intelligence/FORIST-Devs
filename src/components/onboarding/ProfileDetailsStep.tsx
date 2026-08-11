import { useRef, useState } from "react";
import FormInput from "./FormInput";
import PrimaryButton from "./PrimaryButton";

export interface ProfileDetailsValue {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ProfileDetailsStepProps {
  value: ProfileDetailsValue;
  onChange: (value: ProfileDetailsValue) => void;
  onContinue: () => void;
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export default function ProfileDetailsStep({ value, onChange, onContinue }: ProfileDetailsStepProps) {
  const [errors, setErrors] = useState<{ username?: string; displayName?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validate() {
    const next: typeof errors = {};

    const cleanUsername = value.username.trim();
    if (!cleanUsername) next.username = "Choose a username";
    else if (!USERNAME_PATTERN.test(cleanUsername))
      next.username = "3-20 characters, letters, numbers, and underscores only";

    if (!value.displayName.trim()) next.displayName = "Display name is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleContinue() {
    if (validate()) onContinue();
  }

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ ...value, avatarUrl: url });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold leading-tight text-[#1C1A17]">Set up your identity</h1>
        <p className="text-[15px] text-[#6B6459]">This is how people will find and recognize you on Forist.</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#D8D2C7] bg-[#F1EEE9] transition-colors duration-200 ease-out hover:border-[#1F3A5F]/40"
          aria-label="Upload avatar"
        >
          {value.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <CameraIcon />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity duration-200 ease-out group-hover:bg-black/30 group-hover:opacity-100">
            <CameraIcon />
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarPick}
          className="hidden"
        />
        <span className="text-sm text-[#6B6459]">
          {value.avatarUrl ? "Tap to change photo" : "Add a profile photo (optional)"}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        <FormInput
          label="Username"
          value={value.username}
          onChange={(e) => onChange({ ...value, username: e.target.value })}
          error={errors.username}
          placeholder="yourname"
          prefix="@"
        />

        <FormInput
          label="Display name"
          value={value.displayName}
          onChange={(e) => onChange({ ...value, displayName: e.target.value })}
          error={errors.displayName}
          placeholder="Your name"
        />
      </div>

      <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B6459]" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}