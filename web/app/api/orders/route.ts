import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getUser, hasAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { generateTransferCode, vietqrImageUrl, bankInfo } from "@/lib/vietqr";
import { DEFAULT_PRODUCT, productById, isActiveProduct } from "@/lib/products";

function orderResponse(o: { id: string; amountVnd: number; transferCode: string }) {
  return NextResponse.json({
    id: o.id,
    amountVnd: o.amountVnd,
    transferCode: o.transferCode,
    qrUrl: vietqrImageUrl({ amount: o.amountVnd, addInfo: o.transferCode }),
    bank: bankInfo(),
  });
}

// Tạo (hoặc tái dùng) đơn hàng pending cho user hiện tại.
// Body (tùy chọn): { product?: ProductId }. Mặc định all-access (= bundle hiện tại).
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { product?: string };
  const productId = body.product ?? DEFAULT_PRODUCT;
  if (!isActiveProduct(productId)) {
    return NextResponse.json({ error: "Gói chưa mở bán" }, { status: 400 });
  }
  const product = productById(productId)!;

  // All-access bao trùm mọi khóa → đã có quyền thì khỏi mua lại.
  if (await hasAccess(user.id)) {
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

  // Tạo mới, retry nếu trùng transferCode.
  for (let attempt = 0; attempt < 5; attempt++) {
    const transferCode = generateTransferCode();
    try {
      const [created] = await db
        .insert(orders)
        .values({ userId: user.id, product: productId, amountVnd: product.priceVnd, transferCode })
        .returning();
      return orderResponse(created);
    } catch {
      // unique conflict → thử mã khác
    }
  }

  return NextResponse.json({ error: "Không tạo được đơn, thử lại sau" }, { status: 500 });
}
