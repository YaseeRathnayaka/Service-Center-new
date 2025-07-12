import React from "react";

export type AtomicField = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "date" | "select" | "number";
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
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

export default function AtomicForm({
  fields,
  onSubmit,
  submitLabel = "Submit",
  loading,
  error,
}: AtomicFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex flex-col gap-6"
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-2">
          <label
            className="text-slate-300 text-sm font-medium"
            htmlFor={field.name}
          >
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
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
              className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
          )}
        </div>
      ))}
      {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>}
      {submitLabel && (
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200 font-semibold"
          disabled={loading}
        >
          {loading ? "Please wait..." : submitLabel}
        </button>
      )}
    </form>
  );
}
