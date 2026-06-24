import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { LESSONS, SECTIONS } from "@/lib/lessons";
import { getUser, hasAccess } from "@/lib/auth";
import { formatVnd } from "@/lib/utils";

const PRICE = Number(process.env.COURSE_PRICE_VND ?? 199000);

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

        {SECTIONS.map((section) => (
          <section key={section} className="mt-8">
            <div className="font-mono text-xs tracking-[0.12em] uppercase text-accent font-bold mb-3">
              {section}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LESSONS.filter((l) => l.section === section).map((l) => {
                const unlocked = l.available && (l.isFree || access);
                const card = (
                  <div
                    className={`h-full rounded-2xl border p-4 transition ${
                      l.available
                        ? "border-line hover:border-accent"
                        : "border-dashed border-line opacity-55"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-sm font-bold text-white rounded-lg px-2.5 py-1.5 ${
                          l.available ? "bg-accent" : "bg-line"
                        }`}
                      >
                        {l.no}
                      </span>
                      <div className="flex-1" />
                      {l.isFree && (
                        <span className="text-xs font-mono font-bold text-accent-2">FREE</span>
                      )}
                      {l.available && !unlocked && <span>🔒</span>}
                      {!l.available && (
                        <span className="text-xs text-dim font-mono">sắp ra</span>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold leading-snug">{l.title}</h3>
                    <p className="text-sm text-dim mt-1 line-clamp-2">{l.blurb}</p>
                  </div>
                );

                if (l.available && l.slug) {
                  return (
                    <Link key={l.no} href={`/learn/${l.slug}`}>
                      {card}
                    </Link>
                  );
                }
                return <div key={l.no}>{card}</div>;
              })}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
