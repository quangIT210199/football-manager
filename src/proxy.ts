import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/server/supabaseProxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Chỉ chạy ở khu admin và trang đăng nhập; trang công khai không cần session nên giữ nguyên tốc độ.
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
