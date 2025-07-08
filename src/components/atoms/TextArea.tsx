import React from 'react';

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}

export default function TextArea({ label, name, value, onChange, placeholder, required, disabled, error, className, rows = 4 }: TextAreaProps) {
  return (
    <div className={`flex flex-col gap-1 ${className || ''}`}>
      <label htmlFor={name} className="text-gray-800 text-sm font-medium">{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className="border rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
      />
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </div>
  );
} 