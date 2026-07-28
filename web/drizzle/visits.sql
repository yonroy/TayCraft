-- Migration: bảng ghi lại "traffic thật" (UTM + referrer ngoài site), 1 dòng / lượt CÓ tín hiệu
-- nguồn (không ghi mọi lượt xem trang). Chạy trong Supabase → SQL Editor (DB local bị ISP chặn
-- cổng → áp tay như các file khác trong thư mục này). Idempotent.
--
-- Vì sao cần: điều tra 2026-07-28 phát hiện 34 ngày chạy ads/organic mà KHÔNG có cột UTM/referrer
-- nào trong CẢ 9 bảng DB → không biết 11 khách thật (~1 người/3 ngày) từng đến từ đâu. Bảng này +
-- app/api/track/visit/route.ts trả lời đúng câu đó cho đợt đăng bài/chạy ads tiếp theo.
--
-- `visitor` = CÙNG cookie ẩn danh 'gv' mà gift_discounts.visitor / gift_impressions.visitor dùng
-- (xem lib/gift.ts) — một trình duyệt có MỘT id xuyên suốt thấy quà / mở quà / vào site từ
-- campaign nào, nối được cả phễu bằng SQL tay (xem câu mẫu cuối file).
-- `user_id` được điền ngay nếu khách đã đăng nhập lúc ghé, hoặc điền MUỘN bởi
-- app/api/track/visit/route.ts khi khách quay lại (cùng visitor) sau khi đã đăng nhập.
--
-- CHƯA áp migration này thì route vẫn chạy bình thường: lỗi "relation does not exist" (42P01)
-- được bắt riêng (isMissingTableError trong lib/gift.ts, tái dùng), chỉ log qua persistAppError,
-- KHÔNG chặn landing / gift / checkout.

CREATE TABLE IF NOT EXISTS "visits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "visitor" text NOT NULL,
  "user_id" uuid,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_content" text,
  "utm_term" text,
  "referrer" text,
  "referrer_host" text,
  "landing_path" text NOT NULL DEFAULT '/',
  "created_at" timestamptz NOT NULL DEFAULT now()
);

-- Truy vấn thường gặp: theo visitor (nối gift_discounts/absorb), theo user_id (join orders),
-- theo campaign (đối soát hiệu quả từng đợt ads), theo thời gian (mới nhất trước).
CREATE INDEX IF NOT EXISTS "visits_visitor_idx" ON "visits" ("visitor");
CREATE INDEX IF NOT EXISTS "visits_user_id_idx" ON "visits" ("user_id") WHERE "user_id" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "visits_utm_campaign_idx" ON "visits" ("utm_campaign");
CREATE INDEX IF NOT EXISTS "visits_created_at_idx" ON "visits" ("created_at" DESC);

-- Bật RLS (cùng tinh thần drizzle/rls.sql) — app kết nối bằng role 'postgres' (DATABASE_URL) là
-- owner nên BỎ QUA RLS, vẫn chạy bình thường. Bật RLS + không tạo policy = chặn truy cập qua
-- anon/authenticated key (PostgREST).
alter table "visits" enable row level security;

-- ==== Câu SQL mẫu — "traffic từ chiến dịch nào, có ra đơn không" ====
--
-- 1) Traffic + user đã đăng nhập ngay lúc ghé, theo campaign:
--   select utm_source, utm_medium, utm_campaign, count(*) as luot,
--          count(user_id) as da_dang_nhap_luc_ghe
--   from visits
--   group by 1,2,3
--   order by luot desc;
--
-- 2) Nối sang đơn hàng qua user_id đã điền trực tiếp (ghé lúc đã đăng nhập, hoặc đã "nối muộn"):
--   select v.utm_source, v.utm_campaign, o.id as order_id, o.product, o.amount_vnd, o.status,
--          o.created_at as order_created_at
--   from visits v
--   join orders o on o.user_id = v.user_id
--   where v.user_id is not null
--   order by o.created_at desc;
--
-- 3) Nối sang đơn hàng qua cầu gift_discounts (bắt cả khách đăng nhập SAU, miễn có mở hộp quà —
--    absorbAnonGifts trong lib/gift.ts đã gắn user_id vào gift_discounts theo cùng visitor):
--   select v.utm_source, v.utm_campaign, o.id as order_id, o.amount_vnd, o.status
--   from visits v
--   join gift_discounts gd on gd.visitor = v.visitor
--   join orders o on o.user_id = gd.user_id
--   where gd.user_id is not null
--   order by o.created_at desc;
