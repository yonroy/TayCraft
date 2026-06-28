// Bố cục dashboard "Tổng quan" cho /admin. Server component thuần (số liệu SSR).
import type { AdminStats } from "@/lib/admin-stats";
import { BarChart, FunnelBars } from "@/components/admin-charts";
import { formatVnd } from "@/lib/utils";

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const compactVnd = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}tr` : v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`;

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "lam" | "cam";
}) {
  const valueCls =
    accent === "lam" ? "text-accent" : accent === "cam" ? "text-accent-2" : "text-ink";
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="text-xs text-dim">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${valueCls}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-dim">{sub}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function AdminStats({ stats }: { stats: AdminStats }) {
  const { revenue, orders, users, promo } = stats;

  return (
    <section className="space-y-6">
      {!stats.ok && (
        <div className="rounded-xl border border-accent-2/40 bg-accent-2/5 px-4 py-3 text-sm text-accent-2">
          ⚠️ Không tải được số liệu (DB chưa sẵn sàng). Các con số bên dưới là 0.
        </div>
      )}

      {/* Lưới thẻ KPI */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Doanh thu đã thu"
          value={formatVnd(revenue.total)}
          sub={`Hôm nay +${compactVnd(revenue.today)} · 7d +${compactVnd(revenue.d7)}`}
          accent="lam"
        />
        <StatCard
          label="Doanh thu 30 ngày"
          value={formatVnd(revenue.d30)}
          sub={`Đang chờ: ${formatVnd(revenue.pending)}`}
        />
        <StatCard
          label="Giá trị đơn TB"
          value={formatVnd(revenue.aov)}
          sub={`${orders.paid} đơn đã trả`}
        />
        <StatCard
          label="Tỷ lệ chốt đơn"
          value={pct(orders.closeRate)}
          sub={`${orders.paid} trả / ${orders.canceled} hủy`}
        />

        <StatCard
          label="Đơn đã trả"
          value={orders.paid.toLocaleString("vi-VN")}
          sub={`Hôm nay +${orders.today} · 7d +${orders.d7}`}
          accent="lam"
        />
        <StatCard
          label="Đơn chờ thanh toán"
          value={orders.pending.toLocaleString("vi-VN")}
          sub={orders.priceMismatch > 0 ? `⚠️ ${orders.priceMismatch} đơn lệch giá` : "Không lệch giá"}
          accent="cam"
        />
        <StatCard
          label="Tài khoản"
          value={users.total.toLocaleString("vi-VN")}
          sub={`Hôm nay +${users.today} · 7d +${users.d7}`}
        />
        <StatCard
          label="Khách trả tiền"
          value={users.paying.toLocaleString("vi-VN")}
          sub={`Chuyển đổi ${pct(users.signupToPaidRate)} · ${users.freeLeads} lead free`}
          accent="lam"
        />
      </div>

      {/* Tiến độ khai trương */}
      <Card title={`Suất K1 khai trương đã phát · ${promo.claimed}/${promo.limit}`}>
        <div className="h-3 w-full overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-accent-2"
            style={{ width: `${Math.min(100, (promo.claimed / Math.max(1, promo.limit)) * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-dim">
          K1 free: <b className="text-ink">{stats.k1.free}</b> · K1 mua: {stats.k1.paid} ·{" "}
          {promo.expired ? "Đã hết hạn khuyến mãi" : "Đang trong khuyến mãi"}
        </p>
      </Card>

      {/* Biểu đồ xu hướng 30 ngày */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Doanh thu / ngày (30d)">
          <BarChart data={stats.series.revenue} color="var(--color-accent)" format={formatVnd} />
        </Card>
        <Card title="Đơn mới / ngày (30d)">
          <BarChart data={stats.series.orders} color="var(--color-accent-2)" />
        </Card>
        <Card title="Tài khoản mới / ngày (30d)">
          <BarChart data={stats.series.signups} color="#7c5cff" />
        </Card>
      </div>

      {/* Phễu + Phân bố số gói/user */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Phễu chuyển đổi">
          <FunnelBars steps={stats.funnel} />
        </Card>
        <Card title="Phân bố số gói / khách">
          <table className="w-full text-sm">
            <tbody>
              {stats.packagesPerUser.map((r) => (
                <tr key={r.bucket} className="border-t border-line first:border-0">
                  <td className="py-2 text-ink">{r.bucket}</td>
                  <td className="py-2 text-right tabular-nums font-medium">
                    {r.count.toLocaleString("vi-VN")} khách
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Bảng phân tách: doanh thu theo gói + enrollment theo gói */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Doanh thu theo gói">
          <table className="w-full text-sm">
            <thead className="text-left text-dim">
              <tr>
                <th className="pb-2 font-medium">Gói</th>
                <th className="pb-2 text-right font-medium">Đơn</th>
                <th className="pb-2 text-right font-medium">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {stats.revenueByProduct.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-3 text-center text-dim">
                    Chưa có đơn đã trả.
                  </td>
                </tr>
              ) : (
                stats.revenueByProduct.map((r) => (
                  <tr key={r.product} className="border-t border-line">
                    <td className="py-2 text-ink">{r.label}</td>
                    <td className="py-2 text-right tabular-nums">{r.count}</td>
                    <td className="py-2 text-right tabular-nums font-medium">
                      {formatVnd(r.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
        <Card title="Quyền sở hữu theo gói (enrollment)">
          <table className="w-full text-sm">
            <thead className="text-left text-dim">
              <tr>
                <th className="pb-2 font-medium">Gói</th>
                <th className="pb-2 text-right font-medium">Số khóa</th>
                <th className="pb-2 text-right font-medium">Số khách</th>
              </tr>
            </thead>
            <tbody>
              {stats.enrollmentsByPackage.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-3 text-center text-dim">
                    Chưa có enrollment.
                  </td>
                </tr>
              ) : (
                stats.enrollmentsByPackage.map((r) => (
                  <tr key={r.package} className="border-t border-line">
                    <td className="py-2 text-ink">{r.label}</td>
                    <td className="py-2 text-right tabular-nums text-dim">{r.courses}</td>
                    <td className="py-2 text-right tabular-nums font-medium">{r.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Hoạt động gần đây */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Đơn đã trả gần nhất">
          {stats.recentPaid.length === 0 ? (
            <p className="text-sm text-dim">Chưa có.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.recentPaid.map((r) => (
                <li key={r.transferCode} className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate">
                    <span className="font-mono font-semibold">{r.transferCode}</span>{" "}
                    <span className="text-dim">{r.email ?? "—"}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-accent font-medium">
                    {formatVnd(r.amountVnd)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Tài khoản mới nhất">
          {stats.recentSignups.length === 0 ? (
            <p className="text-sm text-dim">Chưa có.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.recentSignups.map((r) => (
                <li key={r.email + r.createdAt} className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-ink">{r.fullName ?? r.email}</span>
                  <span className="shrink-0 text-xs text-dim">
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}
