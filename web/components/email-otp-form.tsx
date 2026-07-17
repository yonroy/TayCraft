"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN = 60;

// Đăng nhập bằng mã OTP 6 số qua email — không redirect, chạy được trong webview
// (Facebook/Instagram in-app browser chặn Google OAuth + magic-link mở sai trình duyệt).
export function EmailOtpForm({
  onSuccess,
  dark = false,
}: {
  onSuccess: () => void;
  dark?: boolean;
}) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputClass = dark
    ? "w-full h-11 px-4 rounded-xl border border-white/20 bg-black/25 text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none"
    : "w-full h-11 px-4 rounded-xl border border-line focus:border-accent focus:outline-none";
  const errorClass = dark ? "text-sm text-amber-200" : "text-sm text-accent-2";
  const hintClass = dark ? "text-xs text-amber-100/60" : "text-xs text-dim";

  function tickCooldown() {
    setCooldown(RESEND_COOLDOWN);
    const id = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function sendCode() {
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep("code");
    tickCooldown();
  }

  async function verifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) {
      setLoading(false);
      setError("Mã không đúng hoặc đã hết hạn. Kiểm tra lại email hoặc gửi mã mới.");
      return;
    }
    try {
      await fetch("/api/auth/after-login", { method: "POST" });
    } catch {
      /* im lặng — không chặn đăng nhập nếu profile sync lỗi */
    }
    setLoading(false);
    onSuccess();
  }

  if (step === "code") {
    return (
      <form onSubmit={verifyCode} className="space-y-3">
        <p className={hintClass}>
          Đã gửi mã tới <b className={dark ? "text-white" : undefined}>{email}</b>.
        </p>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={10}
          required
          placeholder="Nhập mã trong email"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className={cn(inputClass, "text-center tracking-[0.4em] text-lg font-bold")}
        />
        {dark ? (
          <Button type="submit" size="lg" className="w-full" disabled={loading || code.length < 6}>
            {loading ? "Đang xác nhận…" : "Xác nhận →"}
          </Button>
        ) : (
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading || code.length < 6}
          >
            {loading ? "Đang xác nhận…" : "Xác nhận →"}
          </button>
        )}
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            className={dark ? "text-amber-100/70 underline" : "text-dim underline"}
          >
            Đổi email
          </button>
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={() => sendCode()}
            className={cn(dark ? "text-amber-100/70 underline" : "text-dim underline", "disabled:opacity-50 disabled:no-underline")}
          >
            {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : "Gửi lại mã"}
          </button>
        </div>
        {error && <p className={errorClass}>{error}</p>}
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendCode();
      }}
      className="space-y-3"
    >
      <input
        type="email"
        required
        placeholder="email@cua-ban.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      {dark ? (
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Đang gửi…" : "Gửi mã đăng nhập"}
        </Button>
      ) : (
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: "100%" }}
          disabled={loading}
        >
          {loading ? "Đang gửi…" : "Gửi mã đăng nhập"}
        </button>
      )}
      {error && <p className={errorClass}>{error}</p>}
    </form>
  );
}
