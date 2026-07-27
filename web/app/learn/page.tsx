import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LearnDashboard } from "@/components/learn-dashboard";
import { getUser, accessibleCourses } from "@/lib/auth";
import { FREE_COURSES } from "@/lib/lessons";

export default async function LearnPage() {
  const user = await getUser();
  const courses = user ? await accessibleCourses(user.id) : [...FREE_COURSES];

  return (
    <>
      <SiteHeader />

      <div className="lp">
        <LearnDashboard accessCourses={courses} />

        {user && (
          <div className="lpc">
            <div className="learn-review-band">
              <p>💬 Thấy phiếu hữu ích? Để lại cảm nhận cho người học sau nhé.</p>
              <Link href="/danh-gia" className="btn btn-ghost btn-sm">
                Viết đánh giá →
              </Link>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
