import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  as?: "div" | "article";
}

export function Card({ interactive, as: As = "div", className, children, ...props }: CardProps) {
  return (
    <As
      className={cn(
        "rounded-lg border border-[#E8E3DC] bg-white p-4 shadow-[0_1px_2px_rgba(28,26,23,0.06)]",
        "dark:border-[#2C2A25] dark:bg-[#211F1B] dark:shadow-none",
        interactive && "cursor-pointer transition-shadow duration-200 ease-out hover:shadow-[0_4px_12px_rgba(28,26,23,0.08)]",
        className,
      )}
      {...props}
    >
      {children}
    </As>
  );
}