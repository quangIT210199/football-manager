"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { INITIAL_FORM_STATE } from "@/lib/constants";
import type { FormState } from "@/types/form";
import type { Match } from "@/types/match";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Sắp diễn ra" },
  { value: "finished", label: "Đã đá" },
];

type ResultFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  match: Match;
};

export function ResultForm({ action, match }: ResultFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_STATE);
  const [status, setStatus] = useState(match.status);
  const isFinished = status === "finished";

  return (
    <form action={formAction} className="grid max-w-lg gap-4">
      <SelectField label="Trạng thái" name="status" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label={`Bàn của ${match.side_a_name}`}
          name="scoreA"
          type="number"
          inputMode="numeric"
          min={0}
          max={99}
          required={isFinished}
          disabled={!isFinished}
          defaultValue={match.score_a ?? ""}
        />
        <TextField
          label={`Bàn của ${match.side_b_name}`}
          name="scoreB"
          type="number"
          inputMode="numeric"
          min={0}
          max={99}
          required={isFinished}
          disabled={!isFinished}
          defaultValue={match.score_b ?? ""}
        />
      </div>
      {!isFinished && <input type="hidden" name="scoreA" value="" />}
      {!isFinished && <input type="hidden" name="scoreB" value="" />}
      <FormMessage state={state} />
      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? "Đang lưu…" : "Lưu kết quả"}
      </Button>
    </form>
  );
}
