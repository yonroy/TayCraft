import Link from "next/link";
import { PencilLine } from "lucide-react";
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
    <header className="border-b-[1.5px] border-[color:var(--oly-dam,#BCD2C9)] bg-[var(--giay,#F2F6F3)]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-3 sm:px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile thu nhỏ logo + siết padding để nhường chỗ cho "Bài học". Dưới 400px vẫn
              không đủ chỗ cho cả 4 phần tử nên "Bảng giá" ẩn ở riêng dải đó — giá vẫn hiện qua
              thanh CTA dính đáy trang chủ, còn danh sách bài thì header là lối vào DUY NHẤT. */}
          <span className="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-[4px] border-[1.5px] border-[color:var(--muc,#17252A)] bg-[var(--trang,#FFFDFA)] text-[color:var(--muc,#17252A)]">
            <PencilLine size={16} strokeWidth={2.25} aria-hidden />
          </span>
          <span className="text-base sm:text-xl font-extrabold tracking-tight whitespace-nowrap text-[color:var(--muc,#17252A)]">
            Làm toán <span className="text-[color:var(--cam,#C2410C)]">AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2.5 sm:gap-4 text-sm sm:text-base text-[color:var(--chi,#5F7377)]">
          <Link
            href="/learn"
            className="hover:text-[color:var(--cam,#C2410C)] font-medium whitespace-nowrap"
          >
            Bài học
          </Link>
          <Link
            href="/#packages"
            className="hover:text-[color:var(--cam,#C2410C)] font-medium whitespace-nowrap hidden min-[400px]:inline"
          >
            Bảng giá
          </Link>
          {user ? (
            <>
              {admin && (
                <Link
                  href="/admin"
                  className="hover:text-[color:var(--cam,#C2410C)] font-medium"
                >
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
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap rounded-[3px] border-[1.5px] border-[color:var(--muc,#17252A)] bg-[var(--trang,#FFFDFA)] text-[color:var(--muc,#17252A)] shadow-[2px_2px_0_var(--muc,#17252A)] hover:border-[color:var(--muc,#17252A)] hover:text-[color:var(--cam,#C2410C)] hover:brightness-100"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
