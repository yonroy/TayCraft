import { SiteFooter } from "@/components/site-footer";
import { HeaderSkeleton, Skel } from "@/components/skeletons";

// Khung xương gốc — dùng cho trang chủ và làm lưới an toàn cho mọi segment chưa có
// loading.tsx riêng. Bám bố cục hero của trang chủ (.hero-grid: cột chữ + cột ảnh phiếu)
// để lần chuyển về "/" không thấy màn hình trắng trơn.

export default function LoadingRoot() {
  return (
    <>
      <HeaderSkeleton />

      <div className="lp">
        <section className="hero">
          <div className="lpc hero-grid">
            <div className="hero-copy">
              <Skel className="h-[42px] w-full max-w-[520px]" />
              <Skel className="mt-3 h-[42px] w-[85%] max-w-[440px]" />
              <Skel className="mt-6 h-[19px] w-full max-w-[520px]" />
              <Skel className="mt-2 h-[19px] w-full max-w-[500px]" />
              <Skel className="mt-2 h-[19px] w-[70%] max-w-[360px]" />
              <div className="mt-7 flex flex-wrap gap-3">
                <Skel className="h-[54px] w-[220px] max-w-full rounded-xl" />
                <Skel className="h-[54px] w-[260px] max-w-full rounded-xl" />
              </div>
              <Skel className="mt-5 h-[17px] w-[280px] max-w-full" />
            </div>
            <div className="hero-visual">
              <Skel className="aspect-[1/1.4142] w-full max-w-[340px] rounded-xl" />
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="lpc grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-line p-5">
                <Skel className="h-8 w-8 skel-circle" />
                <Skel className="mt-3 h-[19px] w-[70%]" />
                <Skel className="mt-2.5 h-[15px] w-full" />
                <Skel className="mt-1.5 h-[15px] w-[80%]" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
