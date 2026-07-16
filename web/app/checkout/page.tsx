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
      <main className="mx-auto w-full max-w-md px-5 py-12 flex-1">
        <h1 className="text-2xl font-bold text-center mb-2">Mua {meta?.label ?? "Làm toán AI"}</h1>

        {/* Tóm tắt đơn — hiện NGAY (trước cả khi tạo đơn/đăng nhập) để trấn an giá trị + rủi ro. */}
        {meta && price != null && (
          <div className="mt-4 rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold">{meta.label}</div>
                {meta.tagline && <div className="mt-0.5 text-xs text-dim">{meta.tagline}</div>}
              </div>
              <div className="whitespace-nowrap text-2xl font-extrabold text-accent">
                {formatVnd(price)}
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-dim">
              <li>
                <span className="text-accent">✓</span> Mua một lần, học trọn đời (không thuê bao)
              </li>
              <li>
                <span className="text-accent">✓</span> Hoàn tiền trong 7 ngày nếu chưa hợp
              </li>
              <li>
                <span className="text-accent">✓</span> Tự động mở khóa khi nhận được chuyển khoản
              </li>
            </ul>
          </div>
        )}

        {flash.enabled && (
          <div className="mt-4 flex justify-center">
            <ViewerCount min={flash.viewerMin} max={flash.viewerMax} label="người đang thanh toán" />
          </div>
        )}

        {user ? (
          <div className="mt-6">
            <QrCheckout product={productId} productLabel={meta?.label} />
          </div>
        ) : (
          <div className="mt-6">
            <p className="mb-4 text-center text-sm text-dim">
              Đăng nhập nhanh bằng email để sang bước thanh toán — không cần mật khẩu. Mua xong mở
              khóa vĩnh viễn theo tài khoản này.
            </p>
            <LoginForm next={nextUrl} />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
