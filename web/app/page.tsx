import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CurriculumAccordion } from "@/components/curriculum-accordion";
import { TrustBar } from "@/components/trust-bar";
import { GuaranteeBand } from "@/components/guarantee-band";
import { SectionHeading } from "@/components/section-heading";
import { PackageGrid } from "@/components/package-grid";
import { Reviews } from "@/components/reviews";
import { Faq } from "@/components/faq";
import { ViewerCount } from "@/components/viewer-count";
import { LaunchPopup } from "@/components/launch-popup";
import { HeroClaimButton } from "@/components/hero-claim-button";
import { promoExpired } from "@/lib/promo";
import { getApprovedReviews } from "@/lib/reviews";
import { TOTAL_AVAILABLE, FREE_COURSES, PARTS, FREE_SLUGS } from "@/lib/lessons";
import { productById, COURSES } from "@/lib/products";
import { getUser, accessibleCourses } from "@/lib/auth";
import { getFlashSale } from "@/lib/settings";
import { formatVnd } from "@/lib/utils";

const PRICE = productById("k3")!.priceVnd; // giá gói Pro dùng làm mốc "chỉ từ" ở hero (gói nổi bật)

const FEATURES = [
  { t: "Không code", d: "Tự điền ma trận, nhân–cộng từng ô bằng số thật. Hiểu cơ chế tận gốc." },
  { t: "In A4, giải bằng bút chì", d: "Mỗi bài 2 trang: ĐỀ + ĐÁP ÁN. In ra hoặc lưu PDF." },
  { t: "🎲 Đổi số vô hạn", d: "Bấm một nút là có bộ số mới để luyện lại — không bao giờ hết bài." },
  { t: "Học theo thứ tự", d: "Mỗi bài dùng lại kết quả bài trước, dắt từ dot product đến Transformer." },
];

