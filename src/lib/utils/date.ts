const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

const MATCH_DATE_FORMAT = new Intl.DateTimeFormat("vi-VN", {
  timeZone: VIETNAM_TIME_ZONE,
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const MATCH_TIME_FORMAT = new Intl.DateTimeFormat("vi-VN", {
  timeZone: VIETNAM_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

/** Ví dụ: "Thứ Bảy, 27/09/2026 · 19:30" (giờ Việt Nam). */
export function formatMatchDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const day = MATCH_DATE_FORMAT.format(date);
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${MATCH_TIME_FORMAT.format(date)}`;
}

/** Tuổi tính đến hôm nay từ ngày sinh dạng "YYYY-MM-DD". */
export function getAge(isoDate: string, today: Date = new Date()): number {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);
  const hasHadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
  return today.getFullYear() - year - (hasHadBirthday ? 0 : 1);
}
