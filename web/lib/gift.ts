// Cấu hình + logic "hộp quà giảm giá" (một nơi duy nhất, kiểu promo.ts).
// Mục tiêu: mức giảm THẬT + chống gian lận. % do SERVER roll, lưu DB gắn theo user,
// idempotent theo (user, gói) → khách không tự chế % để trả rẻ hơn. Khi tạo đơn, amount đã
// trừ % được ghi vào orders.amount_vnd (webhook SePay ép transferAmount ≥ order.amount_vnd).
//
// 2026-07-26 — ĐỢT 1 mở rộng:
//  1. Quà áp cho CẢ 4 GÓI (k1 · co-ban · k3 · all-access), KHÔNG chỉ k1 như trước.
//  2. MỘT lượt quay / user: % quay ra được ghi cho cả 4 gói (4 dòng gift_discounts cùng percent,
//     cùng expires_at) → khách thấy cùng một mức giảm ở mọi gói, không quay lại được 4 lần.
//  3. BỎ HẲN bậc FREE 100% → thay bằng 80%. Không còn đường nào cấp khóa miễn phí từ hộp quà,
//     nên không còn đơn 0đ. Dữ liệu CŨ (percent=100) vẫn được tôn trọng: xem clampGiftPercent.
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { giftDiscounts, type GiftDiscount } from "@/lib/db/schema";
import { ownsProduct } from "@/lib/auth";
import { persistAppError } from "@/lib/log";
import type { ProductId } from "@/lib/products";

// ---- Cấu hình (dễ chỉnh; quyết định kinh doanh) ----
export const GIFT_ENABLED = (process.env.GIFT_ENABLED ?? "true") !== "false";

// WHITELIST gói được giảm — nguồn chân lý DUY NHẤT. Mọi route nhận `product` từ client PHẢI
// lọc qua isGiftProduct() trước khi dùng (không tin client: nếu không, khách tự gọi API xin
// giảm 80% cho một id gói bịa hoặc cho gói chưa mở bán).
export const GIFT_PRODUCTS: ProductId[] = ["k1", "co-ban", "k3", "all-access"];

// Gói mặc định được làm nổi bật trong popup khi client không nói rõ muốn gói nào.
export const GIFT_DEFAULT_PRODUCT: ProductId = "k1";

export const GIFT_TTL_HOURS = Number(process.env.GIFT_TTL_HOURS ?? 24); // hạn dùng quà (tạo urgency thật)

export function isGiftProduct(id: string | null | undefined): id is ProductId {
  return !!id && (GIFT_PRODUCTS as string[]).includes(id);
}

// Bậc % + TRỌNG SỐ (quyết định kinh doanh). Tổng weight = 100 → đọc thẳng ra %.
// Bình quân giảm = (30·45 + 50·30 + 70·17 + 80·8)/100 = 46.8%.
// Export để /admin so PHÂN BỐ THỰC TẾ với trọng số lý thuyết (lệch mạnh về mức cao = dấu hiệu farm
// đa tài khoản) — đọc từ ĐÚNG một nguồn này, không chép lại số ở lib/admin-stats.ts (tránh lệch).
export const GIFT_TIERS: { percent: number; weight: number }[] = [
  { percent: 30, weight: 45 },
  { percent: 50, weight: 30 },
  { percent: 70, weight: 17 },
  { percent: 80, weight: 8 }, // mức cao nhất — thay cho bậc FREE 100% đã bỏ
];

// Trần % giảm hiện hành (= bậc cao nhất đang cấu hình). Suy ra từ GIFT_TIERS để không lệch khi
// đổi bậc. Mọi % đọc từ DB đều đi qua clampGiftPercent trước khi tính tiền.
export const MAX_GIFT_PERCENT = Math.max(...GIFT_TIERS.map((t) => t.percent));

// DI SẢN: trước 2026-07-26 có bậc FREE 100% (trúng là được cấp thẳng Khóa 1, không thu tiền).
// Bậc đó đã BỎ, nhưng các dòng gift_discounts.percent = 100 CŨ vẫn nằm trong DB.
// Cách xử lý (đã chốt): KHÔNG xóa, KHÔNG thu hồi enrollment free đã cấp — khách cũ giữ nguyên
// khóa họ đang có. Nhưng khi tính tiền cho ĐƠN MỚI thì hạ về trần hiện hành (80%) để:
//   (a) không còn đơn 0đ nào (QR 0đ không hợp lệ, và đó là lý do tồn tại nhánh cấp-free cũ);
//   (b) khách cũ vẫn mua được bình thường, thậm chí vẫn được mức giảm cao nhất — không ai bị thiệt.
export const LEGACY_FREE_PERCENT = 100;

