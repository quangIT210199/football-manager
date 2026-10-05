"use client";

import { useActionState, useState } from "react";

import type { PlayerFormState } from "@/app/admin/players/actions";
import { Button } from "@/components/ui/Button";

const INITIAL_STATE: PlayerFormState = { error: null };

type DeletePlayerButtonProps = {
  action: (state: PlayerFormState) => Promise<PlayerFormState>;
  playerName: string;
};

export function DeletePlayerButton({ action, playerName }: DeletePlayerButtonProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <Button variant="danger" onClick={() => setIsConfirming(true)}>
        Xoá cầu thủ
      </Button>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      <p className="text-sm">
        Xoá hẳn <strong>{playerName}</strong> và ảnh thẻ? Không thể hoàn tác.
      </p>
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
