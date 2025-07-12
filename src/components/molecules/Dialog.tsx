import React, { useEffect, useRef } from "react";
import Button from "../atoms/Button";
import LottieLoader from "../atoms/LottieLoader";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function Dialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 outline-none animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {title && (
          <div
            id="dialog-title"
            className="font-bold text-lg text-blue-900 mb-2"
          >
            {title}
          </div>
        )}
        {message && <div className="text-gray-800 mb-4">{message}</div>}
        {children}
        {loading && (
          <div className="flex justify-center mb-4">
            <LottieLoader size={48} />
          </div>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} variant="secondary" disabled={loading}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} variant="danger" disabled={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