export default async function Home() {
  const flash = await getFlashSale();
  // Ẩn popup khai trương cho người đã sở hữu K1 (đã nhận free / đã mua) — khỏi bị mời lại.
  // Đồng thời truyền danh sách khóa mở được xuống catalog để hiển thị đúng trạng thái khóa/mở.
  const user = await getUser();
  const access = user ? await accessibleCourses(user.id) : [...FREE_COURSES];
  const ownsK1 = access.includes("K1");
  const launchActive = !promoExpired(); // hết dịp khai trương → hero về CTA mua gói Pro
  const reviewRows = await getApprovedReviews(); // tuần tự — pooler max:1, không Promise.all
  const reviewCount = reviewRows.length;
  const reviewAvg = reviewCount
    ? (reviewRows.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
    : null;
  return (
    <>
      <SiteHeader />
      {launchActive && !ownsK1 && <LaunchPopup />}

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="text-center lg:text-left">
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-accent font-bold">
              Toán × AI · in A4 để học
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
              Học AI <span className="text-accent">bằng tay</span> ✍️
            </h1>
            <p className="mt-5 text-lg text-dim max-w-2xl mx-auto lg:mx-0">
              Bộ {TOTAL_AVAILABLE} phiếu <b className="text-ink">tính tay</b> theo tinh thần Prof.
              Tom Yeh: chạy softmax, attention, backprop bằng <b className="text-ink">số thật</b>{" "}
              trên giấy. Không thư viện, không lý thuyết suông — hiểu vì bạn tự tính.
            </p>
            {launchActive ? (
              <>
                {/* Phễu khai trương: khách lạnh nhận K1 free trước (popup), mua gói tính sau */}
                <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                  {ownsK1 ? (
                    <Link href="/learn">
                      <Button size="lg">Vào học tiếp →</Button>
                    </Link>
                  ) : (
                    <HeroClaimButton />
                  )}
                  <Link href="#goi">
                    <Button size="lg" variant="outline">
                      Xem các gói
                    </Button>
                  </Link>
                </div>
                <p className="mt-3 text-sm text-dim">
                  🎉 100 suất khai trương · không cần thẻ, đăng nhập email là học ngay ·{" "}
                  <Link
                    href="/learn/A1-vecto-cong-tru"
                    className="text-accent font-medium hover:underline"
                  >
                    Xem thử 3 phiếu đầu miễn phí →
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link href="/checkout?product=k3">
                    <Button size="lg">Mua gói Pro · {formatVnd(PRICE)}</Button>
                  </Link>
                  <Link href="/learn/A1-vecto-cong-tru">
                    <Button size="lg" variant="outline">
                      Xem thử miễn phí →
                    </Button>
                  </Link>
                </div>
                <p className="mt-3 text-sm text-dim">
                  Trả một lần, truy cập trọn đời · thanh toán QR chuyển khoản
                </p>
              </>
            )}
          </div>

          {/* Ảnh phiếu thật — 2 tờ A4 xếp chồng, bấm vào mở bài học thử miễn phí */}
          <Link
            href="/learn/A1-vecto-cong-tru"
            className="group relative mx-auto block w-full max-w-sm lg:max-w-md"
            aria-label="Xem thử phiếu miễn phí"
          >
            <Image
              src="/hero/phieu-attention.png"
              alt="Phiếu tính tay Scaled Dot-Product Attention — trang ĐỀ in A4"
              width={794}
              height={1123}
              className="absolute right-0 top-6 w-[72%] rotate-[4deg] rounded-lg border border-line bg-white shadow-md"
            />
            <Image
              src="/hero/phieu-nhan-ma-tran.png"
              alt="Phiếu tính tay Nhân ma trận — điền từng ô bằng bút chì, có sơ đồ màu"
              width={794}
              height={1123}
              priority
              className="relative w-[78%] -rotate-[3deg] rounded-lg border border-line bg-white shadow-xl transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-[1.02]"
            />
            <span className="mt-4 block text-center text-sm text-dim">
              👆 Phiếu thật trong bộ — bấm để <b className="text-accent">làm thử miễn phí</b>
            </span>
          </Link>
        </div>
      </section>

      {/* Trust bar — số liệu thật (không bịa lượt in/học viên) */}
      <TrustBar
        totalPhieu={TOTAL_AVAILABLE}
        courseCount={COURSES.length}
        partCount={PARTS.length}
        freeCount={FREE_SLUGS.length}
        reviewAvg={reviewAvg}
        reviewCount={reviewCount}
      />

      {/* Features */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <SectionHeading title="Vì sao học bằng tay">
          <p>Bốn điều khiến bộ phiếu khác hẳn xem video hay đọc lý thuyết suông.</p>
        </SectionHeading>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.t}
              className="group rounded-2xl border border-line p-5 transition hover:border-accent/50 hover:shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="rounded-lg bg-accent px-2 py-1 font-mono text-sm font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-bold leading-snug">{f.t}</h3>
              </div>
              <p className="mt-2 text-sm text-dim">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="goi" className="mx-auto max-w-5xl px-5 py-12 scroll-mt-20">
        <SectionHeading
          title="Các gói khóa học"
          right={
            flash.enabled && (
              <ViewerCount min={flash.viewerMin} max={flash.viewerMax} label="người đang chọn gói" />
            )
          }
        >
          <p>
            {launchActive
              ? "Xem thử 3 phiếu đầu miễn phí. Khai trương: Khóa 1 chỉ 49.000đ — trả một lần, không thuê bao."
              : "Xem thử 3 phiếu đầu miễn phí — trả một lần, học trọn đời, không thuê bao."}
          </p>
          <p className="mt-2 text-sm">
            <b className="text-ink">Phiếu là gì?</b> Mỗi phiếu là một bài tập in A4: bạn tự điền số
            bằng tay, có đề và đáp án.
          </p>
        </SectionHeading>
        <div className="mt-6">
          <PackageGrid />
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <SectionHeading title="Toàn bộ lộ trình">
          <p>
            {TOTAL_AVAILABLE} bài đã có, ra thêm liên tục — học theo thứ tự từ nền tảng đến chuyên
            sâu.
          </p>
        </SectionHeading>
        <div className="mt-8">
          <CurriculumAccordion accessCourses={access} />
        </div>
      </section>

      {/* Reviews */}
      <Reviews reviews={reviewRows} />

      {/* FAQ */}
      <Faq />

      {/* Cam kết hoàn tiền — trấn an trước lời mời mua */}
      <GuaranteeBand />

      {/* Pricing CTA */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-3xl border border-line bg-paper p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold">Pro — trọn lộ trình hiện có</h2>
          <p className="mt-2 text-dim">
            Mở khóa nền tảng → CNN/RNN → Transformer &amp; LLM (Khóa 1–3), trả một lần.
          </p>
          <div className="mt-5 text-4xl font-extrabold text-accent">{formatVnd(PRICE)}</div>
          <div className="mt-6">
            <Link href="/checkout?product=k3">
              <Button size="lg">Mua ngay</Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
