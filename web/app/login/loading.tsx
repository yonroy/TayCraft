import { SiteFooter } from "@/components/site-footer";
import { HeaderSkeleton, Skel } from "@/components/skeletons";

// Khung xương /login — giữ nguyên .co-page/.co-wrap (max 400px) + .co-card của trang thật.
// Chữ tiêu đề là chữ tĩnh nên hiện luôn, chỉ ô nhập email/nút mới là khối xương.

export default function LoadingLogin() {
  return (
    <>
      <HeaderSkeleton />
      <div className="lp">
        <section className="co-page">
          <div className="co-wrap" style={{ maxWidth: 400 }}>
            <div className="co-head">
              <span className="eyebrow">Tài khoản</span>
              <h1>Đăng nhập</h1>
              <p style={{ color: "var(--dim)", fontSize: 14, marginTop: 8 }}>
                Để vào học và mở khóa bài đã mua.
              </p>
            </div>
            <div className="co-card">
              <Skel className="h-[15px] w-32" />
              <Skel className="mt-2.5 h-11 w-full rounded-xl" />
              <Skel className="mt-4 h-11 w-full rounded-xl" />
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
