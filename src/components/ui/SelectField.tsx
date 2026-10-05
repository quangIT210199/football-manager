import { useId, type SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly SelectOption[];
};

export function SelectField({ label, options, id, className = "", ...props }: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={selectId} className="text-sm font-semibold text-muted">
        {label}
      </label>
      <select
        id={selectId}
        className={`rounded-md border border-line bg-white px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
