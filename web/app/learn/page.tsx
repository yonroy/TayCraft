import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CourseCatalog } from "@/components/course-catalog";
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
      <main className="mx-auto w-full max-w-5xl px-5 py-10 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bài học</h1>
            <p className="text-dim mt-1">
              {full
                ? "Bạn đã mở khóa trọn bộ. Chúc học vui ✍️"
                : hasPaid
                  ? "Bạn đã mở khóa một phần. Nâng cấp để học thêm các khóa còn lại."
                  : "Khóa Nền tảng (K1) miễn phí. Mua gói để mở các khóa nâng cao."}
            </p>
          </div>
          {!full && (
            <Link href="/#goi">
              <Button>{hasPaid ? "Nâng cấp gói" : "Xem các gói"}</Button>
            </Link>
          )}
        </div>

        <div className="mt-8">
          <CourseCatalog accessCourses={courses} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
