"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { INITIAL_FORM_STATE } from "@/lib/constants";
import type { FormState } from "@/types/form";

type PlayerOption = {
  value: string;
  label: string;
};

type AddGoalFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  playerOptions: PlayerOption[];
};

const KIND_OPTIONS = [
  { value: "goal", label: "Bàn thắng" },
  { value: "own_goal", label: "Phản lưới (tính cho bên kia)" },
];

export function AddGoalForm({ action, playerOptions }: AddGoalFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_STATE);
  const [kind, setKind] = useState("goal");
  const isOwnGoal = kind === "own_goal";

  return (
    <form action={formAction} className="grid max-w-2xl gap-3 rounded-lg border border-line bg-white p-4">
      <p className="font-semibold">Thêm bàn thắng</p>
      <div className="grid gap-3 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)]">
        <TextField label="Phút" name="minute" type="number" inputMode="numeric" min={0} max={200} placeholder="Không rõ" />
        <SelectField label="Cầu thủ" name="scorerId" required options={[{ value: "", label: "Chọn cầu thủ" }, ...playerOptions]} />
        <SelectField label="Loại" name="kind" options={KIND_OPTIONS} value={kind} onChange={(e) => setKind(e.target.value)} />
      </div>
      <SelectField
        label="Kiến tạo"
        name="assistId"
        disabled={isOwnGoal}
        options={[{ value: "", label: isOwnGoal ? "Không áp dụng cho phản lưới" : "Không có" }, ...playerOptions]}
      />
      <FormMessage state={state} />
      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? "Đang lưu…" : "Thêm bàn"}
      </Button>
    </form>
  );
}
