import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CourseCatalog } from "@/components/course-catalog";
import { getUser, hasAccess } from "@/lib/auth";
import { productById } from "@/lib/products";
import { formatVnd } from "@/lib/utils";

const PRICE = productById("all-access")!.priceVnd; // giá K5 Full (đích)

export default async function LearnPage() {
  const user = await getUser();
  const access = user ? await hasAccess(user.id) : false;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-5 py-10 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bài học</h1>
            <p className="text-dim mt-1">
              {access
                ? "Bạn đã mở khóa trọn bộ. Chúc học vui ✍️"
                : "3 bài đầu miễn phí. Mua trọn bộ để mở tất cả."}
            </p>
          </div>
          {!access && (
            <Link href="/checkout">
              <Button>Mua trọn bộ · {formatVnd(PRICE)}</Button>
            </Link>
          )}
        </div>

        <div className="mt-8">
          <CourseCatalog access={access} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
