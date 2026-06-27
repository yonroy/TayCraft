import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, enrollments } from "@/lib/db/schema";
import { ownsProduct } from "@/lib/auth";
import { PROMO_FREE_LIMIT, promoExpired } from "@/lib/promo";

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

// Số suất K1 free đã phát = enrollment package='k1' KHÔNG gắn đơn (đơn mua thì có orderId).
export async function countFreeK1Claims(): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(enrollments)
    .where(and(eq(enrollments.package, "k1"), isNull(enrollments.orderId)));
  return row?.n ?? 0;
}

export type ClaimResult = "claimed" | "already" | "full" | "expired";

// Nhận K1 free (khai trương). Cap 100 ở mức "đủ tốt": unique (user, package) chặn 1 người nhận 2 lần;
// có thể vượt nhẹ khi nhiều người bấm cùng lúc — chấp nhận được cho đợt khai trương.
export async function claimFreeK1(userId: string): Promise<ClaimResult> {
  if (promoExpired()) return "expired";
  if (await ownsProduct(userId, "k1")) return "already";
  if ((await countFreeK1Claims()) >= PROMO_FREE_LIMIT) return "full";

  const inserted = await db
    .insert(enrollments)
    .values({ userId, package: "k1", orderId: null })
    .onConflictDoNothing()
    .returning({ id: enrollments.id });

  return inserted.length > 0 ? "claimed" : "already";
}
