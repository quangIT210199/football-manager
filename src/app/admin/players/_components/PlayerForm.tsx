"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { PhotoField } from "@/app/admin/players/_components/PhotoField";
import { usePlayerPhoto } from "@/app/admin/players/_components/usePlayerPhoto";
import { Button, getButtonClassName } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { INITIAL_FORM_STATE, ROUTES } from "@/lib/constants";
import { getPositionLabel, POSITION_OPTIONS } from "@/lib/utils/position";
import type { FormState } from "@/types/form";
import type { Player } from "@/types/player";

const DEFAULT_POSITION = "MF";

type PlayerFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  player?: Player;
  initialPhotoUrl: string | null;
  submitLabel: string;
};

export function PlayerForm({ action, player, initialPhotoUrl, submitLabel }: PlayerFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_STATE);
  const photo = usePlayerPhoto(initialPhotoUrl);
  // Các ô đều được điều khiển bằng state để giữ nguyên dữ liệu đã nhập khi server báo lỗi.
  const [fullName, setFullName] = useState(player?.full_name ?? "");
  const [shirtNumber, setShirtNumber] = useState(player?.shirt_number?.toString() ?? "");
  const [position, setPosition] = useState(player?.position ?? DEFAULT_POSITION);
  const [dateOfBirth, setDateOfBirth] = useState(player?.date_of_birth ?? "");
  const [isActive, setIsActive] = useState(player?.is_active ?? true);

  function submit(formData: FormData) {
    if (photo.file) formData.set("photo", photo.file);
    if (photo.isRemoved) formData.set("removePhoto", "on");
    formAction(formData);
  }

  const previewNumber = shirtNumber === "" ? null : Number(shirtNumber);

  return (
    <form action={submit} className="grid items-start gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
      <PhotoField
        photo={photo}
        fullName={fullName}
        shirtNumber={Number.isInteger(previewNumber) ? previewNumber : null}
        positionShort={getPositionLabel(position, "short")}
      />
      <div className="grid max-w-lg gap-4">
        <TextField label="Họ và tên" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={80} />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Số áo"
            name="shirtNumber"
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            value={shirtNumber}
            onChange={(e) => setShirtNumber(e.target.value)}
          />
          <SelectField label="Vị trí" name="position" options={POSITION_OPTIONS} value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
        <TextField label="Ngày sinh" name="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="size-4 accent-blau" />
          Đang tham gia (bỏ tick để ẩn khỏi trang công khai)
        </label>
        {state.error && (
          <p role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending || photo.isProcessing}>
            {isPending ? "Đang lưu…" : submitLabel}
          </Button>
          <Link href={ROUTES.adminPlayers} className={getButtonClassName("ghost")}>
            Huỷ
          </Link>
        </div>
      </div>
    </form>
  );
}
