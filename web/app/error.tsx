"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      {/* Header tối giản (không dùng SiteHeader async trong client component) để trang lỗi
          vẫn có khung site, thay vì một <main> trần trông như vỡ. */}
      <header className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Làm toán <span className="text-accent">AI</span> ✍️
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 py-20 text-center flex-1">
        <div className="text-5xl">⚠️</div>
        <h1 className="mt-4 text-2xl font-bold">Có lỗi xảy ra</h1>
        <p className="mt-2 text-dim text-sm">Xin lỗi, trang gặp sự cố. Bạn thử lại nhé.</p>
        {error?.digest && (
          <p className="mt-3 font-mono text-xs text-dim">Mã lỗi: {error.digest}</p>
        )}
        <div className="mt-6 flex gap-2 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Link href="/">
            <Button variant="outline">Về trang chủ</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
