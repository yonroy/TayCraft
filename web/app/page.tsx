import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { LESSONS, SECTIONS, TOTAL_AVAILABLE } from "@/lib/lessons";
import { formatVnd } from "@/lib/utils";

const PRICE = Number(process.env.COURSE_PRICE_VND ?? 199000);

const FEATURES = [
  { t: "Không code", d: "Tự điền ma trận, nhân–cộng từng ô bằng số thật. Hiểu cơ chế tận gốc." },
  { t: "In A4, giải bằng bút chì", d: "Mỗi bài 2 trang: ĐỀ + ĐÁP ÁN. In ra hoặc lưu PDF." },
  { t: "🎲 Đổi số vô hạn", d: "Bấm một nút là có bộ số mới để luyện lại — không bao giờ hết bài." },
  { t: "Học theo thứ tự", d: "Mỗi bài dùng lại kết quả bài trước, dắt từ dot product đến Transformer." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-12 text-center">
        <p className="font-mono text-xs tracking-[0.18em] uppercase text-accent font-bold">
          Toán × AI · in A4 để học
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Học AI <span className="text-accent">bằng tay</span> ✍️
        </h1>
        <p className="mt-5 text-lg text-dim max-w-2xl mx-auto">
          Bộ {TOTAL_AVAILABLE} phiếu <b className="text-ink">tính tay</b> theo tinh thần Prof. Tom Yeh:
          chạy softmax, attention, backprop bằng <b className="text-ink">số thật</b> trên giấy.
          Không thư viện, không lý thuyết suông — hiểu vì bạn tự tính.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link href="/checkout">
            <Button size="lg">Mua trọn bộ · {formatVnd(PRICE)}</Button>
          </Link>
          <Link href="/learn/01-tich-vo-huong">
            <Button size="lg" variant="outline">
              Xem thử miễn phí →
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-sm text-dim">3 bài đầu miễn phí · thanh toán QR chuyển khoản</p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <div key={f.t} className="rounded-2xl border border-line p-5">
            <h3 className="font-bold">{f.t}</h3>
            <p className="mt-1.5 text-sm text-dim">{f.d}</p>
          </div>
        ))}
      </section>

      {/* Curriculum */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="text-2xl font-bold">Nội dung trọn bộ</h2>
        <p className="text-dim mt-1">{TOTAL_AVAILABLE} bài đã phát hành, thêm bài mới liên tục.</p>

        {SECTIONS.map((section) => (
          <div key={section} className="mt-8">
            <div className="font-mono text-xs tracking-[0.12em] uppercase text-accent font-bold mb-3">
              {section}
            </div>
            <div className="grid gap-2">
              {LESSONS.filter((l) => l.section === section).map((l) => (
                <div
                  key={l.no}
                  className={`flex items-center gap-4 rounded-xl border border-line px-4 py-3 ${
                    l.available ? "" : "opacity-55 border-dashed"
                  }`}
                >
                  <span
                    className={`font-mono text-sm font-bold text-white rounded-lg px-2.5 py-1.5 ${
                      l.available ? "bg-accent" : "bg-line"
                    }`}
                  >
                    {l.no}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {l.title} <span className="text-dim font-normal">— {l.english}</span>
                    </div>
                    <div className="text-sm text-dim truncate">{l.blurb}</div>
                  </div>
                  {l.isFree && (
                    <span className="text-xs font-mono font-bold text-accent-2 border border-accent-2/40 rounded-full px-2 py-0.5">
                      FREE
                    </span>
                  )}
                  {!l.available && <span className="text-xs text-dim font-mono">sắp ra</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Pricing CTA */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-3xl border border-line bg-paper p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold">Trọn bộ, một lần trả</h2>
          <p className="mt-2 text-dim">Mở khóa tất cả bài hiện có và mọi bài ra trong tương lai.</p>
          <div className="mt-5 text-4xl font-extrabold text-accent">{formatVnd(PRICE)}</div>
          <div className="mt-6">
            <Link href="/checkout">
              <Button size="lg">Mua ngay</Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
