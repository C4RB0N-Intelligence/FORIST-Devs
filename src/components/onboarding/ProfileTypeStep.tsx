import ProfileTypeCard from "./ProfileTypeCard";
import PrimaryButton from "./PrimaryButton";
import { GlobeIcon, LockIcon, BuildingIcon } from "./icons";
import type { ProfileType } from "./types";

export interface ProfileTypeStepProps {
  value: ProfileType;
  onChange: (value: ProfileType) => void;
  onContinue: () => void;
}

const OPTIONS: { type: ProfileType; icon: JSX.Element; title: string; description: string }[] = [
  {
    type: "public",
    icon: <GlobeIcon />,
    title: "Public",
    description: "Open profile, visible to everyone.",
  },
  {
    type: "private",
    icon: <LockIcon />,
    title: "Private",
    description: "Locked profile, only followers can see content.",
  },
  {
    type: "page",
    icon: <BuildingIcon />,
    title: "Page",
    description: "For brands or communities.",
  },
];

export default function ProfileTypeStep({ value, onChange, onContinue }: ProfileTypeStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold leading-tight text-[#1C1A17]">Choose your posture</h1>
        <p className="text-[15px] text-[#6B6459]">How do you want to interact on Forist?</p>
      </div>

      <div role="radiogroup" aria-label="Profile type" className="flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <ProfileTypeCard
            key={option.type}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={value === option.type}
            onClick={() => onChange(option.type)}
          />
        ))}
      </div>

      <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
    </div>
  );
}