export function clampGiftPercent(percent: number): number {
  return Math.min(percent, MAX_GIFT_PERCENT);
}

// Chọn ngẫu nhiên 1 bậc % theo trọng số (server-side).
export function rollGiftPercent(): number {
  const total = GIFT_TIERS.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of GIFT_TIERS) {
    if ((r -= t.weight) < 0) return t.percent;
  }
  return GIFT_TIERS[0].percent;
}

// Tỷ lệ (%) người mở quà trúng ĐÚNG mức này — để hiện "độ hiếm" THẬT (không bịa số).
// Mức không còn trong cấu hình (vd 100 di sản) → 0, và UI đã clamp trước nên không hiện ra.
export function tierRarityPercent(percent: number): number {
  const total = GIFT_TIERS.reduce((s, t) => s + t.weight, 0);
  const tier = GIFT_TIERS.find((t) => t.percent === percent);
  return tier && total > 0 ? Math.round((tier.weight / total) * 100) : 0;
}

// Giá sau giảm — làm tròn XUỐNG nghìn cho đẹp & có lợi cho khách. Không bao giờ âm.
// Với trần 80% và gói rẻ nhất 49.000đ thì đáy là 9.000đ → không có đường nào ra 0đ.
export function discountedAmount(base: number, percent: number): number {
  const raw = (base * (100 - clampGiftPercent(percent))) / 100;
  return Math.max(0, Math.floor(raw / 1000) * 1000);
}

// Giá hiển thị cho UI: gốc + đã giảm + % (null = không có quà). Dùng CHUNG cho trang chủ,
// /checkout và paywall để 3 nơi không tự tính khác nhau.
export interface GiftedPrice {
  base: number;
  final: number;
  percent: number | null; // đã clamp; null = không có quà còn hạn
}

export function applyGift(base: number, percent: number | null | undefined): GiftedPrice {
  if (percent == null) return { base, final: base, percent: null };
  const p = clampGiftPercent(percent);
  return { base, final: discountedAmount(base, p), percent: p };
}

function isActive(g: GiftDiscount, now = Date.now()): boolean {
  return g.expiresAt.getTime() > now;
}

// Lấy quà của user cho MỘT gói (bất kể còn hạn hay không).
async function findGift(userId: string, product: string): Promise<GiftDiscount | null> {
  const [row] = await db
    .select()
    .from(giftDiscounts)
    .where(and(eq(giftDiscounts.userId, userId), eq(giftDiscounts.product, product)))
    .limit(1);
  return row ?? null;
}

// Toàn bộ quà của user trên các gói trong whitelist (1 query — trang chủ render 4 thẻ gói).
async function findGifts(userId: string): Promise<GiftDiscount[]> {
  return db
    .select()
    .from(giftDiscounts)
    .where(and(eq(giftDiscounts.userId, userId), inArray(giftDiscounts.product, GIFT_PRODUCTS)));
}

export type GiftState =
  | { status: "disabled" }
  | { status: "owned" } // đã sở hữu hết mọi gói → khỏi tặng
  | { status: "error" } // lỗi hạ tầng (bảng chưa tồn tại / DB lỗi) — KHÔNG phải trạng thái nghiệp vụ
  | {
      status: "ok";
      percent: number; // đã clamp về trần hiện hành
      expiresAt: Date;
      expired: boolean;
      products: ProductId[]; // các gói quà này áp được (dòng CŨ chỉ có k1 → chỉ k1)
    };

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
// Ghi SONG SONG vào bảng app_errors (qua persistAppError, KHÔNG console.error lần 2 — giữ đúng
// 1 dòng console như cũ, tránh in trùng). persistAppError tự nuốt lỗi nếu app_errors chưa tồn tại.
export async function logGiftError(context: string, err: unknown, table: string): Promise<void> {
  if (isMissingTableError(err)) {
    // Dòng riêng, dễ nhận — đây là lỗi hạ tầng (thiếu migration), KHÔNG phải bug logic.
    const msg = `[gift] TABLE MISSING: "${table}" chưa tồn tại (context=${context}). Chạy drizzle/${table === "gift_discounts" ? "gift-discounts" : "gift-impressions"}.sql trong Supabase SQL Editor.`;
    console.error(msg);
    await persistAppError("gift", msg, { table, reason: "table_missing", subcontext: context });
  } else {
    console.error(`[gift] ERROR (${context}):`, err);
    await persistAppError("gift", err instanceof Error ? err.message : String(err), { table, subcontext: context });
  }
}

