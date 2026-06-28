"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Avatar + menu xổ xuống: nút Đăng xuất ẩn trong đây, bấm avatar mới hiện.
export function ProfileMenu({
  avatarUrl,
  displayName,
  email,
  initial,
}: {
  avatarUrl?: string;
  displayName: string;
  email?: string;
  initial: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi bấm ra ngoài hoặc nhấn Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Tài khoản"
        className="flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
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
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-paper shadow-lg z-50"
        >
          <div className="px-4 py-3 border-b border-line">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            {email && <p className="text-xs text-dim truncate">{email}</p>}
          </div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-line/40"
          >
            Tài khoản
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2.5 text-sm text-accent-2 border-t border-line hover:bg-line/40"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
