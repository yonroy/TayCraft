import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Paywall } from "@/components/paywall";
import { Button } from "@/components/ui/button";
import { lessonBySlug, isFreeSlug } from "@/lib/lessons";
import { getUser, hasAccess } from "@/lib/auth";

export default async function LessonViewer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessonBySlug(slug);
  if (!lesson || !lesson.available || !lesson.slug) notFound();

  const user = await getUser();
  const access = user ? await hasAccess(user.id) : false;
  const canView = isFreeSlug(lesson.slug) || access;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-5xl px-5 py-4 flex items-center justify-between">
          <Link href="/learn" className="text-accent font-medium hover:underline">
            ← Tất cả bài học
          </Link>
          <div className="text-sm text-dim font-mono">
            Bài {lesson.no} · {lesson.title}
          </div>
        </div>

        {canView ? (
          <div className="flex-1 bg-paper">
            <iframe
              src={`/api/learn/${lesson.slug}.html`}
              title={lesson.title}
              className="w-full h-[calc(100vh-8rem)] border-0 bg-white"
            />
            <div className="mx-auto max-w-5xl px-5 py-3 text-center text-sm text-dim">
              Mẹo: bấm <b>🎲 Đổi số</b> để luyện bộ số mới · <b>🖨️ In / Lưu PDF</b> để in ra giấy.
            </div>
          </div>
        ) : (
          <div className="px-5 pb-16">
            <Paywall title={`Bài ${lesson.no}: ${lesson.title}`} />
            {!user && (
              <p className="text-center text-sm text-dim mt-4">
                Đã mua rồi?{" "}
                <Link
                  href={`/login?next=/learn/${lesson.slug}`}
                  className="text-accent font-medium"
                >
                  Đăng nhập
                </Link>
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
