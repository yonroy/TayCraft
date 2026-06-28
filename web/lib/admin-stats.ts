// Tổng hợp số liệu cho dashboard /admin. Mọi aggregation chạy DB-level trên TOÀN bảng
// (không phải 100 dòng tải về). Bọc try/catch trả default rỗng để 1 truy vấn lỗi không
// làm sập cả trang admin. Chỉ đọc 4 bảng sẵn có → không cần migration mới.
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { productById, effectivePriceVnd, coursesOfProduct } from "@/lib/products";
import { PROMO_FREE_LIMIT, promoExpired } from "@/lib/promo";

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

export interface AdminStats {
  ok: boolean; // false nếu truy vấn lỗi (DB chưa sẵn sàng) → UI báo nhẹ
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
    total: number;
    today: number;
    d7: number;
    d30: number;
    paying: number; // có ≥1 enrollment trả phí
    freeLeads: number; // chỉ có enrollment free (K1 khai trương)
    signupToPaidRate: number;
  };
  enrollmentsByPackage: PackageRow[];
  k1: { free: number; paid: number };
  promo: { claimed: number; limit: number; expired: boolean };
  packagesPerUser: PackagesPerUserRow[];
  funnel: FunnelStep[];
  series: { revenue: DayPoint[]; orders: DayPoint[]; signups: DayPoint[] };
  recentPaid: RecentPaidRow[];
  recentSignups: RecentSignupRow[];
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

function emptyStats(): AdminStats {
  return {
    ok: false,
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
    users: { total: 0, today: 0, d7: 0, d30: 0, paying: 0, freeLeads: 0, signupToPaidRate: 0 },
    enrollmentsByPackage: [],
    k1: { free: 0, paid: 0 },
    promo: { claimed: 0, limit: PROMO_FREE_LIMIT, expired: promoExpired() },
    packagesPerUser: [],
    funnel: [],
    series: { revenue: [], orders: [], signups: [] },
    recentPaid: [],
    recentSignups: [],
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

    // (1) Mọi số vô hướng trên bảng orders trong 1 lượt quét.
    const oAgg =
      (
        await q(sql`
          SELECT
            COUNT(*) FILTER (WHERE status='paid')::int     AS paid_count,
            COUNT(*) FILTER (WHERE status='pending')::int  AS pending_count,
            COUNT(*) FILTER (WHERE status='canceled')::int AS canceled_count,
            COALESCE(SUM(amount_vnd) FILTER (WHERE status='paid'),0)::bigint    AS rev_total,
            COALESCE(SUM(amount_vnd) FILTER (WHERE status='pending'),0)::bigint AS rev_pending,
            COALESCE(AVG(amount_vnd) FILTER (WHERE status='paid'),0)::float     AS aov,
            COUNT(DISTINCT user_id)::int                            AS users_initiated,
            COUNT(DISTINCT user_id) FILTER (WHERE status='paid')::int AS users_paid
          FROM orders`)
      )[0] ?? {};

    // (2) Đơn paid nhóm theo (gói, số tiền) → suy ra doanh thu/gói + đếm lệch giá trong JS.
    const paidRows = await q(sql`
      SELECT product, amount_vnd, COUNT(*)::int AS n
      FROM orders WHERE status='paid' GROUP BY product, amount_vnd`);

    // (3) Enrollment theo gói (kèm free/paid) trong 1 query.
    const enrRows = await q(sql`
      SELECT package, COUNT(*)::int AS n,
        COUNT(*) FILTER (WHERE order_id IS NULL)::int     AS free_n,
        COUNT(*) FILTER (WHERE order_id IS NOT NULL)::int AS paid_n
      FROM enrollments GROUP BY package`);

    // (4) Phân bố theo user (paying / free-only / số gói / nâng cấp) trong 1 query.
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
            SELECT user_id,
              COUNT(*)                                   AS total_pkgs,
              COUNT(*) FILTER (WHERE order_id IS NOT NULL) AS paid_pkgs
            FROM enrollments GROUP BY user_id
          ) t`)
      )[0] ?? {};

    // (5) Tổng tài khoản.
    const usersTotal = n((await q(sql`SELECT COUNT(*)::int AS n FROM profiles`))[0]?.n);

    // (6–8) Chuỗi 30 ngày (giờ VN).
    const revSeries = fillSeries(
      await q(sql`
        SELECT to_char(date_trunc('day', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COALESCE(SUM(amount_vnd),0)::bigint AS value
        FROM orders WHERE status='paid' AND paid_at >= now() - interval '30 days' GROUP BY 1`),
      days,
    );
    const ordSeries = fillSeries(
      await q(sql`
        SELECT to_char(date_trunc('day', created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COUNT(*)::int AS value
        FROM orders WHERE created_at >= now() - interval '30 days' GROUP BY 1`),
      days,
    );
    const signupSeries = fillSeries(
      await q(sql`
        SELECT to_char(date_trunc('day', created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COUNT(*)::int AS value
        FROM profiles WHERE created_at >= now() - interval '30 days' GROUP BY 1`),
      days,
    );

    // (9–10) Hoạt động gần đây.
    const recentPaidRows = await q(sql`
      SELECT o.transfer_code, o.product, o.amount_vnd, o.paid_at, p.email
      FROM orders o LEFT JOIN profiles p ON p.id = o.user_id
      WHERE o.status='paid' ORDER BY o.paid_at DESC NULLS LAST LIMIT 5`);
    const recentSignupRows = await q(sql`
      SELECT email, full_name, created_at FROM profiles ORDER BY created_at DESC LIMIT 5`);

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
        today: signupSeries.at(-1)?.value ?? 0,
        d7: tail(signupSeries, 7),
        d30: tail(signupSeries, 30),
        paying,
        freeLeads: n(uAgg.free_only),
        signupToPaidRate: usersTotal > 0 ? paying / usersTotal : 0,
      },
      enrollmentsByPackage,
      k1: { free: k1Free, paid: k1Paid },
      promo: { claimed: k1Free, limit: PROMO_FREE_LIMIT, expired: promoExpired() },
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
    };
  } catch (err) {
    console.error("[admin-stats] query failed:", err);
    return emptyStats();
  }
}
