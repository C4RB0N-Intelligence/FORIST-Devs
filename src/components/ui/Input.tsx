import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string; // <-- Added prefix prop
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(function InputText(
  { label, error, hint, prefix, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#1C1A17] dark:text-[#F2EFE9]">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-[#A39C8F]">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-10 w-full rounded-lg border text-[15px] text-[#1C1A17] placeholder:text-[#A39C8F]",
            "bg-[#F1EEE9] dark:bg-[#0F0E0C] dark:text-[#F2EFE9] dark:placeholder:text-[#736C5F]",
            "border-[#D8D2C7] dark:border-[#3D3A33]",
            "focus:outline-none focus:border-[#1F3A5F] dark:focus:border-[#5B84B4]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            prefix ? "pl-7 pr-3" : "px-3", // Adjust padding if prefix exists
            error && "border-[#8C2F2F] dark:border-[#E17272]",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="flex items-center gap-1 text-sm text-[#8C2F2F] dark:text-[#E17272]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-[#6B6459] dark:text-[#B8B1A3]">{hint}</p>
      ) : null}
    </div>
  );
});



export type InputPasswordProps = Omit<InputTextProps, "type">;

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(function InputPassword(
  props,
  ref,
) {
  return <InputText ref={ref} type="password" {...props} />;
});