import Link from "next/link";
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
    <div className="pw-wrap">
      {/* Teaser: phiếu mẫu làm mờ, khóa tương tác, mờ dần xuống card CTA bên dưới. */}
      {preview && (
        <div className="pw-teaser">
          <iframe
            src={preview}
            title="Xem trước phong cách phiếu"
            aria-hidden
            tabIndex={-1}
            scrolling="no"
          />
          {/* Phủ gradient: trong ở trên, đặc dần về màu card ở dưới → nối liền mạch vào CTA. */}
          <div className="pw-fade" />
          <span className="pw-badge">Xem trước phong cách phiếu</span>
        </div>
      )}

      <div className={`pw-card ${preview ? "" : "solo"}`}>
        <div className="pw-lock">🔒</div>
        <h2>{title}</h2>
        <p className="pw-desc">
          Bài này nằm trong gói <b style={{ color: "var(--ink)" }}>{p.label}</b>. Mua một lần, mở
          khóa và học trọn đời.
        </p>

        {/* Bán giá trị: nhấn mạnh MUA 1 BÀI = MỞ CẢ KHO (số N tính động từ TOTAL_AVAILABLE). */}
        {others > 0 && (
          <div className="pw-value">
            <div className="big">
              Mở bài này <em>+ {others} bài khác</em>
            </div>
            <div className="small">
              Cùng nút <b>🎲 Đổi số</b> để luyện lại vô hạn bộ số trên mỗi phiếu.
            </div>
          </div>
        )}

        <div className="pw-price">{formatVnd(price)}</div>
        <p className="pw-price-note">Trọn đời · hoàn tiền trong 7 ngày nếu chưa hợp</p>
        <div className="pw-btns">
          <Link href={`/checkout?product=${p.id}`} className="btn btn-primary btn-lg">
            Mua gói {p.label}
          </Link>
          <Link href={`/learn/${FREE_SLUGS[0]}`} className="btn btn-ghost btn-sm">
            Xem lại bài miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
}
