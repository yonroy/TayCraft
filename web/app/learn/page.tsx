import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LearnCurriculum } from "@/components/learn-curriculum";
import { getUser, accessibleCourses } from "@/lib/auth";
import { COURSES } from "@/lib/products";
import { FREE_COURSES, FREE_SLUGS, lessonBySlug } from "@/lib/lessons";

export default async function LearnPage() {
  const user = await getUser();
  const courses = user ? await accessibleCourses(user.id) : [...FREE_COURSES];
  const full = COURSES.every((c) => courses.includes(c.id)); // mở đủ cả 4 khóa
  const hasPaid = courses.some((c) => !FREE_COURSES.includes(c)); // có khóa trả phí ngoài free

  return (
    <>
      <SiteHeader />

      <div className="lp">
        {/* ============ INTRO ============ */}
        <section className="learn-intro">
          <div className="lpc">
            <span className="eyebrow">Lộ trình học</span>
            <h1>Bài học của bạn</h1>
            <p className="learn-status">
              {full
                ? "Bạn đã mở khóa trọn bộ. Bấm vào từng khóa để mở phần bên trong, chọn bài và bắt đầu điền tay. Chúc học vui ✍️"
                : hasPaid
                  ? "Bạn đã mở khóa một phần. Bấm vào từng khóa để chọn bài; nâng cấp gói để mở nốt các khóa còn lại."
                  : "3 phiếu đầu (A1–A3) xem tự do — không cần đăng nhập. Mua gói để mở toàn bộ lộ trình K1→K4."}
            </p>

            {!full && (
              <div className="learn-cta">
                <Link href="/#packages" className="btn btn-primary">
                  {hasPaid ? "Nâng cấp gói →" : "Xem các gói →"}
                </Link>
              </div>
            )}

            {/* Khách chưa mua: mời xem thử 3 phiếu free ngay */}
            {!hasPaid && (
              <div className="free-callout">
                <div className="fc-title">✍️ Xem thử 3 phiếu đầu — miễn phí, không cần đăng nhập</div>
                <div className="fc-chips">
                  {FREE_SLUGS.map((slug) => {
                    const l = lessonBySlug(slug);
                    if (!l) return null;
                    return (
                      <Link key={slug} href={`/learn/${slug}`} className="fc-chip">
                        <span className="n">{l.no}</span>
                        {l.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============ CURRICULUM ============ */}
        <section className="sec">
          <div className="lpc">
            <LearnCurriculum accessCourses={courses} openCourses={courses} />

            {user && (
              <div className="learn-review-band">
                <p>💬 Thấy phiếu hữu ích? Để lại cảm nhận cho người học sau nhé.</p>
                <Link href="/danh-gia" className="btn btn-ghost btn-sm">
                  Viết đánh giá →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
