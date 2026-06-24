import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QrCheckout } from "@/components/qr-checkout";
import { getUser, hasAccess } from "@/lib/auth";
import { DEFAULT_PRODUCT, isActiveProduct, productById } from "@/lib/products";

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

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md px-5 py-12 flex-1">
        <h1 className="text-2xl font-bold text-center mb-6">Mua {meta?.label ?? "AI by Hand"}</h1>
        <QrCheckout product={productId} />
      </main>
      <SiteFooter />
    </>
  );
}
