import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QrCheckout } from "@/components/qr-checkout";
import { FlashSaleBar } from "@/components/flash-sale-bar";
import { ViewerCount } from "@/components/viewer-count";
import { getUser, hasAccess } from "@/lib/auth";
import { DEFAULT_PRODUCT, isActiveProduct, productById } from "@/lib/products";
import { getFlashSale } from "@/lib/settings";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const productId = product && isActiveProduct(product) ? product : DEFAULT_PRODUCT;
  const meta = productById(productId);

  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout?product=${productId}`)}`);
  if (await hasAccess(user.id)) redirect("/learn");

  const flash = await getFlashSale();

  return (
    <>
      <FlashSaleBar
        enabled={flash.enabled}
        headline={flash.headline}
        countdownMinutes={flash.countdownMinutes}
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-md px-5 py-12 flex-1">
        <h1 className="text-2xl font-bold text-center mb-2">Mua {meta?.label ?? "AI by Hand"}</h1>
        {flash.enabled && (
          <div className="flex justify-center mb-6">
            <ViewerCount min={flash.viewerMin} max={flash.viewerMax} label="người đang thanh toán" />
          </div>
        )}
        <QrCheckout product={productId} />
      </main>
      <SiteFooter />
    </>
  );
}
