import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { giftImpressions } from "@/lib/db/schema";
import { logGiftError, GIFT_VISITOR_COOKIE, GIFT_VISITOR_COOKIE_OPTIONS } from "@/lib/gift";

// Ghi 1 lượt "đã THẤY hộp quà" cho mỗi trình duyệt (cookie 'gv' chống trùng) — KHÔNG cần đăng nhập.
// Trình duyệt đã có cookie → bỏ qua (không ghi thêm) → mỗi máy chỉ đếm 1 lần.
// Dùng để /admin tính "số người không nhận" = số người thấy − số người nhận.
//
// ĐỢT 2: cookie 'gv' KHÔNG còn chỉ để đếm — nó là NEO SỞ HỮU của quà ẩn danh (gift_discounts
// .visitor). Vì vậy tên cookie + tuỳ chọn lấy từ lib/gift.ts để route này và /api/gift/open
// không thể đặt lệch nhau (lệch = khách quay quà xong mất quà).
export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  if (req.cookies.get(GIFT_VISITOR_COOKIE)?.value) return res; // đã đếm trình duyệt này rồi

  const visitor = crypto.randomUUID();
  res.cookies.set(GIFT_VISITOR_COOKIE, visitor, GIFT_VISITOR_COOKIE_OPTIONS);
  try {
    await db.insert(giftImpressions).values({ visitor }).onConflictDoNothing();
  } catch (err) {
    // Bảng chưa áp migration / lỗi DB → không chặn khách, chỉ bỏ qua việc đếm.
    await logGiftError("api/gift/seen", err, "gift_impressions");
  }
  return res;
}
