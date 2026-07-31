"use client";

import { useEffect, useRef, useState } from "react";

// Khung hiển thị phiếu (iframe A4) + skeleton lúc tải. Trước đây iframe nền trắng trơn
// → lúc chờ tải là một khối trắng "trông như hỏng". Overlay quay tròn cho tới khi onLoad.
//
// Mobile: phiếu có bề rộng CỐ ĐỊNH theo mm (dọc 210mm, ngang canvas 297mm) — không tự co giãn
// theo viewport. Trước đây bắt khách vuốt ngang (min-w-[46rem]). Route /api/learn phục vụ CÙNG
// domain nên đọc được contentDocument (same-origin): đo kích thước THẬT của tài liệu sau khi tải
// rồi tự co bằng transform:scale() cho vừa khít bề rộng khung — không viewport nào cần vuốt ngang.
export function LessonFrame({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setFrameWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleLoad() {
    setLoaded(true);
    const doc = iframeRef.current?.contentDocument?.documentElement;
    if (doc) setNatural({ w: doc.scrollWidth, h: doc.scrollHeight });
  }

  const scale = natural && frameWidth ? Math.min(1, frameWidth / natural.w) : 1;
  const marginLeft = natural && scale >= 1 ? Math.max(0, (frameWidth - natural.w) / 2) : 0;

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
      <div ref={frameRef} className="h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden">
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          onLoad={handleLoad}
          className="block border-0 bg-white"
          style={
            natural
              ? {
                  width: natural.w,
                  height: natural.h,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  marginLeft,
                }
              : { width: "100%", height: "100%" }
          }
        />
      </div>
    </div>
  );
}
