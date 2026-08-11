"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { InputText } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/Badge";
import { ListRow } from "@/components/ui/ListRow";
import { EmptyState } from "@/components/ui/StateViews";
import { useMessageableProfiles, useStartConversation } from "@/features/messaging/hooks";

export interface NewConversationSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * New Conversation Flow (G3) — recipient search/select sheet, reuses the
 * BottomSheet.List pattern (Design System Part X) with a search input header.
 * Single-select here; multi-select for group DMs is the same list with
 * toggleable selection state.
 */
export function NewConversationSheet({ open, onClose }: NewConversationSheetProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data: candidates, isLoading } = useMessageableProfiles(query);
  const startConversation = useStartConversation();

  function handleSelect(profileId: string) {
    startConversation.mutate([profileId], {
      onSuccess: (conversation) => {
        onClose();
        setQuery("");
        router.push(`/messages/${conversation.id}`);
      },
    });
  }

  return (
    <Sheet open={open} onClose={onClose} title="New message">
      <div className="flex flex-col gap-3">
        <InputText
          aria-label="Search people"
          placeholder="Search by name or @handle…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {isLoading && <p className="py-4 text-center text-body-sm text-text-secondary">Searching…</p>}

        {!isLoading && candidates && candidates.length === 0 && (
          <EmptyState heading="No matches" supportingText="Try a different name or handle." />
        )}

        {!isLoading && candidates && candidates.length > 0 && (
          <div className="flex max-h-80 flex-col overflow-y-auto rounded-md border border-border-subtle">
            {candidates.map((profile) => (
              <ListRow
                key={profile.id}
                leading={
                  <Avatar src={profile.avatarUrl} alt={profile.displayName} size="list" isPage={profile.type === "page"} />
                }
                title={
                  <span className="flex items-center gap-1.5">
                    {profile.displayName}
                    {profile.verified && <VerifiedBadge />}
                  </span>
                }
                subtitle={`@${profile.handle}`}
                onClick={() => handleSelect(profile.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}
