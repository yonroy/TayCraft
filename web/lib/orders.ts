import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, enrollments } from "@/lib/db/schema";

// Đánh dấu đơn đã trả + cấp quyền (enrollment). Idempotent.
export async function markOrderPaid(orderId: string, sepayTxId?: string): Promise<void> {
  const [order] = await db
    .update(orders)
    .set({ status: "paid", paidAt: new Date(), sepayTxId: sepayTxId ?? null })
    .where(eq(orders.id, orderId))
    .returning();

  if (!order) return;

  // Cấp quyền theo gói của đơn (mặc định all-access). Unique (user, package) → idempotent.
  await db
    .insert(enrollments)
    .values({ userId: order.userId, orderId: order.id, package: order.product })
    .onConflictDoNothing();
}
