import { useState } from "react";
import StepIndicator from "./StepIndicator";
import ProfileDetailsStep, { type ProfileDetailsValue } from "./ProfileDetailsStep";
import ProfileTypeStep from "./ProfileTypeStep";
import InterestStep from "./InterestStep";
import { DEFAULT_INTERESTS } from "./types";
import type { OnboardingResult, ProfileType } from "./types";

export interface OnboardingFlowProps {
  /** Called with the final selections once the user completes Step 3. Handle your
   *  Supabase (or any backend) submission here. */
  onComplete: (result: OnboardingResult) => void | Promise<void>;
  /** Override the interest list shown in Step 3. Defaults to a 15-item set. */
  interests?: readonly string[];
  /** Minimum number of interests required to enable "Complete Setup". Defaults to 3. */
  minInterests?: number;
}

const TOTAL_STEPS = 3;

/**
 * OnboardingFlow — three-step onboarding: Profile Details, Profile Type
 * Selection, then Interest Picker. Self-contained state; call `onComplete`
 * to hand off final values (e.g. to a Supabase write) from the parent app.
 *
 * Usage:
 *   <OnboardingFlow onComplete={(result) => saveToSupabase(result)} />
 */
export default function OnboardingFlow({
  onComplete,
  interests = DEFAULT_INTERESTS,
  minInterests = 3,
}: OnboardingFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileDetails, setProfileDetails] = useState<ProfileDetailsValue>({
    username: "",
    displayName: "",
    avatarUrl: null,
  });
  const [profileType, setProfileType] = useState<ProfileType>("public");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  }

  async function handleComplete() {
    setSubmitting(true);
    try {
      await onComplete({
        username: profileDetails.username.trim(),
        displayName: profileDetails.displayName.trim(),
        avatarUrl: profileDetails.avatarUrl,
        profileType,
        interests: selectedInterests,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF8F5] px-4 py-12">
      <div className="w-full max-w-[480px] rounded-2xl border border-[#E8E3DC] bg-white p-8 shadow-[0_16px_32px_rgba(28,26,23,0.08)] sm:p-10">
        <div className="mb-8">
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>

        {step === 1 && (
          <ProfileDetailsStep value={profileDetails} onChange={setProfileDetails} onContinue={() => setStep(2)} />
        )}

        {step === 2 && (
          <ProfileTypeStep value={profileType} onChange={setProfileType} onContinue={() => setStep(3)} />
        )}

        {step === 3 && (
          <InterestStep
            interests={interests}
            selected={selectedInterests}
            onToggle={toggleInterest}
            minRequired={minInterests}
            onComplete={handleComplete}
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
}