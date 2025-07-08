import React from 'react';

export type AtomicField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'date' | 'select' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { label: string; value: string }[];
  required?: boolean;
};

export interface AtomicFormProps {
  fields: AtomicField[];
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  loading?: boolean;
  error?: string;
}

export default function AtomicForm({ fields, onSubmit, submitLabel = 'Submit', loading, error }: AtomicFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-xl mx-auto flex flex-col gap-4">
      {fields.map(field => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-gray-800 text-sm font-medium" htmlFor={field.name}>{field.label}</label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              className="border rounded px-3 py-2 text-gray-800"
            >
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              className="border rounded px-3 py-2 text-gray-800"
            />
          )}
        </div>
      ))}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Please wait...' : submitLabel}
      </button>
    </form>
  );
} 