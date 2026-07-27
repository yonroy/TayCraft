import { SiteFooter } from "@/components/site-footer";
import { HeaderSkeleton, Skel } from "@/components/skeletons";

// Khung xương /learn — dùng LẠI đúng các class ld-* của LearnDashboard (hero, ld-stats,
// ld-courses, ld-filter, ld-grid) nên khung, gap và mọi media query khớp trang thật;
// chỉ phần chữ/số phụ thuộc dữ liệu mới thay bằng khối .skel. Chữ tĩnh ("Tiến độ theo
// khóa", "Tất cả bài học", nhãn bộ lọc) giữ nguyên chữ thật — đọc được ngay, ít nhấp nháy.

const CARDS = 12;

export default function LoadingLearn() {
  return (
    <>
      <HeaderSkeleton />

      <div className="lp">
        <div className="ld lpc">
          {/* ---------- HERO: tiếp tục học ---------- */}
          <section className="ld-hero">
            <div className="ld-hero-left">
              <Skel className="skel-inv h-[27px] w-[132px] skel-circle" />
              <Skel className="skel-inv mt-3.5 h-[21px] w-14 rounded-md" />
              <Skel className="skel-inv mt-2 h-[34px] w-[min(320px,72vw)] max-w-full" />
              <Skel className="skel-inv mt-1.5 h-[21px] w-[min(240px,60vw)] max-w-full" />
              <Skel className="skel-inv mt-[18px] h-[52px] w-[168px] max-w-full rounded-xl" />
            </div>
            <div className="ld-hero-right">
              <Skel className="skel-inv h-[34px] w-[140px]" />
              <Skel className="skel-inv h-[110px] w-[110px] shrink-0 skel-circle" />
            </div>
          </section>

          {/* ---------- 3 ô thống kê ---------- */}
          <section className="ld-stats">
            {[0, 1, 2].map((i) => (
              <div className="ld-stat" key={i}>
                <Skel className="h-[26px] w-[26px] shrink-0 skel-circle" />
                <span className="w-full">
                  <Skel className="h-[26px] w-24 max-w-full" />
                  <Skel className="mt-1.5 h-[15px] w-40 max-w-full" />
                </span>
              </div>
            ))}
          </section>

          {/* ---------- tiến độ từng khóa ---------- */}
          <div className="ld-sec-head">
            <h3>Tiến độ theo khóa</h3>
          </div>
          <section className="ld-courses">
            {["K1", "K2", "K3", "K4"].map((c) => (
              <div className="ld-course" key={c}>
                <div className="ld-course-top">
                  <span className="ld-course-badge">{c}</span>
                  <Skel className="h-[18px] w-9" />
                </div>
                <Skel className="mt-0.5 mb-2 h-[18px] w-[70%]" />
                <div className="ld-bar" />
                <Skel className="mt-[7px] h-[14px] w-20" />
              </div>
            ))}
          </section>

          {/* ---------- lọc + tìm ---------- */}
          <div className="ld-sec-head">
            <h3>Tất cả bài học</h3>
          </div>
          <div className="ld-filter">
            {["Tất cả", "Đang mở", "Miễn phí", "Chưa học", "Đã học"].map((f) => (
              <span className="ld-chip" key={f}>
                {f}
              </span>
            ))}
            <span className="ld-search">
              <Skel className="h-[35px] w-[220px] max-w-full skel-circle" />
            </span>
          </div>

          {/* ---------- lưới phiếu ---------- */}
          <section className="ld-part">
            <div className="ld-part-head">
              <Skel className="h-[21px] w-9 rounded-md" />
              <Skel className="h-[19px] w-48 max-w-[52vw]" />
              <Skel className="ml-auto h-[16px] w-16" />
            </div>
            <div className="ld-grid">
              {Array.from({ length: CARDS }, (_, i) => (
                <div className="ld-card" key={i}>
                  <div className="ld-thumb">
                    <Skel className="h-full w-full rounded-none" />
                  </div>
                  <div className="ld-card-body">
                    <Skel className="h-[13px] w-10" />
                    <Skel className="mt-1 h-[15px] w-full" />
                    <Skel className="mt-1 h-[15px] w-[70%]" />
                    <Skel className="mt-1.5 h-[13px] w-[55%]" />
                  </div>
                  <span className="ld-check">
                    <Skel className="h-[15px] w-[15px] shrink-0 rounded-sm" />
                    <Skel className="h-[13px] w-24" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
