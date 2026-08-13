import { Avatar } from "@/components/ui/Avatar";
import { ListRow } from "@/components/ui/ListRow";
import { cn } from "@/lib/utils";

export type MemberRole = "owner" | "admin" | "moderator" | "member";

export interface Member {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  role: MemberRole;
}

export interface MemberListProps {
  members: Member[];
  onMemberListClick?: (member: Member) => void;
}

const ROLE_LABELS: Partial<Record<MemberRole, string>> = {
  owner: "Owner",
  admin: "Admin",
};

export function MemberList({ members, onMemberListClick }: MemberListProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#E8E3DC] dark:border-[#2C2A25]">
      {members.map((member) => {
        const roleLabel = ROLE_LABELS[member.role];

        return (
          <ListRow
            key={member.id}
            leading={<Avatar src={member.avatar_url} alt={member.display_name} size="list" />}
            title={
              <span className="flex items-center gap-1.5">
                {member.display_name}
                {roleLabel && (
                  <span
                    className={cn(
                      "inline-flex h-5 items-center rounded-md px-1.5 text-xs font-medium",
                      "bg-[#F1EEE9] text-[#6B6459] dark:bg-[#0F0E0C] dark:text-[#B8B1A3]",
                    )}
                  >
                    {roleLabel}
                  </span>
                )}
              </span>
            }
            subtitle={`@${member.username}`}
            onClick={onMemberListClick ? () => onMemberListClick(member) : undefined}
          />
        );
      })}
    </div>
  );
}