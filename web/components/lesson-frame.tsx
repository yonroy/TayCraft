"use client";

import { useState } from "react";

// Khung hiển thị phiếu (iframe A4) + skeleton lúc tải. Trước đây iframe nền trắng trơn
// → lúc chờ tải là một khối trắng "trông như hỏng". Overlay quay tròn cho tới khi onLoad.
export function LessonFrame({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative bg-paper">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-paper">
          <div className="flex flex-col items-center gap-3 text-dim">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
            <span className="text-sm">Đang tải phiếu…</span>
          </div>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        className="w-full h-[calc(100vh-8rem)] border-0 bg-white"
      />
    </div>
  );
}
