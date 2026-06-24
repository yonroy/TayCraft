-- Migration: đa gói (package/product). Chạy trong Supabase → SQL Editor
-- (DB local bị ISP chặn cổng → không db:push được; áp tay như rls.sql).
-- An toàn & idempotent: dùng IF [NOT] EXISTS. Không hồi quy khách cũ.

-- 1) orders.product — đơn thuộc gói nào (mặc định all-access = bundle hiện tại)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "product" text NOT NULL DEFAULT 'all-access';

-- 2) enrollments.package — gói user sở hữu
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "package" text NOT NULL DEFAULT 'all-access';

-- 3) Grandfather: mọi enrollment cũ → all-access trọn đời
UPDATE "enrollments" SET "package" = 'all-access' WHERE "package" IS NULL OR "package" = '';

-- 4) 1 user có thể giữ nhiều gói: bỏ unique(user_id), thêm unique(user_id, package)
ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "enrollments_user_id_unique";
ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "enrollments_user_package_unique";
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_package_unique" UNIQUE ("user_id", "package");
