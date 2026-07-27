// Mảnh khung xương dùng chung cho các file loading.tsx.
//
// Lưu ý bố cục: SiteHeader nằm TRONG từng page (không nằm ở app/layout.tsx), nên khi
// loading.tsx được hiện thì header thật cũng biến mất theo. Vì vậy mọi skeleton phải tự
// dựng lại header — giữ ĐÚNG chiều cao h-16, đúng padding, đúng breakpoint min-[400px]
// của "Bảng giá" (xem 7df5abb: dưới 400px không đủ chỗ cho 4 phần tử) để không tràn ở 320px
// và không nhảy layout khi trang thật thế chỗ. Chữ tĩnh giữ nguyên chữ thật; chỉ ô tài
// khoản (phụ thuộc phiên đăng nhập) mới là khối xám.

export function Skel({ className = "" }: { className?: string }) {
  return <span className={`skel ${className}`} aria-hidden="true" />;
}

export function HeaderSkeleton() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-5xl px-3 sm:px-5 h-16 flex items-center justify-between">
        <span className="flex items-baseline gap-2">
          <span className="text-base sm:text-xl font-extrabold tracking-tight whitespace-nowrap">
            Làm toán <span className="text-accent">AI</span> ✍️
          </span>
        </span>
        <nav className="flex items-center gap-2.5 sm:gap-4 text-sm sm:text-[15px] text-dim">
          <span className="font-medium whitespace-nowrap">Bài học</span>
          <span className="font-medium whitespace-nowrap hidden min-[400px]:inline">Bảng giá</span>
          <Skel className="h-9 w-[92px] shrink-0 rounded-xl" />
        </nav>
      </div>
    </header>
  );
}

// Ngôn ngữ thị giác "đang tải" của LessonFrame: vòng quay + chữ, trên nền bg-paper.
export function SpinnerBlock({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center bg-paper ${className}`}>
      <div className="flex flex-col items-center gap-3 text-dim">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
