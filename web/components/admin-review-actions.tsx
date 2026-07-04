"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Duyệt / ẩn / xóa review — theo pattern AdminConfirmButton.
export function AdminReviewActions({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function call(init: RequestInit, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/reviews/${id}`, init);
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      window.alert(data?.error ?? "Có lỗi, thử lại.");
    }
  }

  const setApproved = (value: boolean) =>
    call({
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: value }),
    });

  return (
    <div className="flex justify-end gap-2">
      {approved ? (
        <Button size="sm" variant="outline" disabled={loading} onClick={() => setApproved(false)}>
          Ẩn
        </Button>
      ) : (
        <Button size="sm" disabled={loading} onClick={() => setApproved(true)}>
          Duyệt
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        disabled={loading}
        onClick={() => call({ method: "DELETE" }, "Xóa hẳn đánh giá này? Không hoàn tác được.")}
      >
        Xóa
      </Button>
    </div>
  );
}
