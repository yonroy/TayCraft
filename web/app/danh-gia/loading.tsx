import { SiteFooter } from "@/components/site-footer";
import { PageHeading } from "@/components/page-heading";
import { HeaderSkeleton, Skel } from "@/components/skeletons";

// Khung xương /danh-gia — tiêu đề trang là chữ tĩnh nên dùng thẳng <PageHeading> thật
// (đồng bộ tuyệt đối, không nhảy khi trang thật thế chỗ); chỉ form đánh giá là khung xương.

export default function LoadingReview() {
  return (
    <>
      <HeaderSkeleton />
      <main className="mx-auto w-full max-w-xl px-5 py-12 flex-1">
        <PageHeading title="Để lại cảm nhận ✍️">
          <p>
            Bạn là một trong những học viên đầu tiên — vài dòng của bạn giúp người học sau rất
            nhiều.
          </p>
        </PageHeading>

        <div className="mt-8 rounded-2xl border border-line p-5">
          <Skel className="h-[15px] w-24" />
          <Skel className="mt-2 h-11 w-full rounded-xl" />
          <Skel className="mt-4 h-[15px] w-28" />
          <Skel className="mt-2 h-11 w-full rounded-xl" />
          <Skel className="mt-4 h-[15px] w-20" />
          <Skel className="mt-2 h-8 w-40" />
          <Skel className="mt-4 h-[15px] w-32" />
          <Skel className="mt-2 h-28 w-full rounded-xl" />
          <Skel className="mt-5 h-11 w-40 max-w-full rounded-xl" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
