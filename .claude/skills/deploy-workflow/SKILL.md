---
name: deploy-workflow
description: Quy trình build, commit, push và xử lý lỗi deploy Vercel cho dự án football-manager — build local trước, commit/push nhánh hiện tại, đọc log qua Vercel MCP khi deploy lỗi, không tự ý đổi cấu hình Vercel. Dùng khi commit, push, deploy hoặc debug lỗi Vercel.
---

# Deploy Workflow

Vercel tự động deploy khi push lên GitHub. Mục tiêu: bắt lỗi ở local, không để Vercel là nơi phát hiện lỗi đầu tiên.

## (a) Kiểm tra & build local

1. Chạy toàn bộ checklist trong skill `code-review`.
2. Build production local:
   ```bash
   npm run build
   ```
3. Build lỗi → đọc lỗi, sửa, quay lại bước 1. **Không commit/push khi build chưa sạch.**

## (b) Commit & push

1. Xác định nhánh hiện tại:
   ```bash
   git branch --show-current
   ```
2. Stage đúng những file liên quan (không dùng `git add .` mù quáng; kiểm tra `git status` trước):
   ```bash
   git add <files>
   ```
3. Commit với message rõ ràng theo Conventional Commits:
   - `feat: thêm trang danh sách cầu thủ`
   - `fix: sửa lỗi hiển thị tỉ số khi trận chưa kết thúc`
   - `refactor:`, `chore:`, `style:`, `docs:`
   - Dòng đầu ≤ 72 ký tự, mô tả *cái gì thay đổi* và *vì sao* nếu cần.
4. Push lên nhánh hiện tại:
   ```bash
   git push origin <nhánh-hiện-tại>
   ```
   - Nhánh chưa có upstream → `git push -u origin <nhánh-hiện-tại>`.
   - **Không** `--force`, không push thẳng sang nhánh khác, không `--no-verify`.

## (c) Vercel báo lỗi sau deploy → tự điều tra bằng Vercel MCP

Dùng các tool của Vercel MCP server (tên `vercel`). Nếu chưa kết nối, nhắc người dùng chạy:
```bash
claude mcp add --transport http vercel https://mcp.vercel.com
```

Các bước:

1. Liệt kê team/project để lấy đúng project của football-manager (không đoán ID).
2. Liệt kê deployments của project → chọn **deployment mới nhất** của nhánh vừa push.
3. Xem trạng thái:
   - `ERROR` ở giai đoạn build → đọc **build logs**.
   - Build `READY` nhưng app lỗi khi chạy (500, trang trắng) → đọc **runtime logs**.
4. Tìm dòng lỗi đầu tiên có ý nghĩa, xác định nguyên nhân. Các nguyên nhân hay gặp:
   - Thiếu biến môi trường trên Vercel (local có trong `.env.local`).
   - Khác biệt hoa/thường tên file (Windows không phân biệt, Linux trên Vercel có).
   - Code server/client dùng sai môi trường (browser API trong Server Component).
   - Phiên bản Node/dependency khác local.
5. Lỗi do code → sửa code → quay lại bước (a).
6. Lỗi do cấu hình Vercel (env vars, Node version, build settings...) → **dừng lại, báo nguyên nhân và đề xuất cho người dùng**, xem mục (d).

Báo cáo ngắn gọn: deployment nào, lỗi gì (trích dòng log chính), nguyên nhân, cách sửa.

## (d) Giới hạn bắt buộc với Vercel

Chỉ được dùng Vercel MCP ở chế độ **đọc** (xem project, deployment, log).

**KHÔNG BAO GIỜ tự ý**, phải hỏi người dùng và chờ đồng ý trước khi:
- Tạo project mới hoặc link repo vào project khác.
- Thêm/đổi/xoá domain.
- Thêm/sửa/xoá environment variables.
- Đổi build settings, framework preset, Node version, region.
- Xoá, promote, rollback hoặc redeploy deployment.
- Bất kỳ thay đổi cấu hình nào khác trên Vercel.
