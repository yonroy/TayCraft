import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";
import { CurriculumAccordion } from "@/components/curriculum-accordion";
import { getUser, accessibleCourses } from "@/lib/auth";
import { COURSES } from "@/lib/products";
import { FREE_COURSES } from "@/lib/lessons";

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
                : "Khóa Nền tảng (K1) miễn phí. Mua gói để mở các khóa nâng cao."}
          </p>
        </PageHeading>

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
