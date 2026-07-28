import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { isMissingTableError, GIFT_VISITOR_COOKIE, GIFT_VISITOR_COOKIE_OPTIONS } from "@/lib/gift";
import { persistAppError } from "@/lib/log";
import {
  hasUtm,
  isExternalReferrer,
  isLocalhostHost,
  referrerHost,
  TRACK_SESSION_COOKIE,
} from "@/lib/tracking";

// Ghi 1 dòng "traffic thật" (UTM + referrer) cho lượt vào site — trả lời câu "khách này từ đâu
// tới" sau đợt đăng bài/chạy ads tiếp theo (xem lib/tracking.ts về bối cảnh).
//
// Bảng `visits` khai NGAY TẠI ĐÂY, KHÔNG ở lib/db/schema.ts: file schema dùng chung không nằm
// trong danh sách file được giao cho lane này (agent khác có thể đang đụng cùng lúc). drizzle-orm
// build câu SQL từ chính object bảng truyền vào db.insert()/update() — không cần bảng có mặt
// trong tham số `schema` lúc khởi tạo drizzle() ở lib/db/index.ts, nên khai cục bộ vẫn hoạt động
// đúng, chỉ là không có trong db.query.* (không dùng ở đây).
const visits = pgTable("visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitor: text("visitor").notNull(),
  userId: uuid("user_id"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  referrer: text("referrer"),
  referrerHost: text("referrer_host"),
  landingPath: text("landing_path").notNull().default("/"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

const BodySchema = z.object({
  utmSource: z.string().trim().max(200).nullish(),
  utmMedium: z.string().trim().max(200).nullish(),
  utmCampaign: z.string().trim().max(200).nullish(),
  utmContent: z.string().trim().max(200).nullish(),
  utmTerm: z.string().trim().max(200).nullish(),
  referrer: z.string().trim().max(2000).nullish(),
  landingPath: z.string().trim().max(300).optional(),
});

// Cookie PHIÊN (không set maxAge → mất khi đóng trình duyệt) — chỉ để chống ghi trùng ở tầng
// server, KHÔNG mang định danh (định danh dùng GIFT_VISITOR_COOKIE 'gv', xem lib/gift.ts).
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(req: NextRequest) {
  try {
    // ⚠️ dev & production dùng CHUNG một Supabase DB → duyệt site bằng localhost THẬT trong lúc
    // code sẽ ghi thẳng vào DB thật nếu không chặn. Test bằng LAN IP (192.168.x.x, cách duy nhất
    // trên WSL vì WSL không route localhost sang Windows) KHÔNG bị chặn ở đây.
    const host = req.headers.get("host");
    if (isLocalhostHost(host)) {
      return NextResponse.json({ ok: true, skipped: "localhost" });
    }

    if (req.cookies.get(TRACK_SESSION_COOKIE)?.value) {
      return NextResponse.json({ ok: true, skipped: "session_dedup" });
    }

    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }
    const body = parsed.data;

    const utm = {
      utmSource: body.utmSource || null,
      utmMedium: body.utmMedium || null,
      utmCampaign: body.utmCampaign || null,
      utmContent: body.utmContent || null,
      utmTerm: body.utmTerm || null,
    };
    const referrer = body.referrer || "";
    // NEXT_PUBLIC_SITE_URL là nguồn origin chính thức của site (xem app/layout.tsx); fallback
    // theo Host header nếu env thiếu (không nên xảy ra ở production).
    const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${host ?? "localhost"}`;

    // KHÔNG TIN CLIENT: client (components/utm-capture.tsx) đã lọc tín hiệu trước khi gọi, nhưng
    // server tự kiểm tra lại — chặn spam bảng nếu có request gọi thẳng route này bỏ qua client.
    if (!hasUtm(utm) && !isExternalReferrer(referrer, siteOrigin)) {
      return NextResponse.json({ ok: true, skipped: "no_signal" });
    }

    // Neo danh tính ẩn danh: TÁI SỬ DỤNG cookie 'gv' của lib/gift.ts — CÙNG cookie mà
    // gift_discounts.visitor / gift_impressions.visitor dùng, KHÔNG đẻ cookie định danh thứ 2.
    let visitorId = req.cookies.get(GIFT_VISITOR_COOKIE)?.value ?? null;
    let mintedVisitor: string | null = null;
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      mintedVisitor = visitorId;
    }

    const user = await getUser().catch(() => null);

    const res = NextResponse.json({ ok: true });
    if (mintedVisitor) {
      res.cookies.set(GIFT_VISITOR_COOKIE, mintedVisitor, GIFT_VISITOR_COOKIE_OPTIONS);
    }
    res.cookies.set(TRACK_SESSION_COOKIE, "1", SESSION_COOKIE_OPTIONS);

    // 🔴 Bảng `visits` có thể CHƯA được migration (drizzle/visits.sql chạy TAY trong Supabase).
    // Lỗi ở đây CHỈ được log, KHÔNG BAO GIỜ được chặn response — landing/gift/checkout không phụ
    // thuộc route đo lường phụ này.
    try {
      await db.insert(visits).values({
        visitor: visitorId,
        userId: user?.id ?? null,
        ...utm,
        referrer: referrer || null,
        referrerHost: referrerHost(referrer),
        landingPath: body.landingPath || "/",
      });

      // Nối muộn: khách đã đăng nhập VÀ visitor này từng có lượt ghi ẩn danh trước đó (user_id
      // NULL, cùng trình duyệt nhờ cookie 'gv' sống 1 năm) → gắn user_id vào, để sau này join
      // visits ↔ orders trực tiếp mà không phải bắc cầu qua gift_discounts. Best-effort.
      if (user) {
        await db
          .update(visits)
          .set({ userId: user.id })
          .where(and(eq(visits.visitor, visitorId), isNull(visits.userId)));
      }
    } catch (err) {
      // drizzle-orm bọc lỗi postgres gốc vào `err.cause` (DrizzleQueryError) thay vì để `code`
      // ở top-level — isMissingTableError (lib/gift.ts) chỉ soi top-level nên phải soi thêm
      // `.cause` ở đây mới nhận diện đúng "bảng chưa tồn tại" cho lỗi INSERT (đã tự tay curl kiểm
      // chứng: không soi .cause thì rơi vào nhánh ERROR chung dù đúng là 42P01/relation-not-exist).
      const cause = (err as { cause?: unknown } | null)?.cause;
      if (isMissingTableError(err) || isMissingTableError(cause)) {
        console.error(
          '[track] TABLE MISSING: "visits" chưa tồn tại. Chạy drizzle/visits.sql trong Supabase SQL Editor.',
        );
      } else {
        console.error("[track] ERROR (insert visit):", err);
      }
      await persistAppError("track_visit", err instanceof Error ? err.message : String(err), {
        table: "visits",
      });
    }

    return res;
  } catch (err) {
    // Lỗi bất ngờ ở tầng ngoài (parse, cookie, getUser...) — vẫn không được làm vỡ trang gọi tới.
    await persistAppError("track_visit", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false });
  }
}
