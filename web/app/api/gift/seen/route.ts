import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { giftImpressions } from "@/lib/db/schema";
import { logGiftError } from "@/lib/gift";

// Ghi 1 lượt "đã THẤY hộp quà" cho mỗi trình duyệt (cookie 'gv' chống trùng) — KHÔNG cần đăng nhập.
// Trình duyệt đã có cookie → bỏ qua (không ghi thêm) → mỗi máy chỉ đếm 1 lần.
// Dùng để /admin tính "số người không nhận" = số người thấy − số người nhận.
export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  if (req.cookies.get("gv")?.value) return res; // đã đếm trình duyệt này rồi

  const visitor = crypto.randomUUID();
  res.cookies.set("gv", visitor, {
    maxAge: 60 * 60 * 24 * 365, // 1 năm
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  try {
    await db.insert(giftImpressions).values({ visitor }).onConflictDoNothing();
  } catch (err) {
    // Bảng chưa áp migration / lỗi DB → không chặn khách, chỉ bỏ qua việc đếm.
    logGiftError("api/gift/seen", err, "gift_impressions");
  }
  return res;
}
