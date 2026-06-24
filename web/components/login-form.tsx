"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function signInGoogle() {
    setError(null);
    setLoading("google");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
  }

  async function signInEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("email");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(null);
    if (error) setError(error.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-line p-6 text-center">
        <p className="text-lg font-semibold">Kiểm tra email của bạn 📩</p>
        <p className="mt-2 text-dim text-sm">
          Đã gửi liên kết đăng nhập tới <b>{email}</b>. Bấm vào link để vào học.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" size="lg" className="w-full" onClick={signInGoogle} disabled={!!loading}>
        {loading === "google" ? "Đang chuyển…" : "Tiếp tục với Google"}
      </Button>

      <div className="flex items-center gap-3 text-dim text-sm">
        <div className="h-px flex-1 bg-line" /> hoặc <div className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={signInEmail} className="space-y-3">
        <input
          type="email"
          required
          placeholder="email@cua-ban.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-line focus:border-accent focus:outline-none"
        />
        <Button type="submit" size="lg" className="w-full" disabled={!!loading}>
          {loading === "email" ? "Đang gửi…" : "Gửi link đăng nhập"}
        </Button>
      </form>

      {error && <p className="text-sm text-accent-2">{error}</p>}
    </div>
  );
}
