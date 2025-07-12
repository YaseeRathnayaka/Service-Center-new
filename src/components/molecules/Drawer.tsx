import React from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  width = 400,
  className,
  header,
  footer,
}: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        } ${className || ""}`}
        style={{ width }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 shrink-0">
          {header ? (
            <div className="border-b border-slate-700/50">{header}</div>
          ) : (
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <span className="font-bold text-white text-lg">{title}</span>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={`relative z-10 flex-1 overflow-y-auto scrollbar-none hide-scrollbar p-6`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="relative z-10 shrink-0 border-t border-slate-700/50 p-6 bg-slate-800/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
