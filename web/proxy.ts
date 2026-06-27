import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Host canonical duy nhất cho production. Mọi điều hướng trang phải về đây để phiên đăng nhập
// (cookie Supabase) không bị chia giữa nhiều domain → tránh 401 khi gọi API tương đối.
const CANONICAL_HOST = "www.lamtoanai.xyz";
// Các host cần nắn về canonical. KHÔNG đụng preview *.vercel.app khác hay localhost (giữ dev/preview chạy).
const REDIRECT_HOSTS = new Set(["lamtoanai.xyz", "tay-craft.vercel.app"]);

// Next.js 16 "proxy" convention (thay cho middleware).
export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // Chỉ nắn điều hướng TRANG (GET, không phải /api): tránh rớt cookie/body khi 308 một POST sang host khác.
  if (request.method === "GET" && !pathname.startsWith("/api/") && REDIRECT_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // Refresh phiên Supabase mỗi request (giữ cookie auth luôn mới).
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Loại /auth/callback: middleware refresh phiên KHÔNG được đụng vào bước đổi code↔phiên (PKCE),
    // và không 308 redirect callback sang host khác (sẽ mất code_verifier).
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
