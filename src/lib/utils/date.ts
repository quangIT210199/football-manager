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

const VIETNAM_UTC_OFFSET = "+07:00";

const INPUT_PARTS_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: VIETNAM_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** ISO → giá trị cho <input type="datetime-local"> theo giờ Việt Nam ("YYYY-MM-DDTHH:mm"). */
export function toVietnamDateTimeInput(isoDateTime: string): string {
  const parts = Object.fromEntries(
    INPUT_PARTS_FORMAT.formatToParts(new Date(isoDateTime)).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** Giá trị <input type="datetime-local"> (giờ Việt Nam) → ISO có múi giờ để lưu DB. */
export function fromVietnamDateTimeInput(value: string): string {
  return `${value}:00${VIETNAM_UTC_OFFSET}`;
}

/** Tuổi tính đến hôm nay từ ngày sinh dạng "YYYY-MM-DD". */
export function getAge(isoDate: string, today: Date = new Date()): number {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);
  const hasHadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
  return today.getFullYear() - year - (hasHadBirthday ? 0 : 1);
}
