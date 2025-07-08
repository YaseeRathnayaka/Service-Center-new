import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export default function InputField({ label, name, value, onChange, type = 'text', placeholder, required, disabled, error, className }: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className || ''}`}>
      <label htmlFor={name} className="text-gray-800 text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="border rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
      />
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </div>
  );
} 