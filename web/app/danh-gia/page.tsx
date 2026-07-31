import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";
import { ReviewForm } from "@/components/review-form";
import { getUser, hasAccess } from "@/lib/auth";
import { getOwnReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// Trang gửi cảm nhận — chỉ học viên đã có ≥1 khóa (kể cả K1 nhận free) mới GỬI được.
// Không ép đăng nhập trước nữa (#62): trang này vốn được dẫn tới từ khối social-proof ở
// trang chủ, redirect cứng sang /login chặn cả khách ẩn danh lẫn khách đã đăng nhập nhưng
// chưa mua — cả hai nhóm giờ đều thấy được trang + lời mời "học thử K1 free", chỉ riêng
// FORM GỬI vẫn khoá sau hasAccess như cũ (không đổi phân quyền, chỉ đổi thứ tự hiển thị).
export default async function ReviewPage() {
  const user = await getUser();

  // Tuần tự (KHÔNG Promise.all): pooler max:1.
  const canReview = user ? await hasAccess(user.id) : false;
  const own = canReview && user ? await getOwnReview(user.id) : null;
  const defaultName = user
    ? ((user.user_metadata?.full_name as string | undefined) ?? user.email?.split("@")[0] ?? "")
    : "";

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
            <div className="rounded-lg border border-line bg-paper p-8 text-center shadow-sm">
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
              {!user && (
                <p className="mt-4 text-sm text-dim">
                  Đã có tài khoản?{" "}
                  <Link href="/login?next=/danh-gia" className="text-accent font-medium hover:underline">
                    Đăng nhập
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
