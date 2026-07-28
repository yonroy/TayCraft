"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  extractUtm,
  hasUtm,
  isExternalReferrer,
  TRACK_SESSION_STORAGE_KEY,
  TRACK_CHECKOUT_STORAGE_KEY,
} from "@/lib/tracking";

// Mount 1 lần trong app/layout.tsx (toàn site). Làm 2 việc, cả hai đều KHÔNG cần chạm
// app/page.tsx hay app/checkout/page.tsx (agent khác đang giữ 2 file đó):
//
//  1. Ghi 1 dòng "traffic thật" vào bảng `visits` (qua /api/track/visit) — CHỈ khi có tín hiệu
//     nguồn thật (utm_* hoặc referrer NGOÀI site) và CHỈ 1 lần / phiên trình duyệt. Không ghi
//     mọi lượt xem trang: sẽ đầy rác bảng + tốn quota Supabase cho những lượt gõ thẳng URL /
//     điều hướng nội bộ (server route cũng tự kiểm tra lại tín hiệu, không tin riêng client).
//  2. Bắn sự kiện Meta Pixel "InitiateCheckout" khi khách CHẠM /checkout — nghe pathname đổi vì
//     component này có mặt ở MỌI trang (kể cả điều hướng client-side từ trang chủ hay từ hộp
//     quà), nên bắt được checkout dù khách vào từ lối nào.
export function UtmCapture() {
  const pathname = usePathname();
  const checkoutFired = useRef(false);

  // ---- (1) Ghi lượt "traffic thật" — chỉ chạy 1 lần lúc site được mở (không phụ thuộc pathname:
  // đây là landing của cả PHIÊN, không phải của từng trang). ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(TRACK_SESSION_STORAGE_KEY)) return;

    const utm = extractUtm(new URLSearchParams(window.location.search));
    const referrer = document.referrer || "";
    const hasSignal = hasUtm(utm) || isExternalReferrer(referrer, window.location.origin);
    if (!hasSignal) return;

    // Đặt cờ TRƯỚC KHI fetch xong — chặn gửi trùng nếu effect chạy lại (StrictMode ở dev).
    sessionStorage.setItem(TRACK_SESSION_STORAGE_KEY, "1");

    fetch("/api/track/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ...utm,
        referrer: referrer || null,
        landingPath: window.location.pathname,
      }),
    }).catch(() => {
      // Best-effort: mất 1 dòng đo lường không được phép ảnh hưởng trải nghiệm khách.
    });
    // Cố ý: chỉ chạy 1 lần lúc mount (landing của cả phiên, không phải của từng trang).
  }, []);

  // ---- (2) InitiateCheckout khi pathname vào /checkout ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname?.startsWith("/checkout")) return;
    if (checkoutFired.current || sessionStorage.getItem(TRACK_CHECKOUT_STORAGE_KEY)) return;
    checkoutFired.current = true;
    sessionStorage.setItem(TRACK_CHECKOUT_STORAGE_KEY, "1");
    window.fbq?.("track", "InitiateCheckout");
  }, [pathname]);

  return null;
}
