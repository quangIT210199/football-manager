# Plan — Football Manager (đội Ngọa Long)

Web app quản lý đội bóng Ngọa Long: 2 trang công khai để chia sẻ cho cả đội, 1 khu quản trị chỉ admin (chủ đội) dùng.

## Tính năng dự kiến
- [ ] Danh sách cầu thủ — Phase 3 (admin) + Phase 4 (công khai)
- [ ] Lịch thi đấu — Phase 5 (admin) + Phase 6 (công khai)
- [ ] Bảng điểm / kết quả — Phase 5 + Phase 6

## Quyết định đã chốt

| Hạng mục | Lựa chọn |
|---|---|
| Database, đăng nhập, lưu ảnh | Supabase gói Free (Postgres + Auth + Storage) |
| Đăng nhập | Supabase Auth email + mật khẩu, chỉ 1 tài khoản admin, **tắt đăng ký** |
| Trang công khai | Tổng quan đội `/`, Trận đấu `/matches`, Chi tiết trận `/matches/[matchId]` |
| Trang admin | `/admin/...`, chưa đăng nhập → chuyển về `/login` |
| Thể thức trận | **Sân 7, đá nội bộ**: đội chia làm 2 bên (mặc định "Đội Xanh" và "Đội Đỏ", đổi tên được), mỗi bên 7 đá chính (tổng 14) + dự bị không giới hạn |
| Tỉ số | Admin tự nhập. Chi tiết bàn thắng (ai ghi, ai kiến tạo) nhập thêm nếu muốn; lệch với tỉ số thì chỉ cảnh báo, không chặn |
| Thống kê cầu thủ | Số trận, bàn thắng, kiến tạo, phản lưới, **thắng / hòa / thua của bên mình đứng** — tự tính từ dữ liệu trận, không nhập tay |
| Tông màu | Phong cách Barcelona (blaugrana): xanh lam `#004D98`, đỏ garnet `#A50044`, điểm nhấn vàng `#EDBB00`, nền xanh đêm `#0A1630`. Chỉ lấy màu, không dùng logo / tên CLB |
| Bố cục | **Mẫu A**: nền xanh đêm sọc dọc xanh–đỏ, chữ Anton (tiêu đề, số áo) + Barlow / Barlow Condensed. Mẫu tham chiếu: https://claude.ai/artifact/Y9uU4Tuixy1xpZhyJBuccr |
| Thẻ cầu thủ | Thẻ có ảnh kiểu PES / FIFA: viền vàng, nền màu bên (xanh / đỏ), số áo, vị trí (TM / HV / TV / TĐ), ảnh 3:4, tên. Dùng ở danh sách đội, sơ đồ ra sân, dự bị, form admin. Chưa có ảnh → hình bóng mặc định |
| Sơ đồ ra sân | Máy tính: sân ngang, Xanh trái / Đỏ phải. Điện thoại: sân tự xoay dọc. Đội hình mặc định 2-3-1 |
| Thống kê cũ | Không nhập. Thống kê bắt đầu từ trận đầu tiên nhập vào app |

## Câu hỏi còn mở
- Logo đội (nếu có) để đặt cạnh tên Ngọa Long.

## Ý tưởng để sau (chưa làm)
- Trận gặp đội ngoài: bên B là đối thủ (chỉ có tên, không có đội hình). Mô hình dữ liệu hiện tại thêm được mà không phải làm lại.
- Nút "chia đội tự động" cân bằng theo vị trí.

## Lưu ý gói Free
- **Supabase Free tạm dừng project sau 7 ngày không có truy cập.** Xử lý: Vercel Cron gọi `/api/cron/keep-alive` mỗi ngày (gói Hobby cho phép cron 1 lần/ngày), route này chạy 1 query nhẹ.
- Giới hạn Free: DB 500 MB, Storage 1 GB → ảnh cầu thủ được cắt khung 3:4 và thu nhỏ ở trình duyệt (480×640, WebP, ~50–100 KB) trước khi upload.
- Server Action giới hạn body 1 MB mặc định → ảnh đã nén nằm trong giới hạn này.

## Mô hình dữ liệu

