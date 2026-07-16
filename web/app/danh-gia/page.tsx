import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";
import { ReviewForm } from "@/components/review-form";
import { getUser, hasAccess } from "@/lib/auth";
import { getOwnReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// Trang gửi cảm nhận — chỉ học viên đã có ≥1 khóa (kể cả K1 nhận free).
export default async function ReviewPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/danh-gia");

  // Tuần tự (KHÔNG Promise.all): pooler max:1.
  const canReview = await hasAccess(user.id);
  const own = canReview ? await getOwnReview(user.id) : null;
  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? "";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl px-5 py-12 flex-1">
        <PageHeading title="Để lại cảm nhận ✍️">
          <p>
            Bạn là một trong những học viên đầu tiên — vài dòng của bạn giúp người học sau rất
            nhiều.
          </p>
        </PageHeading>

        <div className="mt-8">
          {canReview ? (
            <ReviewForm
              initial={
                own
                  ? {
                      name: own.name,
                      role: own.role ?? "",
                      rating: own.rating,
                      comment: own.comment,
                      approved: own.approved,
                    }
                  : null
              }
              defaultName={defaultName}
            />
          ) : (
            <div className="rounded-2xl border border-line bg-paper p-8 text-center">
              <p className="text-dim">
                Chỉ học viên đã có khóa học mới gửi được đánh giá. Nhận Khóa 1 hoặc xem các gói để
                bắt đầu học nhé!
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/?claim=k1">
                  <Button>Nhận Khóa 1 miễn phí →</Button>
                </Link>
                <Link href="/#packages">
                  <Button variant="outline">Xem các gói</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
