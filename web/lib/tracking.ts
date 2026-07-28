// Tín hiệu nguồn traffic (UTM + referrer) — logic THUẦN (không import DB/drizzle) để dùng được
// CẢ ở client (components/utm-capture.tsx) LẪN server (app/api/track/visit/route.ts) mà không
// kéo phụ thuộc server vào bundle client.
//
// Bối cảnh (điều tra 2026-07-28): 34 ngày chạy ads/organic mà KHÔNG có cột UTM/referrer nào
// trong CẢ 9 bảng DB → không biết 11 khách thật (~1 người/3 ngày) từng đến từ đâu. File này +
// api/track/visit/route.ts + drizzle/visits.sql trả lời đúng câu đó cho đợt ads/bài đăng tiếp theo.

export interface UtmParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}

const UTM_MAX_LEN = 200; // chặn query string dài bất thường (spam/bot) trước khi chạm DB

function clip(v: string | null | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t ? t.slice(0, UTM_MAX_LEN) : null;
}

// Đọc utm_* từ query string. Nhận URLSearchParams để dùng được cả window.location.search (client)
// lẫn req.nextUrl.searchParams (server) — cùng một interface.
export function extractUtm(params: URLSearchParams): UtmParams {
  return {
    utmSource: clip(params.get("utm_source")),
    utmMedium: clip(params.get("utm_medium")),
    utmCampaign: clip(params.get("utm_campaign")),
    utmContent: clip(params.get("utm_content")),
    utmTerm: clip(params.get("utm_term")),
  };
}

export function hasUtm(u: UtmParams): boolean {
  return !!(u.utmSource || u.utmMedium || u.utmCampaign || u.utmContent || u.utmTerm);
}

// Referrer NGOÀI site (khác origin) = tín hiệu nguồn thật (Facebook, Google, ...).
// Referrer rỗng (gõ thẳng URL / bookmark) hoặc CÙNG origin (điều hướng nội bộ) → KHÔNG tính,
// tránh ghi rác cho mọi cú click nội bộ.
export function isExternalReferrer(referrer: string, siteOrigin: string): boolean {
  if (!referrer) return false;
  try {
    return new URL(referrer).origin !== siteOrigin;
  } catch {
    return false;
  }
}

export function referrerHost(referrer: string): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname || null;
  } catch {
    return null;
  }
}

// localhost THẬT (gõ tay http://localhost:3000) — dev và production dùng CHUNG một Supabase DB
// (DB local bị ISP chặn cổng, xem CLAUDE.md/AGENTS.md) nên duyệt site bằng localhost lúc code sẽ
// ghi thẳng vào DB thật nếu không chặn. Test bằng LAN IP (vd 192.168.1.7) KHÔNG khớp hàm này —
// đó là cách duy nhất kiểm chứng ghi DB thật trên WSL (WSL không route localhost sang Windows).
export function isLocalhostHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = host.split(":")[0];
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

// ---- Cookie/khoá dùng chung giữa client (utm-capture.tsx) và server (api/track/visit) ----
//
// Danh tính ẩn danh KHÔNG có cookie riêng ở đây — TÁI SỬ DỤNG GIFT_VISITOR_COOKIE ('gv') của
// lib/gift.ts (đọc trực tiếp ở api/track/visit/route.ts). Các khoá dưới đây chỉ là cờ "đã ghi
// trong phiên này", không mang định danh.

// Cookie PHIÊN (server set, không maxAge → mất khi đóng trình duyệt) chặn ghi trùng ở tầng
// server, phòng khi sessionStorage phía client bị bỏ qua (nhiều tab, riêng tư...).
export const TRACK_SESSION_COOKIE = "tc_v";

// sessionStorage phía client — chặn gọi API thừa trong CÙNG 1 tab trước khi cookie kịp set.
export const TRACK_SESSION_STORAGE_KEY = "tc_visit_logged";
// Cờ riêng cho sự kiện Meta Pixel "InitiateCheckout" (xem components/utm-capture.tsx).
export const TRACK_CHECKOUT_STORAGE_KEY = "tc_checkout_fired";

// Meta Pixel gắn `fbq` vào window sau khi components/meta-pixel.tsx tải xong. Khai ở đây (không
// phải meta-pixel.tsx) để utm-capture.tsx cũng dùng được type này mà không phải import chéo.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
