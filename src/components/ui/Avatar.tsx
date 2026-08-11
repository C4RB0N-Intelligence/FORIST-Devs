import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarSize = "inline" | "list" | "profile";

const SIZE_PX: Record<AvatarSize, number> = {
  inline: 24,
  list: 40,
  profile: 96,
};

export interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  isPage?: boolean;
  className?: string;
}

export function Avatar({ src, alt, size = "list", isPage, className }: AvatarProps) {
  const px = SIZE_PX[size];
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden bg-[#F1EEE9] dark:bg-[#0F0E0C]",
        isPage ? "rounded-lg" : "rounded-full",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image src={src} alt={alt} fill sizes={`${px}px`} className="object-cover" />
    </span>
  );
}