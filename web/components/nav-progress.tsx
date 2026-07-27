"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Thanh tiến trình chuyển trang — phản hồi thị giác TỨC THÌ khi bấm link, trước cả khi
// server trả HTML (mọi route đều dynamic `ƒ` nên độ trễ này có thật, nhất là trên 4G).
//
// Vì sao KHÔNG dùng useLinkStatus() (có thật trong next 16.2.9, export từ "next/link"):
// hook đó chỉ đọc được trạng thái pending của ĐÚNG cái <Link> bao quanh nó, nên muốn phủ
// toàn site phải nhét một component con vào MỌI <Link>. Ba cái giá phải trả:
//   1) sửa 15 file gọi Link;
//   2) thêm node con vào các Link đang là flex có gap (logo header `flex gap-2`, thẻ bài)
//      → đẻ thêm một ô gap, lệch layout đúng chỗ vừa sửa tràn mobile ở 7df5abb;
//   3) vẫn bỏ sót router.push() (login-form, qr-checkout, launch-popup, profile-menu),
//      thẻ <a> thường và nút Back của trình duyệt.
// Nghe click ở tầng document (pha capture) không đụng file nào, bắt được mọi lối đi, và
// chạy TRƯỚC listener của React (React gắn ở root container) nên bar hiện sớm nhất có thể.
//
// Bắt đầu: click trái vào <a> nội bộ có pathname KHÁC pathname hiện tại (link #hash hay đổi
// query trên cùng route không phải chờ server → không bật, tránh thanh treo).
// Kết thúc: usePathname() đổi = cây trang mới đã render.

const MAX_MS = 15000; // chốt chặn: điều hướng hỏng cũng không để thanh chạy mãi
const OUT_MS = 420; // thời gian chốt 100% + tan biến

export function NavProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [run, setRun] = useState(0); // đổi key ⇒ remount thanh ⇒ animation chạy lại từ 0
  const barRef = useRef<HTMLDivElement | null>(null);
  const atRef = useRef<string>(pathname);
  const runningRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const finish = useCallback(() => {
    if (!runningRef.current) return;
    runningRef.current = false;
    clearTimers();

    const el = barRef.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Chốt bề rộng đang chạy thành giá trị tĩnh rồi mới cho chạy nốt tới 100% — nếu
    // chỉ đổi class, animation bị gỡ sẽ kéo width về 0 trong 1 frame (giật ngược).
    if (el && !reduce) {
      el.style.width = getComputedStyle(el).width;
      el.style.animation = "none";
      void el.offsetWidth; // ép reflow để trình duyệt nhận mốc mới
      el.style.transition = "width 180ms ease-out, opacity 300ms ease-out 120ms";
      el.style.width = "100%";
      el.style.opacity = "0";
    }

    timersRef.current.push(setTimeout(() => setVisible(false), reduce ? 0 : OUT_MS));
  }, [clearTimers]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    clearTimers();
    setRun((r) => r + 1);
    setVisible(true);
    timersRef.current.push(setTimeout(finish, MAX_MS));
  }, [clearTimers, finish]);

  // ---- bắt click ở tầng document (capture) ----
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Element | null;
      const a = target?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return; // bỏ qua <a> trong SVG
      if (a.hasAttribute("download")) return;

      const tgt = a.getAttribute("target");
      if (tgt && tgt !== "_self") return;

      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(raw, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // chỉ đổi #hash / ?query

      start();
    }

    // Back/Forward của trình duyệt cũng phải chờ server → cũng cần thanh.
    function onPopState() {
      if (window.location.pathname !== atRef.current) start();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [start]);

  // ---- trang mới đã render → tắt thanh ----
  useEffect(() => {
    atRef.current = pathname;
    finish();
  }, [pathname, finish]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!visible) return null;

  return (
    <div className="navprog" role="progressbar" aria-label="Đang mở trang" aria-busy="true">
      <div key={run} ref={barRef} className="navprog-bar" />
    </div>
  );
}
