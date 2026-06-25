import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdminConfirmButton } from "@/components/admin-order-actions";
import { AdminFlashSale } from "@/components/admin-flash-sale";
import { getUser, isAdmin } from "@/lib/auth";
import { getFlashSale } from "@/lib/settings";
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

  const rows = await db
    .select({
      id: orders.id,
      transferCode: orders.transferCode,
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

  const pending = rows.filter((r) => r.status === "pending").length;
  const paid = rows.filter((r) => r.status === "paid").length;
  const flash = await getFlashSale();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-5 py-10 flex-1">
        <h1 className="text-2xl font-bold">Quản trị đơn hàng</h1>
        <p className="text-dim mt-1">
          {rows.length} đơn · {pending} chờ thanh toán · {paid} đã trả
        </p>

        <div className="mt-6">
          <AdminFlashSale initial={flash} />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Mã CK</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Số tiền</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Tạo lúc</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-dim">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-line">
                    <td className="px-4 py-3 font-mono font-bold">{r.transferCode}</td>
                    <td className="px-4 py-3 text-dim">{r.email ?? "—"}</td>
                    <td className="px-4 py-3">{formatVnd(r.amountVnd)}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
