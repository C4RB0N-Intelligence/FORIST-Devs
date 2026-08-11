import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ListRowProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ListRow({ leading, title, subtitle, trailing, showChevron, onClick, className }: ListRowProps) {
  const isInteractive = Boolean(onClick);
  const Comp = isInteractive ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-b border-[#E8E3DC] bg-white px-4 py-3 text-left last:border-b-0",
        "dark:border-[#2C2A25] dark:bg-[#211F1B]",
        isInteractive && "transition-colors duration-200 ease-out hover:bg-[#F1EEE9] dark:hover:bg-[#0F0E0C]",
        className,
      )}
    >
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-[#1C1A17] dark:text-[#F2EFE9]">{title}</div>
        {subtitle && <div className="truncate text-sm text-[#6B6459] dark:text-[#B8B1A3]">{subtitle}</div>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
      {showChevron && <ChevronRight className="h-4 w-4 shrink-0 text-[#A39C8F] dark:text-[#736C5F]" aria-hidden="true" />}
    </Comp>
  );
}