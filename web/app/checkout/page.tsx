import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QrCheckout } from "@/components/qr-checkout";
import { ViewerCount } from "@/components/viewer-count";
import { LoginForm } from "@/components/login-form";
import { getUser, ownsProduct } from "@/lib/auth";
import { DEFAULT_PRODUCT, isActiveProduct, productById, effectivePriceVnd } from "@/lib/products";
import { getFlashSale } from "@/lib/settings";
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

  const flash = await getFlashSale();
  const price = meta ? effectivePriceVnd(meta) : undefined;
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
                  </div>
                  <div className="co-sum-price">{formatVnd(price)}</div>
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

            {flash.enabled && (
              <div className="co-viewer">
                <ViewerCount
                  min={flash.viewerMin}
                  max={flash.viewerMax}
                  label="người đang thanh toán"
                />
              </div>
            )}

            <div style={{ marginTop: 16 }}>
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
