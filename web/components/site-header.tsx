import Link from "next/link";
import { getUser, isAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const user = await getUser();
  const admin = isAdmin(user?.email);

  const meta = user?.user_metadata ?? {};
  const avatarUrl = (meta.avatar_url ?? meta.picture) as string | undefined;
  const displayName = (meta.full_name ?? meta.name ?? user?.email ?? "") as string;
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            Làm toán <span className="text-accent">bằng tay</span> ✍️
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-[15px]">
          <Link href="/learn" className="hover:text-accent font-medium hidden sm:inline">
            Bài học
          </Link>
          {user ? (
            <>
              {admin && (
                <Link href="/admin" className="hover:text-accent font-medium">
                  Admin
                </Link>
              )}
              <Link href="/account" title="Tài khoản" className="flex items-center" aria-label="Tài khoản">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Ảnh đại diện"
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full border border-line object-cover"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-accent text-sm font-bold">
                    {initial}
                  </span>
                )}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Đăng nhập</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
