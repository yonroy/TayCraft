-- Migration: đếm lượt "đã THẤY hộp quà" (1 dòng / 1 trình duyệt). Chạy trong Supabase → SQL Editor
-- (DB local bị ISP chặn cổng → áp tay như các file khác). Idempotent.
-- /admin dùng: số người không nhận = COUNT(gift_impressions) − COUNT(gift_discounts).

CREATE TABLE IF NOT EXISTS "gift_impressions" (
  "visitor" text PRIMARY KEY,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
