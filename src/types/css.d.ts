import "react";

// Cho phép truyền biến CSS (vd "--x") qua prop style mà không cần ép kiểu.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
