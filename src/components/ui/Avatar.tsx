import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarSize = "inline" | "list" | "profile";

const SIZE_PX: Record<AvatarSize, number> = {
  inline: 24,
  list: 40,
  profile: 96,
};

export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  isPage?: boolean;
  className?: string;
}

export function Avatar({ src, alt, size = "list", isPage, className }: AvatarProps) {
  const px = SIZE_PX[size];
  
  // Safely grab the first letter of the display name for our fallback
  const initial = alt ? alt.charAt(0).toUpperCase() : "?";
  
  // Check if src exists and isn't just an empty string/whitespace
  const hasImage = src && src.trim() !== "";

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-[#E8E3DC] font-medium text-[#6B6459] dark:bg-[#3D3A33] dark:text-[#B8B1A3]",
        isPage ? "rounded-lg" : "rounded-full",
        className,
      )}
      style={{ width: px, height: px, fontSize: Math.max(12, px * 0.4) }}
    >
      {hasImage ? (
        <Image src={src} alt={alt} fill sizes={`${px}px`} className="object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}