// Dựng kết quả "ok" từ các dòng quà đang có của user.
// Mọi dòng của một lượt quay có cùng percent & expires_at → lấy dòng đầu làm đại diện; nếu dữ liệu
// cũ lẫn nhiều mức (khách di sản) thì lấy mức CAO NHẤT cho có lợi cho khách.
function toOkState(rows: GiftDiscount[]): GiftState {
  const best = rows.reduce((a, b) => (b.percent > a.percent ? b : a));
  return {
    status: "ok",
    percent: clampGiftPercent(best.percent),
    expiresAt: best.expiresAt,
    expired: !isActive(best),
    products: rows.map((r) => r.product as ProductId).filter(isGiftProduct),
  };
}

// Mở quà: idempotent. Trả quà cũ nếu đã có (% giữ nguyên → trung thực); nếu chưa & đủ điều kiện
// thì roll % MỘT LẦN và ghi cho cả 4 gói. Một user chỉ quay MỘT lần (hết hạn là hết — urgency
// thật, không farm lại).
//
// CHÚ Ý dữ liệu di sản: nếu user đã có dòng cũ (vd chỉ mỗi k1, percent=100) thì KHÔNG backfill
// thêm 3 gói còn lại. Backfill sẽ biến một suất "free K1" cũ thành 80% cho cả Trọn bộ 349k —
// hào phóng ngoài ý muốn. Khách cũ giữ đúng phạm vi quà họ đã nhận.
//
// Bọc try/catch: bảng thiếu / DB lỗi → trả {status:"error"} thay vì ném exception (trước đây route
// gọi hàm này không catch gì cả → 500 câm, khách chỉ thấy "Có lỗi, thử lại", không ai biết vì sao).
export async function getOrCreateGift(userId: string): Promise<GiftState> {
  if (!GIFT_ENABLED) return { status: "disabled" };

  try {
    const existing = await findGifts(userId);
    if (existing.length > 0) return toOkState(existing);

    // Đã sở hữu TOÀN BỘ nội dung (all-access = mọi khóa) → không còn gì để bán, khỏi cấp quà.
    // Khách mới chỉ có K1 vẫn được quà (để giảm giá Pro/Trọn bộ) — đây là điểm khác bản cũ.
    if (await ownsProduct(userId, "all-access")) return { status: "owned" };

    const percent = rollGiftPercent();
    const expiresAt = new Date(Date.now() + GIFT_TTL_HOURS * 3_600_000);
    await db
      .insert(giftDiscounts)
      .values(GIFT_PRODUCTS.map((product) => ({ userId, product, percent, expiresAt })))
      .onConflictDoNothing();

    // Đọc lại để xử lý đúng cả trường hợp 2 request chèn cùng lúc (giữ bộ dòng duy nhất).
    const saved = await findGifts(userId);
    if (saved.length === 0) return { status: "error" }; // insert bị nuốt bất thường → không bịa quà
    return toOkState(saved);
  } catch (err) {
    await logGiftError("getOrCreateGift", err, "gift_discounts");
    return { status: "error" };
  }
}

// % giảm CÒN HIỆU LỰC cho đơn (dùng khi tạo đơn). Null nếu tắt / không có quà / hết hạn / sai gói.
// Bọc try/catch: đây được gọi từ /api/orders CHO MỌI GÓI — nếu bảng gift_discounts thiếu mà không
// catch, một đơn hàng THẬT (không liên quan gì tới hộp quà) cũng sẽ vỡ theo. Lỗi hạ tầng ở tính
// năng khuyến mãi phụ KHÔNG được phép chặn doanh thu chính → fallback null (= tính giá gốc) là
// lựa chọn AN TOÀN, không làm lộ giảm giá sai.
export async function activeGiftPercent(userId: string, product: string): Promise<number | null> {
  if (!GIFT_ENABLED || !isGiftProduct(product)) return null;
  try {
    const g = await findGift(userId, product);
    if (!g || !isActive(g)) return null;
    return clampGiftPercent(g.percent);
  } catch (err) {
    await logGiftError("activeGiftPercent", err, "gift_discounts");
    return null;
  }
}

// % giảm còn hiệu lực của MỌI gói, cho UI hiển thị giá (trang chủ 4 thẻ, /checkout, paywall).
// 1 query duy nhất. Lỗi hạ tầng → {} (hiện giá gốc) thay vì làm sập trang bán hàng.
export async function activeGiftPercents(userId: string): Promise<Record<string, number>> {
  if (!GIFT_ENABLED) return {};
  try {
    const rows = await findGifts(userId);
    const out: Record<string, number> = {};
    for (const g of rows) {
      if (isActive(g)) out[g.product] = clampGiftPercent(g.percent);
    }
    return out;
  } catch (err) {
    await logGiftError("activeGiftPercents", err, "gift_discounts");
    return {};
  }
}
