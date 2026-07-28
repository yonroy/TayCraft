// Cấu hình khuyến mãi KHAI TRƯƠNG (một nơi duy nhất, dễ chỉnh).
// - 100 người đầu bấm popup → nhận trọn gói K1 miễn phí.
// - Hết suất → giá K1 sau khuyến mãi đọc từ effectivePriceVnd(productById("k1")) trong products.ts
//   (ADR-002: K1 = 99.000đ cố định, không còn bậc giá khai trương riêng — xem MEMORY/DECISIONS.md).
// Có thể nâng PROMO_FREE_LIMIT / PROMO_DEADLINE thành env nếu muốn đổi runtime không cần deploy.

export const PROMO_FREE_LIMIT = Number(process.env.PROMO_FREE_LIMIT ?? 100); // số suất K1 free
export const PROMO_DEADLINE = new Date(
  process.env.PROMO_DEADLINE ?? "2026-07-07T23:59:59+07:00", // 24:00 ngày 07/07 (giờ VN)
);

// Đã qua hạn khuyến mãi chưa.
export function promoExpired(now: number = Date.now()): boolean {
  return now > PROMO_DEADLINE.getTime();
}
