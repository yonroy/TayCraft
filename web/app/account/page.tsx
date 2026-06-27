import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getUser, accessibleCourses } from "@/lib/auth";
import { COURSES } from "@/lib/products";
import { FREE_COURSES } from "@/lib/lessons";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { formatVnd } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  canceled: "Đã hủy",
};

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/account");

  const courses = await accessibleCourses(user.id);
  const full = COURSES.every((c) => courses.includes(c.id));
  const hasPaid = courses.some((c) => !FREE_COURSES.includes(c));
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5 py-10 flex-1">
        <h1 className="text-2xl font-bold">Tài khoản</h1>
        <p className="text-dim mt-1">{user.email}</p>

        <div className="mt-6 rounded-2xl border border-line p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold">Trạng thái</div>
            <div className="text-dim text-sm">
              {full
                ? "Đã mở khóa trọn bộ ✅"
                : hasPaid
                  ? "Đã mở khóa một phần"
                  : "Chưa mua khóa học"}
            </div>
          </div>
          {hasPaid ? (
            <Link href="/learn">
              <Button>Vào học</Button>
            </Link>
          ) : (
            <Link href="/#goi">
              <Button>Xem các gói</Button>
            </Link>
          )}
        </div>

        <h2 className="mt-8 font-bold">Lịch sử đơn hàng</h2>
        {myOrders.length === 0 ? (
          <p className="text-dim text-sm mt-2">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="mt-3 grid gap-2">
            {myOrders.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border border-line px-4 py-3 flex items-center justify-between text-sm"
              >
                <div>
                  <span className="font-mono font-bold">{o.transferCode}</span>
                  <span className="text-dim ml-3">
                    {new Date(o.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{formatVnd(o.amountVnd)}</span>
                  <span
                    className={
                      o.status === "paid"
                        ? "text-accent font-semibold"
                        : o.status === "pending"
                          ? "text-accent-2"
                          : "text-dim"
                    }
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
