import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { LessonFrame } from "@/components/lesson-frame";
import { LessonNav } from "@/components/lesson-nav";
import { Paywall } from "@/components/paywall";
import { ViewerCount } from "@/components/viewer-count";
import { lessonBySlug, isFreeLesson } from "@/lib/lessons";
import { getUser, hasAccess } from "@/lib/auth";
import { getFlashSale } from "@/lib/settings";

export default async function LessonViewer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessonBySlug(slug);
  if (!lesson || !lesson.available || !lesson.slug) notFound();

  const user = await getUser();
  const canView = user ? await hasAccess(user.id, lesson.slug) : isFreeLesson(lesson);
  const flash = await getFlashSale();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-5xl px-5 py-4 flex items-center justify-between">
          <Link href="/learn" className="text-accent font-medium hover:underline">
            ← Tất cả bài học
          </Link>
          <div className="flex items-center gap-4">
            {flash.enabled && (
              <ViewerCount
                min={flash.viewerMin}
                max={flash.viewerMax}
                label="đang xem tài liệu này"
              />
            )}
            <span className="text-sm text-dim font-mono">
              Bài {lesson.no} · {lesson.title}
            </span>
          </div>
        </div>

        {canView ? (
          <div className="flex-1 bg-paper">
            <LessonFrame
              src={`/api/learn/${lesson.course}/${lesson.slug}.html`}
              title={lesson.title}
            />
            <div className="mx-auto max-w-5xl px-5 py-3 text-center text-sm text-dim">
              Mẹo: bấm <b>🎲 Đổi số</b> để luyện bộ số mới · <b>🖨️ In / Lưu PDF</b> để in ra giấy.
            </div>
            <div className="mx-auto max-w-5xl px-5 pb-10">
              <LessonNav slug={lesson.slug} />
            </div>
          </div>
        ) : (
          <div className="px-5 pb-16">
            <div className="lp">
              <Paywall title={`Bài ${lesson.no}: ${lesson.title}`} course={lesson.course} />
              {!user && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 13.5,
                    color: "var(--dim)",
                    marginTop: 16,
                  }}
                >
                  Đã mua rồi?{" "}
                  <Link
                    href={`/login?next=/learn/${lesson.slug}`}
                    style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "underline" }}
                  >
                    Đăng nhập
                  </Link>
                </p>
              )}
            </div>
            <LessonNav slug={lesson.slug} />
          </div>
        )}
      </main>
    </>
  );
}
