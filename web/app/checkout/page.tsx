import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QrCheckout } from "@/components/qr-checkout";
import { getUser, hasAccess } from "@/lib/auth";

export default async function CheckoutPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/checkout");
  if (await hasAccess(user.id)) redirect("/learn");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md px-5 py-12 flex-1">
        <h1 className="text-2xl font-bold text-center mb-6">Mua trọn bộ AI by Hand</h1>
        <QrCheckout />
      </main>
      <SiteFooter />
    </>
  );
}