```
players
  id             uuid pk
  full_name      text not null
  shirt_number   smallint unique (null được)
  position       text check in ('GK','DF','MF','FW')
  date_of_birth  date
  photo_path     text            -- đường dẫn trong bucket player-photos
  is_active      boolean default true
  created_at     timestamptz default now()

matches                           -- 1 trận = 1 buổi đá nội bộ, 2 bên
  id           uuid pk
  played_at    timestamptz not null
  venue        text
  status       text check in ('scheduled','finished')
  side_a_name  text default 'Đội Xanh'
  side_b_name  text default 'Đội Đỏ'
  score_a      smallint           -- admin tự nhập, null khi chưa đá
  score_b      smallint
  notes        text

match_lineups                     -- chia đội: ai đá bên nào, chính hay dự bị
  match_id    uuid fk → matches  on delete cascade
  player_id   uuid fk → players
  side        text check in ('A','B')
  is_starter  boolean             -- tối đa 7 đá chính mỗi bên
  pk (match_id, player_id)        -- mỗi người chỉ thuộc 1 bên trong 1 trận

match_goals                       -- chi tiết bàn thắng (không bắt buộc)
  id           uuid pk
  match_id     uuid fk → matches on delete cascade
  scorer_id    uuid fk → players
  assist_id    uuid fk → players (null được)
  is_own_goal  boolean default false
  minute       smallint (null được)
  -- bên được tính bàn suy ra từ match_lineups:
  --   bàn thường → bên của scorer; phản lưới → bên còn lại

view player_stats                 -- appearances, starts, goals, assists, own_goals, wins, draws, losses

admins
  user_id  uuid pk fk → auth.users
```

**Bảo mật (RLS):**
- Mọi bảng và view: ai cũng **đọc** được, để trang công khai hiển thị.
- Thêm / sửa / xoá: chỉ khi `auth.uid()` có trong bảng `admins`.
- Bucket `player-photos`: ai cũng đọc được, chỉ admin được ghi.
- Kiểm tra quyền ở 3 lớp: `proxy.ts` chặn route, layout admin kiểm tra session, RLS trong DB là lớp chặn cuối cùng.

## Cấu trúc code (theo skill project-structure)

```
supabase/migrations/0001_init.sql        # bảng, view, RLS, bucket
src/proxy.ts                             # Next.js 16 (thay middleware.ts): làm mới session, chặn /admin
src/app/
  (public)/layout.tsx                    # header + menu công khai
  (public)/page.tsx                      # Tổng quan đội
  (public)/matches/page.tsx              # Danh sách trận
  (public)/matches/[matchId]/page.tsx    # Đội hình + người ghi bàn
  login/page.tsx + actions.ts
  admin/layout.tsx                       # kiểm tra session lần 2
  admin/players/page.tsx + actions.ts
  admin/matches/page.tsx + actions.ts
  admin/matches/[matchId]/page.tsx       # nhập đội hình, bàn thắng, tỉ số
  api/cron/keep-alive/route.ts
src/lib/server/supabase.ts               # tạo Supabase server client (@supabase/ssr)
src/lib/server/players.ts, matches.ts    # hàm truy vấn
src/types/database.ts                    # sinh bằng `supabase gen types`
```

- Thêm / sửa / xoá dữ liệu qua Server Actions, sau đó gọi `revalidatePath` để trang công khai cập nhật.
- Validate form bằng `zod`.
- Package: `@supabase/supabase-js`, `@supabase/ssr`, `server-only` (đã cài, khóa phiên bản), `zod` (cài ở Phase 2).
- Biến môi trường: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Vercel tự tạo), `CRON_SECRET` (Phase 7).
- Cập nhật skill project-structure: thêm thư mục `supabase/migrations/`.

## Lộ trình

Mỗi phase là một lần commit + deploy, đi theo skill code-review và deploy-workflow.

- [x] **Phase 0 — Chuẩn bị**
  - [x] Chọn mẫu giao diện (A + thẻ ảnh), tên đội, không nhập thống kê cũ.
  - [x] Supabase Free `ngoa-long-db` qua Vercel Marketplace (region iad1, cùng region server Vercel), biến môi trường tự đồng bộ.
  - [x] Tắt đăng ký mới, tạo user admin, thêm vào bảng `admins`.
- [x] **Phase 1 — Nền tảng dữ liệu:** migration SQL, RLS, bucket ảnh, sinh type, Supabase client, `proxy.ts`.
- [ ] **Phase 2 — Đăng nhập admin:** `/login`, đăng xuất, chặn `/admin`.
- [ ] **Phase 3 — Admin cầu thủ:** thêm / sửa / xoá, upload ảnh.
- [ ] **Phase 4 — Trang Tổng quan đội (công khai):** cầu thủ theo vị trí, số buổi đá, tổng bàn, top ghi bàn / kiến tạo / tỉ lệ thắng.
- [ ] **Phase 5 — Admin trận đấu:** tạo trận → chia 2 bên (đá chính tối đa 7/bên + dự bị) → nhập tỉ số → nhập chi tiết bàn thắng (tùy chọn). Cảnh báo khi số bàn chi tiết lệch tỉ số.
- [ ] **Phase 6 — Trang Trận đấu (công khai):** danh sách các buổi đá, trang chi tiết vẽ 2 đội 7 người trên sân, dự bị mỗi bên, người ghi bàn.
- [ ] **Phase 7 — Hoàn thiện:** cron keep-alive, metadata + ảnh xem trước khi chia sẻ link (Zalo / Facebook), kiểm tra giao diện điện thoại.
