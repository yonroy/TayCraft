"use client";

import { useEffect, useState } from "react";

const KEY = "tc_flash_deadline";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Đồng hồ đếm ngược EVERGREEN theo khách: mỗi trình duyệt giữ 1 mốc trong localStorage;
// hết giờ thì tự đặt mốc mới (reset) → luôn còn thời gian, tạo cảm giác khẩn cấp.
export function FlashSaleBar({
  enabled,
  headline,
  countdownMinutes,
}: {
  enabled: boolean;
  headline: string;
  countdownMinutes: number;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const span = Math.max(1, countdownMinutes) * 60_000;

    function nextDeadline() {
      const dl = Date.now() + span;
      localStorage.setItem(KEY, String(dl));
      return dl;
    }

    let deadline = Number(localStorage.getItem(KEY));
    if (!deadline || Number.isNaN(deadline) || deadline <= Date.now()) {
      deadline = nextDeadline();
    }

    const tick = () => {
      let left = deadline - Date.now();
      if (left <= 0) {
        deadline = nextDeadline(); // reset evergreen
        left = deadline - Date.now();
      }
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [enabled, countdownMinutes]);

  if (!enabled || remaining == null) return null;

  const totalSec = Math.floor(remaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <div className="w-full bg-accent-2 text-white">
      <div className="mx-auto max-w-5xl px-5 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
        <span className="font-semibold">{headline}</span>
        <span className="font-mono font-bold tabular-nums rounded-md bg-black/20 px-2 py-0.5">
          {pad(h)}:{pad(m)}:{pad(s)}
        </span>
      </div>
    </div>
  );
}
