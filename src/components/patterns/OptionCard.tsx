import type { ReactNode } from "react";

export interface OptionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  disabledNote?: string;
  onClick: () => void;
}

/**
 * OptionCard — a radio-style selectable card: icon, title, one-line
 * description, and a radio indicator. Selected state uses the accent border
 * + tinted background in both themes. When disabled, the card stays visible
 * with an inline note rather than being hidden — the gate should always be
 * explained, never concealed.
 */
export function OptionCard({ icon, title, description, selected, disabled, disabledNote, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 ease-out",
        selected
          ? "border-[#1F3A5F] bg-[#1F3A5F]/[0.06] dark:border-[#5B84B4] dark:bg-[#5B84B4]/10"
          : "border-[#E8E3DC] bg-white hover:border-[#D8D2C7] hover:bg-[#FAF8F5] dark:border-[#2C2A25] dark:bg-[#211F1B] dark:hover:border-[#3D3A33] dark:hover:bg-[#0F0E0C]",
        disabled && "cursor-not-allowed opacity-60 hover:border-[#E8E3DC] hover:bg-white dark:hover:border-[#2C2A25] dark:hover:bg-[#211F1B]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          selected
            ? "bg-[#1F3A5F] text-white dark:bg-[#5B84B4] dark:text-[#171512]"
            : "bg-[#F1EEE9] text-[#6B6459] dark:bg-[#0F0E0C] dark:text-[#B8B1A3]",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="text-[15px] font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">{title}</div>
        <div className="mt-0.5 text-sm text-[#6B6459] dark:text-[#B8B1A3]">{description}</div>
        {disabled && disabledNote && (
          <div className="mt-1 text-sm italic text-[#A39C8F] dark:text-[#736C5F]">{disabledNote}</div>
        )}
      </div>

      <span
        className={[
          "mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors duration-200 ease-out",
          selected
            ? "border-[#1F3A5F] bg-[#1F3A5F] dark:border-[#5B84B4] dark:bg-[#5B84B4]"
            : "border-[#D8D2C7] bg-white dark:border-[#3D3A33] dark:bg-transparent",
        ].join(" ")}
        aria-hidden="true"
      />
    </button>
  );
}