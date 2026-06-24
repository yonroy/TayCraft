"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminConfirmButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!window.confirm("Xác nhận đơn này đã thanh toán và mở khóa cho học viên?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}/confirm`, { method: "POST" });
    setLoading(false);
    if (res.ok) router.refresh();
    else window.alert("Không duyệt được đơn. Thử lại.");
  }

  return (
    <Button size="sm" onClick={confirm} disabled={loading}>
      {loading ? "Đang duyệt…" : "Duyệt"}
    </Button>
  );
}
