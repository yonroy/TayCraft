"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4">
      <Button variant="outline" size="lg" className="w-full" onClick={signInGoogle} disabled={loading}>
        {loading ? "Đang chuyển…" : "Tiếp tục với Google"}
      </Button>

      <div className="flex items-center gap-3 text-dim text-sm">
        <div className="h-px flex-1 bg-line" /> hoặc <div className="h-px flex-1 bg-line" />
      </div>

      <EmailOtpForm
        onSuccess={() => {
          router.push(next);
          router.refresh();
        }}
      />

      {error && <p className="text-sm text-accent-2">{error}</p>}
    </div>
  );
}
