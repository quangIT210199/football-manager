---
name: clean-code
description: Quy tắc viết code sạch cho dự án football-manager (TypeScript strict, React/Next.js) — độ dài hàm/component, DRY, đặt tên, cấm any, cách comment. Dùng mỗi khi viết mới hoặc sửa code.
---

# Clean Code

## 1. Kích thước

- **Hàm**: tối đa ~40 dòng. Dài hơn → tách thành hàm con có tên rõ nghĩa.
- **Component**: tối đa ~150 dòng (tính cả JSX). Dài hơn → tách sub-component hoặc đưa logic ra custom hook.
- **File**: tối đa ~250 dòng. Dài hơn → tách file.
- **Tham số**: tối đa 3. Nhiều hơn → gom vào một object có type.
- **Độ lồng**: tối đa 3 cấp `if`/vòng lặp. Dùng early return để làm phẳng.

```ts
// Sai
function getScore(match: Match | null) {
  if (match) {
    if (match.isFinished) {
      return `${match.homeGoals} - ${match.awayGoals}`;
    }
  }
  return "-";
}

// Đúng
function getScore(match: Match | null): string {
  if (!match?.isFinished) return "-";
  return `${match.homeGoals} - ${match.awayGoals}`;
}
```

## 2. DRY — không lặp code

- Logic giống nhau xuất hiện lần thứ 2 → tách ra:
  - Hàm thuần → `src/lib/utils/`
  - Logic có state/effect → `src/hooks/`
  - UI lặp lại → `src/components/ui/` hoặc `src/components/<feature>/`
  - Giá trị lặp lại → `src/lib/constants.ts`
- Trước khi viết hàm mới, **tìm xem đã có hàm tương tự chưa** (Grep trong `src/lib`, `src/hooks`, `src/components`).
- Không trừu tượng hoá sớm: đừng tạo abstraction chung cho thứ mới dùng 1 lần.

## 3. Đặt tên

- Tên phải nói rõ **nó là gì / nó làm gì**, không viết tắt khó hiểu (`p`, `tmp`, `data2`).
- Biến/hàm: `camelCase`. Type/component: `PascalCase`. Hằng số: `UPPER_SNAKE_CASE`.
- Hàm bắt đầu bằng động từ: `getPlayers`, `calculatePoints`, `formatMatchDate`.
- Boolean: tiền tố `is` / `has` / `can` / `should` — `isActive`, `hasInjury`.
- Event handler trong component: `handleXxx`; prop callback: `onXxx`.
- Mảng dùng số nhiều: `players`, `matches`.
- Không magic number/string: `if (players.length > MAX_SQUAD_SIZE)` thay vì `> 25`.

## 4. TypeScript strict

- `tsconfig.json` phải bật `"strict": true` (khuyến nghị thêm `"noUncheckedIndexedAccess": true`).
- **Cấm `any`** (kể cả ngầm định). Thay thế:
  - Chưa biết kiểu → `unknown` rồi thu hẹp bằng type guard.
  - Kiểu linh hoạt → generic `<T>`.
  - Dữ liệu từ bên ngoài (API, form, `JSON.parse`) → validate rồi mới gán type.
- Tránh ép kiểu `as` và non-null `!`; chỉ dùng khi chắc chắn và không còn cách khác.
- Khai báo kiểu trả về cho hàm export.
- Dùng `type` cho union/props, `interface` cho object có thể mở rộng — nhất quán trong cùng file.
- Props component luôn có type riêng: `type PlayerCardProps = { ... }`.

```ts
// Sai
function parse(input: any) { return input.name; }

// Đúng
function getName(input: unknown): string | null {
  if (typeof input === "object" && input !== null && "name" in input && typeof input.name === "string") {
    return input.name;
  }
  return null;
}
```

## 5. Comment

- Code phải tự giải thích qua tên; **chỉ comment khi logic thực sự khó hiểu** — giải thích *tại sao*, không mô tả *cái gì*.
- Không comment thừa kiểu `// tăng i lên 1`.
- Không để lại code bị comment-out; đã có git.
- `TODO` phải kèm lý do cụ thể.

## 6. Khác

- Một hàm làm một việc. Tách tính toán (thuần) khỏi side effect (fetch, ghi DB).
- Xử lý lỗi rõ ràng; không nuốt lỗi bằng `catch {}` rỗng.
- Ưu tiên `const`; không dùng `var`.
- Ưu tiên hàm bất biến (`map`, `filter`, spread) thay vì mutate.
- Không để `console.log` debug trong code commit.
