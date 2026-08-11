import type { ReactNode } from "react";

export interface ProfileTypeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

/** Selectable profile-type card — radio-style, Ink Blue border + tinted background when selected. */
export default function ProfileTypeCard({ icon, title, description, selected, onClick }: ProfileTypeCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={[
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 ease-out",
        selected
          ? "border-[#1F3A5F] bg-[#1F3A5F]/[0.06] shadow-[0_1px_2px_rgba(28,26,23,0.06)]"
          : "border-[#E8E3DC] bg-white hover:border-[#D8D2C7] hover:bg-[#FAF8F5]",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-[#1F3A5F] text-white" : "bg-[#F1EEE9] text-[#6B6459]",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="text-[15px] font-semibold text-[#1C1A17]">{title}</div>
        <div className="mt-0.5 text-sm text-[#6B6459]">{description}</div>
      </div>

      <span
        className={[
          "mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors duration-200 ease-out",
          selected ? "border-[#1F3A5F] bg-[#1F3A5F]" : "border-[#D8D2C7] bg-white",
        ].join(" ")}
        aria-hidden="true"
      />
    </button>
  );
}
