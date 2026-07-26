// Cấu hình + logic "hộp quà giảm giá" (một nơi duy nhất, kiểu promo.ts).
// Mục tiêu: mức giảm THẬT + chống gian lận. % do SERVER roll, lưu DB gắn theo user,
// idempotent theo (user, gói) → khách không tự chế % để trả rẻ hơn. Khi tạo đơn, amount đã
// trừ % được ghi vào orders.amount_vnd (webhook SePay ép transferAmount ≥ order.amount_vnd).
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { giftDiscounts, enrollments, type GiftDiscount } from "@/lib/db/schema";
import { ownsProduct } from "@/lib/auth";
import type { ProductId } from "@/lib/products";

// ---- Cấu hình (dễ chỉnh; quyết định kinh doanh) ----
export const GIFT_ENABLED = (process.env.GIFT_ENABLED ?? "true") !== "false";
export const GIFT_PRODUCT: ProductId = "k1"; // gói được giảm
export const GIFT_TTL_HOURS = Number(process.env.GIFT_TTL_HOURS ?? 24); // hạn dùng quà (tạo urgency thật)
export const FREE_PERCENT = 100; // mốc "trúng free" — quà 100% = tặng thẳng, không thu tiền

// Bậc % + TRỌNG SỐ (quyết định kinh doanh). Tổng weight = 100 → đọc thẳng ra %.
// Bộ "hào phóng": giảm 30–70%, ~8% khách trúng FREE (100%).
// Export để /admin so PHÂN BỐ THỰC TẾ với trọng số lý thuyết (lệch mạnh về FREE = dấu hiệu farm
// đa tài khoản) — đọc từ ĐÚNG một nguồn này, không chép lại số ở lib/admin-stats.ts (tránh lệch).
export const GIFT_TIERS: { percent: number; weight: number }[] = [
  { percent: 30, weight: 45 },
  { percent: 50, weight: 30 },
  { percent: 70, weight: 17 },
  { percent: FREE_PERCENT, weight: 8 }, // JACKPOT: tặng free Khóa 1
];

// Chọn ngẫu nhiên 1 bậc % theo trọng số (server-side).
export function rollGiftPercent(): number {
  const total = GIFT_TIERS.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of GIFT_TIERS) {
    if ((r -= t.weight) < 0) return t.percent;
  }
  return GIFT_TIERS[0].percent;
}

export function isFreeGift(percent: number): boolean {
  return percent >= FREE_PERCENT;
}

// Tỷ lệ (%) người mở quà trúng ĐÚNG mức này — để hiện "độ hiếm" THẬT (không bịa số).
export function tierRarityPercent(percent: number): number {
  const total = GIFT_TIERS.reduce((s, t) => s + t.weight, 0);
  const tier = GIFT_TIERS.find((t) => t.percent === percent);
  return tier && total > 0 ? Math.round((tier.weight / total) * 100) : 0;
}

// Cấp thẳng Khóa 1 free khi trúng 100% (enrollment không gắn đơn — như suất tặng khai trương).
// Idempotent: unique (user, package) chặn nhận 2 lần.
export async function grantGiftFreeK1(userId: string): Promise<void> {
  await db
    .insert(enrollments)
    .values({ userId, package: GIFT_PRODUCT, orderId: null })
    .onConflictDoNothing();
}

// Giá sau giảm — làm tròn XUỐNG nghìn cho đẹp & có lợi cho khách. Không bao giờ âm.
export function discountedAmount(base: number, percent: number): number {
  const raw = (base * (100 - percent)) / 100;
  return Math.max(0, Math.floor(raw / 1000) * 1000);
}

function isActive(g: GiftDiscount, now = Date.now()): boolean {
  return g.expiresAt.getTime() > now;
}

// Lấy quà hiện có (nếu có), bất kể còn hạn hay không.
async function findGift(userId: string): Promise<GiftDiscount | null> {
  const [row] = await db
    .select()
    .from(giftDiscounts)
    .where(and(eq(giftDiscounts.userId, userId), eq(giftDiscounts.product, GIFT_PRODUCT)))
    .limit(1);
  return row ?? null;
}

export type GiftState =
  | { status: "disabled" }
  | { status: "owned" } // đã sở hữu K1 → khỏi tặng
  | { status: "error" } // lỗi hạ tầng (bảng chưa tồn tại / DB lỗi) — KHÔNG phải trạng thái nghiệp vụ
  | { status: "ok"; percent: number; expiresAt: Date; expired: boolean; free: boolean };

