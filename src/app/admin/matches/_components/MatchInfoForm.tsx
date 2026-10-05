"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { TextField } from "@/components/ui/TextField";
import { INITIAL_FORM_STATE } from "@/lib/constants";
import { toVietnamDateTimeInput } from "@/lib/utils/date";
import type { FormState } from "@/types/form";
import type { Match } from "@/types/match";

const DEFAULT_SIDE_A_NAME = "Đội Xanh";
const DEFAULT_SIDE_B_NAME = "Đội Đỏ";

type MatchInfoFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  match?: Match;
  submitLabel: string;
};

export function MatchInfoForm({ action, match, submitLabel }: MatchInfoFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_STATE);

  return (
    <form action={formAction} className="grid max-w-lg gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Ngày giờ đá (giờ Việt Nam)"
          name="playedAt"
          type="datetime-local"
          required
          defaultValue={match ? toVietnamDateTimeInput(match.played_at) : ""}
        />
        <TextField label="Sân" name="venue" maxLength={120} placeholder="Ví dụ: Sân Hoàng Mai" defaultValue={match?.venue ?? ""} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Tên bên A" name="sideAName" required maxLength={40} defaultValue={match?.side_a_name ?? DEFAULT_SIDE_A_NAME} />
        <TextField label="Tên bên B" name="sideBName" required maxLength={40} defaultValue={match?.side_b_name ?? DEFAULT_SIDE_B_NAME} />
      </div>
      <TextField label="Ghi chú" name="notes" maxLength={1000} defaultValue={match?.notes ?? ""} />
      <FormMessage state={state} />
      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? "Đang lưu…" : submitLabel}
      </Button>
    </form>
  );
}
