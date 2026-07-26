// Tổng hợp số liệu cho dashboard /admin. Mọi aggregation chạy DB-level trên TOÀN bảng
// (không phải 100 dòng tải về). Bọc try/catch trả default rỗng để 1 truy vấn lỗi không
// làm sập cả trang admin. Chỉ đọc 4 bảng sẵn có → không cần migration mới.
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { productById, effectivePriceVnd, coursesOfProduct } from "@/lib/products";
import { PROMO_FREE_LIMIT, promoExpired } from "@/lib/promo";
import { GIFT_TIERS, logGiftError } from "@/lib/gift";
import { persistAppError } from "@/lib/log";

// ── Loại tài khoản TEST khỏi mọi số liệu /admin — MỘT nguồn sự thật duy nhất ──
// Đọc từ ADMIN_EXCLUDED_EMAILS (phân tách dấu phẩy) trên Vercel; đổi/thêm tài khoản test
// không cần sửa code, chỉ cần đổi env var. Mặc định = tài khoản test đã biết của chủ dự án.
const DEFAULT_EXCLUDED_TEST_EMAILS = "tranminhtoan140601@gmail.com";

export function excludedTestEmails(): string[] {
  const raw = process.env.ADMIN_EXCLUDED_EMAILS ?? DEFAULT_EXCLUDED_TEST_EMAILS;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// ⚠️ BÀI HỌC (sự cố production 2026-07-26): `sql\`...${arr}::uuid[]\`` với arr là JS array KHÔNG
// serialize đúng qua drizzle-orm's `sql` tag + db.execute() (khác với package `postgres` gốc, có
// phép tự-serialize mảng khi dùng tagged template CỦA CHÍNH NÓ — app không đi qua đường đó).
// Driver stringify mảng thành 1 tham số bind phẳng (vd `["a"].toString()` = `"a"`, không có `{}`),
// Postgres ép kiểu `::uuid[]` lên chuỗi đó → "malformed array literal", NÉM LỖI NGAY LẬP TỨC kể cả
// mảng rỗng. Toàn bộ /admin sập về emptyStats() vì lỗi này xảy ra ở query ĐẦU TIÊN của hàm.
// Fix ĐÚNG: bind TỪNG phần tử làm 1 tham số riêng qua sql.join, dựng literal `ARRAY[$1,$2,...]`
// bằng chính cú pháp SQL (không dựa vào driver tự đoán kiểu mảng nào cả).
function sqlUuidArray(ids: string[]) {
  if (!ids.length) return sql.raw("ARRAY[]::uuid[]");
  return sql`ARRAY[${sql.join(
    ids.map((id) => sql`${id}`),
    sql`, `,
  )}]::uuid[]`;
}
function sqlTextArray(vals: string[]) {
  if (!vals.length) return sql.raw("ARRAY[]::text[]");
  return sql`ARRAY[${sql.join(
    vals.map((v) => sql`${v}`),
    sql`, `,
  )}]::text[]`;
}

// Resolve email → id (uuid) MỘT LẦN đầu getAdminStats, dùng lại cho MỌI query bên dưới —
// đây là điểm duy nhất tính "ai là test account", tránh rải điều kiện lọc rời rạc khắp nơi.
// "$col != ALL(sqlUuidArray(excludedIds))" — mảng rỗng luôn TRUE (đã verify bằng SELECT thật
// trên production qua ĐÚNG đường thi hành db.execute(): != ALL(ARRAY[]::uuid[]) = tổng số dòng).
async function resolveExcludedIds(): Promise<string[]> {
  const emails = excludedTestEmails();
  if (!emails.length) return [];
  const rows = await q(sql`SELECT id::text AS id FROM profiles WHERE lower(email) = ANY(${sqlTextArray(emails)})`);
  return rows.map((r) => String(r.id));
}

export interface DayPoint {
  day: string; // YYYY-MM-DD (giờ VN)
  value: number;
}
export interface ProductRevenue {
  product: string;
  label: string;
  count: number;
  revenue: number;
}
export interface PackageRow {
  package: string;
  label: string;
  courses: number; // số khóa gói mở
  count: number;
}
export interface FunnelStep {
  label: string;
  value: number;
}
export interface PackagesPerUserRow {
  bucket: string; // "1 gói" | "2 gói" | "3+ gói"
  count: number;
}
export interface RecentPaidRow {
  transferCode: string;
  email: string | null;
  product: string;
  amountVnd: number;
  paidAt: string | null;
}
export interface RecentSignupRow {
  email: string;
  fullName: string | null;
  createdAt: string;
}
export interface GiftPercentRow {
  percent: number;
  count: number;
}
// "ok" = bảng tồn tại (không quan tâm có dữ liệu hay không) · "missing" = CHƯA chạy migration
// (drizzle/gift-discounts.sql | gift-impressions.sql) · "unknown" = không probe được (lỗi khác).
export interface GiftHealth {
  discountsTable: "ok" | "missing" | "unknown";
  impressionsTable: "ok" | "missing" | "unknown";
}
export interface GiftTierRow {
  percent: number;
  count: number; // số lượt nhận đúng mức này
  actualPct: number; // % thực tế trong tổng lượt nhận quà
  theoreticalPct: number; // % lý thuyết theo trọng số GIFT_TIERS (lib/gift.ts) — lệch mạnh = dấu hiệu farm
  isLegacyTier: boolean; // percent này KHÔNG còn trong GIFT_TIERS hiện tại → dữ liệu từ cấu hình trọng số CŨ
  // (trọng số đã đổi ít nhất 1 lần trong lịch sử, vd 10/15/20/30/FREE → 30/50/70/FREE — so "thực tế vs lý
  // thuyết" với các dòng legacy là VÔ NGHĨA, không phải bug hay dấu hiệu farm).
  usedCount: number; // đã thanh toán TRƯỚC khi hết hạn (FREE tính là "dùng" ngay vì cấp tự động)
  usedPct: number; // usedCount / count
}
export interface GiftConversion {
  nonFreeRecipients: number; // user nhận quà giảm (không tính suất FREE di sản — FREE tự động "chuyển đổi" 100%, so sánh vô nghĩa)
  nonFreePaid: number; // trong đó đã mua ĐÚNG gói đang giữ quà (status='paid')
  nonFreePaidRate: number;
  freeRecipients: number; // trúng FREE (bậc đã bỏ 2026-07-26) — tham khảo, không nằm trong phép so sánh
  noGiftUsers: number; // có tài khoản (profiles) nhưng CHƯA từng nhận quà
  noGiftUsersPaidK1: number; // trong đó đã mua gói BẤT KỲ (đối xứng với vế trên; tên field giữ nguyên để không phá /admin)
  noGiftUsersPaidRate: number;
}
export interface GiftStats {
  total: number; // tổng lượt nhận quà, ĐẾM THEO USER (1 lượt quay ghi 4 dòng — 1 dòng/gói)
  freeWon: number; // DI SẢN: trúng jackpot 100% thời còn bậc FREE (đã bỏ 2026-07-26) — không tăng nữa
  today: number; // nhận quà hôm nay (giờ VN)
  d7: number; // nhận quà 7 ngày
  byPercent: GiftPercentRow[]; // phân bố theo mức thưởng (100% ở đầu)
  // gift_impressions là bảng ẨN DANH (cookie 'gv', không có user_id) → KHÔNG lọc được tài khoản
  // test khỏi số này bằng cấu trúc dữ liệu hiện tại (không có gì để đối chiếu email/user_id).
  impressions: number; // số trình duyệt đã THẤY hộp quà (gift_impressions) — CHƯA loại được test
  notClaimed: number; // số người thấy mà KHÔNG nhận ≈ impressions − total (sàn 0)
  health: GiftHealth; // để /admin báo rõ "hộp quà đang sống hay chết" thay vì suy đoán từ total=0
  tiers: GiftTierRow[]; // phân bố thực tế vs lý thuyết + tỷ lệ dùng trước hạn, theo từng mức %
  conversion: GiftConversion; // nhóm nhận quà (không-free) vs nhóm không nhận — ai mua K1 nhiều hơn
}

// "ok" = bảng tồn tại · "missing" = CHƯA chạy migration (drizzle/app-errors.sql |
// payment-webhook-events.sql) · "unknown" = không probe được (lỗi DB khác).
export interface OpsHealth {
  paymentEventsTable: "ok" | "missing" | "unknown";
  appErrorsTable: "ok" | "missing" | "unknown";
}
export interface SkippedPaymentRow {
  receivedAt: string;
  transferAmount: number | null;
  matchedTransferCode: string | null;
  skipReason: string;
}
export interface RecentErrorRow {
  occurredAt: string;
  context: string;
  message: string;
}
export interface OpsStats {
  health: OpsHealth;
  skippedPayments: SkippedPaymentRow[]; // webhook có vào tiền nhưng KHÔNG khớp được đơn — CẢNH BÁO
  recentErrors: RecentErrorRow[]; // N lỗi runtime mới nhất (bảng app_errors)
}

export interface AdminStats {
  ok: boolean; // false nếu truy vấn lỗi (DB chưa sẵn sàng) → UI báo nhẹ
  // Đã loại N tài khoản test (ADMIN_EXCLUDED_EMAILS) khỏi MỌI số liệu bên dưới — TRỪ
  // gift.impressions (bảng gift_impressions ẩn danh theo cookie, không có user_id để đối chiếu).
  testFilter: { excludedCount: number };
  revenue: {
    total: number;
    today: number;
    d7: number;
    d30: number;
    pending: number; // doanh thu tiềm năng (đơn pending)
    aov: number; // giá trị đơn trung bình (paid)
  };
  revenueByProduct: ProductRevenue[];
  orders: {
    total: number;
    pending: number;
    paid: number;
    canceled: number;
    today: number;
    d7: number;
    d30: number;
    closeRate: number; // paid / (paid + canceled)
    priceMismatch: number; // đơn paid lệch giá gói
  };
  users: {
    // NGƯỜI duy nhất — COUNT(DISTINCT lower(email)), KHÔNG phải số dòng profile. profiles.email
    // KHÔNG có unique constraint (Supabase tạo auth-user MỚI mỗi lần đăng nhập OTP nếu mất phiên),
    // nên 1 người có thể có nhiều dòng profile. Xác nhận thật trên production: 1 email tạo 8 dòng.
    total: number;
    rawRowCount: number; // số dòng profile thật — hiện ra để so sánh, KHÁC total khi có trùng email
    today: number;
    d7: number;
    d30: number;
    paying: number; // có ≥1 enrollment trả phí (đếm theo NGƯỜI, JOIN profiles theo email)
    freeLeads: number; // chỉ có enrollment free (K1 khai trương) — đếm theo NGƯỜI
    signupToPaidRate: number;
  };
  enrollmentsByPackage: PackageRow[];
  // "free" = TỔNG mọi enrollment K1 miễn phí, bất kể nguồn gốc. Tách rõ 2 nguồn hoàn toàn khác
  // nhau để không phóng đại tác động của hộp quà: freeViaGiftJackpot (trúng 100% ở hộp quà) vs
  // freeViaLaunchPromo (khuyến mãi khai trương cũ claimFreeK1, hết hạn 07/07, không liên quan hộp quà).
  // Phân biệt bằng JOIN thật với gift_discounts (không đoán theo mốc thời gian).
  k1: { free: number; paid: number; freeViaGiftJackpot: number; freeViaLaunchPromo: number };
  // claimed = CHỈ đếm suất khai trương cũ (freeViaLaunchPromo) — đúng ý nghĩa khi so với /limit=100,
  // KHÔNG cộng cả suất trúng hộp quà vào (trước đây gộp chung, phóng đại số suất khai trương).
  promo: { claimed: number; limit: number; expired: boolean };
  packagesPerUser: PackagesPerUserRow[];
  funnel: FunnelStep[];
  series: { revenue: DayPoint[]; orders: DayPoint[]; signups: DayPoint[] };
  recentPaid: RecentPaidRow[];
  recentSignups: RecentSignupRow[];
  gift: GiftStats;
  ops: OpsStats;
}

type Row = Record<string, unknown>;
const n = (v: unknown): number => (v == null ? 0 : Number(v));
const s = (v: unknown): string | null => (v == null ? null : String(v));

// Danh sách 30 chuỗi ngày VN gần nhất (cũ → mới) để lấp ngày trống = 0.
function last30VnDays(): string[] {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const days: string[] = [];
  const now = Date.now();
  for (let i = 29; i >= 0; i--) days.push(fmt.format(new Date(now - i * 86_400_000)));
  return days;
}

function fillSeries(rows: Row[], days: string[]): DayPoint[] {
  const map = new Map<string, number>();
  for (const r of rows) map.set(String(r.day), n(r.value));
  return days.map((d) => ({ day: d, value: map.get(d) ?? 0 }));
}

const tail = (arr: DayPoint[], k: number) => arr.slice(-k).reduce((a, p) => a + p.value, 0);

function emptyGiftStats(health: GiftHealth, impressions = 0): GiftStats {
  return {
    total: 0,
    freeWon: 0,
    today: 0,
    d7: 0,
    byPercent: [],
    impressions,
    notClaimed: impressions,
    health,
    tiers: [],
    conversion: {
      nonFreeRecipients: 0,
      nonFreePaid: 0,
      nonFreePaidRate: 0,
      freeRecipients: 0,
      noGiftUsers: 0,
      noGiftUsersPaidK1: 0,
      noGiftUsersPaidRate: 0,
    },
  };
}

// Probe "bảng có tồn tại không" bằng to_regclass — KHÔNG BAO GIỜ ném lỗi (khác với chạy thẳng
// SELECT ... FROM <bảng> rồi bắt exception), nên đáng tin hơn để /admin báo "sống hay chết"
// một cách dứt khoát thay vì suy đoán từ total=0 (0 lượt nhận có thể là "chưa ai mở" chứ không
// hẳn là "bảng chưa tồn tại" — hai tình huống khác hẳn nhau mà trước đây không phân biệt được).
async function tableExists(qualifiedName: string): Promise<boolean> {
  try {
    const rows = await q(sql`SELECT to_regclass(${qualifiedName}) IS NOT NULL AS exists`);
    return Boolean(rows[0]?.exists);
  } catch {
    return false;
  }
}

// Số liệu hộp quà — try/catch RIÊNG để nếu bảng gift_discounts chưa áp migration thì
// chỉ phần này về 0, KHÔNG kéo sập cả dashboard. Gọi cuối cùng trong getAdminStats.
// excludedIds áp cho MỌI query ở đây TRỪ gift_impressions (bảng ẩn danh theo cookie 'gv',
// không có user_id → không có gì để đối chiếu, xem ghi chú ở field GiftStats.impressions).
async function giftStats(excludedIds: string[]): Promise<GiftStats> {
  const discountsOk = await tableExists("public.gift_discounts");
  const impressionsOk = await tableExists("public.gift_impressions");
  const health: GiftHealth = {
    discountsTable: discountsOk ? "ok" : "missing",
    impressionsTable: impressionsOk ? "ok" : "missing",
  };
  if (!discountsOk) {
    const msg =
      '[gift] TABLE MISSING: "gift_discounts" (phát hiện qua to_regclass ở /admin). Chạy drizzle/gift-discounts.sql trong Supabase SQL Editor.';
    console.error(msg);
    await persistAppError("gift", msg, { table: "gift_discounts", reason: "table_missing", subcontext: "admin-stats/tableExists" });
  }
  if (!impressionsOk) {
    const msg =
      '[gift] TABLE MISSING: "gift_impressions" (phát hiện qua to_regclass ở /admin). Chạy drizzle/gift-impressions.sql trong Supabase SQL Editor.';
    console.error(msg);
    await persistAppError("gift", msg, { table: "gift_impressions", reason: "table_missing", subcontext: "admin-stats/tableExists" });
  }

  // Số người ĐÃ THẤY hộp quà — độc lập với gift_discounts, để "không nhận" vẫn tính được
  // dù bảng nhận-quà có vấn đề riêng. KHÔNG lọc được test account (xem comment ở đầu hàm).
  let impressions = 0;
  if (impressionsOk) {
    try {
      impressions = n((await q(sql`SELECT COUNT(*)::int AS n FROM gift_impressions`))[0]?.n);
    } catch (e) {
      await logGiftError("admin-stats/impressions", e, "gift_impressions");
    }
  }

  if (!discountsOk) return emptyGiftStats(health, impressions);

  try {
    // ĐẾM THEO USER, KHÔNG theo dòng: từ 2026-07-26 một lượt quay ghi 4 dòng (1 dòng/gói, cùng
    // percent) → COUNT(*) sẽ thổi mọi con số lên gấp 4 và làm "người thấy mà không nhận" âm.
    // COUNT(DISTINCT user_id) = đúng nghĩa "số lượt nhận quà" ở mọi cấu hình cũ lẫn mới.
    const agg =
      (
        await q(sql`
          SELECT
            COUNT(DISTINCT user_id)::int                                AS total,
            COUNT(DISTINCT user_id) FILTER (WHERE percent >= 100)::int  AS free_won,
            COUNT(DISTINCT user_id) FILTER (
              WHERE created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'
                    >= date_trunc('day', now() AT TIME ZONE 'Asia/Ho_Chi_Minh')
            )::int                                                      AS today,
            COUNT(DISTINCT user_id) FILTER (WHERE created_at >= now() - interval '7 days')::int AS d7
          FROM gift_discounts
          WHERE user_id != ALL(${sqlUuidArray(excludedIds)})`)
      )[0] ?? {};
    const rows = await q(sql`
      SELECT percent, COUNT(DISTINCT user_id)::int AS n FROM gift_discounts
      WHERE user_id != ALL(${sqlUuidArray(excludedIds)})
      GROUP BY percent ORDER BY percent DESC`);

    // Phân bố THỰC TẾ vs LÝ THUYẾT (GIFT_TIERS, lib/gift.ts) + tỷ lệ đã DÙNG trước khi hết hạn.
    // "Dùng" = có đơn status='paid' cho CHÍNH gói được giảm, paid_at <= expires_at của quà đó
    // (quà giờ áp cho 4 gói → dùng ở bất kỳ gói nào cũng tính); mức FREE di sản luôn tính là
    // "đã dùng" vì được cấp enrollment ngay lúc mở, không qua bước thanh toán.
    const usageRows = await q(sql`
      SELECT gd.percent,
        COUNT(DISTINCT gd.user_id)::int AS n,
        COUNT(DISTINCT gd.user_id) FILTER (
          WHERE gd.percent >= 100
             OR EXISTS (
               SELECT 1 FROM orders o
               WHERE o.user_id = gd.user_id AND o.product = gd.product
                 AND o.status = 'paid' AND o.paid_at IS NOT NULL AND o.paid_at <= gd.expires_at
             )
        )::int AS used_n
      FROM gift_discounts gd
      WHERE gd.user_id != ALL(${sqlUuidArray(excludedIds)})
      GROUP BY gd.percent ORDER BY gd.percent DESC`);

    const totalForPct = usageRows.reduce((s, r) => s + n(r.n), 0);
    const totalWeight = GIFT_TIERS.reduce((s, t) => s + t.weight, 0);
    const tiers: GiftTierRow[] = usageRows.map((r) => {
      const percent = n(r.percent);
      const count = n(r.n);
      const usedCount = n(r.used_n);
      const theoretical = GIFT_TIERS.find((t) => t.percent === percent);
      return {
        percent,
        count,
        actualPct: totalForPct > 0 ? Math.round((count / totalForPct) * 1000) / 10 : 0,
        theoreticalPct:
          theoretical && totalWeight > 0 ? Math.round((theoretical.weight / totalWeight) * 1000) / 10 : 0,
        isLegacyTier: !theoretical, // percent này không còn trong cấu hình hiện tại → từ trọng số cũ
        usedCount,
        usedPct: count > 0 ? Math.round((usedCount / count) * 1000) / 10 : 0,
      };
    });

    // So sánh nhóm nhận quà (không-free) vs nhóm KHÔNG nhận quà — ai xuống tiền tỷ lệ cao hơn.
    // Suất FREE di sản loại khỏi vế "nhận quà" vì nó tự động chuyển đổi 100% (được cấp thẳng,
    // không qua quyết định mua) — đưa vào sẽ làm sai lệch phép so sánh.
    // Quà giờ áp cho CẢ 4 GÓI nên "đã mua" = mua ĐÚNG gói mình đang giữ quà (o.product =
    // gd.product), không còn khóa cứng 'k1' — khóa cứng sẽ bỏ sót người dùng quà mua Pro/Trọn bộ
    // và báo tỷ lệ chuyển đổi thấp giả tạo.
    const convAgg =
      (
        await q(sql`
          SELECT
            COUNT(DISTINCT gd.user_id) FILTER (WHERE gd.percent < 100)::int AS non_free_recipients,
            COUNT(DISTINCT gd.user_id) FILTER (WHERE gd.percent < 100 AND EXISTS (
              SELECT 1 FROM orders o
              WHERE o.user_id = gd.user_id AND o.product = gd.product AND o.status = 'paid'
            ))::int AS non_free_paid,
            COUNT(DISTINCT gd.user_id) FILTER (WHERE gd.percent >= 100)::int AS free_recipients
          FROM gift_discounts gd
          WHERE gd.user_id != ALL(${sqlUuidArray(excludedIds)})`)
      )[0] ?? {};

    // Vế đối chứng phải ĐỐI XỨNG với vế trên: nhóm không có quà tính là "đã mua" khi mua BẤT KỲ
    // gói nào (trước đây chỉ đếm đơn 'k1' → so lệch chuẩn giữa 2 nhóm, nhóm không-quà bị hạ thấp).
    const noGiftAgg =
      (
        await q(sql`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE EXISTS (
              SELECT 1 FROM orders o WHERE o.user_id = p.id AND o.status = 'paid'
            ))::int AS paid_k1
          FROM profiles p
          WHERE NOT EXISTS (SELECT 1 FROM gift_discounts gd WHERE gd.user_id = p.id)
            AND p.id != ALL(${sqlUuidArray(excludedIds)})`)
      )[0] ?? {};

    const nonFreeRecipients = n(convAgg.non_free_recipients);
    const nonFreePaid = n(convAgg.non_free_paid);
    const noGiftUsers = n(noGiftAgg.total);
    const noGiftUsersPaidK1 = n(noGiftAgg.paid_k1);

    const total = n(agg.total);
    return {
      total,
      freeWon: n(agg.free_won),
      today: n(agg.today),
      d7: n(agg.d7),
      byPercent: rows.map((r) => ({ percent: n(r.percent), count: n(r.n) })),
      impressions,
      notClaimed: Math.max(0, impressions - total),
      health,
      tiers,
      conversion: {
        nonFreeRecipients,
        nonFreePaid,
        nonFreePaidRate: nonFreeRecipients > 0 ? nonFreePaid / nonFreeRecipients : 0,
        freeRecipients: n(convAgg.free_recipients),
        noGiftUsers,
        noGiftUsersPaidK1,
        noGiftUsersPaidRate: noGiftUsers > 0 ? noGiftUsersPaidK1 / noGiftUsers : 0,
      },
    };
  } catch (err) {
    await logGiftError("admin-stats/giftStats", err, "gift_discounts");
    return emptyGiftStats(health, impressions);
  }
}

function emptyOpsStats(health: OpsHealth): OpsStats {
  return { health, skippedPayments: [], recentErrors: [] };
}

// Số liệu vận hành: giao dịch webhook bị bỏ qua (tiền có thể đã vào tài khoản nhưng chưa khớp
// đơn) + N lỗi runtime gần nhất. Cả 2 bảng nguồn (payment_webhook_events, app_errors) là migration
// CHẠY TAY — probe tableExists() trước, KHÔNG đọc thẳng rồi bắt exception, để phân biệt "chưa chạy
// migration" (missing) với "0 dòng vì chưa có sự kiện nào" (ok, rỗng) — cùng bài học với giftStats().
async function opsStats(): Promise<OpsStats> {
  const paymentEventsOk = await tableExists("public.payment_webhook_events");
  const appErrorsOk = await tableExists("public.app_errors");
  const health: OpsHealth = {
    paymentEventsTable: paymentEventsOk ? "ok" : "missing",
    appErrorsTable: appErrorsOk ? "ok" : "missing",
  };

  let skippedPayments: SkippedPaymentRow[] = [];
  if (paymentEventsOk) {
    try {
      const rows = await q(sql`
        SELECT received_at, transfer_amount, matched_transfer_code, skip_reason
        FROM payment_webhook_events
        WHERE skip_reason IS NOT NULL
        ORDER BY received_at DESC LIMIT 20`);
      skippedPayments = rows.map((r) => ({
        receivedAt: String(r.received_at),
        transferAmount: r.transfer_amount == null ? null : n(r.transfer_amount),
        matchedTransferCode: r.matched_transfer_code == null ? null : String(r.matched_transfer_code),
        skipReason: String(r.skip_reason),
      }));
    } catch (err) {
      await persistAppError(
        "admin-stats/opsStats",
        err instanceof Error ? err.message : String(err),
        { table: "payment_webhook_events" },
      );
    }
  }

  let recentErrors: RecentErrorRow[] = [];
  if (appErrorsOk) {
    try {
      const rows = await q(sql`
        SELECT occurred_at, context, message
        FROM app_errors
        ORDER BY occurred_at DESC LIMIT 20`);
      recentErrors = rows.map((r) => ({
        occurredAt: String(r.occurred_at),
        context: String(r.context),
        message: String(r.message),
      }));
    } catch {
      // Đọc app_errors lỗi → console.warn thôi, KHÔNG ghi lại vào chính bảng đó (tránh vòng lặp
      // log-lỗi-của-log-lỗi vô nghĩa).
      console.warn("[admin-stats] đọc app_errors lỗi (bỏ qua)");
    }
  }

  return { health, skippedPayments, recentErrors };
}

function emptyStats(): AdminStats {
  return {
    ok: false,
    testFilter: { excludedCount: 0 },
    revenue: { total: 0, today: 0, d7: 0, d30: 0, pending: 0, aov: 0 },
    revenueByProduct: [],
    orders: {
      total: 0,
      pending: 0,
      paid: 0,
      canceled: 0,
      today: 0,
      d7: 0,
      d30: 0,
      closeRate: 0,
      priceMismatch: 0,
    },
    users: {
      total: 0,
      rawRowCount: 0,
      today: 0,
      d7: 0,
      d30: 0,
      paying: 0,
      freeLeads: 0,
      signupToPaidRate: 0,
    },
    enrollmentsByPackage: [],
    k1: { free: 0, paid: 0, freeViaGiftJackpot: 0, freeViaLaunchPromo: 0 },
    promo: { claimed: 0, limit: PROMO_FREE_LIMIT, expired: promoExpired() },
    packagesPerUser: [],
    funnel: [],
    series: { revenue: [], orders: [], signups: [] },
    recentPaid: [],
    recentSignups: [],
    // DB không phản hồi được ở đây (catch ngoài cùng của getAdminStats) → không tự probe được
    // bảng nào tồn tại hay không, để "unknown" cho trung thực (khác "missing" = đã kiểm và thiếu).
    gift: emptyGiftStats({ discountsTable: "unknown", impressionsTable: "unknown" }),
    ops: emptyOpsStats({ paymentEventsTable: "unknown", appErrorsTable: "unknown" }),
  };
}

// db.execute trả về mảng các dòng (postgres-js RowList). Cast về Row[] cho gọn.
async function q(query: ReturnType<typeof sql>): Promise<Row[]> {
  const res = (await db.execute(query)) as unknown as Row[];
  return Array.isArray(res) ? res : [];
}

// QUAN TRỌNG: chạy các query TUẦN TỰ (await từng cái), KHÔNG Promise.all.
// Pooler cấu hình max:1 ở chế độ transaction (Supabase) → bắn nhiều query đồng thời
// qua 1 connection sẽ treo → Vercel 504 FUNCTION_INVOCATION_TIMEOUT. Toàn app cũng
// theo pattern await tuần tự này. Query đã gộp tối đa để giảm round-trip.
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const days = last30VnDays();

    // (0) Loại tài khoản test — resolve MỘT LẦN, dùng lại cho MỌI query bên dưới. Đây là điểm
    // duy nhất quyết định "ai là test" trong toàn bộ hàm — không rải điều kiện lọc rời rạc.
    const excludedIds = await resolveExcludedIds();

    // (1) Mọi số vô hướng trên bảng orders trong 1 lượt quét. users_initiated/users_paid đếm theo
    // NGƯỜI (distinct email qua JOIN profiles), KHÔNG theo user_id — 1 người có thể có nhiều
    // user_id nếu tạo lại phiên đăng nhập (xem comment ở AdminStats.users). LEFT JOIN (không phải
    // INNER) để 1 order thiếu profile khớp (không nên xảy ra) vẫn không bị rớt khỏi paid_count/rev_*
    // — chỉ riêng 2 cột COUNT(DISTINCT email) mới bỏ qua NULL email một cách tự nhiên và an toàn.
    const oAgg =
      (
        await q(sql`
          SELECT
            COUNT(*) FILTER (WHERE o.status='paid')::int     AS paid_count,
            COUNT(*) FILTER (WHERE o.status='pending')::int  AS pending_count,
            COUNT(*) FILTER (WHERE o.status='canceled')::int AS canceled_count,
            COALESCE(SUM(o.amount_vnd) FILTER (WHERE o.status='paid'),0)::bigint    AS rev_total,
            COALESCE(SUM(o.amount_vnd) FILTER (WHERE o.status='pending'),0)::bigint AS rev_pending,
            COALESCE(AVG(o.amount_vnd) FILTER (WHERE o.status='paid'),0)::float     AS aov,
            COUNT(DISTINCT lower(p.email))::int                                AS users_initiated,
            COUNT(DISTINCT lower(p.email)) FILTER (WHERE o.status='paid')::int AS users_paid
          FROM orders o
          LEFT JOIN profiles p ON p.id = o.user_id
          WHERE o.user_id != ALL(${sqlUuidArray(excludedIds)})`)
      )[0] ?? {};

    // (2) Đơn paid nhóm theo (gói, số tiền) → suy ra doanh thu/gói + đếm lệch giá trong JS.
    const paidRows = await q(sql`
      SELECT product, amount_vnd, COUNT(*)::int AS n
      FROM orders WHERE status='paid' AND user_id != ALL(${sqlUuidArray(excludedIds)})
      GROUP BY product, amount_vnd`);

    // (3) Enrollment theo gói (kèm free/paid) trong 1 query.
    const enrRows = await q(sql`
      SELECT package, COUNT(*)::int AS n,
        COUNT(*) FILTER (WHERE order_id IS NULL)::int     AS free_n,
        COUNT(*) FILTER (WHERE order_id IS NOT NULL)::int AS paid_n
      FROM enrollments WHERE user_id != ALL(${sqlUuidArray(excludedIds)})
      GROUP BY package`);

    // (4) Phân bố theo NGƯỜI (paying / free-only / số gói / nâng cấp) — group theo email (JOIN
    // profiles), KHÔNG theo user_id, cùng lý do ở (1). COUNT(DISTINCT e.package) (không phải
    // COUNT(*)) để 1 gói không bị đếm 2 lần nếu cùng 1 người lỡ có 2 user_id đều enroll gói đó.
    const uAgg =
      (
        await q(sql`
          SELECT
            COUNT(*) FILTER (WHERE paid_pkgs >= 1)::int  AS paying,
            COUNT(*) FILTER (WHERE paid_pkgs = 0)::int   AS free_only,
            COUNT(*) FILTER (WHERE total_pkgs = 1)::int  AS p1,
            COUNT(*) FILTER (WHERE total_pkgs = 2)::int  AS p2,
            COUNT(*) FILTER (WHERE total_pkgs >= 3)::int AS p3,
            COUNT(*) FILTER (WHERE paid_pkgs >= 2)::int  AS upgraded
          FROM (
            SELECT lower(p.email) AS person,
              COUNT(DISTINCT e.package)                                       AS total_pkgs,
              COUNT(DISTINCT e.package) FILTER (WHERE e.order_id IS NOT NULL) AS paid_pkgs
            FROM enrollments e
            JOIN profiles p ON p.id = e.user_id
            WHERE e.user_id != ALL(${sqlUuidArray(excludedIds)})
            GROUP BY lower(p.email)
          ) t`)
      )[0] ?? {};

    // (5) Tổng tài khoản — NGƯỜI duy nhất (distinct email) + số dòng profile thật để so sánh
    // (khác nhau khi có trùng email — xem comment AdminStats.users).
    const usersAgg =
      (
        await q(sql`
          SELECT COUNT(*)::int AS raw_n, COUNT(DISTINCT lower(email))::int AS n
          FROM profiles WHERE id != ALL(${sqlUuidArray(excludedIds)})`)
      )[0] ?? {};
    const usersTotal = n(usersAgg.n);
    const usersRawRowCount = n(usersAgg.raw_n);

    // (6–8) Chuỗi 30 ngày (giờ VN).
    const revSeries = fillSeries(
      await q(sql`
        SELECT to_char(date_trunc('day', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COALESCE(SUM(amount_vnd),0)::bigint AS value
        FROM orders WHERE status='paid' AND paid_at >= now() - interval '30 days'
          AND user_id != ALL(${sqlUuidArray(excludedIds)}) GROUP BY 1`),
      days,
    );
    const ordSeries = fillSeries(
      await q(sql`
        SELECT to_char(date_trunc('day', created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COUNT(*)::int AS value
        FROM orders WHERE created_at >= now() - interval '30 days'
          AND user_id != ALL(${sqlUuidArray(excludedIds)}) GROUP BY 1`),
      days,
    );
    // Bucket theo NGƯỜI: mốc "ngày" là lần đăng ký ĐẦU TIÊN của mỗi email (MIN created_at), không
    // phải mọi dòng profile — nếu không, 1 người tạo lại phiên đăng nhập nhiều lần sẽ bị đếm là
    // "tài khoản mới" nhiều lần trong biểu đồ dù họ không phải khách mới.
    const signupSeries = fillSeries(
      await q(sql`
        SELECT to_char(date_trunc('day', first_seen AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COUNT(*)::int AS value
        FROM (
          SELECT lower(email) AS email, MIN(created_at) AS first_seen
          FROM profiles WHERE id != ALL(${sqlUuidArray(excludedIds)})
          GROUP BY lower(email)
        ) t
        WHERE first_seen >= now() - interval '30 days'
        GROUP BY 1`),
      days,
    );

    // (9–10) Hoạt động gần đây.
    const recentPaidRows = await q(sql`
      SELECT o.transfer_code, o.product, o.amount_vnd, o.paid_at, p.email
      FROM orders o LEFT JOIN profiles p ON p.id = o.user_id
      WHERE o.status='paid' AND o.user_id != ALL(${sqlUuidArray(excludedIds)})
      ORDER BY o.paid_at DESC NULLS LAST LIMIT 5`);
    const recentSignupRows = await q(sql`
      SELECT email, full_name, created_at FROM profiles
      WHERE id != ALL(${sqlUuidArray(excludedIds)})
      ORDER BY created_at DESC LIMIT 5`);

    // (11) Số liệu hộp quà (try/catch riêng, gọi cuối — không kéo sập stats khác).
    const gift = await giftStats(excludedIds);

    // (11b) Số liệu vận hành: giao dịch webhook bị bỏ qua + lỗi runtime gần nhất.
    const ops = await opsStats();

    // (12) Tách nguồn gốc enrollment K1-free: trúng jackpot hộp quà (percent>=100 ở CHÍNH user đó)
    // vs khuyến mãi khai trương cũ (claimFreeK1 — không đụng gift_discounts bao giờ). Phân biệt
    // bằng JOIN thật với gift_discounts, KHÔNG đoán theo mốc thời gian đăng ký/nhận.
    let k1FreeViaGiftJackpot = 0;
    let k1FreeViaLaunchPromo = 0;
    try {
      const k1FreeSplit =
        (
          await q(sql`
            SELECT
              COUNT(*) FILTER (WHERE EXISTS (
                SELECT 1 FROM gift_discounts gd
                WHERE gd.user_id = e.user_id AND gd.product = e.package AND gd.percent >= 100
              ))::int AS via_gift_jackpot,
              COUNT(*) FILTER (WHERE NOT EXISTS (
                SELECT 1 FROM gift_discounts gd
                WHERE gd.user_id = e.user_id AND gd.product = e.package AND gd.percent >= 100
              ))::int AS via_launch_promo
            FROM enrollments e
            WHERE e.package = 'k1' AND e.order_id IS NULL
              AND e.user_id != ALL(${sqlUuidArray(excludedIds)})`)
        )[0] ?? {};
      k1FreeViaGiftJackpot = n(k1FreeSplit.via_gift_jackpot);
      k1FreeViaLaunchPromo = n(k1FreeSplit.via_launch_promo);
    } catch (err) {
      // Nếu gift_discounts chưa sẵn sàng: coi mọi K1-free hiện có là "khai trương cũ" — an toàn,
      // không phóng đại đóng góp của hộp quà khi không xác minh được nguồn gốc thật.
      await logGiftError("admin-stats/k1FreeSplit", err, "gift_discounts");
      k1FreeViaLaunchPromo = n(enrRows.find((r) => String(r.package) === "k1")?.free_n);
      k1FreeViaGiftJackpot = 0;
    }

    // ── Suy diễn trong JS ──
    const oPaid = n(oAgg.paid_count),
      oPending = n(oAgg.pending_count),
      oCanceled = n(oAgg.canceled_count);
    const ordersTotal = oPaid + oPending + oCanceled;
    const closeRate = oPaid + oCanceled > 0 ? oPaid / (oPaid + oCanceled) : 0;

    // Doanh thu/gói + lệch giá từ cùng 1 tập paidRows.
    const revMap = new Map<string, { count: number; revenue: number }>();
    let priceMismatch = 0;
    for (const r of paidRows) {
      const product = String(r.product);
      const amount = n(r.amount_vnd);
      const cnt = n(r.n);
      const cur = revMap.get(product) ?? { count: 0, revenue: 0 };
      cur.count += cnt;
      cur.revenue += amount * cnt;
      revMap.set(product, cur);
      const prod = productById(product);
      if (prod && amount !== effectivePriceVnd(prod)) priceMismatch += cnt;
    }
    const revenueByProduct: ProductRevenue[] = [...revMap.entries()]
      .map(([product, v]) => ({
        product,
        label: productById(product)?.label ?? product,
        count: v.count,
        revenue: v.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const enrollmentsByPackage: PackageRow[] = enrRows
      .map((r) => {
        const prod = productById(String(r.package));
        return {
          package: String(r.package),
          label: prod?.label ?? String(r.package),
          courses: prod ? coursesOfProduct(prod).length : 0,
          count: n(r.n),
        };
      })
      .sort((a, b) => b.count - a.count);

    const k1Row = enrRows.find((r) => String(r.package) === "k1");
    const k1Free = n(k1Row?.free_n);
    const k1Paid = n(k1Row?.paid_n);

    const packagesPerUser: PackagesPerUserRow[] = [
      { bucket: "1 gói", count: n(uAgg.p1) },
      { bucket: "2 gói", count: n(uAgg.p2) },
      { bucket: "3+ gói", count: n(uAgg.p3) },
    ];

    const paying = n(uAgg.paying);
    const funnel: FunnelStep[] = [
      { label: "Tài khoản", value: usersTotal },
      { label: "Tạo đơn", value: n(oAgg.users_initiated) },
      { label: "Đã trả", value: n(oAgg.users_paid) },
      { label: "Nâng cấp (≥2 gói)", value: n(uAgg.upgraded) },
    ];

    return {
      ok: true,
      testFilter: { excludedCount: excludedIds.length },
      revenue: {
        total: n(oAgg.rev_total),
        today: revSeries.at(-1)?.value ?? 0,
        d7: tail(revSeries, 7),
        d30: tail(revSeries, 30),
        pending: n(oAgg.rev_pending),
        aov: Math.round(n(oAgg.aov)),
      },
      revenueByProduct,
      orders: {
        total: ordersTotal,
        pending: oPending,
        paid: oPaid,
        canceled: oCanceled,
        today: ordSeries.at(-1)?.value ?? 0,
        d7: tail(ordSeries, 7),
        d30: tail(ordSeries, 30),
        closeRate,
        priceMismatch,
      },
      users: {
        total: usersTotal,
        rawRowCount: usersRawRowCount,
        today: signupSeries.at(-1)?.value ?? 0,
        d7: tail(signupSeries, 7),
        d30: tail(signupSeries, 30),
        paying,
        freeLeads: n(uAgg.free_only),
        signupToPaidRate: usersTotal > 0 ? paying / usersTotal : 0,
      },
      enrollmentsByPackage,
      k1: {
        free: k1Free,
        paid: k1Paid,
        freeViaGiftJackpot: k1FreeViaGiftJackpot,
        freeViaLaunchPromo: k1FreeViaLaunchPromo,
      },
      // claimed = CHỈ suất khai trương cũ — đúng ý nghĩa khi so với /limit=100 (trước đây gộp cả
      // suất trúng hộp quà vào, phóng đại số suất khai trương đã phát).
      promo: { claimed: k1FreeViaLaunchPromo, limit: PROMO_FREE_LIMIT, expired: promoExpired() },
      packagesPerUser,
      funnel,
      series: { revenue: revSeries, orders: ordSeries, signups: signupSeries },
      recentPaid: recentPaidRows.map((r) => ({
        transferCode: String(r.transfer_code),
        email: s(r.email),
        product: String(r.product),
        amountVnd: n(r.amount_vnd),
        paidAt: s(r.paid_at),
      })),
      recentSignups: recentSignupRows.map((r) => ({
        email: String(r.email),
        fullName: s(r.full_name),
        createdAt: String(r.created_at),
      })),
      gift,
      ops,
    };
  } catch (err) {
    console.error("[admin-stats] query failed:", err);
    await persistAppError("admin-stats", err instanceof Error ? err.message : String(err));
    return emptyStats();
  }
}
