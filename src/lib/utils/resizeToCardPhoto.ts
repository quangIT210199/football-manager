// Chạy ở trình duyệt: cắt ảnh về khung thẻ 3:4 và nén trước khi tải lên (giữ dung lượng gói Free).
const CARD_PHOTO_WIDTH = 480;
const CARD_PHOTO_HEIGHT = 640;
const CARD_PHOTO_QUALITY = 0.85;
// Ảnh chân dung thường có mặt ở phần trên, nên khi cắt bớt chiều cao thì giữ phần trên nhiều hơn.
const VERTICAL_CROP_BIAS = 0.2;

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getCardCrop(width: number, height: number): CropArea {
  const targetRatio = CARD_PHOTO_WIDTH / CARD_PHOTO_HEIGHT;
  if (width / height > targetRatio) {
    const cropWidth = height * targetRatio;
    return { x: (width - cropWidth) / 2, y: 0, width: cropWidth, height };
  }
  const cropHeight = width / targetRatio;
  return { x: 0, y: (height - cropHeight) * VERTICAL_CROP_BIAS, width, height: cropHeight };
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", CARD_PHOTO_QUALITY));
}

export async function resizeToCardPhoto(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const crop = getCardCrop(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = CARD_PHOTO_WIDTH;
  canvas.height = CARD_PHOTO_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");

  context.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, CARD_PHOTO_WIDTH, CARD_PHOTO_HEIGHT);
  bitmap.close();

  // Trình duyệt không hỗ trợ WebP sẽ tự trả về PNG; server chấp nhận cả hai.
  const blob = await canvasToBlob(canvas);
  if (!blob) throw new Error("Không nén được ảnh.");
  const extension = blob.type === "image/webp" ? "webp" : "png";
  return new File([blob], `photo.${extension}`, { type: blob.type });
}
