import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { flashSale } from "@/lib/db/schema";

export interface FlashSaleConfig {
  enabled: boolean;
  headline: string;
  countdownMinutes: number;
  viewerMin: number;
  viewerMax: number;
}

// Mặc định dùng khi DB chưa sẵn / bảng chưa tạo (migration flash-sale.sql chưa chạy).
export const FLASH_SALE_DEFAULTS: FlashSaleConfig = {
  enabled: true,
  headline: "⚡ FLASH SALE — Ưu đãi early-bird sắp kết thúc",
  countdownMinutes: 720,
  viewerMin: 6,
  viewerMax: 24,
};

// Đọc cấu hình. KHÔNG bao giờ ném — lỗi DB/chưa migrate → trả mặc định (trang public không vỡ).
export async function getFlashSale(): Promise<FlashSaleConfig> {
  try {
    const [row] = await db.select().from(flashSale).where(eq(flashSale.id, "singleton")).limit(1);
    if (!row) return FLASH_SALE_DEFAULTS;
    return {
      enabled: row.enabled,
      headline: row.headline,
      countdownMinutes: row.countdownMinutes,
      viewerMin: row.viewerMin,
      viewerMax: row.viewerMax,
    };
  } catch {
    return FLASH_SALE_DEFAULTS;
  }
}

// Ghi cấu hình (admin). Upsert dòng singleton.
export async function updateFlashSale(cfg: FlashSaleConfig): Promise<void> {
  await db
    .insert(flashSale)
    .values({ id: "singleton", ...cfg, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: flashSale.id,
      set: { ...cfg, updatedAt: new Date() },
    });
}
