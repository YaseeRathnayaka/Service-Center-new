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
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg rounded-l-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } ${className || ""}`}
        style={{ width }}
      >
        {/* Header */}
        {header ? (
          <div className="border-b">{header}</div>
        ) : (
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-blue-900 text-lg">{title}</span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-blue-600 text-xl cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}
        {/* Content */}
        <div
          className={`overflow-y-auto ${
            footer ? "h-[calc(100%-128px)]" : "h-[calc(100%-64px)]"
          } p-4`}
        >
          {children}
        </div>
        {/* Footer
        {footer && (
          <div className="border-t p-4 bg-white sticky bottom-0 top-0">{footer}</div>
        )} */}
      </div>
    </div>
  );
}
