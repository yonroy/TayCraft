"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { EmailOtpForm } from "@/components/email-otp-form";
import { formatVnd } from "@/lib/utils";

// Event Vercel Analytics cho phễu hộp quà — CHỈ gửi biến phân loại (percent/trigger),
// KHÔNG bao giờ gửi email/user_id/tên (không định danh cá nhân lên analytics bên thứ ba).

type GiftProduct = {
  id: string;
  label: string;
  tagline: string | null;
  highlight: boolean;
  basePrice: number;
  finalPrice: number;
};

type GiftData = {
  status: "ok";
  percent: number;
  rarity: number; // % người trúng đúng mức này (độ hiếm THẬT, không bịa)
  primary: string | null; // gói được làm nổi bật
  products: GiftProduct[]; // các gói quà này áp được, giá do SERVER tính
  expiresAt: string;
  expired: boolean;
  // ĐỢT 2: quà đã CHỐT (neo vào cookie 'gv') nhưng khách chưa đăng nhập → phải đăng nhập ở
  // bước LẤY THƯỞNG. Server quyết cờ này, không suy từ client.
  needLoginToClaim?: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Hộp quà giảm giá: khách bấm mở → server chốt % MỘT lần → lộ mức giảm áp cho CẢ 4 GÓI +
// đồng hồ đếm ngược → CTA mua. % do server quyết (chống gian lận); giá đã giảm là THẬT
// (đơn ghi đúng số tiền đó, webhook ép theo).
//
// ĐỢT 2 — HOÃN ĐĂNG NHẬP: mở quà KHÔNG cần đăng nhập nữa (quà neo vào cookie 'gv'). Đăng nhập
// chuyển xuống bước LẤY THƯỞNG: khách chọn gói → form OTP ngay trong popup → sang /checkout.
// `needLogin` vẫn giữ cho đường lùi: DB chưa áp drizzle/gift-anon.sql thì server trả 401 và
// popup hiện OTP TRƯỚC khi mở quà, đúng như hành vi trước ĐỢT 2.
export function GiftPopup() {
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [claimProduct, setClaimProduct] = useState<string | null>(null); // gói khách chọn để nhận
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
      // KHÔNG gửi `product`: để server tự chọn gói nổi bật. Server vẫn validate nếu có gửi.
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
        else track("gift_claimed", { percent: d.percent });
      } else if (d.status === "error") {
        // Lỗi hạ tầng (đã log chi tiết ở server, prefix "[gift]") — khách chỉ thấy thông báo nhẹ,
        // giống hệt nhánh lỗi mạng bên dưới, không lộ chi tiết kỹ thuật.
        setMessage("Có lỗi, bạn thử lại nhé.");
      } else {
        // "owned" (đã có mọi khóa) hoặc "disabled" → không có quà để trao.
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
            className="relative max-h-full w-full max-w-md overflow-y-auto rounded-3xl bg-gradient-to-b from-[#7a0d0d] to-[#3a0606] text-white shadow-2xl ring-1 ring-amber-300/30"
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
                    Mở hộp quà nhận <b className="text-white">mã giảm giá</b> dùng được cho{" "}
                    <b className="text-white">mọi gói</b> — <b className="text-amber-200">giảm tới 80%!</b>
                  </p>
                  <p className="mt-1.5 text-xs text-amber-100/55">
                    {/* ĐỢT 2: bỏ "mỗi tài khoản" vì mở quà không còn cần tài khoản. */}
                    Chỉ mở được <b className="text-amber-100/80">1 lần</b> · ưu đãi có hạn ·{" "}
                    <b className="text-amber-100/80">không cần đăng nhập</b>
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
                  <div className="mx-auto mt-3 inline-block rounded-full border border-amber-300/60 bg-amber-400/10 px-4 py-1 text-xs font-bold tracking-[0.15em] text-amber-200 uppercase">
                    Bạn nhận được
                  </div>
                  <div className="mt-2 text-5xl font-extrabold text-amber-300">Giảm {data.percent}%</div>
                  <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-amber-200">
                    {data.rarity > 0 && data.rarity <= 33 ? (
                      <>
                        {data.rarity <= 20 ? "🔥 HIẾM" : "✨"} · chỉ {data.rarity}% người mở quà trúng
                        mức −{data.percent}%
                      </>
                    ) : (
                      <>💥 Giảm ngay −{data.percent}% · ưu đãi có hạn, dùng kẻo lỡ</>
                    )}
                  </div>

                  {!expired ? (
                    <>
                      <p className="mt-4 text-xs text-amber-100/70">
                        Áp cho <b className="text-amber-100">mọi gói</b> dưới đây — chọn gói bạn muốn:
                      </p>
                      <div className="mt-3 space-y-2 text-left">
                        {data.products.map((p) => {
                          const primary = p.id === data.primary;
                          const rowClass = `flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition hover:brightness-110 ${
                            primary
                              ? "bg-gradient-to-b from-amber-300 to-amber-500 text-[#5a0a0a]"
                              : "bg-black/25 text-white ring-1 ring-amber-300/20"
                          } ${claimProduct === p.id ? "ring-2 ring-amber-300" : ""}`;
                          const inner = (
                            <>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-extrabold">{p.label}</span>
                                <span
                                  className={`block text-xs ${primary ? "text-[#5a0a0a]/70" : "text-amber-100/55"}`}
                                >
                                  {formatVnd(p.basePrice)} → còn {formatVnd(p.finalPrice)}
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block text-lg font-extrabold leading-tight">
                                  {formatVnd(p.finalPrice)}
                                </span>
                                <span
                                  className={`block text-[11px] font-bold ${primary ? "text-[#5a0a0a]/70" : "text-amber-200"}`}
                                >
                                  −{data.percent}%
                                </span>
                              </span>
                            </>
                          );

                          // Chưa đăng nhập → chọn gói mở form OTP NGAY TẠI ĐÂY (bước lấy thưởng),
                          // không đẩy sang /checkout rồi mới bắt đăng nhập.
                          return data.needLoginToClaim ? (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setClaimProduct(p.id);
                                track("gift_login_required");
                              }}
                              className={rowClass}
                            >
                              {inner}
                            </button>
                          ) : (
                            <a key={p.id} href={`/checkout?product=${p.id}`} className={rowClass}>
                              {inner}
                            </a>
                          );
                        })}
                      </div>

                      {/* Bước LẤY THƯỞNG cho khách ẩn danh: đăng nhập rồi sang thẳng thanh toán.
                          Quà đã neo ở cookie 'gv' → server tự gắn vào tài khoản vừa đăng nhập. */}
                      {data.needLoginToClaim && claimProduct && (
                        <div className="mt-4 space-y-2 rounded-2xl bg-black/25 p-3 text-left ring-1 ring-amber-300/20">
                          <p className="text-center text-xs text-amber-100/75">
                            Nhập email để <b className="text-amber-100">nhận giá này</b> — mã xác nhận
                            gửi qua email, không cần mật khẩu
                          </p>
                          <EmailOtpForm
                            dark
                            onSuccess={() => {
                              track("gift_login_completed");
                              window.location.href = `/checkout?product=${claimProduct}`;
                            }}
                          />
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-100/70">
                        <span>Ưu đãi hết hạn sau</span>
                        <span className="rounded-md bg-black/30 px-2 py-1 font-mono font-bold tabular-nums">
                          {pad(h)}:{pad(m)}:{pad(s)}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-amber-100/60">
                        {data.needLoginToClaim
                          ? "Mã đang được giữ cho bạn trên máy này — đăng nhập ở bước nhận là tự áp."
                          : "Mã đã gắn với tài khoản của bạn — cứ thanh toán là tự áp."}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-4 text-sm text-amber-100/80">
                        Ưu đãi đã hết hạn. Bạn vẫn có thể chọn gói với giá thường:
                      </p>
                      <Link
                        href="/#packages"
                        onClick={() => setOpen(false)}
                        className="mt-4 block w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-6 py-3.5 text-base font-extrabold text-[#5a0a0a] shadow-lg transition hover:brightness-105"
                      >
                        Xem bảng giá →
                      </Link>
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
