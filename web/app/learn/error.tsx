"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Làm toán <span className="text-accent">AI</span> ✍️
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 py-20 text-center flex-1">
        <div className="text-5xl">⚠️</div>
        <h1 className="mt-4 text-2xl font-bold">Không tải được trang học</h1>
        <p className="mt-2 text-dim text-sm">
          Có thể do kết nối tạm thời. Thử lại hoặc đăng nhập lại nhé.
        </p>
        {error?.digest && (
          <p className="mt-3 font-mono text-xs text-dim">Mã lỗi: {error.digest}</p>
        )}
        <div className="mt-6 flex gap-2 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Link href="/login">
            <Button variant="outline">Đăng nhập lại</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
