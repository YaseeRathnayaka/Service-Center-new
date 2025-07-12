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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl max-w-sm w-full outline-none animate-fade-in relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        {title && (
          <div className="relative z-10 p-6 border-b border-slate-700/50">
            <div
              id="dialog-title"
              className="font-bold text-lg text-white"
            >
              {title}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-6">
          {message && <div className="text-slate-300 mb-4">{message}</div>}
          {children}
          {loading && (
            <div className="flex justify-center mb-4">
              <LottieLoader size={48} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 p-6 border-t border-slate-700/50 bg-slate-800/20">
          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary" disabled={loading}>
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm} variant="danger" disabled={loading}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
