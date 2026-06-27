import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { claimFreeK1, countFreeK1Claims } from "@/lib/orders";
import { PROMO_FREE_LIMIT } from "@/lib/promo";

export const dynamic = "force-dynamic";

// Nhận trọn gói K1 miễn phí (100 suất khai trương). Yêu cầu đăng nhập.
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const result = await claimFreeK1(user.id);
  const remaining = Math.max(0, PROMO_FREE_LIMIT - (await countFreeK1Claims()));
  return NextResponse.json({ result, remaining });
}
