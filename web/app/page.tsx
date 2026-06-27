import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CourseCatalog } from "@/components/course-catalog";
import { PackageGrid } from "@/components/package-grid";
import { Reviews } from "@/components/reviews";
import { FlashSaleBar } from "@/components/flash-sale-bar";
import { ViewerCount } from "@/components/viewer-count";
import { LaunchPopup } from "@/components/launch-popup";
import { TOTAL_AVAILABLE } from "@/lib/lessons";
import { productById } from "@/lib/products";
import { getFlashSale } from "@/lib/settings";
import { formatVnd } from "@/lib/utils";

const PRICE = productById("all-access")!.priceVnd; // giá gói Trọn bộ

const FEATURES = [
  { t: "Không code", d: "Tự điền ma trận, nhân–cộng từng ô bằng số thật. Hiểu cơ chế tận gốc." },
  { t: "In A4, giải bằng bút chì", d: "Mỗi bài 2 trang: ĐỀ + ĐÁP ÁN. In ra hoặc lưu PDF." },
  { t: "🎲 Đổi số vô hạn", d: "Bấm một nút là có bộ số mới để luyện lại — không bao giờ hết bài." },
  { t: "Học theo thứ tự", d: "Mỗi bài dùng lại kết quả bài trước, dắt từ dot product đến Transformer." },
];

export default async function Home() {
  const flash = await getFlashSale();
  return (
    <>
      <FlashSaleBar
        enabled={flash.enabled}
        headline={flash.headline}
        countdownMinutes={flash.countdownMinutes}
      />
      <SiteHeader />
      <LaunchPopup />

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
          <Link href="/learn/A1-vecto-cong-tru">
            <Button size="lg" variant="outline">
              Xem thử miễn phí →
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-sm text-dim">
          🎉 Khai trương: tặng 100 suất Khóa 1 · sau đó chỉ 49.000đ · thanh toán QR chuyển khoản
        </p>
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

      {/* Packages */}
      <section id="goi" className="mx-auto max-w-5xl px-5 py-12 scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">Các gói khóa học</h2>
          {flash.enabled && (
            <ViewerCount min={flash.viewerMin} max={flash.viewerMax} label="người đang chọn gói" />
          )}
        </div>
        <p className="text-dim mt-1">
          Xem thử 3 phiếu đầu miễn phí. Khai trương: Khóa 1 chỉ 49.000đ — trả một lần, không thuê bao.
        </p>
        <p className="text-sm text-dim mt-2">
          <b className="text-ink">Phiếu là gì?</b> Mỗi phiếu là một bài tập in A4: bạn tự điền số bằng
          tay, có đề và đáp án.
        </p>
        <div className="mt-6">
          <PackageGrid />
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="text-2xl font-bold">Toàn bộ lộ trình</h2>
        <p className="text-dim mt-1">
          {TOTAL_AVAILABLE} bài đã có, ra thêm liên tục — học theo thứ tự từ nền tảng đến chuyên sâu.
        </p>
        <div className="mt-8">
          <CourseCatalog />
        </div>
      </section>

      {/* Reviews */}
      <Reviews />

      {/* Pricing CTA */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-3xl border border-line bg-paper p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold">Trọn bộ, một lần trả</h2>
          <p className="mt-2 text-dim">
            Mở khóa tất cả bài hiện có, kèm cập nhật mới miễn phí trong 12 tháng.
          </p>
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
