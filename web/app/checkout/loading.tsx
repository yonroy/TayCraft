import { SiteFooter } from "@/components/site-footer";
import { HeaderSkeleton, Skel } from "@/components/skeletons";

// Khung xương /checkout — giữ .co-page/.co-wrap/.co-summary/.co-card của trang thật.
// Ba dòng "quyền lợi" là chữ tĩnh (luôn hiện đúng như vậy) nên để nguyên chữ: khách đang
// ở bước trả tiền, thấy cam kết ngay lúc chờ tốt hơn là thấy ba vạch xám.

export default function LoadingCheckout() {
  return (
    <>
      <HeaderSkeleton />
      <div className="lp">
        <section className="co-page">
          <div className="co-wrap">
            <div className="co-head">
              <span className="eyebrow">Thanh toán</span>
              <Skel className="h-[30px] w-[240px] max-w-full" />
            </div>

            <div className="co-summary">
              <div className="co-sum-top">
                <div className="min-w-0 flex-1">
                  <Skel className="h-[19px] w-[160px] max-w-full" />
                  <Skel className="mt-2 h-[15px] w-[200px] max-w-full" />
                </div>
                <div className="co-sum-price-col">
                  <Skel className="h-[26px] w-[110px]" />
                </div>
              </div>
              <ul className="co-perks">
                <li>
                  <span className="ck">✓</span> Mua một lần, học trọn đời (không thuê bao)
                </li>
                <li>
                  <span className="ck">✓</span> Hoàn tiền trong 7 ngày nếu chưa hợp
                </li>
                <li>
                  <span className="ck">✓</span> Tự động mở khóa khi nhận được chuyển khoản
                </li>
              </ul>
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="co-card">
                <Skel className="h-[15px] w-full max-w-[320px]" />
                <Skel className="mt-2 h-[15px] w-[70%] max-w-[240px]" />
                <Skel className="mt-4 h-11 w-full rounded-xl" />
                <Skel className="mt-3 h-11 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
