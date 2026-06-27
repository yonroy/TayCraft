import { NextResponse } from "next/server";
import { countFreeK1Claims } from "@/lib/orders";
import { PROMO_FREE_LIMIT, PROMO_DEADLINE, promoExpired } from "@/lib/promo";

export const dynamic = "force-dynamic";

// Trạng thái KM cho popup khai trương: số suất free còn lại + hạn chót.
export async function GET() {
  const claimed = await countFreeK1Claims();
  const remaining = Math.max(0, PROMO_FREE_LIMIT - claimed);
  return NextResponse.json({
    limit: PROMO_FREE_LIMIT,
    remaining,
    full: remaining <= 0,
    expired: promoExpired(),
    deadline: PROMO_DEADLINE.toISOString(),
  });
}
