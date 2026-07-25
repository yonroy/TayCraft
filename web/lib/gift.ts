// Cấu hình + logic "hộp quà giảm giá" (một nơi duy nhất, kiểu promo.ts).
// Mục tiêu: mức giảm THẬT + chống gian lận. % do SERVER roll, lưu DB gắn theo user,
// idempotent theo (user, gói) → khách không tự chế % để trả rẻ hơn. Khi tạo đơn, amount đã
// trừ % được ghi vào orders.amount_vnd (webhook SePay ép transferAmount ≥ order.amount_vnd).
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { giftDiscounts, type GiftDiscount } from "@/lib/db/schema";
import { ownsProduct } from "@/lib/auth";
import type { ProductId } from "@/lib/products";

// ---- Cấu hình (dễ chỉnh; quyết định kinh doanh) ----
export const GIFT_ENABLED = (process.env.GIFT_ENABLED ?? "true") !== "false";
export const GIFT_PRODUCT: ProductId = "k1"; // gói được giảm
export const GIFT_TTL_HOURS = Number(process.env.GIFT_TTL_HOURS ?? 24); // hạn dùng quà (tạo urgency thật)
// Bậc % được phép (có lặp = trọng số): nghiêng về số nhỏ, thi thoảng trúng 20%.
const GIFT_TIERS = [10, 10, 10, 15, 15, 20];

// Chọn ngẫu nhiên 1 bậc % (server-side).
export function rollGiftPercent(): number {
  return GIFT_TIERS[Math.floor(Math.random() * GIFT_TIERS.length)];
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
  | { status: "ok"; percent: number; expiresAt: Date; expired: boolean };

// Mở quà: idempotent. Trả quà cũ nếu đã có (% giữ nguyên → trung thực); nếu chưa & đủ điều kiện
// thì roll % mới, lưu DB. Một user chỉ nhận MỘT quà (hết hạn là hết — urgency thật, không farm lại).
export async function getOrCreateGift(userId: string): Promise<GiftState> {
  if (!GIFT_ENABLED) return { status: "disabled" };

  const existing = await findGift(userId);
  if (existing) {
    return {
      status: "ok",
      percent: existing.percent,
      expiresAt: existing.expiresAt,
      expired: !isActive(existing),
    };
  }

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
  return {
    status: "ok",
    percent: saved.percent,
    expiresAt: saved.expiresAt,
    expired: !isActive(saved),
  };
}

// % giảm CÒN HIỆU LỰC cho đơn (dùng khi tạo đơn). Null nếu tắt / không có quà / hết hạn / sai gói.
export async function activeGiftPercent(userId: string, product: string): Promise<number | null> {
  if (!GIFT_ENABLED || product !== GIFT_PRODUCT) return null;
  const g = await findGift(userId);
  if (!g || !isActive(g)) return null;
  return g.percent;
}
