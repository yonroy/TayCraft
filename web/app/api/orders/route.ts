import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getUser, ownsProduct } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { generateTransferCode, vietqrImageUrl, bankInfo, paymentContent } from "@/lib/vietqr";
import { DEFAULT_PRODUCT, productById, isActiveProduct, effectivePriceVnd } from "@/lib/products";
import {
  absorbAnonGifts,
  effectiveGiftPercent,
  discountedAmount,
  logGiftError,
  GIFT_VISITOR_COOKIE,
} from "@/lib/gift";

function orderResponse(o: { id: string; amountVnd: number; transferCode: string }) {
  const content = paymentContent(o.transferCode); // vd "SEVQR TCABC123" cho VietinBank
  return NextResponse.json({
    id: o.id,
    amountVnd: o.amountVnd,
    transferCode: o.transferCode,
    transferContent: content,
    qrUrl: vietqrImageUrl({ amount: o.amountVnd, addInfo: content }),
    bank: bankInfo(),
  });
}

// Tạo (hoặc tái dùng) đơn hàng pending cho user hiện tại.
// Body (tùy chọn): { product?: ProductId }. Mặc định all-access (= bundle hiện tại).
export async function POST(req: NextRequest) {
  // CHỐT CHẶN CUỐI — KHÔNG ĐƯỢC GỠ. ĐỢT 2 chỉ hoãn đăng nhập ở bước XEM quà (api/gift/open);
  // tới bước LẤY THƯỞNG (tạo đơn) thì vẫn phải có tài khoản, vì quyền học gắn theo user_id.
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { product?: string };
  const productId = body.product ?? DEFAULT_PRODUCT;
  if (!isActiveProduct(productId)) {
    return NextResponse.json({ error: "Gói chưa mở bán" }, { status: 400 });
  }
  const product = productById(productId)!;

  // Đã sở hữu đủ mọi khóa của gói này → khỏi mua lại (vẫn cho nâng cấp lên gói cao hơn).
  if (await ownsProduct(user.id, productId)) {
    return NextResponse.json({ alreadyOwned: true });
  }

  // Tái dùng đơn pending cùng gói để tránh tạo trùng.
  const existing = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.userId, user.id),
        eq(orders.status, "pending"),
        eq(orders.product, productId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return orderResponse(existing[0]);
  }

  // Áp "hộp quà" nếu có quà còn hạn cho gói này (server quyết định — không tin client).
  // Mức giảm THẬT: ghi thẳng amount đã trừ % vào đơn; webhook chỉ chấp nhận khi nhận ≥ amount này.
  // effectiveGiftPercent đã clamp về trần hiện hành (80%) → dòng percent=100 di sản KHÔNG ra 0đ.
  //
  // ĐỢT 2: khách có thể đã quay quà TRƯỚC khi đăng nhập → quà nằm ở cookie 'gv'. Kéo về tài khoản
  // trước (first-wins: tài khoản đã có quà thì giữ quà tài khoản, quà cookie bị bỏ).
  // absorb là best-effort; số tiền KHÔNG phụ thuộc nó thành công — effectiveGiftPercent đọc được
  // quà theo cookie kể cả khi absorb lỗi, nên số tiền đơn LUÔN khớp giá /checkout đã hiện.
  const visitor = req.cookies.get(GIFT_VISITOR_COOKIE)?.value ?? null;
  await absorbAnonGifts(user.id, visitor);

  const base = effectivePriceVnd(product);
  const giftPercent = await effectiveGiftPercent(user.id, visitor, productId);
  const amountVnd = giftPercent ? discountedAmount(base, giftPercent) : base;

  // Chốt an toàn: bậc FREE 100% đã BỎ (2026-07-26) nên không còn đường nào ra 0đ. Nếu vẫn xảy ra
  // thì đó là lỗi cấu hình giá/bậc % — thà từ chối tạo đơn và log ra để sửa, còn hơn âm thầm cấp
  // khóa miễn phí (nhánh grantGiftFreeK1 cũ) hoặc dựng QR 0đ mà ngân hàng không nhận.
  if (amountVnd <= 0) {
    await logGiftError(
      "api/orders/zero-amount",
      new Error(`Đơn 0đ bị chặn: product=${productId} base=${base} giftPercent=${giftPercent}`),
      "gift_discounts",
    );
    return NextResponse.json({ error: "Giá gói đang có vấn đề, thử lại sau" }, { status: 500 });
  }

  // Tạo mới, retry nếu trùng transferCode.
  for (let attempt = 0; attempt < 5; attempt++) {
    const transferCode = generateTransferCode();
    try {
      const [created] = await db
        .insert(orders)
        .values({ userId: user.id, product: productId, amountVnd, transferCode })
        .returning();
      return orderResponse(created);
    } catch {
      // unique conflict → thử mã khác
    }
  }

  return NextResponse.json({ error: "Không tạo được đơn, thử lại sau" }, { status: 500 });
}
