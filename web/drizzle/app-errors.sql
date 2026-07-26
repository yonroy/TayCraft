-- Migration: nhật ký lỗi runtime có cấu trúc. Chạy trong Supabase → SQL Editor
-- (DB local bị ISP chặn cổng → áp tay như các file khác trong thư mục này). Idempotent.
--
-- Vì sao cần: trước đây mọi lỗi runtime ([gift]*, [sepay]*, [admin-stats]*, [auth/callback]*)
-- chỉ console.error/console.warn — bắt buộc phải vào Vercel Logs mới thấy được, /admin không có
-- cách nào biết đang có lỗi xảy ra. Đây chính là lý do sự cố /admin sập hoàn toàn ngày 2026-07-26
-- (mọi chỉ số về 0) không ai biết cho tới khi chủ dự án tự chụp ảnh gửi. Bảng này ghi SONG SONG
-- với console (không thay thế) để /admin có thể hiện card "Lỗi gần đây".

CREATE TABLE IF NOT EXISTS "app_errors" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "occurred_at" timestamptz NOT NULL DEFAULT now(),
  "context" text NOT NULL,
  "message" text NOT NULL,
  "detail" jsonb
);

CREATE INDEX IF NOT EXISTS "app_errors_occurred_at_idx" ON "app_errors" ("occurred_at" DESC);
