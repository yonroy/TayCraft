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

const giftReward = (p: number) => (p >= 100 ? "🏆 FREE (100%)" : `Giảm ${p}%`);

const SKIP_REASON_LABEL: Record<string, string> = {
  no_transfer_code: "Không tìm thấy mã đơn trong nội dung chuyển khoản",
  order_not_found: "Có mã nhưng không khớp đơn đang chờ (có thể đã trả/hủy)",
  amount_mismatch: "Số tiền chuyển ít hơn giá đơn",
};

export function AdminStats({ stats }: { stats: AdminStats }) {
  const { revenue, orders, users, promo, gift, ops } = stats;

  return (
    <section className="space-y-6">
      {!stats.ok && (
        <div className="rounded-xl border border-accent-2/40 bg-accent-2/5 px-4 py-3 text-sm text-accent-2">
          ⚠️ Không tải được số liệu (DB chưa sẵn sàng). Các con số bên dưới là 0.
        </div>
      )}

      {/* Giao dịch webhook vào tiền nhưng CHƯA khớp đơn — CẢNH BÁO ưu tiên cao nhất: tiền thật có
          thể đã vào tài khoản ngân hàng của shop mà khách chưa được mở khóa (khách mất tiền, admin
          không biết trừ khi khách tự nhắn báo). Đặt ngay đầu trang để không ai bỏ sót. */}
      {ops.health.paymentEventsTable !== "ok" ? (
        <div className="rounded-xl border border-accent-2/40 bg-accent-2/5 px-4 py-3 text-sm text-accent-2">
          ⚠️ Bảng <code className="font-mono">payment_webhook_events</code>{" "}
          {ops.health.paymentEventsTable === "missing" ? "CHƯA tồn tại" : "không kiểm tra được"} — chưa
          ghi được giao dịch webhook nào, chưa thể cảnh báo &quot;vào tiền nhưng chưa khớp đơn&quot;.
          Chạy{" "}
          <code className="font-mono">drizzle/payment-webhook-events.sql</code> trong Supabase SQL
          Editor.
        </div>
      ) : ops.skippedPayments.length > 0 ? (
        <div className="rounded-xl border-2 border-red-400 bg-red-50 px-4 py-4">
          <p className="font-bold text-red-700">
            🚨 {ops.skippedPayments.length} giao dịch vào tiền nhưng CHƯA khớp đơn — kiểm tra ngay
          </p>
          <p className="mt-1 text-xs text-red-600">
            Khách có thể đã chuyển khoản thành công nhưng sai/thiếu nội dung nên hệ thống không tự
            khớp được đơn. Đối chiếu sao kê ngân hàng rồi duyệt tay ở bảng &quot;100 đơn gần
            nhất&quot; bên dưới nếu đúng là đơn thật.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-red-700">
                <tr>
                  <th className="pb-1 pr-3 font-medium">Lúc nhận</th>
                  <th className="pb-1 pr-3 text-right font-medium">Số tiền</th>
                  <th className="pb-1 pr-3 font-medium">Mã nhận diện được</th>
                  <th className="pb-1 font-medium">Lý do bỏ qua</th>
                </tr>
              </thead>
              <tbody>
                {ops.skippedPayments.map((r, i) => (
                  <tr key={i} className="border-t border-red-200">
                    <td className="whitespace-nowrap py-1 pr-3 text-red-800">
                      {new Date(r.receivedAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-1 pr-3 text-right tabular-nums font-medium text-red-800">
                      {r.transferAmount != null ? formatVnd(r.transferAmount) : "—"}
                    </td>
                    <td className="py-1 pr-3 font-mono text-red-800">
                      {r.matchedTransferCode ?? "— (không nhận diện được)"}
                    </td>
                    <td className="py-1 text-red-700">
                      {SKIP_REASON_LABEL[r.skipReason] ?? r.skipReason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-dim">
          ✅ Không có giao dịch webhook nào bị bỏ qua gần đây.
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
          sub={
            `Hôm nay +${users.today} · 7d +${users.d7}` +
            (users.rawRowCount !== users.total
              ? ` · ⚠️ ${users.rawRowCount.toLocaleString("vi-VN")} dòng đăng nhập (đếm theo email duy nhất, không phải số dòng)`
              : "")
          }
        />
        <StatCard
          label="Khách trả tiền"
          value={users.paying.toLocaleString("vi-VN")}
          sub={`Chuyển đổi ${pct(users.signupToPaidRate)} · ${users.freeLeads} lead free`}
          accent="lam"
        />
        <StatCard
          label="Lượt nhận quà 🎁"
          value={gift.total.toLocaleString("vi-VN")}
          sub={`Hôm nay +${gift.today} · 7d +${gift.d7} · 🏆 FREE ${gift.freeWon}`}
          accent="cam"
        />
        <StatCard
          label="Không nhận quà 👀"
          value={gift.impressions >= gift.total && gift.impressions > 0 ? gift.notClaimed.toLocaleString("vi-VN") : "—"}
          sub={
            gift.impressions === 0
              ? gift.health.impressionsTable === "ok"
                ? "0 lượt thấy ghi nhận — chưa đủ dữ liệu để so, không phải ai cũng bỏ qua"
                : "Bảng đếm lượt thấy chưa sẵn sàng (xem cảnh báo bên dưới)"
              : gift.impressions < gift.total
                ? `Chỉ ${gift.impressions.toLocaleString("vi-VN")} lượt thấy nhưng ${gift.total.toLocaleString("vi-VN")} lượt nhận — đếm lượt thấy mới bật SAU một số lượt nhận, chưa so được`
                : `${gift.impressions.toLocaleString("vi-VN")} người thấy · tỷ lệ nhận ${pct(gift.total / gift.impressions)} · ⚠️ chưa loại được tài khoản test`
          }
        />
      </div>

      {/* Tiến độ khai trương — CHỈ tính suất khuyến mãi cũ, không gộp suất trúng hộp quà vào
          (trước đây gộp chung khiến "K1 free" trông như phóng đại gấp nhiều lần tác động hộp quà). */}
      <Card title={`Suất K1 khai trương đã phát · ${promo.claimed}/${promo.limit}`}>
        <div className="h-3 w-full overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-accent-2"
            style={{ width: `${Math.min(100, (promo.claimed / Math.max(1, promo.limit)) * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-dim">
          K1 free — khai trương: <b className="text-ink">{stats.k1.freeViaLaunchPromo}</b> · trúng hộp
          quà: <b className="text-accent-2">{stats.k1.freeViaGiftJackpot}</b> (2 nguồn khác nhau, không
          cộng dồn) · K1 mua: {stats.k1.paid} ·{" "}
          {promo.expired ? "Đã hết hạn khuyến mãi" : "Đang trong khuyến mãi"}
        </p>
      </Card>

      {/* Sức khỏe hộp quà — để nhìn 1 cái biết đang SỐNG hay CHẾT, không phải suy đoán từ total=0 */}
      {(gift.health.discountsTable !== "ok" || gift.health.impressionsTable !== "ok") && (
        <div className="rounded-xl border border-accent-2/40 bg-accent-2/5 px-4 py-3 text-sm">
          <p className="font-semibold text-accent-2">⚠️ Hộp quà đang KHÔNG hoạt động đầy đủ</p>
          <ul className="mt-1 list-disc pl-5 text-accent-2/90">
            {gift.health.discountsTable !== "ok" && (
              <li>
                Bảng <code className="font-mono">gift_discounts</code> {gift.health.discountsTable === "missing" ? "CHƯA tồn tại" : "không kiểm tra được"} — khách bấm &quot;Mở hộp quà&quot; sẽ chỉ thấy &quot;Có lỗi, bạn thử lại nhé.&quot;, không nhận được quà nào. Chạy{" "}
                <code className="font-mono">drizzle/gift-discounts.sql</code> trong Supabase SQL Editor.
              </li>
            )}
            {gift.health.impressionsTable !== "ok" && (
              <li>
                Bảng <code className="font-mono">gift_impressions</code> {gift.health.impressionsTable === "missing" ? "CHƯA tồn tại" : "không kiểm tra được"} — số &quot;người thấy mà không nhận&quot; sẽ luôn là 0 (thiếu, không sai). Chạy{" "}
                <code className="font-mono">drizzle/gift-impressions.sql</code>.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Hộp quà giảm giá */}
      <Card title={`Hộp quà 🎁 — ${gift.total} lượt nhận · ${gift.freeWon} trúng FREE`}>
        {gift.tiers.length === 0 ? (
          <p className="text-sm text-dim">
            {gift.health.discountsTable === "ok" ? "Chưa có ai nhận quà." : "Chưa đọc được dữ liệu (xem cảnh báo phía trên)."}
          </p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="text-left text-dim">
                <tr>
                  <th className="pb-2 font-medium">Phần thưởng</th>
                  <th className="pb-2 text-right font-medium">Số lượt</th>
                  <th className="pb-2 text-right font-medium">% thực tế</th>
                  <th className="pb-2 text-right font-medium">% lý thuyết</th>
                  <th className="pb-2 text-right font-medium">Đã dùng trước hạn</th>
                </tr>
              </thead>
              <tbody>
                {gift.tiers.map((r) => {
                  const deviation = r.actualPct - r.theoreticalPct;
                  // Chỉ cờ farm cho mức CÒN trong cấu hình hiện tại — mức cũ (isLegacyTier) luôn có
                  // theoreticalPct=0 nên sẽ luôn "lệch", không phải dấu hiệu farm, chỉ là dữ liệu cũ.
                  const flagFarm = !r.isLegacyTier && r.percent >= 100 && deviation > 5;
                  return (
                    <tr key={r.percent} className="border-t border-line">
                      <td className={`py-2 ${r.percent >= 100 ? "font-semibold text-accent-2" : "text-ink"}`}>
                        {giftReward(r.percent)}
                        {r.isLegacyTier && (
                          <span className="ml-1.5 text-xs font-normal text-dim" title="Mức % này không còn trong cấu hình hiện tại — dữ liệu từ trọng số CŨ, đã đổi">
                            (mức cũ)
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right tabular-nums font-medium">
                        {r.count.toLocaleString("vi-VN")}
                      </td>
                      <td className="py-2 text-right tabular-nums text-dim">
                        {r.actualPct.toFixed(1)}%
                        {flagFarm && (
                          <span className="ml-1 text-accent-2" title="Lệch mạnh so với lý thuyết — có thể là dấu hiệu farm đa tài khoản">
                            ⚠️
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right tabular-nums text-dim">
                        {r.isLegacyTier ? "— (mức cũ)" : `${r.theoreticalPct.toFixed(1)}%`}
                      </td>
                      <td className="py-2 text-right tabular-nums text-dim">
                        {r.usedCount.toLocaleString("vi-VN")} ({r.usedPct.toFixed(1)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-dim">
              &quot;% lý thuyết&quot; tính từ đúng trọng số đang cấu hình trong code HIỆN TẠI. Bảng trọng số
              đã đổi ít nhất 1 lần trong lịch sử — dòng đánh dấu &quot;(mức cũ)&quot; là % không còn tồn tại
              trong cấu hình bây giờ, so lý thuyết với chúng VÔ NGHĨA (không phải bug hay farm). Chỉ nghi
              farm khi mức FREE CÒN TRONG cấu hình hiện tại mà % thực tế cao hơn hẳn lý thuyết (xem ⚠️).
              &quot;Đã dùng trước hạn&quot; = đã thanh toán K1 trước khi quà hết hạn (FREE luôn tính 100% vì
              cấp thẳng không qua thanh toán). Tổng mẫu hiện tại: <b>{gift.total}</b> lượt — dưới 30 thì
              mọi tỷ lệ ở đây chỉ mang tính tham khảo, chưa đủ để kết luận.
            </p>
          </>
        )}
      </Card>

      {/* So sánh chuyển đổi: nhận quà vs không nhận quà */}
      <Card title="Hộp quà có tạo thêm doanh thu, hay chỉ giảm giá cho người vốn đã định mua?">
        <table className="w-full text-sm">
          <thead className="text-left text-dim">
            <tr>
              <th className="pb-2 font-medium">Nhóm</th>
              <th className="pb-2 text-right font-medium">Số người</th>
              <th className="pb-2 text-right font-medium">Đã mua K1</th>
              <th className="pb-2 text-right font-medium">Tỷ lệ mua</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="py-2 text-ink">Nhận quà giảm (30/50/70%)</td>
              <td className="py-2 text-right tabular-nums">
                {gift.conversion.nonFreeRecipients.toLocaleString("vi-VN")}
              </td>
              <td className="py-2 text-right tabular-nums">
                {gift.conversion.nonFreePaid.toLocaleString("vi-VN")}
              </td>
              <td className="py-2 text-right tabular-nums font-semibold text-accent">
                {pct(gift.conversion.nonFreePaidRate)}
              </td>
            </tr>
            <tr className="border-t border-line">
              <td className="py-2 text-ink">Không nhận quà (chưa từng mở)</td>
              <td className="py-2 text-right tabular-nums">
                {gift.conversion.noGiftUsers.toLocaleString("vi-VN")}
              </td>
              <td className="py-2 text-right tabular-nums">
                {gift.conversion.noGiftUsersPaidK1.toLocaleString("vi-VN")}
              </td>
              <td className="py-2 text-right tabular-nums font-semibold">
                {pct(gift.conversion.noGiftUsersPaidRate)}
              </td>
            </tr>
            {gift.conversion.freeRecipients > 0 && (
              <tr className="border-t border-line text-dim">
                <td className="py-2">Trúng FREE (tham khảo, không tính vào so sánh)</td>
                <td className="py-2 text-right tabular-nums">{gift.conversion.freeRecipients}</td>
                <td className="py-2 text-right tabular-nums" colSpan={2}>
                  cấp thẳng, không qua quyết định mua
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-dim">
          Mẫu: <b>{gift.conversion.nonFreeRecipients}</b> người nhận quà giảm ·{" "}
          <b>{gift.conversion.noGiftUsers}</b> người chưa nhận
          {gift.conversion.nonFreeRecipients < 30 || gift.conversion.noGiftUsers < 30
            ? " — cả hai đều dưới 30, tỷ lệ trên KHÔNG đủ tin cậy để kết luận, chỉ để theo dõi xu hướng."
            : "."}{" "}
          ⚠️ KHÔNG phải thử nghiệm ngẫu nhiên (A/B test): người tự bấm &quot;Mở hộp quà&quot; có thể vốn đã
          quan tâm hơn mức trung bình (thiên lệch tự chọn). Tỷ lệ mua cao hơn ở nhóm nhận quà không
          chứng minh được hộp quà LÀ NGUYÊN NHÂN — chỉ là tín hiệu tham khảo tốt nhất hiện có với dữ
          liệu đang thu thập.
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

      {/* Lỗi gần đây — bảng app_errors, ghi song song với console.error/warn ở [gift]/[sepay]/
          [admin-stats]/[auth/callback]. Trước đây phải vào Vercel Logs mới thấy được. */}
      <Card
        title={`Lỗi gần đây${ops.health.appErrorsTable !== "ok" ? " — bảng chưa sẵn sàng" : ""}`}
      >
        {ops.health.appErrorsTable !== "ok" ? (
          <p className="text-sm text-dim">
            Bảng <code className="font-mono">app_errors</code>{" "}
            {ops.health.appErrorsTable === "missing" ? "CHƯA tồn tại" : "không kiểm tra được"}. Chạy{" "}
            <code className="font-mono">drizzle/app-errors.sql</code> trong Supabase SQL Editor.
          </p>
        ) : ops.recentErrors.length === 0 ? (
          <p className="text-sm text-dim">Chưa ghi nhận lỗi nào — hộp quà và thanh toán đang chạy sạch.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {ops.recentErrors.map((e, i) => (
              <li key={i} className="border-t border-line pt-2 first:border-0 first:pt-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-accent-2">{e.context}</span>
                  <span className="shrink-0 text-xs text-dim">
                    {new Date(e.occurredAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-dim" title={e.message}>
                  {e.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
