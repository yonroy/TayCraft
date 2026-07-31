import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LoginForm } from "@/components/login-form";
import { getUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; reason?: string }>;
}) {
  const { next, error, reason } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/";

  const user = await getUser();
  if (user) redirect(safeNext);

  return (
    <>
      <SiteHeader />
      <div className="lp">
        <section className="co-page">
          <div className="co-wrap max-w-[400px]">
            <div className="co-head">
              <span className="eyebrow">Tài khoản</span>
              <h1>Đăng nhập</h1>
              <p className="mt-2 text-sm text-dim">Để vào học và mở khóa bài đã mua.</p>
            </div>
            {error && (
              <div className="co-alert mb-4">
                <p className={reason ? "mb-2" : ""}>
                  Đăng nhập chưa hoàn tất. Bạn thử lại bằng nút bên dưới nhé.
                </p>
                {reason && <p className="co-mono text-xs break-all">{reason}</p>}
              </div>
            )}
            <div className="co-card">
              <LoginForm next={safeNext} />
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
