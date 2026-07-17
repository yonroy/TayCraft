"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { EmailOtpForm } from "@/components/email-otp-form";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInGoogle() {
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-ghost btn-lg"
        style={{ width: "100%" }}
        onClick={signInGoogle}
        disabled={loading}
      >
        {loading ? "Đang chuyển…" : "Tiếp tục với Google"}
      </button>

      <div className="co-or">hoặc</div>

      <EmailOtpForm
        onSuccess={() => {
          router.push(next);
          router.refresh();
        }}
      />

      {error && (
        <p style={{ marginTop: 12, fontSize: 13, color: "var(--accent-2)" }}>{error}</p>
      )}
    </div>
  );
}
