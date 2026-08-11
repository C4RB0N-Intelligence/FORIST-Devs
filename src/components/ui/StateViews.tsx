import { AlertTriangle, Inbox, WifiOff } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({
  icon,
  heading,
  supportingText,
  actionLabel,
  onAction,
}: {
  icon?: React.ReactNode;
  heading: string;
  supportingText?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="text-[#A39C8F] dark:text-[#736C5F]" aria-hidden="true">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">{heading}</h3>
      {supportingText && <p className="max-w-sm text-sm text-[#6B6459] dark:text-[#B8B1A3]">{supportingText}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 rounded-lg border-l-4 border-[#8C2F2F] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(28,26,23,0.06)] dark:border-[#E17272] dark:bg-[#211F1B]"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-[#8C2F2F] dark:text-[#E17272]" aria-hidden="true" />
        <span className="text-sm text-[#1C1A17] dark:text-[#F2EFE9]">{message}</span>
      </div>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-[#8A5A1F]/30 bg-[#8A5A1F]/10 px-4 py-2 text-sm text-[#8A5A1F] dark:border-[#D9A257]/30 dark:bg-[#D9A257]/10 dark:text-[#D9A257]">
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      You're offline. We'll reconnect automatically.
    </div>
  );
}

export function LoadingSkeleton({ className = "h-24 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#F1EEE9] dark:bg-[#0F0E0C] ${className}`} aria-hidden="true" />;
}