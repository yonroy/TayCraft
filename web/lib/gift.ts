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
const GIFT_TIERS: { percent: number; weight: number }[] = [
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
  | { status: "ok"; percent: number; expiresAt: Date; expired: boolean; free: boolean };

// Dựng kết quả "ok" từ 1 bản ghi quà; nếu trúng FREE thì cấp thẳng Khóa 1 (idempotent).
async function toOkState(userId: string, g: GiftDiscount): Promise<GiftState> {
  const free = isFreeGift(g.percent);
  if (free) await grantGiftFreeK1(userId); // trúng 100% → cấp free ngay, không cần thanh toán
  return { status: "ok", percent: g.percent, expiresAt: g.expiresAt, expired: !isActive(g), free };
}

// Mở quà: idempotent. Trả quà cũ nếu đã có (% giữ nguyên → trung thực); nếu chưa & đủ điều kiện
// thì roll % mới, lưu DB. Một user chỉ nhận MỘT quà (hết hạn là hết — urgency thật, không farm lại).
export async function getOrCreateGift(userId: string): Promise<GiftState> {
  if (!GIFT_ENABLED) return { status: "disabled" };

  const existing = await findGift(userId);
  if (existing) return toOkState(userId, existing);

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
  return toOkState(userId, saved);
}

// % giảm CÒN HIỆU LỰC cho đơn (dùng khi tạo đơn). Null nếu tắt / không có quà / hết hạn / sai gói.
export async function activeGiftPercent(userId: string, product: string): Promise<number | null> {
  if (!GIFT_ENABLED || product !== GIFT_PRODUCT) return null;
  const g = await findGift(userId);
  if (!g || !isActive(g)) return null;
  return g.percent;
}
