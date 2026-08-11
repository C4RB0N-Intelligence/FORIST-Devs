import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#1F3A5F] text-white hover:bg-[#152840] dark:bg-[#5B84B4] dark:text-[#171512] dark:hover:bg-[#7FA3D1]",
  secondary:
    "border border-[#D8D2C7] bg-transparent text-[#1C1A17] hover:bg-[#F1EEE9] dark:border-[#3D3A33] dark:text-[#F2EFE9] dark:hover:bg-[#0F0E0C]",
  ghost: "bg-transparent text-[#1F3A5F] hover:bg-[#E4EBF3] dark:text-[#5B84B4] dark:hover:bg-[#22314A]",
  destructive: "border border-[#8C2F2F] bg-transparent text-[#8C2F2F] hover:bg-[#8C2F2F]/5 dark:border-[#E17272] dark:text-[#E17272]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading, className, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});