import InterestChip from "./InterestChip";
import PrimaryButton from "./PrimaryButton";

export interface InterestStepProps {
  interests: readonly string[];
  selected: string[];
  onToggle: (interest: string) => void;
  minRequired: number;
  onComplete: () => void;
  loading?: boolean;
}

export default function InterestStep({
  interests,
  selected,
  onToggle,
  minRequired,
  onComplete,
  loading,
}: InterestStepProps) {
  const canComplete = selected.length >= minRequired;
  const remaining = Math.max(minRequired - selected.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold leading-tight text-[#1C1A17]">What are you into?</h1>
        <p className="text-[15px] text-[#6B6459]">
          Select at least {minRequired} topics to build your Discover feed.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Interests">
        {interests.map((interest) => (
          <InterestChip
            key={interest}
            label={interest}
            selected={selected.includes(interest)}
            onClick={() => onToggle(interest)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <PrimaryButton onClick={onComplete} disabled={!canComplete} loading={loading}>
          Complete Setup
        </PrimaryButton>
        {!canComplete && (
          <p className="text-center text-sm text-[#6B6459]">
            Pick {remaining} more {remaining === 1 ? "topic" : "topics"} to continue
          </p>
        )}
      </div>
    </div>
  );
}
