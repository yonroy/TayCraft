import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import {
  getOrCreateGift,
  applyGift,
  tierRarityPercent,
  logGiftError,
  isGiftProduct,
  GIFT_DEFAULT_PRODUCT,
} from "@/lib/gift";
import { productById, effectivePriceVnd, isActiveProduct } from "@/lib/products";

// Mở "hộp quà" — chốt % giảm cho user (server roll MỘT lần, áp cho cả 4 gói, idempotent).
// Yêu cầu đăng nhập: client hiện form OTP khi gặp 401 (đằng nào cũng cần đăng nhập để mua &
// giữ quyền). Hoãn đăng nhập là việc của ĐỢT 2 — đợt này không đụng luồng auth.
//
// Body (tùy chọn): { product?: ProductId } — CHỈ dùng để chọn gói được làm nổi bật trong popup.
// KHÔNG TIN CLIENT: id gói phải nằm trong whitelist GIFT_PRODUCTS (lib/gift.ts) và phải đang mở
// bán; sai → 400. % giảm và danh sách gói được giảm luôn do SERVER quyết, không đọc từ body.
//
// Toàn bộ handler bọc try/catch: getOrCreateGift đã tự bắt lỗi DB (trả {status:"error"}), khối
// try/catch ở đây là lớp phòng thủ NGOÀI CÙNG cho các lỗi khác (vd productById/effectivePriceVnd) —
// mục tiêu là route KHÔNG BAO GIỜ trả 500 câm nữa, luôn trả JSON để client hiện thông báo nhẹ nhàng.
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    const body = (await req.json().catch(() => ({}))) as { product?: unknown };
    const raw = typeof body.product === "string" ? body.product : undefined;
    if (raw !== undefined && !(isGiftProduct(raw) && isActiveProduct(raw))) {
      return NextResponse.json({ error: "Gói không hợp lệ" }, { status: 400 });
    }
    const primary = raw ?? GIFT_DEFAULT_PRODUCT;

    const gift = await getOrCreateGift(user.id);
    if (gift.status !== "ok") {
      // "owned" (đã có mọi khóa) / "disabled" (tắt tính năng) / "error" (lỗi hạ tầng, đã log trong
      // gift.ts) → client không hiện quà (hoặc hiện thông báo nhẹ cho "error").
      return NextResponse.json({ status: gift.status });
    }

    // Bảng giá cho ĐÚNG các gói quà này áp được, tính ở SERVER (client không tự nhân %).
    // Gói đã ngừng bán bị loại — không mời khách mua thứ không mua được.
    const products = gift.products
      .filter((id) => isActiveProduct(id))
      .map((id) => {
        const p = productById(id)!;
        const price = applyGift(effectivePriceVnd(p), gift.percent);
        return {
          id,
          label: p.label,
          tagline: p.tagline ?? null,
          highlight: !!p.highlight,
          basePrice: price.base,
          finalPrice: price.final,
        };
      });

    return NextResponse.json({
      status: "ok",
      percent: gift.percent,
      rarity: tierRarityPercent(gift.percent), // % người trúng đúng mức này (độ hiếm THẬT)
      primary: products.some((p) => p.id === primary) ? primary : (products[0]?.id ?? null),
      products,
      expiresAt: gift.expiresAt.toISOString(),
      expired: gift.expired,
    });
  } catch (err) {
    await logGiftError("api/gift/open", err, "gift_discounts");
    return NextResponse.json({ status: "error" });
  }
}
