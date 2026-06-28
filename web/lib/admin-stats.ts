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

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [
      revAgg,
      ordersStatus,
      usersTotalRow,
      revByProductRows,
      paidPriceRows,
      enrollByPkgRows,
      k1Row,
      payingRow,
      freeLeadsRow,
      pkgPerUserRows,
      funnelRow,
      revSeriesRows,
      ordSeriesRows,
      signupSeriesRows,
      recentPaidRows,
      recentSignupRows,
    ] = await Promise.all([
      q(sql`
        SELECT
          COALESCE(SUM(amount_vnd) FILTER (WHERE status='paid'),0)::bigint AS total,
          COALESCE(SUM(amount_vnd) FILTER (WHERE status='pending'),0)::bigint AS pending,
          COALESCE(AVG(amount_vnd) FILTER (WHERE status='paid'),0)::float AS aov
        FROM orders`),
      q(sql`SELECT status, COUNT(*)::int AS n FROM orders GROUP BY status`),
      q(sql`SELECT COUNT(*)::int AS n FROM profiles`),
      q(sql`
        SELECT product, COUNT(*)::int AS n, COALESCE(SUM(amount_vnd),0)::bigint AS revenue
        FROM orders WHERE status='paid' GROUP BY product`),
      q(sql`
        SELECT product, amount_vnd, COUNT(*)::int AS n
        FROM orders WHERE status='paid' GROUP BY product, amount_vnd`),
      q(sql`SELECT package, COUNT(*)::int AS n FROM enrollments GROUP BY package`),
      q(sql`
        SELECT
          COUNT(*) FILTER (WHERE order_id IS NULL)::int AS free,
          COUNT(*) FILTER (WHERE order_id IS NOT NULL)::int AS paid
        FROM enrollments WHERE package='k1'`),
      q(sql`SELECT COUNT(DISTINCT user_id)::int AS n FROM enrollments WHERE order_id IS NOT NULL`),
      q(sql`
        SELECT COUNT(*)::int AS n FROM (
          SELECT user_id FROM enrollments GROUP BY user_id HAVING bool_and(order_id IS NULL)
        ) t`),
      q(sql`
        SELECT c, COUNT(*)::int AS n FROM (
          SELECT user_id, COUNT(*) AS c FROM enrollments GROUP BY user_id
        ) t GROUP BY c`),
      q(sql`
        SELECT
          (SELECT COUNT(*)::int FROM profiles) AS signups,
          (SELECT COUNT(DISTINCT user_id)::int FROM orders) AS initiated,
          (SELECT COUNT(DISTINCT user_id)::int FROM orders WHERE status='paid') AS paid,
          (SELECT COUNT(*)::int FROM (
            SELECT user_id FROM enrollments WHERE order_id IS NOT NULL
            GROUP BY user_id HAVING COUNT(*) >= 2
          ) u) AS upgraded`),
      q(sql`
        SELECT to_char(date_trunc('day', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COALESCE(SUM(amount_vnd),0)::bigint AS value
        FROM orders WHERE status='paid' AND paid_at >= now() - interval '30 days' GROUP BY 1`),
      q(sql`
        SELECT to_char(date_trunc('day', created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COUNT(*)::int AS value
        FROM orders WHERE created_at >= now() - interval '30 days' GROUP BY 1`),
      q(sql`
        SELECT to_char(date_trunc('day', created_at AT TIME ZONE 'Asia/Ho_Chi_Minh'),'YYYY-MM-DD') AS day,
               COUNT(*)::int AS value
        FROM profiles WHERE created_at >= now() - interval '30 days' GROUP BY 1`),
      q(sql`
        SELECT o.transfer_code, o.product, o.amount_vnd, o.paid_at, p.email
        FROM orders o LEFT JOIN profiles p ON p.id = o.user_id
        WHERE o.status='paid' ORDER BY o.paid_at DESC NULLS LAST LIMIT 5`),
      q(sql`SELECT email, full_name, created_at FROM profiles ORDER BY created_at DESC LIMIT 5`),
    ]);

    const days = last30VnDays();
    const revSeries = fillSeries(revSeriesRows, days);
    const ordSeries = fillSeries(ordSeriesRows, days);
    const signupSeries = fillSeries(signupSeriesRows, days);

    // Đơn theo trạng thái (toàn bảng) — sửa bug đếm-trong-100.
    let oPending = 0,
      oPaid = 0,
      oCanceled = 0;
    for (const r of ordersStatus) {
      const v = n(r.n);
      if (r.status === "pending") oPending = v;
      else if (r.status === "paid") oPaid = v;
      else if (r.status === "canceled") oCanceled = v;
    }
    const ordersTotal = oPending + oPaid + oCanceled;
    const closeRate = oPaid + oCanceled > 0 ? oPaid / (oPaid + oCanceled) : 0;

    // Lệch giá: so amount paid với giá gói có hiệu lực (tính trong JS theo promo state).
    let priceMismatch = 0;
    for (const r of paidPriceRows) {
      const prod = productById(String(r.product));
      if (prod && n(r.amount_vnd) !== effectivePriceVnd(prod)) priceMismatch += n(r.n);
    }

    const revenueByProduct: ProductRevenue[] = revByProductRows
      .map((r) => ({
        product: String(r.product),
        label: productById(String(r.product))?.label ?? String(r.product),
        count: n(r.n),
        revenue: n(r.revenue),
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const enrollmentsByPackage: PackageRow[] = enrollByPkgRows
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

    // Phân bố số gói/user → 3 nhóm.
    let p1 = 0,
      p2 = 0,
      p3 = 0;
    for (const r of pkgPerUserRows) {
      const c = n(r.c),
        cnt = n(r.n);
      if (c <= 1) p1 += cnt;
      else if (c === 2) p2 += cnt;
      else p3 += cnt;
    }
    const packagesPerUser: PackagesPerUserRow[] = [
      { bucket: "1 gói", count: p1 },
      { bucket: "2 gói", count: p2 },
      { bucket: "3+ gói", count: p3 },
    ];

    const usersTotal = n(usersTotalRow[0]?.n);
    const paying = n(payingRow[0]?.n);

    const f = funnelRow[0] ?? {};
    const funnel: FunnelStep[] = [
      { label: "Tài khoản", value: n(f.signups) },
      { label: "Tạo đơn", value: n(f.initiated) },
      { label: "Đã trả", value: n(f.paid) },
      { label: "Nâng cấp (≥2 gói)", value: n(f.upgraded) },
    ];

    const rev = revAgg[0] ?? {};

    return {
      ok: true,
      revenue: {
        total: n(rev.total),
        today: revSeries.at(-1)?.value ?? 0,
        d7: tail(revSeries, 7),
        d30: tail(revSeries, 30),
        pending: n(rev.pending),
        aov: Math.round(n(rev.aov)),
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
        freeLeads: n(freeLeadsRow[0]?.n),
        signupToPaidRate: usersTotal > 0 ? paying / usersTotal : 0,
      },
      enrollmentsByPackage,
      k1: { free: n(k1Row[0]?.free), paid: n(k1Row[0]?.paid) },
      promo: { claimed: n(k1Row[0]?.free), limit: PROMO_FREE_LIMIT, expired: promoExpired() },
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
