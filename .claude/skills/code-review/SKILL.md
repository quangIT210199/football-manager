---
name: code-review
description: Checklist tự kiểm tra code TRƯỚC KHI commit cho dự án football-manager — console.log thừa, tsc --noEmit, lint, import thừa, tuân thủ project-structure và clean-code. Không bao gồm test. Dùng trước mọi lần commit.
---

# Code Review — Checklist trước khi commit

Chạy lần lượt từng bước. Bước nào fail → sửa → **chạy lại từ đầu**. Chỉ commit khi tất cả đều pass.

> Dự án KHÔNG dùng test. Không viết, không chạy, không đề xuất test.

## Bước 1 — Rà lại thay đổi

```bash
git status
git diff
```

- Chỉ những file liên quan đến task mới được thay đổi.
- Không có file rác (file tạm, log, build output).
- Không có secret hoặc `.env*` (trừ `.env.example`).

## Bước 2 — Không còn code debug

Tìm trong `src/`:

- `console.log`, `console.debug` → xoá (chỉ giữ `console.error`/`console.warn` khi thực sự cần xử lý lỗi).
- `debugger` → xoá.
- Code bị comment-out → xoá.

## Bước 3 — Type check

```bash
npm run typecheck
```

Script này chạy `next typegen && tsc --noEmit`. Phải có `next typegen` vì các type toàn cục như `PageProps`, `LayoutProps` được Next.js sinh vào `.next/types`; chạy `tsc --noEmit` trần trên bản clone mới sẽ báo lỗi giả.

Yêu cầu: **0 lỗi**. Không sửa bằng cách thêm `any`, `@ts-ignore` hay `as` bừa.

## Bước 4 — Lint

```bash
npm run lint
```

- Next.js 16 đã bỏ `next lint`; script `lint` trong `package.json` chạy `eslint` với cấu hình `eslint.config.mjs` (tương đương `next lint` trước đây).
- Yêu cầu: **0 lỗi**. Warning cũng phải xử lý nếu thuộc file vừa sửa.

## Bước 5 — Import thừa / biến không dùng

- Lint ở bước 4 phải bắt được (`no-unused-vars`); kiểm tra thêm bằng mắt các file đã sửa.
- Xoá import không dùng, biến/hàm/type không dùng.

## Bước 6 — Tuân thủ project-structure

- File nằm đúng vị trí theo bảng tra trong skill `project-structure`.
- Tên file/thư mục đúng quy ước (kebab-case thư mục, PascalCase component, `useXxx` hook...).
- Import dùng alias `@/`.
- `"use client"` chỉ đặt ở nơi thật sự cần.
- Không import `src/lib/server/` từ Client Component.

## Bước 7 — Tuân thủ clean-code

- [ ] Không hàm > ~40 dòng, không component > ~150 dòng.
- [ ] Không lặp code — đã tái sử dụng util/hook/component sẵn có.
- [ ] Tên biến/hàm rõ nghĩa, boolean có `is/has/can`.
- [ ] Không `any`, hạn chế `as` và `!`.
- [ ] Không magic number/string.
- [ ] Comment chỉ ở chỗ logic khó hiểu.

## Kết quả

Báo cáo ngắn gọn: các bước đã chạy + pass/fail. Nếu tất cả pass → sẵn sàng commit (xem skill `deploy-workflow`).
