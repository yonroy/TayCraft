"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const DISMISS_KEY = "launch-popup-dismissed";

type Status = {
  limit: number;
  remaining: number;
  full: boolean;
  expired: boolean;
  deadline: string;
};

type ClaimResult = "claimed" | "already" | "full" | "expired";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Popup "Tưng bừng khai trương": tặng 100 suất K1 free. Hết suất / hết hạn → chuyển CTA mua K1 49k.
export function LaunchPopup() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [open, setOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const autoClaimed = useRef(false);

  const claim = useCallback(async () => {
    setClaiming(true);
    setMessage(null);
    try {
      const res = await fetch("/api/promo/claim-k1", { method: "POST" });
      if (res.status === 401) {
        // Chưa đăng nhập → đăng nhập xong quay lại home tự nhận.
        router.push("/login?next=" + encodeURIComponent("/?claim=k1"));
        return;
      }
      const data = (await res.json()) as { result: ClaimResult; remaining: number };
      setStatus((s) => (s ? { ...s, remaining: data.remaining, full: data.remaining <= 0 } : s));
      switch (data.result) {
        case "claimed":
          setMessage("🎉 Nhận thành công! Đang mở khóa K1…");
          setTimeout(() => router.push("/learn"), 1200);
          break;
        case "already":
          setMessage("Bạn đã có Khóa 1 rồi — đang chuyển tới trang học…");
          setTimeout(() => router.push("/learn"), 1200);
          break;
        case "full":
          setStatus((s) => (s ? { ...s, full: true, remaining: 0 } : s));
          setMessage(null);
          break;
        case "expired":
          setStatus((s) => (s ? { ...s, expired: true } : s));
          setMessage(null);
          break;
      }
    } catch {
      setMessage("Có lỗi, vui lòng thử lại.");
    } finally {
      setClaiming(false);
    }
  }, [router]);

  // Tải trạng thái KM + quyết định có mở popup không.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/promo/status");
        const data = (await res.json()) as Status;
        if (!alive) return;
        setStatus(data);

        const params = new URLSearchParams(window.location.search);
        const wantClaim = params.get("claim") === "k1";
        if (data.expired) {
          setOpen(false);
          return;
        }
        // Mở nếu: vừa quay lại để nhận, HOẶC chưa từng đóng popup.
        const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
        if (wantClaim || !dismissed) setOpen(true);
        if (wantClaim && !autoClaimed.current) {
          autoClaimed.current = true;
          claim();
        }
      } catch {
        /* im lặng — không chặn trang nếu KM lỗi */
      }
    })();
    return () => {
      alive = false;
    };
  }, [claim]);

  // Đồng hồ đếm ngược tới hạn chót (tick mỗi giây khi popup mở).
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [open]);

  if (!open || !status || status.expired) return null;

  const close = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  };

  const left = Math.max(0, new Date(status.deadline).getTime() - now);
  const totalSec = Math.floor(left / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[#7a0d0d] to-[#3a0606] text-white shadow-2xl ring-1 ring-amber-300/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Đóng"
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white/80 hover:bg-black/50"
        >
          ✕
        </button>

        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mx-auto mb-3 inline-block rounded-full border border-amber-300/60 bg-amber-400/10 px-4 py-1 text-xs font-bold tracking-[0.18em] text-amber-200 uppercase">
            🎉 Tưng bừng khai trương
          </div>

          <h2 className="bg-gradient-to-b from-amber-200 to-amber-400 bg-clip-text text-3xl font-extrabold leading-tight text-transparent">
            Tặng 100 bạn
            <br />
            gói Khóa 1 · Nền tảng AI
          </h2>
          <p className="mt-2 text-sm text-amber-100/80">
            Quỹ học bổng giới hạn cho 100 học viên đăng ký đầu tiên.
          </p>

          {!status.full ? (
            <>
              <div className="mt-5 rounded-2xl bg-black/20 px-4 py-3">
                <div className="text-4xl font-extrabold text-amber-300 tabular-nums">
                  Còn {status.remaining}
                  <span className="text-lg text-amber-100/60">/{status.limit} suất</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-100/70">
                <span>Kết thúc sau</span>
                <span className="rounded-md bg-black/30 px-2 py-1 font-mono font-bold tabular-nums">
                  {days > 0 ? `${days}n ` : ""}
                  {pad(h)}:{pad(m)}:{pad(s)}
                </span>
              </div>

              {message ? (
                <p className="mt-5 text-sm font-semibold text-amber-200">{message}</p>
              ) : (
                <button
                  onClick={claim}
                  disabled={claiming}
                  className="mt-5 w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3.5 text-base font-extrabold text-[#5a0a0a] shadow-lg transition hover:brightness-105 disabled:opacity-60"
                >
                  {claiming ? "Đang xử lý…" : "Nhận Khóa 1 miễn phí →"}
                </button>
              )}
              <p className="mt-3 text-xs text-amber-100/60">
                Cần đăng nhập để giữ quyền học trọn đời cho tài khoản của bạn.
              </p>
            </>
          ) : (
            <>
              <p className="mt-5 text-sm text-amber-100/85">
                Đã hết 100 suất miễn phí 😍 Nhưng trong dịp khai trương, bạn vẫn học trọn{" "}
                <b>Khóa 1</b> với giá ưu đãi:
              </p>
              <div className="mt-3 text-4xl font-extrabold text-amber-300">
                49.000đ <span className="text-lg text-amber-100/50 line-through">149.000đ</span>
              </div>
              <a
                href="/checkout?product=k1"
                className="mt-5 block w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3.5 text-base font-extrabold text-[#5a0a0a] shadow-lg transition hover:brightness-105"
              >
                Học Khóa 1 chỉ 49.000đ →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
