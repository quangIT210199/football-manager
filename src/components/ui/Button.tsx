import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-blau text-white hover:bg-blau/90",
  secondary: "border border-line bg-white text-ink hover:bg-paper",
  ghost: "text-muted hover:bg-paper hover:text-ink",
  danger: "border border-danger/40 bg-white text-danger hover:bg-danger hover:text-white",
};

/** Dùng chung cho <Link> cần trông giống nút. */
export function getButtonClassName(variant: ButtonVariant = "primary"): string {
  return `${BASE_CLASSES} ${VARIANT_CLASSES[variant]}`;
}

export function Button({ variant = "primary", type = "button", className = "", ...props }: ButtonProps) {
  return <button type={type} className={`${getButtonClassName(variant)} ${className}`} {...props} />;
}
