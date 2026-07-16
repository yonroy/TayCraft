import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/utils";
import { FREE_SLUGS, TOTAL_AVAILABLE, lessonBySlug, type Course } from "@/lib/lessons";
import {
  packagesGrantingCourse,
  productById,
  effectivePriceVnd,
  DEFAULT_PRODUCT,
  type Product,
} from "@/lib/products";

// Gói RẺ NHẤT đang bán mở được khóa chứa bài này → đúng mức giá cần để mở đúng bài đang xem.
// (Trước đây paywall đọc COURSE_PRICE_VND ?? 199000 = giá ảo không khớp thang giá nào.)
function cheapestUnlock(course: Course): Product {
  const granting = packagesGrantingCourse(course)
    .map((id) => productById(id))
    .filter((p): p is Product => !!p && p.active);
  const pool = granting.length ? granting : [productById(DEFAULT_PRODUCT)!];
  return pool.reduce((a, b) => (effectivePriceVnd(b) < effectivePriceVnd(a) ? b : a));
}

// Bản xem-trước phong cách phiếu: render MỘT phiếu miễn phí thật (bản mẫu đại diện) làm mờ,
// khóa tương tác, phủ gradient loãng dần xuống card CTA. Không dùng chính bài đang khóa vì
// /api/learn trả 402 cho nội dung chưa mua → iframe sẽ chỉ hiện thông báo lỗi. Bản mẫu free
// truyền thật độ dày/chất lượng của phiếu mà không bịa gì.
function previewSrc(): string | null {
  const sample = lessonBySlug(FREE_SLUGS[0]);
  return sample?.slug ? `/api/learn/${sample.course}/${sample.slug}.html` : null;
}

export function Paywall({ title, course }: { title: string; course: Course }) {
  const p = cheapestUnlock(course);
  const price = effectivePriceVnd(p);
  const preview = previewSrc();
  // N = tổng phiếu đã phát hành trừ đúng bài đang xem (tính động, không hardcode).
  const others = Math.max(0, TOTAL_AVAILABLE - 1);

  return (
    <div className="mx-auto max-w-md mt-10">
      {/* Teaser: phiếu mẫu làm mờ, khóa tương tác, mờ dần xuống card CTA bên dưới. */}
      {preview && (
        <div className="relative h-48 overflow-hidden rounded-t-3xl border border-b-0 border-line bg-white">
          <iframe
            src={preview}
            title="Xem trước phong cách phiếu"
            aria-hidden
            tabIndex={-1}
            scrolling="no"
            className="pointer-events-none absolute inset-x-0 top-0 h-[820px] w-full select-none blur-[3px]"
          />
          {/* Phủ gradient: trong ở trên, đặc dần về màu card ở dưới → nối liền mạch vào CTA. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-paper/60 to-paper" />
          <span className="absolute left-3 top-3 rounded-full border border-line bg-paper/90 px-2.5 py-1 text-xs font-medium text-dim backdrop-blur">
            Xem trước phong cách phiếu
          </span>
        </div>
      )}

      <div
        className={`text-center border border-line bg-paper p-8 ${
          preview ? "rounded-b-3xl border-t-0" : "rounded-3xl"
        }`}
      >
        <div className="text-4xl">🔒</div>
        <h2 className="mt-3 text-xl font-bold">{title}</h2>
        <p className="mt-2 text-dim text-sm">
          Bài này nằm trong gói <b className="text-ink">{p.label}</b>. Mua một lần, mở khóa và học
          trọn đời.
        </p>

        {/* Bán giá trị: nhấn mạnh MUA 1 BÀI = MỞ CẢ KHO (số N tính động từ TOTAL_AVAILABLE). */}
        {others > 0 && (
          <div className="mt-4 rounded-2xl border border-line bg-white px-4 py-3 text-sm">
            <div className="font-semibold text-ink">
              Mở bài này <span className="text-accent">+ {others} bài khác</span>
            </div>
            <div className="mt-0.5 text-xs text-dim">
              Cùng nút <b>🎲 Đổi số</b> để luyện lại vô hạn bộ số trên mỗi phiếu.
            </div>
          </div>
        )}

        <div className="mt-5 text-3xl font-extrabold text-accent">{formatVnd(price)}</div>
        <p className="mt-1 text-xs text-dim">Trọn đời · hoàn tiền trong 7 ngày nếu chưa hợp</p>
        <div className="mt-5 flex flex-col gap-2">
          <Link href={`/checkout?product=${p.id}`}>
            <Button size="lg" className="w-full">
              Mua gói {p.label}
            </Button>
          </Link>
          <Link href={`/learn/${FREE_SLUGS[0]}`}>
            <Button variant="ghost" size="sm">
              Xem lại bài miễn phí
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
