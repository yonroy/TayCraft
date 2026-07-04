import { NextResponse } from "next/server";
import { getUser, ensureProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Đăng nhập bằng OTP (verifyOtp phía client) không đi qua /auth/callback nên
// ensureProfile không tự chạy — gọi tay ngay sau khi client xác nhận mã.
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  await ensureProfile(user);
  return NextResponse.json({ ok: true });
}
