import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getOrCreateGift, discountedAmount, GIFT_PRODUCT } from "@/lib/gift";
import { productById, effectivePriceVnd } from "@/lib/products";

// Mở "hộp quà" — chốt % giảm cho user (server roll, idempotent). Yêu cầu đăng nhập:
// client hiện form OTP khi gặp 401 (đằng nào cũng cần đăng nhập để mua & giữ quyền).
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const gift = await getOrCreateGift(user.id);
  if (gift.status !== "ok") {
    // "owned" (đã có K1) / "disabled" (tắt tính năng) → client không hiện quà.
    return NextResponse.json({ status: gift.status });
  }

  const product = productById(GIFT_PRODUCT)!;
  const basePrice = effectivePriceVnd(product);
  const finalPrice = discountedAmount(basePrice, gift.percent);
  return NextResponse.json({
    status: "ok",
    product: GIFT_PRODUCT,
    percent: gift.percent,
    basePrice,
    finalPrice,
    expiresAt: gift.expiresAt.toISOString(),
    expired: gift.expired,
  });
}
