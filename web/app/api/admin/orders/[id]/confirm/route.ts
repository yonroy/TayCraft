import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { markOrderPaid } from "@/lib/orders";

// Fallback khi chưa nối SePay: admin xác nhận đơn đã chuyển khoản thủ công.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Chỉ duyệt đơn đang pending — tránh hồi sinh đơn đã hủy hoặc ghi đè sepayTxId của đơn đã trả.
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });
  }
  if (order.status !== "pending") {
    return NextResponse.json(
      { error: `Đơn đã ở trạng thái "${order.status}", không thể duyệt lại.` },
      { status: 409 },
    );
  }

  await markOrderPaid(id, "admin-manual");
  return NextResponse.json({ success: true });
}
