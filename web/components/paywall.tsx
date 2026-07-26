import Link from "next/link";
import { cookies } from "next/headers";
import { formatVnd } from "@/lib/utils";
import { FREE_SLUGS, TOTAL_AVAILABLE, lessonBySlug, type Course } from "@/lib/lessons";
import { getUser } from "@/lib/auth";
import { effectiveGiftPercent, applyGift, GIFT_VISITOR_COOKIE } from "@/lib/gift";
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

export async function Paywall({ title, course }: { title: string; course: Course }) {
  const p = cheapestUnlock(course);
  const preview = previewSrc();
  // N = tổng phiếu đã phát hành trừ đúng bài đang xem (tính động, không hardcode).
  const others = Math.max(0, TOTAL_AVAILABLE - 1);

  // Giá đi qua ĐÚNG nguồn chân lý dùng chung với /checkout, trang chủ và /api/orders
  // (effectiveGiftPercent + applyGift) → 4 nơi không thể ra số khác nhau. Trước đây chỗ này
  // luôn hiện giá GỐC: khách vừa quay trúng 70% ở hộp quà, mở một bài đang khóa lại thấy
  // 149.000đ nguyên giá — đúng màn hình thuyết phục mua nhất thì giấu mất lợi ích, và số ở đây
  // lệch hẳn số ở /checkout ngay bước sau.
  // ĐỢT 2: quà có thể neo ở cookie 'gv' của khách CHƯA đăng nhập → phải đọc CẢ cookie, không chỉ
  // user, nếu không thì khách ẩn danh vẫn thấy giá nguyên và việc hoãn đăng nhập thành vô nghĩa.
  // Chỉ ĐỌC cookie (server component không set được cookie) và không ghi DB — hấp thụ quà vào
  // tài khoản là việc của /api/gift/open và /api/orders.
  // getUser() gọi lại lần 2 (trang learn đã gọi) vì page.tsx không truyền user xuống; đổi lại
  // paywall tự đủ dữ liệu, không cần sửa chữ ký ở nơi gọi.
  const user = await getUser();
  const visitor = (await cookies()).get(GIFT_VISITOR_COOKIE)?.value ?? null;
  const giftPercent = await effectiveGiftPercent(user?.id ?? null, visitor, p.id);
  const price = applyGift(effectivePriceVnd(p), giftPercent);

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

        {/* Có quà còn hạn → giá gốc gạch ngang + nhãn −N% NGAY TRÊN giá phải trả, rồi dòng
            "tiết kiệm". Dùng lại đúng .co-sum-* của tóm tắt đơn ở /checkout để hai màn hình
            liền mạch một hệ, khách không phải đối chiếu lại. */}
        {price.percent != null && (
          <div className="pw-gift-row">
            <span className="co-sum-old">{formatVnd(price.base)}</span>
            <span className="co-sum-off">−{price.percent}%</span>
          </div>
        )}
        <div className="pw-price">{formatVnd(price.final)}</div>
        {price.percent != null && (
          <div className="co-sum-gift">
            🎁 Đã áp mã giảm giá của bạn — tiết kiệm {formatVnd(price.base - price.final)}
          </div>
        )}
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