// ---- Chẩn đoán lỗi hạ tầng (KHÔNG đổi hành vi/xác suất — chỉ để LOG rõ & fail an toàn) ----
// Postgres báo "relation ... does not exist" (code 42P01) khi bảng chưa chạy migration
// (drizzle/gift-discounts.sql, drizzle/gift-impressions.sql là file SQL chạy TAY trong Supabase
// SQL Editor — không nằm trong lịch sử drizzle-kit nên không có cách nào khác để biết đã áp chưa).
// Tách riêng lỗi này khỏi lỗi DB chung để log ra Vercel Logs một dòng thật dễ tìm.
export function isMissingTableError(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  const msg = err instanceof Error ? err.message : String(err);
  return code === "42P01" || /relation .* does not exist/i.test(msg);
}

// Log có cấu trúc, prefix "[gift]" để tra Vercel Logs được (giống "[sepay]" ở webhook).
// table: tên bảng liên quan (để dòng TABLE MISSING nêu đích danh bảng cần chạy migration).
export function logGiftError(context: string, err: unknown, table: string): void {
  if (isMissingTableError(err)) {
    // Dòng riêng, dễ nhận — đây là lỗi hạ tầng (thiếu migration), KHÔNG phải bug logic.
    console.error(`[gift] TABLE MISSING: "${table}" chưa tồn tại (context=${context}). Chạy drizzle/${table === "gift_discounts" ? "gift-discounts" : "gift-impressions"}.sql trong Supabase SQL Editor.`);
  } else {
    console.error(`[gift] ERROR (${context}):`, err);
  }
}

// Dựng kết quả "ok" từ 1 bản ghi quà; nếu trúng FREE thì cấp thẳng Khóa 1 (idempotent).
async function toOkState(userId: string, g: GiftDiscount): Promise<GiftState> {
  const free = isFreeGift(g.percent);
  if (free) await grantGiftFreeK1(userId); // trúng 100% → cấp free ngay, không cần thanh toán
  return { status: "ok", percent: g.percent, expiresAt: g.expiresAt, expired: !isActive(g), free };
}

// Mở quà: idempotent. Trả quà cũ nếu đã có (% giữ nguyên → trung thực); nếu chưa & đủ điều kiện
// thì roll % mới, lưu DB. Một user chỉ nhận MỘT quà (hết hạn là hết — urgency thật, không farm lại).
// Bọc try/catch: bảng thiếu / DB lỗi → trả {status:"error"} thay vì ném exception (trước đây route
// gọi hàm này không catch gì cả → 500 câm, khách chỉ thấy "Có lỗi, thử lại", không ai biết vì sao).
export async function getOrCreateGift(userId: string): Promise<GiftState> {
  if (!GIFT_ENABLED) return { status: "disabled" };

  try {
    const existing = await findGift(userId);
    if (existing) return await toOkState(userId, existing);

    // Đã sở hữu K1 (mua/nhận) → không cấp quà.
    if (await ownsProduct(userId, GIFT_PRODUCT)) return { status: "owned" };

    const percent = rollGiftPercent();
    const expiresAt = new Date(Date.now() + GIFT_TTL_HOURS * 3_600_000);
    await db
      .insert(giftDiscounts)
      .values({ userId, product: GIFT_PRODUCT, percent, expiresAt })
      .onConflictDoNothing();

    // Đọc lại để xử lý đúng cả trường hợp 2 request chèn cùng lúc (giữ 1 bản ghi duy nhất).
    const saved = (await findGift(userId))!;
    return await toOkState(userId, saved);
  } catch (err) {
    logGiftError("getOrCreateGift", err, "gift_discounts");
    return { status: "error" };
  }
}

// % giảm CÒN HIỆU LỰC cho đơn (dùng khi tạo đơn). Null nếu tắt / không có quà / hết hạn / sai gói.
// Bọc try/catch: đây được gọi từ /api/orders CHO MỌI GÓI (không chỉ k1) — nếu bảng gift_discounts
// thiếu mà không catch, một đơn hàng K1 THẬT (không liên quan gì tới hộp quà) cũng sẽ vỡ theo.
// Lỗi hạ tầng ở tính năng khuyến mãi phụ KHÔNG được phép chặn doanh thu chính → fallback null
// (= coi như không có quà, tính giá gốc) là lựa chọn AN TOÀN, không làm lộ giảm giá sai.
export async function activeGiftPercent(userId: string, product: string): Promise<number | null> {
  if (!GIFT_ENABLED || product !== GIFT_PRODUCT) return null;
  try {
    const g = await findGift(userId);
    if (!g || !isActive(g)) return null;
    return g.percent;
  } catch (err) {
    logGiftError("activeGiftPercent", err, "gift_discounts");
    return null;
  }
}
