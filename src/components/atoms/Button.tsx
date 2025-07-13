import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  /**
   * If true, renders a square icon-only button. aria-label is required for accessibility.
   */
  iconOnly?: boolean;
  /**
   * Accessible label for icon-only button.
   */
  'aria-label'?: string;
}

const base = 'px-4 py-2 font-semibold focus:outline-none transition-all duration-200 border shadow-sm text-sm select-none rounded-md';
const iconBase = 'w-9 h-9 flex items-center justify-center focus:outline-none transition-all duration-200 border shadow-sm select-none rounded-md';
const variants = {
  primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95',
  secondary: 'bg-slate-100 text-blue-900 border-slate-200 hover:bg-slate-200 hover:text-blue-700 hover:shadow-md active:scale-95',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 hover:from-red-600 hover:to-pink-600 hover:shadow-lg active:scale-95',
};
const iconVariants = {
  primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95',
  secondary: 'bg-slate-100 text-blue-900 border-slate-200 hover:bg-slate-200 hover:text-blue-700 hover:shadow-md active:scale-95',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 hover:from-red-600 hover:to-pink-600 hover:shadow-lg active:scale-95',
};

export default function Button({ children, onClick, type = 'button', disabled, className, variant = 'primary', iconOnly, 'aria-label': ariaLabel }: ButtonProps) {
  if (iconOnly && !ariaLabel) {
    throw new Error('Icon-only buttons must have an aria-label for accessibility.');
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={iconOnly ? ariaLabel : undefined}
      className={
        `${iconOnly
          ? `${iconBase} ${iconVariants[variant]}`
          : `${base} ${variants[variant]}`
        } ${className || ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`
      }
    >
      {children}
    </button>
  );
} 