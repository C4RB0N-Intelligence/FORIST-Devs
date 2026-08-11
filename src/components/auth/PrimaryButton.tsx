import type { ButtonHTMLAttributes } from "react";

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

/** Primary action button — deep ink-blue fill, one per form. */
export default function PrimaryButton({ loading, disabled, children, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "flex h-12 w-full items-center justify-center gap-2 rounded-lg text-[15px] font-semibold",
        "bg-[#1F3A5F] text-[#FAF8F5] hover:bg-[#152840] active:bg-[#152840]",
        "dark:bg-[#5B84B4] dark:text-[#171512] dark:hover:bg-[#7FA3D1] dark:active:bg-[#7FA3D1]",
        "transition-colors duration-200 ease-out",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3A5F] dark:focus-visible:ring-[#5B84B4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F5] dark:focus-visible:ring-offset-[#171512]",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
        </svg>
      )}
      {children}
    </button>
  );
}
