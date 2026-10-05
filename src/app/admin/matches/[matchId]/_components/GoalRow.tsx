"use client";

import { useActionState } from "react";

import { INITIAL_FORM_STATE } from "@/lib/constants";
import type { FormState } from "@/types/form";

type GoalRowProps = {
  minute: number | null;
  scorerName: string;
  detail: string;
  creditedSideName: string;
  creditedSideClass: string;
  deleteAction: (state: FormState) => Promise<FormState>;
};

export function GoalRow({ minute, scorerName, detail, creditedSideName, creditedSideClass, deleteAction }: GoalRowProps) {
  const [state, formAction, isPending] = useActionState(deleteAction, INITIAL_FORM_STATE);

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line px-3 py-2 last:border-b-0">
      <span className="w-10 font-mono text-sm text-muted tabular-nums">{minute === null ? "–" : `${minute}'`}</span>
      <span className="min-w-0 flex-1">
        <span className="font-semibold">{scorerName}</span>
        {detail && <span className="text-sm text-muted"> · {detail}</span>}
      </span>
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${creditedSideClass}`}>+1 {creditedSideName}</span>
      <form action={formAction}>
        <button type="submit" disabled={isPending} className="text-sm font-semibold text-danger hover:underline disabled:opacity-50">
          {isPending ? "Đang xoá…" : "Xoá"}
        </button>
      </form>
      {state.error && <p className="basis-full text-sm text-danger">{state.error}</p>}
    </li>
  );
}
