"use client";

import { useState } from "react";
import { Globe, Lock } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { InputText } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { OptionCard } from "./OptionCard";

export type CommunityVisibility = "public" | "private";

export interface CreateCommunityValues {
  name: string;
  description: string;
  type: CommunityVisibility;
  tag: string;
}

export interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: CreateCommunityValues) => void | Promise<void>;
}

type Step = 1 | 2 | 3;

const STEP_TITLES: Record<Step, string> = {
  1: "Create a community",
  2: "Visibility",
  3: "Community tag",
};

/**
 * CreateCommunityModal — three-step community creation flow inside the
 * shared Sheet. Step 1: name/description. Step 2: public/private choice via
 * OptionCard. Step 3: unique @tag. All state is local; onSubmit fires once
 * on the final step with the complete set of values.
 */
export function CreateCommunityModal({ open, onClose, onSubmit }: CreateCommunityModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CommunityVisibility | null>(null);
  const [tag, setTag] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function resetState() {
    setStep(1);
    setName("");
    setDescription("");
    setType(null);
    setTag("");
    setTagError(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleSubmit() {
    const cleanTag = tag.trim();
    if (!cleanTag) {
      setTagError("Choose a tag for your community.");
      return;
    }
    if (!/^[a-zA-Z0-9_]{2,32}$/.test(cleanTag)) {
      setTagError("2-32 characters, letters, numbers, and underscores only.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.({ name: name.trim(), description: description.trim(), type: type as CommunityVisibility, tag: cleanTag });
      resetState();
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onClose={handleClose} title={STEP_TITLES[step]}>
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <InputText
            label="Community name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Frontend Engineers"
          />
          <InputText
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this community about?"
          />
          <Button variant="primary" size="md" disabled={!name.trim()} onClick={() => setStep(2)} className="mt-2">
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div role="radiogroup" aria-label="Community visibility" className="flex flex-col gap-3">
            <OptionCard
              icon={<Globe className="h-5 w-5" />}
              title="Public"
              description="Discoverable by anyone. Public channels are viewable without joining."
              selected={type === "public"}
              onClick={() => setType("public")}
            />
            <OptionCard
              icon={<Lock className="h-5 w-5" />}
              title="Private"
              description="Not discoverable. Invite-only."
              selected={type === "private"}
              onClick={() => setType("private")}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button variant="primary" size="md" disabled={!type} onClick={() => setStep(3)} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <InputText
            label="Community tag"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setTagError(null);
            }}
            placeholder="FrontendEng"
            prefix="@"
            error={tagError ?? undefined}
            hint={!tagError ? "This becomes your community's handle. It can be edited once, then it's locked." : undefined}
          />
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
            <Button variant="primary" size="md" loading={submitting} onClick={handleSubmit} className="flex-1">
              Create Community
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}