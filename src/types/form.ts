/** Kết quả trả về của Server Action dùng với useActionState. */
export type FormState = {
  error: string | null;
  /** Thông báo khi lưu thành công mà vẫn ở lại trang. */
  success?: string;
};
