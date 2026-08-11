import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Optional leading glyph rendered inside the field, e.g. "@" for usernames. */
  prefix?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { label, error, id, type = "text", prefix, className = "", ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-[#1C1A17] dark:text-[#F2EFE9]">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-[#A39C8F]">
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={[
            "h-11 w-full rounded-lg border text-[15px] leading-none",
            prefix ? "pl-7 pr-3.5" : "px-3.5",
            "bg-[#F1EEE9] text-[#1C1A17] placeholder:text-[#A39C8F]",
            "dark:bg-[#0F0E0C] dark:text-[#F2EFE9] dark:placeholder:text-[#736C5F]",
            "border-[#D8D2C7] dark:border-[#3D3A33]",
            "transition-colors duration-200 ease-out",
            "focus:outline-none focus:border-[#1F3A5F] dark:focus:border-[#5B84B4]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-[#8C2F2F] dark:border-[#E17272]" : "",
            isPassword ? "pr-11" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[#6B6459] hover:text-[#1C1A17] dark:text-[#B8B1A3] dark:hover:text-[#F2EFE9]"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-[#8C2F2F] dark:text-[#E17272]">
          {error}
        </p>
      )}
    </div>
  );
});

export default FormInput;

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a17.6 17.6 0 0 1-2.16 3.19M6.61 6.61A17.7 17.7 0 0 0 1 12s4 8 11 8a9.26 9.26 0 0 0 5.39-1.61M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}