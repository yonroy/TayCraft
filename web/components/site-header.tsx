import Link from "next/link";
import { getUser, isAdmin } from "@/lib/auth";
import { ProfileMenu } from "@/components/profile-menu";
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
      <div className="mx-auto max-w-5xl px-3 sm:px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          {/* Mobile thu nhỏ logo + siết padding để nhường chỗ cho "Bài học". Dưới 400px vẫn
              không đủ chỗ cho cả 4 phần tử nên "Bảng giá" ẩn ở riêng dải đó — giá vẫn hiện qua
              thanh CTA dính đáy trang chủ, còn danh sách bài thì header là lối vào DUY NHẤT. */}
          <span className="text-base sm:text-xl font-extrabold tracking-tight whitespace-nowrap">
            Làm toán <span className="text-accent">AI</span> ✍️
          </span>
        </Link>
        <nav className="flex items-center gap-2.5 sm:gap-4 text-sm sm:text-[15px]">
          <Link href="/learn" className="hover:text-accent font-medium whitespace-nowrap">
            Bài học
          </Link>
          <Link
            href="/#packages"
            className="hover:text-accent font-medium whitespace-nowrap hidden min-[400px]:inline"
          >
            Bảng giá
          </Link>
          {user ? (
            <>
              {admin && (
                <Link href="/admin" className="hover:text-accent font-medium">
                  Admin
                </Link>
              )}
              <ProfileMenu
                avatarUrl={avatarUrl}
                displayName={displayName}
                email={user.email}
                initial={initial}
              />
            </>
          ) : (
            <Link href="/login" className="shrink-0">
              <Button size="sm" className="whitespace-nowrap">
                Đăng nhập
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
