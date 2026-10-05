---
name: project-structure
description: Quy định cấu trúc thư mục Next.js App Router và quy ước đặt tên file/thư mục cho dự án football-manager. Dùng khi tạo mới, di chuyển hoặc đổi tên file; thêm route, API, component, hook, util hoặc type.
---

# Project Structure (Next.js App Router)

## Cây thư mục chuẩn

```
football-manager/
├── public/                      # Asset tĩnh (ảnh, icon, favicon)
├── supabase/
│   ├── config.toml              # Cấu hình Supabase CLI
│   └── migrations/              # SQL migration (bảng, view, RLS, storage) — xem mục Database
├── src/
│   ├── proxy.ts                 # Next.js 16 (thay middleware.ts): làm mới session, chặn /admin
│   ├── app/                     # CHỈ chứa routing (App Router)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Trang chủ "/"
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── (dashboard)/         # Route group: nhóm route, không ảnh hưởng URL
│   │   │   └── players/
│   │   │       ├── page.tsx     # "/players"
│   │   │       ├── loading.tsx
│   │   │       ├── error.tsx
│   │   │       ├── actions.ts   # Server Actions riêng của route
│   │   │       ├── _components/ # Component CHỈ dùng trong route này
│   │   │       └── [playerId]/
│   │   │           └── page.tsx # "/players/:playerId"
│   │   └── api/                 # Route Handlers
│   │       └── players/
│   │           ├── route.ts     # GET/POST /api/players
│   │           └── [playerId]/
│   │               └── route.ts # GET/PATCH/DELETE /api/players/:playerId
│   ├── components/
│   │   ├── ui/                  # Primitive dùng chung, không chứa nghiệp vụ (Button, Input, Modal)
│   │   ├── layout/              # Header, Sidebar, Footer
│   │   └── <feature>/           # Component nghiệp vụ dùng ở ≥ 2 route (vd: players/PlayerCard.tsx)
│   ├── hooks/                   # Custom hook dùng chung (client)
│   ├── lib/                     # Util, constants, API client, helper thuần
│   │   ├── utils/
│   │   ├── constants.ts
│   │   └── server/              # Code CHỈ chạy trên server (DB, secret) — import "server-only"
│   │       ├── supabase.ts      # createSupabaseServerClient() cho Server Component / Action
│   │       ├── supabaseProxy.ts # updateSession() — chỉ proxy.ts dùng
│   │       └── supabaseEnv.ts   # đọc + kiểm tra biến môi trường Supabase
│   └── types/                   # Type/interface dùng chung giữa nhiều nơi
│       └── database.ts          # SINH TỰ ĐỘNG từ DB — không sửa tay
├── .env.local                   # Không commit (lấy bằng `vercel env pull .env.local --yes`)
├── .env.example                 # Tên biến môi trường cần có (không chứa giá trị)
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Bảng tra nhanh: "Đặt file ở đâu?"

| Loại code | Vị trí |
|---|---|
| Trang (UI route) | `src/app/<route>/page.tsx` |
| API endpoint | `src/app/api/<resource>/route.ts` |
| Server Action | `src/app/<route>/actions.ts` (riêng route) hoặc `src/lib/server/<domain>Actions.ts` (dùng chung) |
| Hàm truy vấn DB dùng chung | `src/lib/server/<domain>.ts` (vd: `players.ts`, `matches.ts`) |
| Thay đổi cấu trúc DB | `supabase/migrations/<timestamp>_<tên>.sql` (tạo bằng CLI, xem mục Database) |
| Component chỉ 1 route dùng | `src/app/<route>/_components/` |
| Component dùng ≥ 2 route | `src/components/<feature>/` |
| UI primitive không nghiệp vụ | `src/components/ui/` |
| Custom hook | `src/hooks/` (hoặc `_components/` nếu chỉ 1 route dùng) |
| Hàm tiện ích thuần | `src/lib/utils/` |
| Hằng số | `src/lib/constants.ts` |
| Truy cập DB / secret | `src/lib/server/` |
| Type dùng chung | `src/types/` |
| Type chỉ dùng trong 1 file | Khai báo ngay trong file đó |

Nguyên tắc: **bắt đầu cục bộ (colocate), chỉ đưa ra thư mục chung khi có nơi thứ hai dùng.**

## Quy ước đặt tên

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| Thư mục (route, feature) | `kebab-case` | `match-schedule/` |
| Dynamic segment | `[camelCase]` | `[playerId]/` |
| Route group | `(kebab-case)` | `(dashboard)/` |
| Thư mục private | `_kebab-case` | `_components/` |
| File component | `PascalCase.tsx` | `PlayerCard.tsx` |
| File hook | `useCamelCase.ts` | `usePlayers.ts` |
| File util | `camelCase.ts` | `formatDate.ts` |
| File type | `kebab-case.ts` | `types/player.ts` |
| Type / interface | `PascalCase` | `Player`, `MatchResult` |
| Hằng số | `UPPER_SNAKE_CASE` | `MAX_SQUAD_SIZE` |
| File đặc biệt Next.js | Giữ tên chuẩn | `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx` |

- Một file component export **một** component chính, tên trùng tên file.
- Ưu tiên named export; chỉ dùng default export cho file đặc biệt của Next.js (`page`, `layout`...).
- Không tạo file `index.ts` barrel trừ `components/ui/`.

## Import

- Luôn dùng alias `@/*` → `src/*` (cấu hình trong `tsconfig.json`). Ví dụ: `import { Button } from "@/components/ui/Button"`.
- Không dùng đường dẫn tương đối vượt quá 1 cấp (`../../`).
- Code trong `src/lib/server/` không bao giờ được import từ Client Component.

## Server vs Client Component

- Mặc định là **Server Component**.
- Chỉ thêm `"use client"` khi cần: `useState`, `useEffect`, event handler, browser API.
- Đẩy `"use client"` xuống component lá nhỏ nhất có thể; không đặt ở `page.tsx`/`layout.tsx`.
- Fetch dữ liệu ở Server Component hoặc Server Action; không gọi `/api` của chính mình từ Server Component.

## Database (Supabase)

Thông tin cố định:
- Project Supabase `ngoa-long-db` (ref `peezmuuajpftippyurmi`, region iad1, gói Free), gắn vào Vercel qua Marketplace.
- Kết nối CLI: biến `POSTGRES_URL_NON_POOLING` trong `.env.local` (session pooler, IPv4). Không in giá trị ra màn hình.
- Quyền: mọi bảng bật RLS; ai cũng đọc, chỉ user trong bảng `public.admins` được ghi (hàm `public.is_admin()`).
- Từ 2026 bảng mới **không tự mở cho Data API** → migration phải có `GRANT` cho `anon` / `authenticated`, kèm RLS.
- View phải tạo `with (security_invoker = true)`. Không dùng `SECURITY DEFINER` để "chữa" lỗi quyền.

Quy trình đổi cấu trúc DB (PowerShell):
```powershell
npx supabase migration new <ten_thay_doi>            # tạo file trong supabase/migrations/, rồi viết SQL vào đó
$db = ((Get-Content .env.local | ? { $_ -like 'POSTGRES_URL_NON_POOLING=*' }) -split '=', 2)[1].Trim('"')
npx supabase db push --db-url $db --dry-run          # xem trước
npx supabase db push --db-url $db --yes              # áp dụng
npx supabase gen types --lang typescript --db-url $db --schema public > src/types/database.ts
```
- Không sửa migration đã push; muốn đổi thì tạo migration mới.
- `npx supabase db query --db-url $db --file <file.sql>` chỉ chạy **1 câu lệnh** mỗi lần.
- Dữ liệu cá nhân (email admin...) không ghi vào migration vì repo GitHub là public.

Client Supabase:
- Server Component / Server Action: `await createSupabaseServerClient()` từ `@/lib/server/supabase`.
- Kiểm tra đăng nhập ở server: `supabase.auth.getClaims()`; **không** dùng `getSession()`.
- `proxy.ts` chỉ chạy ở `/admin/*` và `/login`; trang công khai không đi qua proxy.
- Key dùng trong app: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Không bao giờ dùng secret / service_role key trong code app.
