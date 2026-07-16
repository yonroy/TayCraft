import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";
import { CurriculumAccordion } from "@/components/curriculum-accordion";
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
      <main className="mx-auto w-full max-w-5xl px-5 py-12 flex-1">
        <PageHeading
          title="Bài học"
          right={
            !full && (
              <Link href="/#goi">
                <Button>{hasPaid ? "Nâng cấp gói" : "Xem các gói"}</Button>
              </Link>
            )
          }
        >
          <p>
            {full
              ? "Bạn đã mở khóa trọn bộ. Chúc học vui ✍️"
              : hasPaid
                ? "Bạn đã mở khóa một phần. Nâng cấp để học thêm các khóa còn lại."
                : "3 phiếu đầu (A1–A3) xem tự do. Mua gói để mở toàn bộ lộ trình."}
          </p>
        </PageHeading>

        {/* Khách chưa mua: mời xem thử 3 phiếu free ngay, để trang không chỉ là "tường khóa" */}
        {!hasPaid && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <p className="text-sm font-semibold text-ink">
              ✍️ Xem thử 3 phiếu đầu — miễn phí, không cần đăng nhập
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FREE_SLUGS.map((slug) => {
                const l = lessonBySlug(slug);
                if (!l) return null;
                return (
                  <Link
                    key={slug}
                    href={`/learn/${slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-sm transition hover:border-accent"
                  >
                    <span className="font-mono text-xs font-bold text-accent">{l.no}</span>
                    {l.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8">
          <CurriculumAccordion accessCourses={courses} openCourses={courses} />
        </div>

        {user && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-5 py-4">
            <p className="text-sm text-dim">
              💬 Thấy phiếu hữu ích? Để lại cảm nhận cho người học sau nhé.
            </p>
            <Link href="/danh-gia">
              <Button size="sm" variant="outline">
                Viết đánh giá →
              </Button>
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
