"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

export interface CreatePostSheetProps {
  open: boolean;
  onClose: () => void;
  /** Called on submit with the caption text and the raw File (if an image was
   *  attached). Wire your Supabase upload + insert here. */
  onSubmit?: (values: { caption: string; imageFile: File | null }) => void | Promise<void>;
}

/**
 * CreatePostSheet — Post Composer. Caption textarea auto-resizes with no
 * visible border (the Sheet's own background reads as the field surface),
 * a single optional image attachment with thumbnail preview + remove, and a
 * Post button that's disabled until there's something to post.
 */
export function CreatePostSheet({ open, onClose, onSubmit }: CreatePostSheetProps) {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize the textarea to fit content.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [caption]);

  // Generate/revoke an object URL for the image preview.
  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function resetState() {
    setCaption("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!caption.trim() && !imageFile) return;
    setSubmitting(true);
    try {
      await onSubmit?.({ caption: caption.trim(), imageFile });
      resetState();
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = (caption.trim().length > 0 || imageFile !== null) && !submitting;

  return (
    <Sheet open={open} onClose={handleClose} title="New Post">
      <div className="flex flex-col gap-4">
        <textarea
          ref={textareaRef}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-[15px] leading-relaxed text-[#1C1A17] placeholder:text-[#A39C8F] focus:outline-none focus:ring-0 dark:text-[#F2EFE9] dark:placeholder:text-[#736C5F]"
        />

        {imagePreviewUrl && (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="Selected image preview"
              className="max-h-56 w-auto rounded-lg border border-[#E8E3DC] object-cover dark:border-[#2C2A25]"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="Remove image"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-150 ease-out hover:bg-black/75"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#E8E3DC] pt-4 dark:border-[#2C2A25]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Add image"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B6459] transition-colors duration-150 ease-out hover:bg-[#F1EEE9] hover:text-[#1F3A5F] dark:text-[#B8B1A3] dark:hover:bg-[#0F0E0C] dark:hover:text-[#5B84B4]"
          >
            <ImagePlus className="h-5 w-5" aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button variant="primary" size="md" disabled={!canSubmit} loading={submitting} onClick={handleSubmit}>
            Post
          </Button>
        </div>
      </div>
    </Sheet>
  );
}