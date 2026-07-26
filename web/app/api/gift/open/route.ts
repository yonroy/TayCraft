import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getOrCreateGift, discountedAmount, tierRarityPercent, logGiftError, GIFT_PRODUCT } from "@/lib/gift";
import { productById, effectivePriceVnd } from "@/lib/products";

// Mở "hộp quà" — chốt % giảm cho user (server roll, idempotent). Yêu cầu đăng nhập:
// client hiện form OTP khi gặp 401 (đằng nào cũng cần đăng nhập để mua & giữ quyền).
//
// Toàn bộ handler bọc try/catch: getOrCreateGift đã tự bắt lỗi DB (trả {status:"error"}), khối
// try/catch ở đây là lớp phòng thủ NGOÀI CÙNG cho các lỗi khác (vd productById/effectivePriceVnd) —
// mục tiêu là route KHÔNG BAO GIỜ trả 500 câm nữa, luôn trả JSON để client hiện thông báo nhẹ nhàng.
export async function POST() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    const gift = await getOrCreateGift(user.id);
    if (gift.status !== "ok") {
      // "owned" (đã có K1) / "disabled" (tắt tính năng) / "error" (lỗi hạ tầng, đã log trong gift.ts)
      // → client không hiện quà (hoặc hiện thông báo nhẹ cho "error").
      return NextResponse.json({ status: gift.status });
    }

    const product = productById(GIFT_PRODUCT)!;
    const basePrice = effectivePriceVnd(product);
    const finalPrice = discountedAmount(basePrice, gift.percent);
    return NextResponse.json({
      status: "ok",
      product: GIFT_PRODUCT,
      percent: gift.percent,
      rarity: tierRarityPercent(gift.percent), // % người trúng đúng mức này (độ hiếm THẬT)
      free: gift.free, // trúng 100% → đã cấp Khóa 1 free, client dẫn thẳng vào học
      basePrice,
      finalPrice,
      expiresAt: gift.expiresAt.toISOString(),
      expired: gift.expired,
    });
  } catch (err) {
    logGiftError("api/gift/open", err, "gift_discounts");
    return NextResponse.json({ status: "error" });
  }
}
