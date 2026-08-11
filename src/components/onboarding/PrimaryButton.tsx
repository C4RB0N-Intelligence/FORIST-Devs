import type { ButtonHTMLAttributes } from "react";

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

/** Primary action button — deep ink-blue fill. */
export default function PrimaryButton({ loading, disabled, children, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "flex h-12 w-full items-center justify-center gap-2 rounded-lg text-[15px] font-semibold",
        "bg-[#1F3A5F] text-[#FAF8F5] hover:bg-[#152840] active:bg-[#152840]",
        "transition-colors duration-200 ease-out",
        "disabled:cursor-not-allowed disabled:bg-[#1F3A5F]/30 disabled:hover:bg-[#1F3A5F]/30",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
        </svg>
      )}
      {children}
    </button>
  );
}
