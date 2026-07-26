import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { orders, paymentWebhookEvents } from "@/lib/db/schema";
import { markOrderPaid } from "@/lib/orders";
import { persistAppError } from "@/lib/log";

export const dynamic = "force-dynamic";

// Payload SePay (https://docs.sepay.vn/tich-hop-webhooks.html) — chỉ lấy field cần.
const payloadSchema = z.object({
  id: z.union([z.number(), z.string()]),
  transferType: z.string().optional(),
  transferAmount: z.number(),
  content: z.string().optional().default(""),
  code: z.string().nullable().optional(),
});

// Ghi 1 dòng vào payment_webhook_events — audit trail MỌI lần webhook gọi tới, kể cả bị SKIP.
// rawPayload lưu payload ĐÃ QUA zod validate (biến `tx` bên dưới), KHÔNG lưu req.json() thô —
// hạn chế rủi ro lưu thừa trường nhạy cảm ngoài ý muốn từ phía SePay (xem drizzle/payment-
// webhook-events.sql).
//
// ⚠️ Bọc try/catch NUỐT LỖI: ghi log TUYỆT ĐỐI không được làm hỏng luồng thanh toán — bài học
// từ sự cố hộp quà (thêm quan sát mà làm sập đường tiền là phản tác dụng). Bảng có thể CHƯA tồn
// tại (migration chạy tay, drizzle/payment-webhook-events.sql) — im lặng bỏ qua, webhook vẫn xử
// lý đơn bình thường như trước khi có bảng này.
async function recordWebhookEvent(input: {
  payload: unknown;
  transferAmount: number;
  matchedTransferCode: string | null;
  matchedOrderId: string | null;
  skipReason: string | null;
}): Promise<void> {
  try {
    await db.insert(paymentWebhookEvents).values({
      rawPayload: input.payload,
      transferAmount: input.transferAmount,
      matchedTransferCode: input.matchedTransferCode,
      matchedOrderId: input.matchedOrderId,
      skipReason: input.skipReason,
    });
  } catch (err) {
    console.warn("[sepay] không ghi được payment_webhook_events (bỏ qua, KHÔNG chặn thanh toán):", err);
  }
}

export async function POST(req: NextRequest) {
  // Log mỗi lần SePay gọi tới — xem trong Vercel → Logs (KHÔNG log API key).
  console.log("[sepay] webhook hit");

  // Xác thực: SePay gửi header "Authorization: Apikey <key>".
  const expected = process.env.SEPAY_WEBHOOK_API_KEY;
  const auth = req.headers.get("authorization") ?? "";
  if (!expected || auth !== `Apikey ${expected}`) {
    console.warn("[sepay] auth fail");
    await persistAppError("sepay", "auth fail", { host: req.headers.get("host") });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    console.warn("[sepay] bad payload", json);
    await persistAppError("sepay", "bad payload", { json });
    return NextResponse.json({ error: "Payload không hợp lệ" }, { status: 400 });
  }
  const tx = parsed.data;

  if (tx.transferType && tx.transferType !== "in") {
    console.log("[sepay] skip: not incoming", tx.transferType);
    return NextResponse.json({ success: true, skipped: "not incoming" });
  }

  // Trích mã đơn TCxxxxxx từ code hoặc content.
  const haystack = `${tx.code ?? ""} ${tx.content}`.toUpperCase();
  const match = haystack.match(/TC[A-Z0-9]{6}/);
  if (!match) {
    console.warn("[sepay] no TC code in", haystack);
    await recordWebhookEvent({
      payload: tx,
      transferAmount: tx.transferAmount,
      matchedTransferCode: null,
      matchedOrderId: null,
      skipReason: "no_transfer_code",
    });
    return NextResponse.json({ success: true, skipped: "no transfer code" });
  }
  const transferCode = match[0];

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.transferCode, transferCode), eq(orders.status, "pending")))
    .limit(1);

  if (!order) {
    console.warn("[sepay] no pending order for", transferCode);
    await recordWebhookEvent({
      payload: tx,
      transferAmount: tx.transferAmount,
      matchedTransferCode: transferCode,
      matchedOrderId: null,
      skipReason: "order_not_found",
    });
    return NextResponse.json({ success: true, skipped: "order not found or already paid" });
  }

  if (tx.transferAmount < order.amountVnd) {
    console.warn("[sepay] amount", tx.transferAmount, "<", order.amountVnd, "order", order.id);
    await recordWebhookEvent({
      payload: tx,
      transferAmount: tx.transferAmount,
      matchedTransferCode: transferCode,
      matchedOrderId: order.id,
      skipReason: "amount_mismatch",
    });
    return NextResponse.json({ success: true, skipped: "amount mismatch" });
  }

  await markOrderPaid(order.id, String(tx.id));
  await recordWebhookEvent({
    payload: tx,
    transferAmount: tx.transferAmount,
    matchedTransferCode: transferCode,
    matchedOrderId: order.id,
    skipReason: null,
  });
  console.log("[sepay] PAID order", order.id, "tx", tx.id, transferCode);
  return NextResponse.json({ success: true });
}
