"use client";

import { useEffect, useState } from "react";

// "Số người đang xem" (giả) — social proof. Chọn số ngẫu nhiên trong [min,max] rồi đi bộ
// ngẫu nhiên ±1–2 mỗi vài giây để trông sống động. Render sau khi mount (tránh lệch hydration).
export function ViewerCount({
  min,
  max,
  label = "người đang xem",
  className = "",
}: {
  min: number;
  max: number;
  label?: string;
  className?: string;
}) {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const lo = Math.max(0, Math.min(min, max));
    const hi = Math.max(min, max);
    const rand = () => lo + Math.floor(Math.random() * (hi - lo + 1));

    const tick = (initial: boolean) =>
      setN((prev) => {
        if (initial || prev == null) return rand();
        const step = (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.7 ? 1 : 2);
        return Math.min(hi, Math.max(lo, prev + step));
      });

    tick(true);
    const id = setInterval(() => tick(false), 3000 + Math.floor(Math.random() * 2500));
    return () => clearInterval(id);
  }, [min, max]);

  if (n == null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-dim ${className}`}
      suppressHydrationWarning
    >
      <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
      <b className="text-ink">{n}</b> {label}
    </span>
  );
}
