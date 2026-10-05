import type { ReactNode } from "react";

type AdminSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AdminSection({ title, description, children }: AdminSectionProps) {
  return (
    <section className="grid gap-4 border-t border-line pt-6">
      <div className="grid gap-1">
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}
