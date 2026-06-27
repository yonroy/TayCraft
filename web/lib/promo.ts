// Cấu hình khuyến mãi KHAI TRƯƠNG (một nơi duy nhất, dễ chỉnh).
// - 100 người đầu bấm popup → nhận trọn gói K1 miễn phí.
// - Hết suất → bán gói K1 giá khai trương 49k tới 24:00 07/07; sau đó về giá thường 149k.
// Có thể nâng PROMO_FREE_LIMIT / PROMO_DEADLINE thành env nếu muốn đổi runtime không cần deploy.

export const PROMO_FREE_LIMIT = Number(process.env.PROMO_FREE_LIMIT ?? 100); // số suất K1 free
export const PROMO_DEADLINE = new Date(
  process.env.PROMO_DEADLINE ?? "2026-07-07T23:59:59+07:00", // 24:00 ngày 07/07 (giờ VN)
);
export const K1_LAUNCH_PRICE = 49000;
export const K1_REGULAR_PRICE = 149000;

// Đã qua hạn khuyến mãi chưa.
export function promoExpired(now: number = Date.now()): boolean {
  return now > PROMO_DEADLINE.getTime();
}
