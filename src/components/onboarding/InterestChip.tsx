export interface InterestChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/** Selectable interest chip — subtle border at rest, solid Ink Blue with white text when selected. */
export default function InterestChip({ label, selected, onClick }: InterestChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ease-out",
        selected
          ? "border-[#1F3A5F] bg-[#1F3A5F] text-white"
          : "border-[#D8D2C7] bg-white text-[#6B6459] hover:border-[#1F3A5F]/40 hover:bg-[#FAF8F5]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
