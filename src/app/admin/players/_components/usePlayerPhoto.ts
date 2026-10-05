import { useEffect, useState } from "react";

import { resizeToCardPhoto } from "@/lib/utils/resizeToCardPhoto";

export type PlayerPhotoState = ReturnType<typeof usePlayerPhoto>;

/** Giữ ảnh đã cắt / nén ở state (không ở input file) để không bị mất khi form báo lỗi. */
export function usePlayerPhoto(initialUrl: string | null) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function selectFile(original: File) {
    setError(null);
    setIsProcessing(true);
    try {
      const processed = await resizeToCardPhoto(original);
      setFile(processed);
      setPreviewUrl(URL.createObjectURL(processed));
      setIsRemoved(false);
    } catch {
      setError("Không đọc được ảnh này. Hãy chọn ảnh JPG, PNG hoặc WebP khác.");
    } finally {
      setIsProcessing(false);
    }
  }

  function removePhoto() {
    setFile(null);
    setPreviewUrl(null);
    setIsRemoved(true);
    setError(null);
  }

  return { file, previewUrl, isRemoved, isProcessing, error, selectFile, removePhoto };
}
