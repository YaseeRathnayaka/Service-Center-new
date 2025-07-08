import React from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
  className?: string;
}

export default function Drawer({ open, onClose, title, children, width = 400, className }: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg rounded-l-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} ${className || ''}`}
        style={{ width }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-blue-900 text-lg">{title}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-blue-600 text-xl">&times;</button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">{children}</div>
      </div>
    </div>
  );
} 