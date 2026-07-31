import { SiteFooter } from "@/components/site-footer";
import { PageHeading } from "@/components/page-heading";
import { HeaderSkeleton, Skel } from "@/components/skeletons";

// Khung xương /account — giữ đúng max-w-3xl, khối "Trạng thái" và danh sách đơn hàng.

export default function LoadingAccount() {
  return (
    <>
      <HeaderSkeleton />
      <main className="mx-auto w-full max-w-3xl px-5 py-12 flex-1">
        <PageHeading title="Tài khoản">
          <Skel className="h-[19px] w-[220px] max-w-full" />
        </PageHeading>

        <div className="mt-6 rounded-lg border border-line p-5 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-semibold">Trạng thái</div>
            <Skel className="mt-2 h-[17px] w-[200px] max-w-full" />
          </div>
          <Skel className="h-11 w-[120px] shrink-0 rounded-md" />
        </div>

        <h2 className="mt-8 font-bold">Lịch sử đơn hàng</h2>
        <div className="mt-3 grid gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-md border border-line px-4 py-3 flex items-center justify-between gap-3"
            >
              <Skel className="h-[17px] w-[min(180px,45%)]" />
              <Skel className="h-[17px] w-[min(120px,35%)]" />
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
