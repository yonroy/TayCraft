import { NextResponse, type NextRequest } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { updateFlashSale, type FlashSaleConfig } from "@/lib/settings";

const clampInt = (v: unknown, lo: number, hi: number, fb: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fb;
};

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const viewerMin = clampInt(body.viewerMin, 0, 9999, 6);
  const cfg: FlashSaleConfig = {
    enabled: Boolean(body.enabled),
    headline: String(body.headline ?? "").slice(0, 200) || "⚡ FLASH SALE",
    countdownMinutes: clampInt(body.countdownMinutes, 1, 100000, 720),
    viewerMin,
    viewerMax: clampInt(body.viewerMax, viewerMin, 9999, Math.max(viewerMin, 24)),
  };

  try {
    await updateFlashSale(cfg);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Chưa lưu được — cần chạy migration flash-sale.sql trên Supabase." },
      { status: 500 },
    );
  }
}
