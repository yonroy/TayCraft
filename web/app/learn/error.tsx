"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-md px-5 py-20 text-center flex-1">
      <div className="text-5xl">⚠️</div>
      <h1 className="mt-4 text-2xl font-bold">Không tải được trang học</h1>
      <p className="mt-2 text-dim text-sm">
        Có thể do kết nối tạm thời. Thử lại hoặc đăng nhập lại nhé.
      </p>
      {error?.message && (
        <pre className="mt-4 text-left text-xs bg-paper rounded-lg p-3 overflow-auto text-dim">
          {error.message}
        </pre>
      )}
      <div className="mt-6 flex gap-2 justify-center">
        <Button onClick={reset}>Thử lại</Button>
        <Link href="/login">
          <Button variant="outline">Đăng nhập lại</Button>
        </Link>
      </div>
    </main>
  );
}
