import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QrCheckout } from "@/components/qr-checkout";
import { LoginForm } from "@/components/login-form";
import { getUser, ownsProduct } from "@/lib/auth";
import { DEFAULT_PRODUCT, isActiveProduct, productById, effectivePriceVnd } from "@/lib/products";
import { effectiveGiftPercent, applyGift, GIFT_VISITOR_COOKIE } from "@/lib/gift";
import { formatVnd } from "@/lib/utils";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const productId = product && isActiveProduct(product) ? product : DEFAULT_PRODUCT;
  const meta = productById(productId);

  const user = await getUser();
  // Không ép đăng nhập TRƯỚC nữa (giảm ma sát): khách chưa đăng nhập vẫn thấy tóm tắt đơn +
  // đăng nhập ngay tại chỗ (OTP inline, không bật sang /login rồi quay lại). Vẫn cần tài khoản
  // để gắn quyền — chỉ đổi CHỖ đăng nhập, không đổi luồng cấp quyền (không migration).
  if (user && (await ownsProduct(user.id, productId))) redirect("/learn");

  // Giá hiển thị PHẢI khớp số tiền đơn sẽ ghi (api/orders áp cùng activeGiftPercent + applyGift).
  // Trước đây chỗ này luôn hiện giá GỐC trong khi QR lại ra số đã giảm → khách thấy 149k rồi mới
  // thấy 44k ở bước cuối: vừa mất niềm tin, vừa giấu mất chính lợi ích đang thuyết phục họ mua.
  // ĐỢT 2: khách CHƯA đăng nhập cũng phải thấy giá đã giảm — quà neo ở cookie 'gv'. Nếu chỗ này
  // vẫn hiện giá gốc cho khách ẩn danh thì cả việc hoãn đăng nhập trở nên vô nghĩa: popup vừa
  // khoe "giảm 70%", bấm sang đây lại thấy giá nguyên.
  // Chỉ ĐỌC cookie, không ghi (server component không set được cookie) và không ghi DB — việc
  // hấp thụ quà vào tài khoản do /api/gift/open và /api/orders làm.
  const visitor = (await cookies()).get(GIFT_VISITOR_COOKIE)?.value ?? null;
  const giftPercent = meta ? await effectiveGiftPercent(user?.id ?? null, visitor, productId) : null;
  const price = meta ? applyGift(effectivePriceVnd(meta), giftPercent) : undefined;
  const nextUrl = `/checkout?product=${productId}`;

  return (
    <>
      <SiteHeader />
      <div className="lp">
        <section className="co-page">
          <div className="co-wrap">
            <div className="co-head">
              <span className="eyebrow">Thanh toán</span>
              <h1>Mua {meta?.label ?? "Làm toán AI"}</h1>
            </div>

            {/* Tóm tắt đơn — hiện NGAY (trước cả khi tạo đơn/đăng nhập) để trấn an giá trị + rủi ro. */}
            {meta && price != null && (
              <div className="co-summary">
                <div className="co-sum-top">
                  <div>
                    <div className="co-sum-name">{meta.label}</div>
                    {meta.tagline && <div className="co-sum-tag">{meta.tagline}</div>}
                    {price.percent != null && (
                      <div className="co-sum-gift">
                        🎁 Đã áp mã giảm giá của bạn — tiết kiệm{" "}
                        {formatVnd(price.base - price.final)}
                      </div>
                    )}
                  </div>
                  <div className="co-sum-price-col">
                    {price.percent != null && (
                      <>
                        <span className="co-sum-old">{formatVnd(price.base)}</span>
                        <span className="co-sum-off">−{price.percent}%</span>
                      </>
                    )}
                    <div className="co-sum-price">{formatVnd(price.final)}</div>
                  </div>
                </div>
                <ul className="co-perks">
                  <li>
                    <span className="ck">✓</span> Mua một lần, học trọn đời (không thuê bao)
                  </li>
                  <li>
                    <span className="ck">✓</span> Hoàn tiền trong 7 ngày nếu chưa hợp
                  </li>
                  <li>
                    <span className="ck">✓</span> Tự động mở khóa khi nhận được chuyển khoản
                  </li>
                </ul>
              </div>
            )}

            <div className="mt-4">
              {user ? (
                <QrCheckout product={productId} productLabel={meta?.label} />
              ) : (
                <div className="co-card">
                  <p className="co-login-hint">
                    Đăng nhập nhanh bằng email để sang bước thanh toán — không cần mật khẩu. Mua xong
                    mở khóa vĩnh viễn theo tài khoản này.
                  </p>
                  <LoginForm next={nextUrl} />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
