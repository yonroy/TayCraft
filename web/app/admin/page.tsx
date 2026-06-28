import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdminConfirmButton } from "@/components/admin-order-actions";
import { AdminFlashSale } from "@/components/admin-flash-sale";
import { AdminStats } from "@/components/admin-stats";
import { getUser, isAdmin } from "@/lib/auth";
import { getFlashSale } from "@/lib/settings";
import { getAdminStats } from "@/lib/admin-stats";
import { productById, effectivePriceVnd } from "@/lib/products";
import { db } from "@/lib/db";
import { orders, profiles } from "@/lib/db/schema";
import { formatVnd } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Chờ TT", cls: "text-accent-2" },
  paid: { label: "Đã trả", cls: "text-accent font-semibold" },
  canceled: { label: "Hủy", cls: "text-dim" },
};

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user.email)) redirect("/");

  // Tuần tự (KHÔNG Promise.all): pooler max:1 transaction-mode treo nếu chạy đồng thời → 504.
  const stats = await getAdminStats();
  const flash = await getFlashSale();
  const rows = await db
    .select({
      id: orders.id,
      transferCode: orders.transferCode,
      product: orders.product,
      amountVnd: orders.amountVnd,
      status: orders.status,
      createdAt: orders.createdAt,
      paidAt: orders.paidAt,
      email: profiles.email,
    })
    .from(orders)
    .leftJoin(profiles, eq(orders.userId, profiles.id))
    .orderBy(desc(orders.createdAt))
    .limit(100);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 flex-1">
        <h1 className="text-2xl font-bold">Tổng quan quản trị</h1>
        <p className="text-dim mt-1">
          {stats.orders.total} đơn · {stats.orders.pending} chờ · {stats.orders.paid} đã trả ·{" "}
          <b className="text-ink">
            K1 free: {stats.promo.claimed}/{stats.promo.limit}
          </b>
        </p>

        <div className="mt-6">
          <AdminStats stats={stats} />
        </div>

        <div className="mt-8">
          <AdminFlashSale initial={flash} />
        </div>

        <h2 className="mt-8 text-lg font-semibold">100 đơn gần nhất</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Mã CK</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Gói</th>
                <th className="px-4 py-3 font-medium">Số tiền</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Tạo lúc</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-dim">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const prod = productById(r.product);
                  const priceMismatch = prod != null && r.amountVnd !== effectivePriceVnd(prod);
                  return (
                  <tr key={r.id} className="border-t border-line">
                    <td className="px-4 py-3 font-mono font-bold">{r.transferCode}</td>
                    <td className="px-4 py-3 text-dim">{r.email ?? "—"}</td>
                    <td className="px-4 py-3">{prod?.label ?? r.product}</td>
                    <td className="px-4 py-3">
                      {formatVnd(r.amountVnd)}
                      {priceMismatch && (
                        <span
                          className="ml-1 text-accent-2"
                          title={`Lệch giá gói ${prod.label} (${formatVnd(effectivePriceVnd(prod))})`}
                        >
                          ⚠️
                        </span>
                      )}
                    </td>
                    <td className={`px-4 py-3 ${STATUS[r.status]?.cls ?? ""}`}>
                      {STATUS[r.status]?.label ?? r.status}
                    </td>
                    <td className="px-4 py-3 text-dim">
                      {new Date(r.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.status === "pending" && <AdminConfirmButton orderId={r.id} />}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
