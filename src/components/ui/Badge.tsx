import { Check } from "lucide-react";
import { cn, formatCount } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Verified"
      title="Verified"
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1F3A5F] text-white dark:bg-[#5B84B4]",
        className,
      )}
    >
      <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

export function CountBadge({
  count,
  label,
  bridge,
  className,
}: {
  count: number;
  label?: string;
  bridge?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full bg-[#F1EEE9] px-2.5 text-xs text-[#6B6459] dark:bg-[#0F0E0C] dark:text-[#B8B1A3]",
        className,
      )}
    >
      {bridge && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C4A572] dark:bg-[#C9A96A]" aria-hidden="true" />}
      {label && <span>{label}</span>}
      <span className="tabular-nums">{formatCount(count)}</span>
    </span>
  );
}