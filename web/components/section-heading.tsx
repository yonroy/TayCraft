import type { ReactNode } from "react";

// Tiêu đề section dùng chung — thanh màu nhấn bên trái (đồng bộ với thanh màu khóa của
// accordion lộ trình). Giữ mọi section trên trang chủ cùng một ngôn ngữ thị giác.
export function SectionHeading({
  title,
  bar = "bg-accent",
  right,
  children,
}: {
  title: ReactNode;
  bar?: string; // class nền cho thanh nhấn (mặc định teal thương hiệu)
  right?: ReactNode; // slot phải (vd ViewerCount)
  children?: ReactNode; // phần mô tả dưới tiêu đề
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2.5 text-2xl font-bold">
          <span className={`inline-block h-6 w-1.5 shrink-0 rounded-full ${bar}`} aria-hidden />
          {title}
        </h2>
        {children && <div className="mt-1.5 text-dim">{children}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
