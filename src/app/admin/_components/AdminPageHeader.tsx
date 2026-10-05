import Link from "next/link";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
};

export function AdminPageHeader({ title, description, back, actions }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="grid gap-1">
        {back && (
          <Link href={back.href} className="text-sm text-muted hover:text-ink">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {actions}
    </header>
  );
}
