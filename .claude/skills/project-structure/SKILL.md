---
name: project-structure
description: Quy định cấu trúc thư mục Next.js App Router và quy ước đặt tên file/thư mục cho dự án football-manager. Dùng khi tạo mới, di chuyển hoặc đổi tên file; thêm route, API, component, hook, util hoặc type.
---

# Project Structure (Next.js App Router)

## Cây thư mục chuẩn

```
football-manager/
├── public/                      # Asset tĩnh (ảnh, icon, favicon)
├── src/
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
│   └── types/                   # Type/interface dùng chung giữa nhiều nơi
├── .env.local                   # Không commit
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Bảng tra nhanh: "Đặt file ở đâu?"

| Loại code | Vị trí |
|---|---|
| Trang (UI route) | `src/app/<route>/page.tsx` |
| API endpoint | `src/app/api/<resource>/route.ts` |
| Server Action | `src/app/<route>/actions.ts` (riêng route) hoặc `src/lib/server/<domain>-actions.ts` (dùng chung) |
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
