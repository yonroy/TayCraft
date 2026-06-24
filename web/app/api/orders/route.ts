import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getUser, hasAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { generateTransferCode, vietqrImageUrl, bankInfo } from "@/lib/vietqr";

const PRICE = Number(process.env.COURSE_PRICE_VND ?? 199000);

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
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  if (await hasAccess(user.id)) {
    return NextResponse.json({ alreadyOwned: true });
  }

  // Tái dùng đơn pending gần nhất để tránh tạo trùng.
  const existing = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.status, "pending")))
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
        .values({ userId: user.id, amountVnd: PRICE, transferCode })
        .returning();
      return orderResponse(created);
    } catch {
      // unique conflict → thử mã khác
    }
  }

  return NextResponse.json({ error: "Không tạo được đơn, thử lại sau" }, { status: 500 });
}
