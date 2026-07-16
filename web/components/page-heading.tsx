import type { ReactNode } from "react";

// Tiêu đề TRANG dùng chung — thanh nhấn teal bên trái giống SectionHeading nhưng ở cấp <h1>.
// Đưa mọi trang trong (/learn, /account, /danh-gia…) về cùng ngôn ngữ thị giác với trang chủ,
// thay cho <h1 className="text-2xl font-bold"> trơn mỗi trang tự chế.
export function PageHeading({
  title,
  bar = "bg-accent",
  right,
  children,
}: {
  title: ReactNode;
  bar?: string; // class nền cho thanh nhấn (mặc định teal thương hiệu)
  right?: ReactNode; // slot phải (vd nút CTA)
  children?: ReactNode; // phần mô tả dưới tiêu đề
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold">
          <span className={`inline-block h-7 w-1.5 shrink-0 rounded-full ${bar}`} aria-hidden />
          {title}
        </h1>
        {children && <div className="mt-1.5 text-dim">{children}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
