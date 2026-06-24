import Link from "next/link";
import { getUser, isAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const user = await getUser();
  const admin = isAdmin(user?.email);

  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            AI by <span className="text-accent">Hand</span> ✍️
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
              <Link href="/account" className="hover:text-accent font-medium">
                Tài khoản
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
