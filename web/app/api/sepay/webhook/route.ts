import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { markOrderPaid } from "@/lib/orders";

export const dynamic = "force-dynamic";

// Payload SePay (https://docs.sepay.vn/tich-hop-webhooks.html) — chỉ lấy field cần.
const payloadSchema = z.object({
  id: z.union([z.number(), z.string()]),
  transferType: z.string().optional(),
  transferAmount: z.number(),
  content: z.string().optional().default(""),
  code: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  // Xác thực: SePay gửi header "Authorization: Apikey <key>".
  const expected = process.env.SEPAY_WEBHOOK_API_KEY;
  const auth = req.headers.get("authorization") ?? "";
  if (!expected || auth !== `Apikey ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload không hợp lệ" }, { status: 400 });
  }
  const tx = parsed.data;

  if (tx.transferType && tx.transferType !== "in") {
    return NextResponse.json({ success: true, skipped: "not incoming" });
  }

  // Trích mã đơn TCxxxxxx từ code hoặc content.
  const haystack = `${tx.code ?? ""} ${tx.content}`.toUpperCase();
  const match = haystack.match(/TC[A-Z0-9]{6}/);
  if (!match) {
    return NextResponse.json({ success: true, skipped: "no transfer code" });
  }
  const transferCode = match[0];

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.transferCode, transferCode), eq(orders.status, "pending")))
    .limit(1);

  if (!order) {
    return NextResponse.json({ success: true, skipped: "order not found or already paid" });
  }

  if (tx.transferAmount < order.amountVnd) {
    return NextResponse.json({ success: true, skipped: "amount mismatch" });
  }

  await markOrderPaid(order.id, String(tx.id));
  return NextResponse.json({ success: true });
}
