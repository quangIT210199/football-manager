"use client";

import { useActionState, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { INITIAL_FORM_STATE } from "@/lib/constants";
import type { FormState } from "@/types/form";

type ConfirmDeleteButtonProps = {
  action: (state: FormState) => Promise<FormState>;
  triggerLabel: string;
  confirmMessage: ReactNode;
};

/** Nút xoá hai bước: bấm lần đầu hiện câu hỏi xác nhận, bấm "Xác nhận xoá" mới gọi server. */
export function ConfirmDeleteButton({ action, triggerLabel, confirmMessage }: ConfirmDeleteButtonProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_STATE);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <Button variant="danger" onClick={() => setIsConfirming(true)} className="justify-self-start">
        {triggerLabel}
      </Button>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      <p className="text-sm">{confirmMessage}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="danger" disabled={isPending}>
          {isPending ? "Đang xoá…" : "Xác nhận xoá"}
        </Button>
        <Button variant="ghost" onClick={() => setIsConfirming(false)} disabled={isPending}>
          Không xoá
        </Button>
      </div>
      {state.error && (
        <p role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
