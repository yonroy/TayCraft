"use client";

import { useState } from "react";

// Khung hiển thị phiếu (iframe A4) + skeleton lúc tải. Trước đây iframe nền trắng trơn
// → lúc chờ tải là một khối trắng "trông như hỏng". Overlay quay tròn cho tới khi onLoad.
// Mobile: phiếu A4 bị co nhỏ khó đọc → cho khung cuộn ngang với bề rộng tối thiểu (~46rem)
// để chữ đủ to, kèm gợi ý "vuốt ngang". Từ breakpoint sm trở lên giữ nguyên desktop (w-full).
export function LessonFrame({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative bg-paper">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-paper">
          <div className="flex flex-col items-center gap-3 text-dim">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
            <span className="text-sm">Đang tải phiếu…</span>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          className="block h-[calc(100vh-8rem)] w-full min-w-[46rem] border-0 bg-white sm:min-w-0"
        />
      </div>
      <p className="px-5 pt-2 text-center text-xs text-dim sm:hidden">
        ← Vuốt ngang để xem trọn bề rộng phiếu →
      </p>
    </div>
  );
}
