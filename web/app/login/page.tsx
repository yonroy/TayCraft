import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoginForm } from "@/components/login-form";
import { getUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/learn";

  const user = await getUser();
  if (user) redirect(safeNext);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm px-5 py-16 flex-1">
        <h1 className="text-2xl font-bold text-center">Đăng nhập</h1>
        <p className="text-dim text-center mt-1 mb-8 text-sm">
          Để vào học và mở khóa bài đã mua.
        </p>
        {error && (
          <p className="mb-4 text-center text-sm text-accent-2 bg-accent-2/10 rounded-lg py-2 px-3">
            Đăng nhập chưa hoàn tất. Bạn thử lại bằng nút bên dưới nhé.
          </p>
        )}
        <LoginForm next={safeNext} />
      </main>
      <SiteFooter />
    </>
  );
}
