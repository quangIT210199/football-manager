import { useId, type InputHTMLAttributes } from "react";

type TextFieldTone = "light" | "dark";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  tone?: TextFieldTone;
};

const LABEL_TONE_CLASSES: Record<TextFieldTone, string> = {
  light: "text-muted",
  dark: "text-chalk-dim",
};

const INPUT_TONE_CLASSES: Record<TextFieldTone, string> = {
  light: "border-line bg-white text-ink",
  dark: "border-white/20 bg-white/5 text-chalk",
};

export function TextField({ label, tone = "light", id, className = "", ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className={`text-sm font-semibold ${LABEL_TONE_CLASSES[tone]}`}>
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-md border px-3 py-2 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 ${INPUT_TONE_CLASSES[tone]} ${className}`}
        {...props}
      />
    </div>
  );
}
