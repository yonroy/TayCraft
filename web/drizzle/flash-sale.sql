-- Migration: cấu hình flash-sale (1 dòng singleton). Chạy trong Supabase → SQL Editor
-- (DB local bị ISP chặn cổng → áp tay như packages.sql). Idempotent.
-- Tới khi chạy migration này, app vẫn chạy bằng giá trị mặc định (getFlashSale có fallback).

CREATE TABLE IF NOT EXISTS "flash_sale" (
  "id" text PRIMARY KEY DEFAULT 'singleton',
  "enabled" boolean NOT NULL DEFAULT true,
  "headline" text NOT NULL DEFAULT '⚡ FLASH SALE — Ưu đãi early-bird sắp kết thúc',
  "countdown_minutes" integer NOT NULL DEFAULT 720,
  "viewer_min" integer NOT NULL DEFAULT 6,
  "viewer_max" integer NOT NULL DEFAULT 24,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Tạo dòng singleton nếu chưa có.
INSERT INTO "flash_sale" ("id") VALUES ('singleton') ON CONFLICT ("id") DO NOTHING;
