import { SiteFooter } from "@/components/site-footer";
import { HeaderSkeleton, Skel } from "@/components/skeletons";

// Khung xương /admin — trang nặng nhất (thống kê + 2 bảng), mỗi truy vấn chạy TUẦN TỰ vì
// pooler max:1 nên chờ lâu nhất. Giữ max-w-6xl, khối thống kê và khung 2 bảng cuộn ngang.

function TableSkeleton({ cols, rows }: { cols: number; rows: number }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
      <div className="min-w-[640px]">
        <div className="bg-paper flex gap-4 px-4 py-3">
          {Array.from({ length: cols }, (_, i) => (
            <Skel key={i} className="h-[15px] flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="border-t border-line flex gap-4 px-4 py-3.5">
            {Array.from({ length: cols }, (_, i) => (
              <Skel key={i} className="h-[15px] flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingAdmin() {
  return (
    <>
      <HeaderSkeleton />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 flex-1">
        <h1 className="text-2xl font-bold">Tổng quan quản trị</h1>
        <Skel className="mt-2 h-[19px] w-full max-w-[520px]" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-line p-5">
              <Skel className="h-[15px] w-24" />
              <Skel className="mt-3 h-[28px] w-20" />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-line p-5">
          <Skel className="h-[19px] w-40" />
          <Skel className="mt-3 h-11 w-full max-w-[380px] rounded-xl" />
        </div>

        <h2 className="mt-8 text-lg font-semibold">Đánh giá học viên</h2>
        <TableSkeleton cols={6} rows={3} />

        <h2 className="mt-8 text-lg font-semibold">100 đơn gần nhất</h2>
        <TableSkeleton cols={7} rows={6} />
      </main>
      <SiteFooter />
    </>
  );
}
