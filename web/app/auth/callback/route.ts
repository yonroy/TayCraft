import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth";

// Đổi mã OAuth/magic-link thành phiên đăng nhập, rồi đồng bộ profile.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const safeNext = next && next.startsWith("/") ? next : "/learn";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Log để soi trong Vercel Logs (vd "both auth code and code verifier should be non-empty"
      // = lệch host giữa lúc bấm đăng nhập và lúc nhận callback).
      console.error("[auth/callback] exchangeCodeForSession failed:", error.message, "host=", request.headers.get("host"));
    }
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          await ensureProfile(user);
        } catch {
          // Không chặn đăng nhập nếu DB chưa sẵn sàng.
        }
      }
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    // Lộ lý do thật ra URL để chẩn đoán (vd "both auth code and code verifier should be non-empty").
    return NextResponse.redirect(
      `${origin}/login?error=auth&reason=${encodeURIComponent(error?.message ?? "unknown")}`,
    );
  }

  return NextResponse.redirect(`${origin}/login?error=auth&reason=no_code`);
}
