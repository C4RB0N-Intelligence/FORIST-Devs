"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            className={cn(
              "relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-[0_16px_32px_rgba(28,26,23,0.12)]",
              "dark:bg-[#211F1B] dark:shadow-none",
              "sm:max-w-[480px] sm:rounded-2xl",
              className,
            )}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#D8D2C7] dark:bg-[#3D3A33] sm:hidden" aria-hidden="true" />
            {title && <h2 className="mb-3 text-xl font-semibold text-[#1C1A17] dark:text-[#F2EFE9]">{title}</h2>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}