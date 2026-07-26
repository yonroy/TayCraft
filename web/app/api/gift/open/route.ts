import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import {
  getOrCreateGift,
  absorbAnonGifts,
  giftAnonSupported,
  applyGift,
  tierRarityPercent,
  logGiftError,
  isGiftProduct,
  GIFT_DEFAULT_PRODUCT,
  GIFT_VISITOR_COOKIE,
  GIFT_VISITOR_COOKIE_OPTIONS,
  type GiftOwner,
} from "@/lib/gift";
import { productById, effectivePriceVnd, isActiveProduct } from "@/lib/products";

// Mở "hộp quà" — chốt % giảm MỘT lần, áp cho cả 4 gói, idempotent.
//
// ĐỢT 2 (2026-07-26) — HOÃN ĐĂNG NHẬP: route này KHÔNG còn đòi đăng nhập.
// Khách ẩn danh quay được quà và thấy ngay mình giảm bao nhiêu; quà neo vào cookie 'gv'
// (cùng cookie api/gift/seen). Đăng nhập chỉ cần ở bước LẤY THƯỞNG — /api/orders vẫn trả 401,
// đó là chốt chặn cuối và không được gỡ.
//   • Đã đăng nhập  → hấp thụ quà theo cookie vào tài khoản (first-wins: tài khoản đã có quà thì
//                     giữ quà tài khoản), rồi trả quà của tài khoản.
//   • Chưa đăng nhập→ quà theo cookie; chưa có cookie thì cấp mới ngay trong response.
//   • DB chưa áp drizzle/gift-anon.sql (chưa có cột `visitor`) → giftAnonSupported() = false →
//     trả 401 y như TRƯỚC ĐỢT 2, popup hiện form OTP. Đây là đường lùi an toàn, nhờ nó code này
//     deploy được TRƯỚC khi migration được chạy mà không làm sập gì.
//
// Body (tùy chọn): { product?: ProductId } — CHỈ dùng để chọn gói được làm nổi bật trong popup.
// KHÔNG TIN CLIENT: id gói phải nằm trong whitelist GIFT_PRODUCTS (lib/gift.ts) và phải đang mở
// bán; sai → 400. % giảm và danh sách gói được giảm luôn do SERVER quyết, không đọc từ body.
export async function POST(req: NextRequest) {
  // Đọc trước khối try: cần cả ở nhánh lỗi để không cấp cookie trùng.
  const existingVisitor = req.cookies.get(GIFT_VISITOR_COOKIE)?.value ?? null;
  let mintedVisitor: string | null = null;

  // Gắn cookie vừa cấp (nếu có) vào MỌI response thoát khỏi route — nếu không, khách quay quà
  // xong mà không nhận được cookie thì lần sau vào lại sẽ quay ra % khác (mất idempotent).
  const withVisitorCookie = (res: NextResponse) => {
    if (mintedVisitor) res.cookies.set(GIFT_VISITOR_COOKIE, mintedVisitor, GIFT_VISITOR_COOKIE_OPTIONS);
    return res;
  };

  try {
    const user = await getUser();

    const body = (await req.json().catch(() => ({}))) as { product?: unknown };
    const raw = typeof body.product === "string" ? body.product : undefined;
    if (raw !== undefined && !(isGiftProduct(raw) && isActiveProduct(raw))) {
      return NextResponse.json({ error: "Gói không hợp lệ" }, { status: 400 });
    }
    const primary = raw ?? GIFT_DEFAULT_PRODUCT;

    let owner: GiftOwner;
    if (user) {
      // Khách vừa đăng nhập sau khi đã quay quà ẩn danh → kéo quà đó về tài khoản.
      // Best-effort: thất bại cũng không sao, hàm này không quyết định con số nào.
      await absorbAnonGifts(user.id, existingVisitor);
      owner = { kind: "user", userId: user.id };
    } else {
      // Chưa đăng nhập: chỉ đi được nhánh ẩn danh khi DB đã có cột `visitor`.
      if (!(await giftAnonSupported())) {
        return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
      }
      const visitor = existingVisitor ?? crypto.randomUUID();
      if (!existingVisitor) mintedVisitor = visitor;
      owner = { kind: "visitor", visitor };
    }

    const gift = await getOrCreateGift(owner);
    if (gift.status === "login_required") {
      // Chỉ xảy ra nếu cột `visitor` biến mất giữa hai lần dò → vẫn phải lùi về luồng cũ.
      return withVisitorCookie(NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }));
    }
    if (gift.status !== "ok") {
      // "owned" (đã có mọi khóa) / "disabled" (tắt tính năng) / "error" (lỗi hạ tầng, đã log trong
      // gift.ts) → client không hiện quà (hoặc hiện thông báo nhẹ cho "error").
      return withVisitorCookie(NextResponse.json({ status: gift.status }));
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

    return withVisitorCookie(
      NextResponse.json({
        status: "ok",
        percent: gift.percent,
        rarity: tierRarityPercent(gift.percent), // % người trúng đúng mức này (độ hiếm THẬT)
        primary: products.some((p) => p.id === primary) ? primary : (products[0]?.id ?? null),
        products,
        expiresAt: gift.expiresAt.toISOString(),
        expired: gift.expired,
        // Khách ẩn danh: quà đã CHỐT và neo vào cookie, nhưng để nhận thì phải đăng nhập ở bước
        // tạo đơn. Popup dùng cờ này để đổi nhãn CTA ("Đăng nhập để nhận giá này") thay vì đẩy
        // khách sang /checkout rồi mới bắt đăng nhập.
        needLoginToClaim: !user,
      }),
    );
  } catch (err) {
    await logGiftError("api/gift/open", err, "gift_discounts");
    return withVisitorCookie(NextResponse.json({ status: "error" }));
  }
}
