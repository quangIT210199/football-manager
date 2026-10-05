import "server-only";

import { revalidatePath } from "next/cache";

/** Cầu thủ / trận đấu hiện ở nhiều trang (thống kê, đội hình, admin) nên làm mới toàn bộ sau mỗi thay đổi. */
export function revalidateTeamPages(): void {
  revalidatePath("/", "layout");
}
