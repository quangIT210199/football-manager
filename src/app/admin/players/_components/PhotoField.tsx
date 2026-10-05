"use client";

import { useRef, type ChangeEvent } from "react";

import type { PlayerPhotoState } from "@/app/admin/players/_components/usePlayerPhoto";
import { PlayerCard } from "@/components/players/PlayerCard";
import { Button } from "@/components/ui/Button";

type PhotoFieldProps = {
  photo: PlayerPhotoState;
  fullName: string;
  shirtNumber: number | null;
  positionShort: string;
};

export function PhotoField({ photo, fullName, shirtNumber, positionShort }: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) void photo.selectFile(selected);
    event.target.value = "";
  }

  return (
    <div className="grid content-start justify-items-center gap-3 rounded-lg border border-dashed border-line bg-white p-4 sm:w-56">
      <PlayerCard
        fullName={fullName || "Tên cầu thủ"}
        shirtNumber={shirtNumber}
        positionShort={positionShort}
        photoUrl={photo.previewUrl}
        className="w-36"
      />
      <p className="text-center text-xs text-muted">
        Ảnh tự cắt khung 3:4 và nén trước khi tải lên. Đẹp nhất: chụp nửa người, khung dọc, nền trơn.
      </p>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} aria-label="Chọn ảnh thẻ" />
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={photo.isProcessing}>
          {photo.isProcessing ? "Đang xử lý…" : "Chọn ảnh"}
        </Button>
        {photo.previewUrl && (
          <Button variant="ghost" onClick={photo.removePhoto}>
            Gỡ ảnh
          </Button>
        )}
      </div>
      {photo.error && (
        <p role="alert" className="text-center text-sm text-danger">
          {photo.error}
        </p>
      )}
    </div>
  );
}
