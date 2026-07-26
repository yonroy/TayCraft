"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { EmailOtpForm } from "@/components/email-otp-form";
import { formatVnd } from "@/lib/utils";

// Event Vercel Analytics cho phễu hộp quà — CHỈ gửi biến phân loại (percent/free/trigger),
// KHÔNG bao giờ gửi email/user_id/tên (không định danh cá nhân lên analytics bên thứ ba).

type GiftData = {
  status: "ok";
  product: string;
  percent: number;
  rarity: number; // % người trúng đúng mức này (độ hiếm THẬT, không bịa)
  free: boolean; // trúng 100% → đã cấp Khóa 1 free, dẫn vào học thay vì checkout
  basePrice: number;
  finalPrice: number;
  expiresAt: string;
  expired: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Hộp quà giảm giá K1: khách bấm mở → (đăng nhập nếu cần) → server chốt % → lộ giá đã giảm
// + đồng hồ đếm ngược → CTA mua. % do server quyết (chống gian lận); giá đã giảm là THẬT.
export function GiftPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [data, setData] = useState<GiftData | null>(null);
  const [gone, setGone] = useState(false); // đã sở hữu / tính năng tắt → ẩn hẳn
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Đếm "đã THẤY hộp quà" (impression) — 1 lần/phiên; server chống trùng theo cookie.
  // Để /admin tính "số người không nhận" = số người thấy − số người nhận.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("giftBeacon")) return;
    sessionStorage.setItem("giftBeacon", "1");
    fetch("/api/gift/seen", { method: "POST", keepalive: true }).catch(() => {});
  }, []);

  // Tự bung 1 lần mỗi phiên (không làm phiền mỗi lần cuộn). Nút quà nổi vẫn mở lại được.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("giftSeen")) return;
    const t = setTimeout(() => {
      setOpen(true);
      track("gift_shown", { trigger: "auto" });
      sessionStorage.setItem("giftSeen", "1");
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const openGift = useCallback(async () => {
    track("gift_open_clicked");
    setOpening(true);
    setMessage(null);
    try {
      const res = await fetch("/api/gift/open", { method: "POST" });
      if (res.status === 401) {
        track("gift_login_required");
        setNeedLogin(true);
        return;
      }
      const d = await res.json();
      if (d.status === "ok") {
        setData(d as GiftData);
        // Tách rõ 2 nhánh: quà còn hạn nhận được (claimed) vs quay lại thấy quà cũ đã hết hạn
        // chưa dùng (expired_unused) — đây là khoảng mù trước đây không phân biệt được.
        if (d.expired) track("gift_expired_unused", { percent: d.percent });
        else track("gift_claimed", { percent: d.percent, free: d.free });
      } else if (d.status === "error") {
        // Lỗi hạ tầng (đã log chi tiết ở server, prefix "[gift]") — khách chỉ thấy thông báo nhẹ,
        // giống hệt nhánh lỗi mạng bên dưới, không lộ chi tiết kỹ thuật.
        setMessage("Có lỗi, bạn thử lại nhé.");
      } else {
        // "owned" (đã có K1) hoặc "disabled" → không có quà để trao.
        setGone(true);
        setOpen(false);
      }
    } catch {
      setMessage("Có lỗi, bạn thử lại nhé.");
    } finally {
      setOpening(false);
    }
  }, []);

  // Đồng hồ đếm ngược khi đã lộ quà.
  useEffect(() => {
    if (!data) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [data]);

  if (gone) return null;

  const left = data ? Math.max(0, new Date(data.expiresAt).getTime() - now) : 0;
  const totalSec = Math.floor(left / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const expired = data ? data.expired || left <= 0 : false;

  return (
    <>
      {/* Nút quà nổi — luôn có để mở lại sau khi đóng ✕ */}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            track("gift_shown", { trigger: "reopen" });
          }}
          aria-label="Mở hộp quà ưu đãi"
          className="gift-shake fixed bottom-24 right-4 z-[75] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-rose-500 to-rose-700 text-2xl shadow-xl ring-2 ring-amber-300/60 hover:brightness-110 sm:bottom-6"
        >
          🎁
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[#7a0d0d] to-[#3a0606] text-white shadow-2xl ring-1 ring-amber-300/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white/80 hover:bg-black/50"
            >
              ✕
            </button>

            <div className="px-6 pb-6 pt-8 text-center">
              {!data ? (
                // ---- Giai đoạn 1: hộp quà chưa mở ----
                <>
                  <div className="text-7xl gift-shake" aria-hidden>
                    🎁
                  </div>
                  <h2 className="mt-4 bg-gradient-to-b from-amber-200 to-amber-400 bg-clip-text text-3xl font-extrabold leading-tight text-transparent">
                    Quà tặng cho bạn!
                  </h2>
                  <p className="mt-2 text-sm text-amber-100/80">
                    Mở hộp quà nhận <b className="text-white">mã giảm giá</b> cho{" "}
                    <b className="text-white">Khóa 1 · Nền tảng AI</b> —{" "}
                    <b className="text-amber-200">có cả suất tặng FREE 100%!</b>
                  </p>
                  <p className="mt-1.5 text-xs text-amber-100/55">
                    Mỗi tài khoản chỉ mở <b className="text-amber-100/80">1 lần</b> · ưu đãi có hạn
                  </p>

                  {message ? (
                    <p className="mt-5 text-sm font-semibold text-amber-200">{message}</p>
                  ) : needLogin ? (
                    <div className="mt-5 space-y-2 text-left">
                      <p className="text-center text-xs text-amber-100/70">
                        Nhập email để mở quà — nhận mã xác nhận, không cần mật khẩu
                      </p>
                      <EmailOtpForm
                        dark
                        onSuccess={() => {
                          track("gift_login_completed");
                          setNeedLogin(false);
                          openGift();
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={openGift}
                      disabled={opening}
                      className="mt-6 w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3.5 text-base font-extrabold text-[#5a0a0a] shadow-lg transition hover:brightness-105 disabled:opacity-60"
                    >
                      {opening ? "Đang mở…" : "Mở hộp quà 🎁"}
                    </button>
                  )}
                </>
              ) : (
                // ---- Giai đoạn 2: đã lộ quà ----
                <div className="gift-pop">
                  <div className="text-6xl" aria-hidden>
                    🎉
                  </div>

                  {data.free ? (
                    // JACKPOT: trúng 100% → Khóa 1 đã được cấp free, dẫn thẳng vào học.
                    <>
                      <div className="mx-auto mt-3 inline-block rounded-full border border-amber-300/60 bg-amber-400/10 px-4 py-1 text-xs font-bold tracking-[0.15em] text-amber-200 uppercase">
                        🏆 Trúng lớn
                      </div>
                      <div className="mt-2 text-4xl font-extrabold text-amber-300 leading-tight">
                        TẶNG FREE 100%
                      </div>
                      <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-amber-200">
                        🔥 CỰC HIẾM · chỉ {data.rarity}% người mở quà trúng suất FREE
                      </div>
                      <p className="mt-3 text-sm text-amber-100/85">
                        Bạn trúng suất tặng — nhận trọn <b className="text-white">Khóa 1 · Nền tảng AI</b>{" "}
                        hoàn toàn miễn phí!
                      </p>
                      <button
                        onClick={() => {
                          router.push("/learn");
                          router.refresh();
                        }}
                        className="mt-5 block w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3.5 text-base font-extrabold text-[#5a0a0a] shadow-lg transition hover:brightness-105"
                      >
                        Vào học ngay →
                      </button>
                      <p className="mt-3 text-xs text-amber-100/60">
                        Khóa đã mở sẵn trong tài khoản của bạn.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto mt-3 inline-block rounded-full border border-amber-300/60 bg-amber-400/10 px-4 py-1 text-xs font-bold tracking-[0.15em] text-amber-200 uppercase">
                        Bạn nhận được
                      </div>
                      <div className="mt-2 text-5xl font-extrabold text-amber-300">
                        Giảm {data.percent}%
                      </div>
                      <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-amber-200">
                        {data.rarity <= 33 ? (
                          <>
                            {data.rarity <= 20 ? "🔥 HIẾM" : "✨"} · chỉ {data.rarity}% người mở quà
                            trúng mức −{data.percent}%
                          </>
                        ) : (
                          <>💥 Giảm ngay −{data.percent}% · ưu đãi có hạn, dùng kẻo lỡ</>
                        )}
                      </div>

                      <div className="mt-4 rounded-2xl bg-black/20 px-4 py-3">
                        <div className="text-sm text-amber-100/70">Khóa 1 · Nền tảng AI</div>
                        <div className="mt-1 text-3xl font-extrabold text-white">
                          {formatVnd(data.finalPrice)}{" "}
                          <span className="text-lg font-semibold text-amber-100/50 line-through">
                            {formatVnd(data.basePrice)}
                          </span>
                        </div>
                      </div>

                      {!expired ? (
                        <>
                          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-100/70">
                            <span>Ưu đãi hết hạn sau</span>
                            <span className="rounded-md bg-black/30 px-2 py-1 font-mono font-bold tabular-nums">
                              {pad(h)}:{pad(m)}:{pad(s)}
                            </span>
                          </div>
                          <a
                            href="/checkout?product=k1"
                            className="mt-5 block w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3.5 text-base font-extrabold text-[#5a0a0a] shadow-lg transition hover:brightness-105"
                          >
                            Nhận giá {formatVnd(data.finalPrice)} →
                          </a>
                          <p className="mt-3 text-xs text-amber-100/60">
                            Mã đã gắn với tài khoản của bạn — cứ thanh toán là tự áp.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-4 text-sm text-amber-100/80">
                            Ưu đãi đã hết hạn. Bạn vẫn có thể học Khóa 1 với giá thường:
                          </p>
                          <a
                            href="/checkout?product=k1"
                            className="mt-4 block w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3.5 text-base font-extrabold text-[#5a0a0a] shadow-lg transition hover:brightness-105"
                          >
                            Học Khóa 1 →
                          </a>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
