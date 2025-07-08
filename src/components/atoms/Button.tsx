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

const base = 'px-4 py-2 rounded font-medium focus:outline-none transition';
const iconBase = 'w-9 h-9 flex items-center justify-center rounded focus:outline-none transition';
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-blue-900 hover:bg-gray-200',
  danger: 'bg-red-500 text-white hover:bg-red-600',
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
      className={`${iconOnly ? iconBase : base} ${variants[variant]} ${className || ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
} 